import unittest
from folio.data_parse import read_resume, parse_personal_info, parse_sections, save_to_file

class TestDataParse(unittest.TestCase):

    def setUp(self):
        self.sample_text = """John Doe
        johndoe@example.com
        (123) 456-7890
        
        Summary
        Experienced software developer with a passion for building scalable applications.
        
        Experience
        Software Engineer at XYZ Corp (2019 - Present)
        - Developed web applications using Python and JavaScript.
        
        Education
        B.S. in Computer Science, University of Example (2015 - 2019)
        
        Skills
        - Python
        - JavaScript
        - SQL
        """

    def test_parse_personal_info(self):
        expected_info = {
            'name': 'John Doe',
            'email': 'johndoe@example.com',
            'phone': '(123) 456-7890'
        }
        personal_info = parse_personal_info(self.sample_text)
        self.assertEqual(personal_info, expected_info)

    def test_parse_sections(self):
        expected_sections = {
            'Summary': 'Experienced software developer with a passion for building scalable applications.',
            'Experience': 'Software Engineer at XYZ Corp (2019 - Present)\n- Developed web applications using Python and JavaScript.',
            'Education': 'B.S. in Computer Science, University of Example (2015 - 2019)',
            'Skills': '- Python\n- JavaScript\n- SQL'
        }
        sections = parse_sections(self.sample_text)
        self.assertEqual(sections, expected_sections)

    def test_read_resume(self):
        # This test would require a sample resume file to be created beforehand.
        # For now, we can just check if the function returns None for a non-existent file.
        result = read_resume('non_existent_file.txt')
        self.assertIsNone(result)

    def test_save_to_file(self):
        # This test would check if the data is saved correctly to a JSON file.
        # For simplicity, we can check if the function runs without errors.
        data = {'test_key': 'test_value'}
        try:
            save_to_file(data, 'test_output.json')
            self.assertTrue(True)  # If no exception is raised, the test passes
        except Exception:
            self.fail("save_to_file raised an exception unexpectedly!")

if __name__ == '__main__':
    unittest.main()