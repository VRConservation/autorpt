#!/usr/bin/env python3
"""Test script for the markdown converter functionality."""

from autorpt.markdown_converter import convert_markdown_to_word
from pathlib import Path
import sys

# Add the autorpt module to the path
sys.path.insert(0, str(Path(__file__).parent / 'autorpt'))


def test_markdown_converter():
    """Test the markdown to Word converter."""

    # Test file paths
    markdown_file = "example_report.md"
    output_file = "example_report.docx"

    print(f"🧪 Testing markdown converter...")
    print(f"📄 Input: {markdown_file}")
    print(f"📄 Output: {output_file}")

    # Convert markdown to Word
    success = convert_markdown_to_word(markdown_file, output_file)

    if success:
        print("✅ Conversion successful!")
        print(f"📁 Word document created: {output_file}")
    else:
        print("❌ Conversion failed!")
        return False

    return True


if __name__ == "__main__":
    test_markdown_converter()
