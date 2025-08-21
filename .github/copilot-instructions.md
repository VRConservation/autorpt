# autorpt - Automated Report Generator

autorpt is a Python package for automated budget report generation using Excel input and Word document output. It combines Excel data with Markdown content to create comprehensive grant management reports.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.**

## Working Effectively

### Bootstrap and Setup (Required First Steps)
- **NEVER CANCEL**: Full setup takes 2-3 minutes. Set timeout to 5+ minutes.
- Install main dependencies: `pip install -r requirements.txt` -- takes 1-45 seconds (depending on cache)
- Install development dependencies: `pip install -r requirements_dev.txt` -- takes 3-60 seconds (depending on cache)  
- Install package in editable mode: `pip install -e .` -- takes 2-15 seconds
- **ALWAYS** run all three commands above before doing any development work

### Build and Test
- Run tests: `python -m unittest discover tests/ -v` -- takes 1 second
- **Note**: Test suite is minimal with only basic functionality tests
- **NEVER CANCEL**: Even though tests are fast, always let them complete

### Linting and Code Quality
- Check code style: `flake8 autorpt tests` -- takes less than 1 second
- **Expected**: Many E501 line length errors exist in current codebase
- Format code: `black autorpt/` -- takes 2 seconds  
- Check spelling: `codespell autorpt/ --count` -- takes 1 second
- **ALWAYS** run `flake8 autorpt tests` and `black --check autorpt/` before committing

### Build Documentation
- Build docs: `mkdocs build --verbose` -- takes 6 seconds
- **NEVER CANCEL**: Documentation build includes Jupyter notebook processing
- **Note**: Documentation builds successfully with material theme
- **Important**: Documentation build requires a Git repository context (will fail in non-git directories)

## Core Functionality and Validation

### Basic Report Generation
- Generate report with auto-discovery: `autorpt --generate --auto-content --verbose` -- takes 1.2 seconds
- Generate with specific files: `autorpt --generate --mixed reports/content.md reports/budget.xlsx --verbose` -- takes 1.2 seconds
- Check available options: `autorpt --help` -- immediate response

### Platform-Specific Limitations
- **CRITICAL**: PDF conversion (`autorpt --pdf`) FAILS on Linux/macOS with: "NotImplementedError: docx2pdf is not implemented for linux as it requires Microsoft Word to be installed"
- PDF functionality only works on Windows with Microsoft Word installed
- **DO NOT** attempt PDF operations on Linux-based CI systems or macOS
- **This is expected behavior** - do not treat PDF failures as bugs on non-Windows platforms

### Manual Validation Scenarios
After making changes, **ALWAYS** run these validation steps:
1. **Generate basic report**: `autorpt --generate --auto-content --verbose`
2. **Verify file creation**: Check that `.docx` file is created in `reports/` directory
3. **Test with custom content**: `autorpt --generate --mixed reports/content.md reports/budget.xlsx`
4. **Check CLI help**: `autorpt --help` should display all options
5. **Run tests**: `python -m unittest discover tests/ -v`

## Key Project Structure

### Repository Root
```
autorpt/
├── autorpt/           # Main package source code
│   ├── autorpt.py     # Main report generation module
│   ├── common.py      # Shared utility functions
│   ├── pdf.py         # PDF conversion (Windows only)
│   ├── gen_auto.py    # Auto-generation functionality
│   └── gui.py         # GUI interface
├── tests/             # Unit tests (minimal coverage)
├── docs/              # MkDocs documentation
├── reports/           # Sample content and generated reports
│   ├── budget.xlsx    # Sample Excel budget file
│   ├── content.md     # Sample markdown content
│   └── *.docx         # Generated Word reports
├── requirements.txt   # Core dependencies
├── requirements_dev.txt # Development dependencies
└── setup.py          # Package configuration
```

### Critical Files for Development
- `autorpt/autorpt.py`: Main CLI entry point and report generation logic
- `autorpt/common.py`: Shared utilities for file handling and formatting
- `setup.py`: Package metadata and console script entry point
- `requirements.txt`: Core runtime dependencies (pandas, matplotlib, python-docx, etc.)

## Common Tasks

### Development Workflow
1. **Setup environment**: Run bootstrap commands above (2-3 minutes total)
2. **Make changes**: Edit files in `autorpt/` directory
3. **Test changes**: Generate sample reports to verify functionality
4. **Run tests**: `python -m unittest discover tests/ -v`
5. **Check code quality**: `flake8 autorpt tests` and `black --check autorpt/`
6. **Build docs**: `mkdocs build --verbose` if documentation changes made

### Timing Expectations and Timeouts
- **Installation**: 1-2 minutes total when cached, 2-3 minutes from scratch -- Set timeout to 5+ minutes
- **Report generation**: 1.2 seconds -- Set timeout to 30+ seconds
- **Tests**: 1 second -- Set timeout to 30+ seconds  
- **Linting**: 1-3 seconds total -- Set timeout to 60+ seconds
- **Documentation build**: 6 seconds -- Set timeout to 60+ seconds
- **NEVER CANCEL** any of these operations prematurely

### Entry Points and Commands
- **Main CLI**: `autorpt` (after `pip install -e .`)
- **Module syntax**: `python -m autorpt.autorpt` (alternative if package not installed)
- **Help**: `autorpt --help` shows all available options and examples

### Working with Sample Data
- **Sample files location**: `reports/budget.xlsx` and `reports/content.md`
- **Generated reports**: Automatically saved to `reports/` directory with timestamp
- **Chart generation**: Creates `budget_chart.png` in repository root

## Requirements and Dependencies

### Python Version
- **Minimum**: Python 3.9
- **Tested**: Python 3.9, 3.10, 3.11, 3.12
- **CI platforms**: Ubuntu, Windows, macOS

### Core Dependencies (requirements.txt)
- pandas>=1.3.0 (data processing)
- matplotlib>=3.5.0 (chart generation) 
- python-docx>=0.8.11 (Word document creation)
- openpyxl>=3.0.0 (Excel file reading)
- docx2pdf>=0.1.8 (PDF conversion, Windows only)

### Development Dependencies (requirements_dev.txt)
- black (code formatting)
- flake8 (linting)
- mkdocs + mkdocs-material (documentation)
- tox (testing framework, not configured)
- codespell (spell checking)
- coverage (test coverage)

## Validation Checklist

Before completing any changes, **ALWAYS** verify:
- [ ] `pip install -e .` succeeds without errors
- [ ] `autorpt --help` displays complete help text
- [ ] `autorpt --generate --auto-content --verbose` creates a Word document
- [ ] Generated `.docx` file exists in `reports/` directory and is not empty
- [ ] `python -m unittest discover tests/ -v` passes all tests
- [ ] `flake8 autorpt tests` completes (note: expect line length warnings)
- [ ] `black --check autorpt/` reports formatting status
- [ ] `mkdocs build` succeeds if documentation was modified

## Troubleshooting

### Common Issues
- **PDF conversion errors on Linux**: Expected behavior - PDF only works on Windows
- **Import errors**: Ensure `pip install -e .` was run after installing requirements
- **File not found errors**: Run commands from repository root directory
- **Flake8 line length errors**: Existing issue in codebase, not a blocker

### Expected Behavior
- Many flake8 E501 (line too long) warnings exist in current codebase
- PDF functionality is intentionally disabled on non-Windows platforms
- Test suite is minimal but functional
- Generated reports include both default content and discovered files from `reports/` directory