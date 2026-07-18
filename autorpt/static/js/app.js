// Global state
let currentSections = [];
let currentEditor = 'wysiwyg';
let snippets = [];
let history = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTemplates();
    loadContent();
    loadExcelFiles();
    loadSnippets();
    loadHistory();
    loadVersion();
    initializePanelResize();
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
    
    // Update preview on content change
    document.getElementById('contentEditor').addEventListener('input', updatePreview);
    document.getElementById('contentMarkdown').addEventListener('input', updatePreview);
    
    // Set default date to today
    document.getElementById('metaDate').valueAsDate = new Date();
});

function initializePanelResize() {
    const appLayout = document.getElementById('appLayout');
    const leftPanel = document.getElementById('leftPanel');
    const resizeHandle = document.getElementById('resizeHandle');

    if (!appLayout || !leftPanel || !resizeHandle) {
        return;
    }

    let isResizing = false;

    resizeHandle.addEventListener('mousedown', function(event) {
        if (window.innerWidth <= 768) {
            return;
        }
        isResizing = true;
        event.preventDefault();
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(event) {
        if (!isResizing) {
            return;
        }

        const layoutRect = appLayout.getBoundingClientRect();
        const nextWidth = event.clientX - layoutRect.left;
        const constrainedWidth = Math.max(260, Math.min(700, nextWidth));
        appLayout.style.setProperty('--left-panel-width', `${constrainedWidth}px`);
    });

    document.addEventListener('mouseup', function() {
        if (!isResizing) {
            return;
        }
        isResizing = false;
        document.body.style.userSelect = '';
    });
}

function toggleLeftPanel() {
    const appLayout = document.getElementById('appLayout');
    if (!appLayout) {
        return;
    }

    appLayout.classList.toggle('panel-collapsed');
}

async function loadVersion() {
    const versionElement = document.getElementById('appVersion');
    if (!versionElement) {
        return;
    }

    try {
        const response = await fetch('/api/version');
        const data = await response.json();
        versionElement.textContent = `v${data.version}`;
    } catch (error) {
        versionElement.textContent = '';
    }
}

// Load available templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        
        const select = document.getElementById('templateSelect');
        data.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = template.name;
            option.dataset.sections = JSON.stringify(template.sections);
            select.appendChild(option);
        });
    } catch (error) {
        showToast('Error loading templates', 'danger');
    }
}

// Load template sections
function loadTemplate() {
    const select = document.getElementById('templateSelect');
    const option = select.options[select.selectedIndex];
    
    if (option.value && option.dataset.sections) {
        currentSections = JSON.parse(option.dataset.sections);
        renderSections();
        showToast('Template loaded', 'success');
    }
}

// Render sections list
function renderSections() {
    const container = document.getElementById('sectionsContainer');
    container.innerHTML = '';
    
    currentSections.forEach((section, index) => {
        const div = document.createElement('div');
        div.className = 'section-item';
        div.innerHTML = `
            <span>${section}</span>
            <div>
                <button class="btn btn-sm btn-link text-primary" onclick="jumpToSection(${index})">
                    <i class="bi bi-arrow-right"></i>
                </button>
                <button class="btn btn-sm btn-link text-danger" onclick="removeSection(${index})">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Add new section
function addSection() {
    const sectionName = prompt('Enter section name:');
    if (sectionName) {
        currentSections.push(sectionName);
        renderSections();
        
        // Add section to editor
        const editor = document.getElementById('contentEditor');
        const heading = document.createElement('h2');
        heading.textContent = sectionName;
        editor.appendChild(heading);
        const para = document.createElement('p');
        para.innerHTML = '<br>';
        editor.appendChild(para);
        
        updatePreview();
    }
}

// Remove section
function removeSection(index) {
    if (confirm('Remove this section?')) {
        currentSections.splice(index, 1);
        renderSections();
    }
}

// Jump to section
function jumpToSection(index) {
    const editor = document.getElementById('contentEditor');
    const headings = editor.querySelectorAll('h1, h2, h3');
    if (headings[index]) {
        headings[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        headings[index].focus();
    }
}

// Toggle editor mode
function toggleEditor(mode) {
    currentEditor = mode;
    
    if (mode === 'markdown') {
        document.getElementById('editorMarkdown').style.display = 'block';
        document.getElementById('editorWYSIWYG').style.display = 'none';
        document.getElementById('btnMarkdown').classList.add('active');
        document.getElementById('btnWYSIWYG').classList.remove('active');
        
        // Convert HTML to markdown (simple conversion)
        const html = document.getElementById('contentEditor').innerHTML;
        document.getElementById('contentMarkdown').value = htmlToMarkdown(html);
    } else {
        document.getElementById('editorMarkdown').style.display = 'none';
        document.getElementById('editorWYSIWYG').style.display = 'block';
        document.getElementById('btnMarkdown').classList.remove('active');
        document.getElementById('btnWYSIWYG').classList.add('active');
        
        // Convert markdown to HTML
        const markdown = document.getElementById('contentMarkdown').value;
        document.getElementById('contentEditor').innerHTML = marked.parse(markdown);
    }
    updatePreview();
}

// Format text in editor
function formatText(command) {
    document.execCommand(command, false, null);
    updatePreview();
}

// Insert list
function insertList(type) {
    if (type === 'ul') {
        document.execCommand('insertUnorderedList', false, null);
    } else {
        document.execCommand('insertOrderedList', false, null);
    }
    updatePreview();
}

// Update preview
function updatePreview() {
    const preview = document.getElementById('preview');
    
    if (currentEditor === 'wysiwyg') {
        const content = document.getElementById('contentEditor').innerHTML;
        preview.innerHTML = content;
    } else {
        const markdown = document.getElementById('contentMarkdown').value;
        preview.innerHTML = marked.parse(markdown);
    }
}

// Simple HTML to Markdown conversion
function htmlToMarkdown(html) {
    let text = html;
    text = text.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    text = text.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    text = text.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
    text = text.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    text = text.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    text = text.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    text = text.replace(/<i>(.*?)<\/i>/gi, '*$1*');
    text = text.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');
    return text.trim();
}

// Load existing content
async function loadContent() {
    try {
        const response = await fetch('/api/load-content');
        const data = await response.json();
        
        if (data.success) {
            // Load metadata
            document.getElementById('metaTitle').value = data.metadata.title || '';
            document.getElementById('metaAuthor').value = data.metadata.author || '';
            document.getElementById('metaDate').value = data.metadata.date || '';
            document.getElementById('metaProject').value = data.metadata.project || '';
            
            // Load content
            if (data.content) {
                if (currentEditor === 'markdown') {
                    document.getElementById('contentMarkdown').value = data.content;
                } else {
                    document.getElementById('contentEditor').innerHTML = marked.parse(data.content);
                }
                updatePreview();
            }
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Save content
async function saveContent() {
    const metadata = {
        title: document.getElementById('metaTitle').value,
        author: document.getElementById('metaAuthor').value,
        date: document.getElementById('metaDate').value,
        project: document.getElementById('metaProject').value
    };
    
    let content;
    if (currentEditor === 'markdown') {
        content = document.getElementById('contentMarkdown').value;
    } else {
        content = htmlToMarkdown(document.getElementById('contentEditor').innerHTML);
    }
    
    try {
        const response = await fetch('/api/save-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metadata, content })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast('Content saved successfully', 'success');
        }
    } catch (error) {
        showToast('Error saving content', 'danger');
    }
}

// Auto-save
function autoSave() {
    saveContent();
    console.log('Auto-saved at', new Date().toLocaleTimeString());
}

// Upload Excel file
async function uploadExcel() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload-excel', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            document.getElementById('excelPreview').innerHTML = `
                <div class="alert alert-success p-2 mt-2">
                    <small><strong>${data.filename}</strong><br>
                    ${data.rows} rows × ${data.columns.length} columns</small>
                </div>
                ${data.preview}
            `;
            loadExcelFiles();
            showToast('Excel file uploaded', 'success');
        } else {
            showToast(data.error, 'danger');
        }
    } catch (error) {
        showToast('Error uploading file', 'danger');
    }
}

// Load Excel files list
async function loadExcelFiles() {
    try {
        const response = await fetch('/api/list-excel-files');
        const data = await response.json();
        
        const container = document.getElementById('excelFiles');
        if (data.files.length > 0) {
            container.innerHTML = '<small class="text-muted">Available files:</small><ul class="list-unstyled small mt-1">';
            data.files.forEach(file => {
                container.innerHTML += `<li><i class="bi bi-file-earmark-excel text-success"></i> ${file.filename}</li>`;
            });
            container.innerHTML += '</ul>';
        }
    } catch (error) {
        console.error('Error loading Excel files:', error);
    }
}

// Generate report
async function generateReport(format) {
    // Save first
    await saveContent();
    
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Generating...';
    button.disabled = true;
    
    const metadata = {
        title: document.getElementById('metaTitle').value,
        author: document.getElementById('metaAuthor').value,
        date: document.getElementById('metaDate').value,
        project: document.getElementById('metaProject').value
    };
    
    let content;
    if (currentEditor === 'markdown') {
        content = document.getElementById('contentMarkdown').value;
    } else {
        content = htmlToMarkdown(document.getElementById('contentEditor').innerHTML);
    }
    
    try {
        const response = await fetch('/api/generate-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ format, metadata, content })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast(`Report generated: ${data.filename}`, 'success');
            
            // Download file
            window.location.href = data.download_url;
            
            loadHistory();
        } else {
            showToast(`Error: ${data.error}`, 'danger');
        }
    } catch (error) {
        showToast('Error generating report', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Snippets functionality
async function loadSnippets() {
    try {
        const response = await fetch('/api/snippets');
        const data = await response.json();
        snippets = data.snippets;
    } catch (error) {
        console.error('Error loading snippets:', error);
    }
}

function showSnippets() {
    renderSnippets();
    const modal = new bootstrap.Modal(document.getElementById('snippetsModal'));
    modal.show();
}

function renderSnippets() {
    const container = document.getElementById('snippetsList');
    if (snippets.length === 0) {
        container.innerHTML = '<p class="text-muted">No snippets saved yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    snippets.forEach(snippet => {
        const div = document.createElement('div');
        div.className = 'snippet-item';
        div.innerHTML = `
            <div class="d-flex justify-content-between">
                <strong>${snippet.title}</strong>
                <button class="btn btn-sm btn-danger" onclick="deleteSnippet(${snippet.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <small class="text-muted d-block mb-2">${new Date(snippet.created).toLocaleDateString()}</small>
            <div>${snippet.content.substring(0, 100)}${snippet.content.length > 100 ? '...' : ''}</div>
        `;
        div.onclick = (e) => {
            if (!e.target.closest('button')) {
                insertSnippet(snippet.content);
            }
        };
        container.appendChild(div);
    });
}

function showNewSnippet() {
    document.getElementById('newSnippetForm').style.display = 'block';
}

function hideNewSnippet() {
    document.getElementById('newSnippetForm').style.display = 'none';
    document.getElementById('snippetTitle').value = '';
    document.getElementById('snippetContent').value = '';
}

async function saveNewSnippet() {
    const title = document.getElementById('snippetTitle').value;
    const content = document.getElementById('snippetContent').value;
    
    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }
    
    try {
        const response = await fetch('/api/snippets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        
        const data = await response.json();
        if (data.success) {
            snippets = data.snippets;
            renderSnippets();
            hideNewSnippet();
            showToast('Snippet saved', 'success');
        }
    } catch (error) {
        showToast('Error saving snippet', 'danger');
    }
}

async function deleteSnippet(id) {
    if (!confirm('Delete this snippet?')) return;
    
    try {
        const response = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            snippets = data.snippets;
            renderSnippets();
            showToast('Snippet deleted', 'success');
        }
    } catch (error) {
        showToast('Error deleting snippet', 'danger');
    }
}

function insertSnippet(content) {
    const editor = document.getElementById('contentEditor');
    if (currentEditor === 'markdown') {
        const textarea = document.getElementById('contentMarkdown');
        textarea.value += '\n\n' + content;
    } else {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const node = document.createTextNode(content);
            range.insertNode(node);
        } else {
            editor.innerHTML += '<p>' + content + '</p>';
        }
    }
    updatePreview();
    showToast('Snippet inserted', 'success');
}

// History functionality
async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        const data = await response.json();
        history = data.history;
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function showHistory() {
    renderHistory();
    const modal = new bootstrap.Modal(document.getElementById('historyModal'));
    modal.show();
}

function renderHistory() {
    const container = document.getElementById('historyList');
    if (history.length === 0) {
        container.innerHTML = '<p class="text-muted">No reports generated yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="d-flex justify-content-between">
                <strong>${item.filename}</strong>
                <span class="badge bg-${getFormatBadge(item.format)}">${item.format.toUpperCase()}</span>
            </div>
            <small class="text-muted">${new Date(item.timestamp).toLocaleString()}</small>
            <div class="mt-2">${item.preview}</div>
            <a href="/api/download/${item.filename}" class="btn btn-sm btn-primary mt-2">
                <i class="bi bi-download"></i> Download
            </a>
        `;
        container.appendChild(div);
    });
}

function getFormatBadge(format) {
    const badges = {
        'docx': 'primary',
        'pdf': 'danger',
        'html': 'info',
        'md': 'secondary'
    };
    return badges[format] || 'secondary';
}

// Dark mode toggle
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('autorpt_theme', next);
    const icon = document.getElementById('themeIcon');
    icon.className = next === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
}

(function initTheme() {
    const saved = localStorage.getItem('autorpt_theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.addEventListener('DOMContentLoaded', function() {
            const icon = document.getElementById('themeIcon');
            if (icon) icon.className = 'bi bi-sun';
        });
    }
})();

// Toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast align-items-center text-white bg-${type} border-0`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    const toast = new bootstrap.Toast(toastContainer);
    toast.show();
    
    setTimeout(() => {
        toastContainer.remove();
    }, 5000);
}
