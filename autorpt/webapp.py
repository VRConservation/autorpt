"""Web application for autorpt - A user-friendly interface for report generation."""

import os
import json
import glob
import webbrowser
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for
from werkzeug.utils import secure_filename
import pandas as pd

# Try to import report generation functions
try:
    from .autorpt import create_report_word
    from .pdf import create_report_pdf
except ImportError:
    # Fallback if imports fail
    create_report_word = None
    create_report_pdf = None

try:
    from .common import read_markdown_with_frontmatter
except ImportError:
    def read_markdown_with_frontmatter(filepath):
        """Fallback function to read markdown files."""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        # Simple frontmatter parsing
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                metadata_text = parts[1]
                body = parts[2].strip()
                metadata = {}
                for line in metadata_text.strip().split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        metadata[key.strip()] = value.strip()
                return metadata, body
        return {}, content

try:
    from . import __version__
except ImportError:
    __version__ = '0.0.0'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'autorpt-secret-key-change-in-production'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Configuration
REPORTS_DIR = Path('reports')
SNIPPETS_FILE = REPORTS_DIR / 'snippets.json'
HISTORY_FILE = REPORTS_DIR / 'history.json'

# Ensure directories exist
REPORTS_DIR.mkdir(exist_ok=True)


def get_snippets():
    """Load saved snippets."""
    if SNIPPETS_FILE.exists():
        with open(SNIPPETS_FILE, 'r') as f:
            return json.load(f)
    return []


def save_snippets(snippets):
    """Save snippets to file."""
    with open(SNIPPETS_FILE, 'w') as f:
        json.dump(snippets, f, indent=2)


def get_history():
    """Load report history."""
    if HISTORY_FILE.exists():
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []


def save_history(history):
    """Save report history."""
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)


def add_to_history(filename, format_type, content_preview):
    """Add a generated report to history."""
    history = get_history()
    history.insert(0, {
        'filename': filename,
        'format': format_type,
        'timestamp': datetime.now().isoformat(),
        'preview': content_preview[:100] + '...' if len(content_preview) > 100 else content_preview
    })
    # Keep only last 50 entries
    history = history[:50]
    save_history(history)


@app.route('/')
def index():
    """Main page."""
    return render_template('index.html')


@app.route('/api/version')
def get_version():
    """Return current application version."""
    return jsonify({'version': __version__})


@app.route('/api/load-content', methods=['GET'])
def load_content():
    """Load existing content.md file."""
    content_path = REPORTS_DIR / 'content.md'
    if content_path.exists():
        with open(content_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse frontmatter and content
        metadata, body = read_markdown_with_frontmatter(str(content_path))
        
        return jsonify({
            'success': True,
            'metadata': metadata,
            'content': body
        })
    return jsonify({
        'success': True,
        'metadata': {},
        'content': ''
    })


@app.route('/api/save-content', methods=['POST'])
def save_content():
    """Save content to content.md."""
    data = request.json
    metadata = data.get('metadata', {})
    content = data.get('content', '')
    
    # Build markdown with frontmatter
    lines = ['---']
    for key, value in metadata.items():
        lines.append(f'{key}: {value}')
    lines.append('---')
    lines.append('')
    lines.append(content)
    
    full_content = '\n'.join(lines)
    
    content_path = REPORTS_DIR / 'content.md'
    with open(content_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    return jsonify({'success': True})


@app.route('/api/upload-excel', methods=['POST'])
def upload_excel():
    """Handle Excel file upload."""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'})
    
    if file and file.filename.endswith(('.xlsx', '.xls')):
        filename = secure_filename(file.filename)
        filepath = REPORTS_DIR / filename
        file.save(filepath)
        
        # Read Excel to show preview
        try:
            df = pd.read_excel(filepath)
            preview = df.head(5).to_html(classes='table table-sm table-bordered', index=False)
            return jsonify({
                'success': True,
                'filename': filename,
                'preview': preview,
                'rows': len(df),
                'columns': list(df.columns)
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    return jsonify({'success': False, 'error': 'Invalid file type. Please upload .xlsx or .xls'})


@app.route('/api/list-excel-files', methods=['GET'])
def list_excel_files():
    """List all Excel files in reports directory."""
    excel_files = []
    for ext in ['*.xlsx', '*.xls']:
        excel_files.extend(glob.glob(str(REPORTS_DIR / ext)))
    
    files = []
    for filepath in excel_files:
        path = Path(filepath)
        files.append({
            'filename': path.name,
            'size': path.stat().st_size,
            'modified': datetime.fromtimestamp(path.stat().st_mtime).isoformat()
        })
    
    return jsonify({'files': files})


@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    """Generate report in specified format."""
    data = request.json
    format_type = data.get('format', 'docx')
    
    # Save content first
    save_content()
    
    try:
        timestamp = datetime.now().strftime('%Y-%m-%d')
        content_file = str(REPORTS_DIR / 'content.md')
        
        if format_type == 'docx':
            filename = f'report_{timestamp}.docx'
            filepath = REPORTS_DIR / filename
            if create_report_word:
                # Use the main autorpt function
                from .autorpt import generate_report_from_content
                generate_report_from_content()
                # Find the generated file
                latest_docx = max(glob.glob(str(REPORTS_DIR / 'report_*.docx')), 
                                key=os.path.getctime, default=None)
                if latest_docx:
                    filename = Path(latest_docx).name
            else:
                return jsonify({'success': False, 'error': 'Word generation not available'})
                
        elif format_type == 'pdf':
            filename = f'report_{timestamp}.pdf'
            filepath = REPORTS_DIR / filename
            if create_report_pdf:
                # Use typst or pdf generation
                from .autorpt import generate_pdf_with_typst
                generate_pdf_with_typst()
                # Find the generated file
                latest_pdf = max(glob.glob(str(REPORTS_DIR / 'report_*.pdf')),
                               key=os.path.getctime, default=None)
                if latest_pdf:
                    filename = Path(latest_pdf).name
            else:
                return jsonify({'success': False, 'error': 'PDF generation not available. Install Typst.'})
                
        elif format_type == 'html':
            filename = f'report_{timestamp}.html'
            filepath = REPORTS_DIR / filename
            # Simple HTML export
            import markdown
            with open(content_file, 'r', encoding='utf-8') as f:
                content = f.read()
            # Remove frontmatter for HTML
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    content = parts[2]
            html_content = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{data.get('metadata', {}).get('title', 'Report')}</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }}
        h1 {{ color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }}
        h2 {{ color: #0066cc; margin-top: 30px; }}
        table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #0066cc; color: white; }}
    </style>
</head>
<body>
    {markdown.markdown(content, extensions=['tables', 'fenced_code'])}
</body>
</html>'''
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
                
        elif format_type == 'md':
            filename = f'report_{timestamp}.md'
            filepath = REPORTS_DIR / filename
            # Just copy the content.md file
            import shutil
            shutil.copy(content_file, filepath)
        
        add_to_history(filename, format_type, data.get('content', ''))
        
        return jsonify({
            'success': True,
            'filename': filename,
            'download_url': f'/api/download/{filename}'
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)})



@app.route('/api/gallery')
def get_gallery():
    """List all saved report directories."""
    reports = []
    if REPORTS_DIR.exists():
        for item in sorted(REPORTS_DIR.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True):
            if item.is_dir() and not item.name.startswith('.'):
                content_file = item / 'content.md'
                meta = {}
                if content_file.exists():
                    meta, _ = read_markdown_with_frontmatter(str(content_file))
                reports.append({
                    'name': item.name,
                    'title': meta.get('title', item.name),
                    'project': meta.get('project', ''),
                    'date': meta.get('date', ''),
                    'modified': datetime.fromtimestamp(item.stat().st_mtime).isoformat(),
                })
    return jsonify({'reports': reports})


@app.route('/api/save-as', methods=['POST'])
def save_as():
    """Save current report to a new directory."""
    import shutil
    data = request.json
    name = secure_filename(data.get('name', '').strip())
    if not name:
        return jsonify({'success': False, 'error': 'Name is required'})

    dest_dir = REPORTS_DIR / name
    if dest_dir.exists():
        return jsonify({'success': False, 'error': f'"{name}" already exists'})

    dest_dir.mkdir(parents=True, exist_ok=True)

    # Copy content.md
    src_content = REPORTS_DIR / 'content.md'
    if src_content.exists():
        shutil.copy(src_content, dest_dir / 'content.md')

    # Copy any .xlsx files
    for xlsx in REPORTS_DIR.glob('*.xlsx'):
        shutil.copy(xlsx, dest_dir / xlsx.name)

    return jsonify({'success': True, 'name': name})


@app.route('/api/load-saved/<name>')
def load_saved(name):
    """Load a saved report by directory name."""
    safe_name = secure_filename(name)
    saved_dir = REPORTS_DIR / safe_name
    if not saved_dir.exists():
        return jsonify({'success': False, 'error': 'Report not found'})

    content_file = saved_dir / 'content.md'
    if content_file.exists():
        metadata, body = read_markdown_with_frontmatter(str(content_file))
        return jsonify({
            'success': True,
            'metadata': metadata,
            'content': body,
            'name': safe_name
        })
    return jsonify({'success': False, 'error': 'No content.md found'})


@app.route('/api/download/<filename>')
def download_file(filename):
    """Download or view a generated report."""
    filepath = REPORTS_DIR / secure_filename(filename)
    if filepath.exists():
        # Open PDF and HTML in browser; force download for Word and Markdown
        if filename.endswith(('.pdf', '.html')):
            return send_file(filepath, as_attachment=False)
        return send_file(filepath, as_attachment=True)
    return jsonify({'error': 'File not found'}), 404


@app.route('/api/snippets', methods=['GET'])
def get_snippets_api():
    """Get all snippets."""
    return jsonify({'snippets': get_snippets()})


@app.route('/api/snippets', methods=['POST'])
def save_snippet():
    """Save a new snippet."""
    data = request.json
    snippets = get_snippets()
    snippets.append({
        'id': len(snippets) + 1,
        'title': data.get('title', 'Untitled'),
        'content': data.get('content', ''),
        'created': datetime.now().isoformat()
    })
    save_snippets(snippets)
    return jsonify({'success': True, 'snippets': snippets})


@app.route('/api/snippets/<int:snippet_id>', methods=['DELETE'])
def delete_snippet(snippet_id):
    """Delete a snippet."""
    snippets = get_snippets()
    snippets = [s for s in snippets if s['id'] != snippet_id]
    save_snippets(snippets)
    return jsonify({'success': True, 'snippets': snippets})


@app.route('/api/history', methods=['GET'])
def get_history_api():
    """Get report history."""
    return jsonify({'history': get_history()})


@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get available report templates."""
    templates = [
        {
            'id': 'basic',
            'name': 'Basic Report',
            'sections': ['Executive Summary', 'Introduction', 'Budget', 'Conclusion']
        },
        {
            'id': 'grant',
            'name': 'Grant Report',
            'sections': ['Project Overview', 'Activities', 'Budget', 'Outcomes', 'Next Steps']
        },
        {
            'id': 'quarterly',
            'name': 'Quarterly Report',
            'sections': ['Q1 Summary', 'Q2 Summary', 'Q3 Summary', 'Q4 Summary', 'Annual Budget']
        }
    ]
    return jsonify({'templates': templates})


def kill_port(port):
    """Kill any process listening on the given port."""
    import subprocess
    import time
    try:
        result = subprocess.run(
            ['lsof', '-ti', f':{port}'],
            capture_output=True, text=True, timeout=5
        )
        pids = result.stdout.strip().split('\n')
        for pid in pids:
            if pid.isdigit():
                subprocess.run(['kill', '-9', pid], timeout=5)
        if pids and pids[0]:
            print(f"  Cleared port {port}")
            time.sleep(0.5)
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass


def start_server(host='127.0.0.1', port=8080, debug=False, open_browser=True):
    """Start the Flask web server."""
    kill_port(port)

    if open_browser:
        import threading
        def open_browser_delayed():
            import time
            time.sleep(1.5)
            webbrowser.open(f'http://{host}:{port}')
        threading.Thread(target=open_browser_delayed, daemon=True).start()
    
    print(f"\n🚀 AutoRpt Web Interface Starting...")
    print(f"📝 Open your browser to: http://{host}:{port}")
    print(f"📁 Reports directory: {REPORTS_DIR.absolute()}")
    print(f"⌨️  Press CTRL+C to stop\n")
    
    app.run(host=host, port=port, debug=debug)


if __name__ == '__main__':
    start_server(debug=True)
