# Project Title: Resume Parser

## Overview
This project is designed to parse resume data from various file formats, including plain text, PDF, and Word documents. It extracts personal information and sections from resumes and saves the parsed data in a structured JSON format.

## File Structure
```
folio
├── data_parse.py          # Main script for parsing resume data
├── readers
│   ├── __init__.py        # Initializes the readers package
│   ├── pdf_reader.py      # Contains functionality to read PDF files
│   └── docx_reader.py     # Contains functionality to read Word documents
├── tests
│   └── test_data_parse.py  # Unit tests for data_parse.py
├── requirements.txt       # Lists project dependencies
└── README.md              # Project documentation
```

## Installation
To set up the environment, ensure you have Python installed. Then, install the required packages using pip:

```bash
pip install -r requirements.txt
```

## Usage
1. **Reading and Parsing Resumes:**
   - The main functionality is provided in `data_parse.py`. You can run the script from the command line, providing the path to the resume file as an argument:
   ```bash
   python data_parse.py <resume_file_path> [output_json]
   ```
   - If the output JSON file name is not provided, it will default to `<resume_file_name>_parsed.json`.

2. **Supported File Formats:**
   - The project currently supports parsing resumes from:
     - Plain text files (.txt)
     - PDF files (.pdf)
     - Word documents (.docx)

3. **Testing:**
   - Unit tests for the parsing functionality are located in the `tests` directory. You can run the tests using:
   ```bash
   python -m unittest discover -s tests
   ```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.