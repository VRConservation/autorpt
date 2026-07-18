# Web Interface Guide

## Getting Started

Launch the web interface:

```bash
auto --gui
```

Your browser will automatically open to `http://127.0.0.1:5000` with the AutoRpt interface.

## Interface Overview

The web interface is divided into three main areas:

### Left Sidebar - Setup & Configuration

1. **Templates**
   - Select from pre-built report templates
   - Templates include: Basic Report, Grant Report, Quarterly Report
   - Each template provides standard sections to get you started

2. **Excel Budget**
   - Drag and drop Excel files or click to browse
   - Upload `.xlsx` or `.xls` files
   - Preview shows table structure and row/column count
   - All uploaded files are listed for reference

3. **Metadata**
   - Report Title
   - Author name
   - Date (defaults to today)
   - Project name
   - Metadata appears in report headers and frontmatter

### Center - Content Editor

1. **Sections List**
   - View all report sections
   - Click to jump to a section
   - Add new sections with custom names
   - Remove sections you don't need

2. **Editor Modes**
   - **Visual Editor** (default): WYSIWYG like Word/Google Docs
   - **Markdown Editor**: For users who prefer markdown syntax
   - Switch between modes anytime
   - Content syncs automatically

3. **Formatting Toolbar**
   - **Bold**, *Italic*, Underline
   - Bulleted lists
   - Numbered lists
   - Auto-save every 30 seconds
   - Manual save button available

4. **Generate Reports**
   - **Word (.docx)**: Standard Microsoft Word format
   - **PDF**: Professional PDF output
   - **HTML**: Web-compatible format
   - **Markdown (.md)**: Plain text markdown

### Right Sidebar - Live Preview

- Real-time preview of your report
- Updates as you type
- Shows exactly how the final report will look
- Renders markdown, formatting, and structure

## Key Features

### 📝 Text Snippets

Save frequently used text for easy reuse:

1. Click "Snippets" button in top toolbar
2. Click "New Snippet"
3. Enter title and content
4. Click "Save"

To use a snippet:
1. Open Snippets panel
2. Click on any snippet to insert at cursor position

**Use cases:**
- Standard introduction paragraphs
- Common methodology sections
- Boilerplate legal/compliance text
- Contact information
- Acknowledgments

### 📊 Report History

Track all generated reports:

1. Click "History" button in top toolbar
2. View list of all generated reports
3. See filename, format, timestamp, and preview
4. Download any previous report

**Benefits:**
- Never lose a report
- Compare different versions
- Quick access to recent work
- Track changes over time

### 📋 Templates

Pre-built templates include:

**Basic Report**
- Executive Summary
- Introduction
- Budget
- Conclusion

**Grant Report**
- Project Overview
- Activities
- Budget
- Outcomes
- Next Steps

**Quarterly Report**
- Q1-Q4 Summaries
- Annual Budget

Templates can be customized after loading by:
- Adding new sections
- Removing sections
- Renaming sections
- Reordering content

## Workflow Example

### Creating Your First Report

1. **Start the web interface**
   ```bash
   auto --gui
   ```

2. **Choose a template** (optional)
   - Select "Grant Report" from dropdown
   - Sections are automatically created

3. **Add metadata**
   - Title: "Q2 2026 Progress Report"
   - Author: Your name
   - Date: Today (auto-filled)
   - Project: "Wildlife Conservation Initiative"

4. **Upload Excel budget**
   - Click "Choose File" under Excel Budget
   - Select your budget spreadsheet
   - Preview confirms upload

5. **Write content**
   - Click in Visual Editor
   - Type or paste your content
   - Use formatting toolbar for emphasis
   - Content auto-saves every 30 seconds

6. **Add sections as needed**
   - Click "Add Section"
   - Enter section name
   - Jump to section to write content

7. **Save a snippet** (if needed)
   - Select text you want to reuse
   - Click "Snippets" → "New Snippet"
   - Name it and save

8. **Preview your work**
   - Check right panel for live preview
   - Verify formatting and structure

9. **Generate report**
   - Click "Word (.docx)" button
   - Report generates and downloads
   - Also creates entry in History

10. **Generate other formats** (optional)
    - Click "PDF" for PDF version
    - Click "HTML" for web version
    - All versions use same content

## Advanced Features

### Keyboard Shortcuts

- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + U**: Underline
- **Ctrl/Cmd + S**: Save (manual)

### Custom Sections

Create sections for your specific needs:
- **Methodology**: Describe your approach
- **Data Analysis**: Present findings
- **Stakeholder Feedback**: Include comments
- **Risk Assessment**: Identify concerns
- **Appendices**: Supporting materials

### Excel Integration

The Excel upload feature:
- Accepts `.xlsx` and `.xls` formats
- Displays preview with row/column counts
- Multiple files can be uploaded
- Files are saved in `reports/` directory
- Budget tables automatically insert into reports

### Content Persistence

Your work is automatically saved:
- Content saves every 30 seconds
- Snippets persist across sessions
- History tracks all generated reports
- Uploaded files remain in `reports/` folder

## Troubleshooting

### Web interface won't start

```bash
# Check if Flask is installed
pip install flask

# Try starting on different port
auto --gui --port 8080
```

### Browser doesn't open automatically

```bash
# Use server mode and open manually
auto --server

# Then open browser to:
# http://127.0.0.1:5000
```

### Excel file won't upload

- Check file extension is `.xlsx` or `.xls`
- Verify file size is under 16MB
- Ensure file isn't corrupted
- Try opening in Excel first to verify

### Report generation fails

- Check that content has been saved
- Verify Excel files are in `reports/` directory
- Check browser console for errors
- Try generating from command line: `auto`

### Preview not updating

- Switch editor modes (Markdown ↔ Visual)
- Refresh the page
- Clear browser cache
- Check for JavaScript errors in console

## Best Practices

### For Non-Technical Users

1. **Use the Visual Editor**: Familiar interface like Word
2. **Start with Templates**: Get a head start on structure
3. **Save Snippets**: Reuse common text easily
4. **Preview Often**: Check how it looks before generating
5. **Generate Multiple Formats**: Word for editing, PDF for sharing

### For Teams

1. **Standardize Snippets**: Create shared snippet library
2. **Use Templates**: Ensure consistent report structure
3. **Document Metadata**: Always fill in all fields
4. **Keep Excel Updated**: Use latest budget data
5. **Archive Reports**: Use History to track versions

### For Regular Reports

1. **Create Custom Templates**: For recurring reports
2. **Maintain Snippet Library**: Build up reusable content
3. **Name Files Consistently**: Easy to find in History
4. **Batch Generate**: Create Word and PDF at same time
5. **Automate When Possible**: Switch to CLI for repetitive tasks

## Tips & Tricks

- **Quick Insert**: Drag text from Preview to Editor
- **Section Navigation**: Use sections list to jump around long documents
- **Multi-Format Output**: Generate all formats for maximum flexibility
- **Template Customization**: Load template, modify, save as content
- **Snippet Organization**: Use descriptive titles for easy finding

## Going Further

### Transition to CLI

Once comfortable with the web interface, power users can transition to CLI:

```bash
# After creating content in web interface
auto                    # Generate Word
auto --typst           # Generate PDF
auto --all             # Generate both
```

### Automation

For repetitive reports:

```bash
# Use web interface for first report
# Then automate subsequent updates via CLI
# Or use Python API for full automation
```

See [README.md](../README.md) for CLI and API documentation.

## Getting Help

- **Documentation**: https://3point.xyz/autorpt
- **GitHub**: https://github.com/VRConservation/autorpt
- **Issues**: https://github.com/VRConservation/autorpt/issues

---

**Happy Reporting!** 🎉
