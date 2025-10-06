import re
import json
import os
import sys
from readers.pdf_reader import read_pdf
from readers.docx_reader import read_docx

def read_resume(file_path):
    """Reads the content of a resume file."""
    try:
        if file_path.endswith('.pdf'):
            return read_pdf(file_path)
        elif file_path.endswith('.docx'):
            return read_docx(file_path)
        else:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return None

def parse_personal_info(text):
    """Parses personal information like name, email, and phone number."""
    info = {}
    
    # Regex for email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    info['email'] = email_match.group(0) if email_match else None
    
    # Regex for phone number (handles various formats)
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    info['phone'] = phone_match.group(0) if phone_match else None
    
    # Simple approach for name: assume it's the first line
    info['name'] = text.split('\n')[0].strip()
    
    return info

def parse_sections(text):
    """
    Parse resume sections. Lines that contain any keyword (substring match)
    and look like a header (short, all-caps, ends with colon, or starts with the keyword)
    will start a new section. Multiple occurrences of the same canonical section
    (e.g., several "education" headings) will be merged into a single section.
    """
    sections = {}
    # groups of keywords mapped to canonical section titles
    groups = [
        (['summary', 'profile', 'objective'], 'Summary'),
        (['experience', 'professional experience', 'work experience', 'work history', 'employment'], 'Experience'),
        (['education', 'educational', 'educational history', 'degree', 'school', 'institution', 'university', 'college'], 'Education'),
        (['skills', 'competencies', 'ability', 'abilities'], 'Skills'),
        (['projects', 'portfolio'], 'Projects'),
        (['certifications', 'certificates', 'license', 'licenses'], 'Certifications'),
        (['award', 'awards', 'honors', 'achievements'], 'Awards'),
        (['publications'], 'Publications'),
    ]

    lines = text.splitlines()
    current = None
    buffer = []

    def save_current():
        nonlocal sections, current, buffer
        if not current:
            return
        content = '\n'.join(buffer).strip()
        if not content:
            buffer = []
            return
        if current in sections and sections[current]:
            sections[current] = sections[current].rstrip() + '\n' + content
        else:
            sections[current] = content
        buffer = []

    for line in lines:
        cleaned = line.rstrip()
        if not cleaned.strip():
            # blank line — treat as separator but still keep buffering under current
            if current:
                buffer.append('')
            continue

        lw = cleaned.lower()
        matched_title = None

        # look for any keyword match and header-like shape
        for kws, canon in groups:
            for kw in kws:
                if kw in lw:
                    words = cleaned.split()
                    looks_like_header = (
                        len(words) <= 10 or           # short line
                        cleaned.isupper() or         # ALL CAPS
                        cleaned.strip().endswith(':') or
                        lw.startswith(kw)            # starts with the keyword
                    )
                    if looks_like_header:
                        matched_title = canon
                        break
            if matched_title:
                break

        if matched_title:
            # save previous section and start (or continue) the canonical section
            save_current()
            current = matched_title
            # start with header line removed (so header itself is not repeated in content)
            # if header line contains extra text after the keyword (e.g., "Education & Training"),
            # keep the remainder as a small intro line
            remainder = re.sub(r'(?i).*?\b(' + '|'.join(re.escape(k) for group in groups for k in group[0]) + r')\b[:\s\-]*', '', cleaned, count=1).strip()
            if remainder:
                buffer = [remainder]
            else:
                buffer = []
        elif current:
            buffer.append(cleaned)

    save_current()
    return sections

def save_to_file(data, output_filename):
    """Saves the extracted data to a JSON file."""
    try:
        with open(output_filename, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)
        print(f"Successfully saved parsed data to '{output_filename}'")
    except Exception as e:
        print(f"An error occurred while saving the file: {e}")

def main():
    # Usage: python data_parse.py <input_file> [output_json]
    if len(sys.argv) < 2:
        print("Usage: python data_parse.py <resume.(txt|docx|pdf)> [output.json]")
        sys.exit(1)

    in_path = sys.argv[1]
    if not os.path.isfile(in_path):
        print(f"Error: '{in_path}' not found.")
        sys.exit(1)

    # derive output path if not provided
    out_path = sys.argv[2] if len(sys.argv) >= 3 else (
        os.path.splitext(in_path)[0] + "_parsed.json"
    )

    text = read_resume(in_path)
    if not text:
        print("Error: no text extracted (empty).")
        sys.exit(1)

    personal_info = parse_personal_info(text)
    sections = parse_sections(text)

    data = {"personal_info": personal_info, "sections": sections}
    save_to_file(data, out_path)
    print(f"Parsed -> {out_path}")

if __name__ == "__main__":
    main()