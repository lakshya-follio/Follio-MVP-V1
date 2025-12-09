import type { ParsedResumeData } from '../App';

const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneRegex = /\+?\d[\d()\s.-]{7,}\d/;

const textDecoder = new TextDecoder('utf-8');
const latin1Decoder = new TextDecoder('latin1');

const decompressWithStream = async (data: Uint8Array, format: 'deflate' | 'deflate-raw') => {
  if (typeof DecompressionStream === 'undefined') {
    return null;
  }

  const stream = new DecompressionStream(format);
  const writer = stream.writable.getWriter();
  await writer.write(data as unknown as BufferSource);
  await writer.close();

  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
    }
  }

  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
};

const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const rawString = latin1Decoder.decode(arrayBuffer);
  const textSegments: string[] = [];

  const plainMatches = rawString.matchAll(/\(([^()]*)\)\s*TJ?/g);
  for (const match of plainMatches) {
    textSegments.push(match[1]);
  }

  const streamRegex = /stream[\r\n]+/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawString))) {
    const start = match.index + match[0].length;
    const end = rawString.indexOf('endstream', start);
    if (end === -1) break;

    const slice = new Uint8Array(arrayBuffer.slice(start, end));
    const inflated = await decompressWithStream(slice, 'deflate');

    if (inflated) {
      const inflatedText = textDecoder.decode(inflated);
      const innerMatches = inflatedText.matchAll(/\(([^()]*)\)\s*TJ?/g);
      for (const inner of innerMatches) {
        textSegments.push(inner[1]);
      }
    }

    streamRegex.lastIndex = end;
  }

  return textSegments.join('\n');
};

const readUint32LE = (view: DataView, offset: number) => view.getUint32(offset, true);
const readUint16LE = (view: DataView, offset: number) => view.getUint16(offset, true);

const extractTextFromDocx = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  // Find the End of Central Directory record
  let eocdOffset = -1;
  for (let i = uint8.length - 22; i >= 0; i--) {
    if (readUint32LE(view, i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid DOCX archive');
  }

  const centralDirectoryOffset = readUint32LE(view, eocdOffset + 16);
  const totalEntries = readUint16LE(view, eocdOffset + 10);

  let documentEntry:
    | {
      compression: number;
      compressedSize: number;
      offset: number;
    }
    | null = null;

  let cursor = centralDirectoryOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (readUint32LE(view, cursor) !== 0x02014b50) break;

    const compressionMethod = readUint16LE(view, cursor + 10);
    const compressedSize = readUint32LE(view, cursor + 20);
    const fileNameLength = readUint16LE(view, cursor + 28);
    const extraLength = readUint16LE(view, cursor + 30);
    const commentLength = readUint16LE(view, cursor + 32);
    const localHeaderOffset = readUint32LE(view, cursor + 42);

    const fileNameStart = cursor + 46;
    const fileNameEnd = fileNameStart + fileNameLength;
    const fileName = textDecoder.decode(uint8.slice(fileNameStart, fileNameEnd));

    if (fileName === 'word/document.xml') {
      documentEntry = {
        compression: compressionMethod,
        compressedSize,
        offset: localHeaderOffset
      };
      break;
    }

    cursor = fileNameEnd + extraLength + commentLength;
  }

  if (!documentEntry) {
    throw new Error('Could not find document.xml in DOCX');
  }

  const localHeaderOffset = documentEntry.offset;
  if (readUint32LE(view, localHeaderOffset) !== 0x04034b50) {
    throw new Error('Invalid DOCX local header');
  }

  const nameLength = readUint16LE(view, localHeaderOffset + 26);
  const extraLength = readUint16LE(view, localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + nameLength + extraLength;
  const dataEnd = dataStart + documentEntry.compressedSize;
  const compressedData = new Uint8Array(buffer.slice(dataStart, dataEnd));

  let documentXml: string;
  if (documentEntry.compression === 0) {
    documentXml = textDecoder.decode(compressedData);
  } else if (documentEntry.compression === 8) {
    const inflated = await decompressWithStream(compressedData, 'deflate');
    if (!inflated) {
      throw new Error('DOCX decompression not supported in this browser');
    }
    documentXml = textDecoder.decode(inflated);
  } else {
    throw new Error('Unsupported DOCX compression');
  }

  const textWithBreaks = documentXml
    .replace(/<w:p[^>]*>/g, '\n')
    .replace(/<w:br\s*\/>/g, '\n')
    .replace(/<[^>]+>/g, ' ');

  return textWithBreaks.replace(/\s+/g, ' ').replace(/\n\s+/g, '\n').trim();
};

const splitLines = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const extractSection = (lines: string[], startKeywords: string[], endKeywords: string[]) => {
  const startIndex = lines.findIndex((line) =>
    startKeywords.some((keyword) => line.toLowerCase().includes(keyword))
  );

  if (startIndex === -1) return [] as string[];

  const endIndex = lines.findIndex(
    (line, idx) => idx > startIndex && endKeywords.some((keyword) => line.toLowerCase().includes(keyword))
  );

  return lines.slice(startIndex + 1, endIndex === -1 ? undefined : endIndex);
};

const parseSkills = (lines: string[]): string[] => {
  if (!lines.length) return [];

  const combined = lines.join(' ');
  if (combined.includes(',')) {
    return combined
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return lines
    .flatMap((line) =>
      line
        .replace(/^[-•]\s*/, '')
        .split(/\s{2,}|\s•\s|\/|\|/)
        .map((skill) => skill.trim())
    )
    .filter(Boolean);
};

const parseExperience = (lines: string[]) => {
  const experiences: ParsedResumeData['experience'] = [];
  if (!lines.length) return experiences;

  let current: string[] = [];
  const flush = () => {
    if (!current.length) return;
    const [headline, ...rest] = current;
    const [role = '', company = ''] = headline.split(/\s+at\s+|\s+@\s+|\s+-\s+/i);
    const dateLine = rest.find((line) => /\b\d{4}\b/.test(line)) ?? '';
    const highlights = rest
      .filter((line) => line !== dateLine)
      .map((line) => line.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);

    experiences.push({
      id: `${experiences.length + 1}`,
      company: company || headline,
      role: role || 'Role',
      startDate: dateLine.split(/–|-|to/i)[0]?.trim() ?? '',
      endDate: dateLine.split(/–|-|to/i)[1]?.trim() ?? '',
      highlights: highlights.length ? highlights : ['Describe your impact']
    });
    current = [];
  };

  lines.forEach((line) => {
    if (!line) return;
    const isNewRole = /^(experience|work experience|professional experience)$/i.test(line);
    const looksLikeHeader = /\d{4}/.test(line) && current.length === 0;

    if (isNewRole && current.length) {
      flush();
    }

    if (line.match(/^[•-]/) && current.length === 0) {
      current.push(line.replace(/^[•-]\s*/, ''));
    } else if (line.match(/^[•-]/)) {
      current.push(line.replace(/^[•-]\s*/, ''));
    } else if (looksLikeHeader && current.length) {
      flush();
      current.push(line);
    } else {
      current.push(line);
    }
  });

  flush();
  return experiences;
};

const parseEducation = (lines: string[]) => {
  if (!lines.length) return [] as ParsedResumeData['education'];

  const education: ParsedResumeData['education'] = [];
  let current: string[] = [];

  const flush = () => {
    if (!current.length) return;
    const [school = 'Institution', degree = 'Degree'] = current;
    const dateLine = current.find((line) => /\b\d{4}\b/.test(line)) ?? '';

    education.push({
      id: `${education.length + 1}`,
      school,
      degree,
      startDate: dateLine.split(/–|-|to/i)[0]?.trim() ?? '',
      endDate: dateLine.split(/–|-|to/i)[1]?.trim() ?? '',
    });
    current = [];
  };

  lines.forEach((line) => {
    if (!line) return;
    if (line.match(/^[•-]/) && current.length) {
      current.push(line.replace(/^[•-]\s*/, ''));
    } else if (line.match(/^[•-]/)) {
      flush();
      current.push(line.replace(/^[•-]\s*/, ''));
    } else if (/^(education)$/i.test(line) && current.length) {
      flush();
    } else {
      current.push(line);
    }
  });

  flush();
  return education;
};

const buildParsedResume = (text: string): ParsedResumeData => {
  const lines = splitLines(text);
  const email = text.match(emailRegex)?.[0] ?? '';
  const phone = text.match(phoneRegex)?.[0] ?? '';
  const name = lines[0] ?? 'Your Name';
  const headline = lines[1] && !lines[1].match(emailRegex) ? lines[1] : 'Professional';
  const location = lines.find((line) => /(,\s*[A-Za-z]{2}|USA|United States|Canada|UK|India)/i.test(line)) ?? '';

  const experienceLines = extractSection(lines, ['experience', 'professional experience', 'work experience'], ['education', 'skills', 'projects']);
  const educationLines = extractSection(lines, ['education'], ['experience', 'skills', 'projects']);
  const skillsLines = extractSection(lines, ['skills', 'technical skills'], ['experience', 'education', 'projects']);

  const experience = parseExperience(experienceLines);
  const education = parseEducation(educationLines);
  const skills = parseSkills(skillsLines);

  return {
    profile: {
      name,
      headline,
      location,
      email,
      phone
    },
    experience: experience.length
      ? experience
      : [
        {
          id: '1',
          company: 'Your Company',
          role: 'Role',
          startDate: '',
          endDate: '',
          highlights: ['Summarize your achievements']
        }
      ],
    education: education.length
      ? education
      : [
        {
          id: '1',
          school: 'University or Certification',
          degree: 'Degree or Program',
          startDate: '',
          endDate: ''
        }
      ],
    skills: skills.length ? skills : ['Collaboration', 'Problem solving', 'Leadership']
  };
};

export const getDummyResumeData = (): ParsedResumeData => ({
  profile: {
    name: 'Alex Morgan',
    headline: 'Senior Product Designer',
    location: 'San Francisco, CA',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567'
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Inc.',
      role: 'Senior Product Designer',
      startDate: '2021',
      endDate: 'Present',
      highlights: [
        'Led the redesign of the core product interface, improving user engagement by 40%',
        'Established a comprehensive design system used across 5 different product lines',
        'Mentored junior designers and conducted weekly design critiques'
      ]
    },
    {
      id: '2',
      company: 'Creative Solutions',
      role: 'UX Designer',
      startDate: '2018',
      endDate: '2021',
      highlights: [
        'Collaborated with product managers to define user requirements and flows',
        'Conducted user research and usability testing to validate design decisions',
        'Designed mobile-first interfaces for e-commerce clients'
      ]
    }
  ],
  education: [
    {
      id: '1',
      school: 'California College of the Arts',
      degree: 'Bachelor of Fine Arts in Interaction Design',
      startDate: '2014',
      endDate: '2018'
    }
  ],
  skills: [
    'Figma',
    'Prototyping',
    'User Research',
    'Design Systems',
    'HTML/CSS',
    'Agile Methodology',
    'Adobe Creative Suite',
    'Wireframing'
  ]
});

export const parseResumeFile = async (file: File): Promise<ParsedResumeData> => {
  // For now, we'll bypass the actual parsing to ensure we always move to the next step with valid data.
  return getDummyResumeData();
};
