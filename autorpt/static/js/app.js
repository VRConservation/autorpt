// Global state
let currentSections = [];
let currentEditor = 'wysiwyg';
let snippets = [];
let history = [];
let budgetData = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTemplates();
    loadContent();
    loadExcelFiles();
    loadSnippets();
    loadHistory();
    fetchVersion();
    initResizeHandle();

    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
    }

    // Restore snippets collapsed state
    const snippetsOpen = localStorage.getItem('autorpt_snippetsOpen');
    if (snippetsOpen === '0') {
        document.getElementById('snippetsBody').classList.add('collapsed');
        document.getElementById('snippetsChevron').style.transform = 'rotate(-90deg)';
    }

    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);

    // Update preview on content change
    document.getElementById('contentEditor').addEventListener('input', updatePreview);
    document.getElementById('contentMarkdown').addEventListener('input', updatePreview);

    // Tab switching: toggle editorCard / budgetCard / previewCard in main panel
    var tabReport = document.querySelector('[data-bs-target="#tabReport"]');
    var tabBudget = document.querySelector('[data-bs-target="#tabBudget"]');
    var tabPreview = document.querySelector('[data-bs-target="#tabPreview"]');

    if (tabReport) {
        tabReport.addEventListener('shown.bs.tab', function() {
            document.getElementById('editorCard').classList.remove('d-none');
            document.getElementById('budgetCard').classList.add('d-none');
            document.getElementById('previewCard').classList.add('d-none');
            document.getElementById('basicsCard').classList.remove('d-none');
            document.getElementById('snippetsCard').classList.remove('d-none');
        });
    }
    if (tabBudget) {
        tabBudget.addEventListener('shown.bs.tab', function() {
            document.getElementById('editorCard').classList.add('d-none');
            document.getElementById('budgetCard').classList.remove('d-none');
            document.getElementById('previewCard').classList.add('d-none');
            document.getElementById('basicsCard').classList.remove('d-none');
            document.getElementById('snippetsCard').classList.remove('d-none');
        });
    }
    if (tabPreview) {
        tabPreview.addEventListener('shown.bs.tab', function() {
            document.getElementById('editorCard').classList.add('d-none');
            document.getElementById('budgetCard').classList.add('d-none');
            document.getElementById('previewCard').classList.remove('d-none');
            document.getElementById('basicsCard').classList.add('d-none');
            document.getElementById('snippetsCard').classList.add('d-none');
            updatePreview();
        });
    }

    // Set default date to today
    document.getElementById('metaDate').valueAsDate = new Date();
});

// Fetch version
async function fetchVersion() {
    try {
        const response = await fetch('/api/version');
        const data = await response.json();
        const el = document.getElementById('appVersion');
        if (el && data.version) el.textContent = 'v' + data.version;
    } catch (error) {
        console.error('Error fetching version:', error);
    }
}

// Toggle basics card body
function toggleBasics() {
    const body = document.getElementById('basicsBody');
    const chevron = document.getElementById('basicsChevron');
    if (body.style.display === 'none') {
        body.style.display = '';
        chevron.style.transform = '';
    } else {
        body.style.display = 'none';
        chevron.style.transform = 'rotate(-90deg)';
    }
}

// Toggle snippets card body
function toggleSnippetsPanel() {
    const body = document.getElementById('snippetsBody');
    const chevron = document.getElementById('snippetsChevron');
    if (body.classList.contains('collapsed')) {
        body.classList.remove('collapsed');
        chevron.style.transform = '';
        localStorage.setItem('autorpt_snippetsOpen', '1');
    } else {
        body.classList.add('collapsed');
        chevron.style.transform = 'rotate(-90deg)';
        localStorage.setItem('autorpt_snippetsOpen', '0');
    }
}

// Resizable left panel
function initResizeHandle() {
    const handle = document.getElementById('resizeHandle');
    const panel = document.getElementById('leftPanel');
    if (!handle || !panel) return;

    const savedWidth = localStorage.getItem('autorpt_leftPanelWidth');
    if (savedWidth !== null) {
        panel.style.width = savedWidth;
    }

    let startX, startWidth;

    function onMouseDown(e) {
        startX = e.clientX;
        startWidth = panel.offsetWidth;
        handle.classList.add('dragging');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    }

    function onMouseMove(e) {
        const diff = e.clientX - startX;
        const newWidth = Math.min(Math.max(startWidth + diff, 200), 600);
        panel.style.width = newWidth + 'px';
    }

    function onMouseUp() {
        handle.classList.remove('dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        localStorage.setItem('autorpt_leftPanelWidth', panel.style.width);
    }

    handle.addEventListener('mousedown', onMouseDown);

    handle.addEventListener('dblclick', function() {
        if (panel.style.width === '0px') {
            panel.style.width = '';
        } else {
            panel.style.width = '0px';
        }
        localStorage.setItem('autorpt_leftPanelWidth', panel.style.width);
    });
}

// Templates
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

function loadTemplate() {
    const select = document.getElementById('templateSelect');
    const option = select.options[select.selectedIndex];
    if (option.value && option.dataset.sections) {
        currentSections = JSON.parse(option.dataset.sections);
        renderSections();
        showToast('Template loaded', 'success');
    }
}

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

function addSection() {
    const sectionName = prompt('Enter section name:');
    if (sectionName) {
        currentSections.push(sectionName);
        renderSections();
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

function removeSection(index) {
    if (confirm('Remove this section?')) {
        currentSections.splice(index, 1);
        renderSections();
    }
}

function jumpToSection(index) {
    const editor = document.getElementById('contentEditor');
    const headings = editor.querySelectorAll('h1, h2, h3');
    if (headings[index]) {
        headings[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        headings[index].focus();
    }
}

function toggleEditor(mode) {
    currentEditor = mode;
    if (mode === 'markdown') {
        document.getElementById('editorMarkdown').style.display = 'block';
        document.getElementById('editorWYSIWYG').style.display = 'none';
        document.getElementById('btnMarkdown').classList.add('active');
        document.getElementById('btnWYSIWYG').classList.remove('active');
        const html = document.getElementById('contentEditor').innerHTML;
        document.getElementById('contentMarkdown').value = htmlToMarkdown(html);
    } else {
        document.getElementById('editorMarkdown').style.display = 'none';
        document.getElementById('editorWYSIWYG').style.display = 'block';
        document.getElementById('btnMarkdown').classList.remove('active');
        document.getElementById('btnWYSIWYG').classList.add('active');
        const markdown = document.getElementById('contentMarkdown').value;
        if (typeof marked !== 'undefined' && marked.parse) {
            document.getElementById('contentEditor').innerHTML = marked.parse(markdown);
        } else if (typeof marked === 'function') {
            document.getElementById('contentEditor').innerHTML = marked(markdown);
        }
    }
    updatePreview();
}

function formatText(command) {
    document.execCommand(command, false, null);
    updatePreview();
}

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
    if (!preview) return;

    let html;
    if (currentEditor === 'wysiwyg') {
        html = document.getElementById('contentEditor').innerHTML;
    } else {
        const markdown = document.getElementById('contentMarkdown').value;
        if (typeof marked !== 'undefined' && marked.parse) {
            html = marked.parse(markdown);
        } else if (typeof marked === 'function') {
            html = marked(markdown);
        } else {
            html = '<p>' + markdown.replace(/\n/g, '<br>') + '</p>';
        }
    }

    preview.innerHTML = html;
    renderMermaidIn(preview);
}

function renderMermaidIn(container) {
    if (typeof mermaid === 'undefined' || !mermaid.run) return;

    const codeBlocks = container.querySelectorAll('pre > code.language-mermaid');
    codeBlocks.forEach(function(code) {
        const pre = code.parentElement;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = code.textContent;
        pre.replaceWith(div);
    });

    const nodes = container.querySelectorAll('.mermaid');
    if (nodes.length > 0) {
        mermaid.run({ nodes: nodes }).catch(function(err) {
            console.error('Mermaid render error:', err);
        });
    }
}

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
            document.getElementById('metaTitle').value = data.metadata.title || '';
            document.getElementById('metaAuthor').value = data.metadata.author || '';
            document.getElementById('metaDate').value = data.metadata.date || '';
            document.getElementById('metaProject').value = data.metadata.project || '';

            if (data.metadata.budget) {
                try {
                    budgetData = JSON.parse(data.metadata.budget);
                    renderBudgetTable();
                } catch (e) { budgetData = []; }
            }
            const commentsEl = document.getElementById('budgetComments');
            if (commentsEl && data.metadata.budget_comments) {
                commentsEl.value = data.metadata.budget_comments;
            }

            if (data.content) {
                if (currentEditor === 'markdown') {
                    document.getElementById('contentMarkdown').value = data.content;
                } else {
                    if (typeof marked !== 'undefined' && marked.parse) {
                        document.getElementById('contentEditor').innerHTML = marked.parse(data.content);
                    } else if (typeof marked === 'function') {
                        document.getElementById('contentEditor').innerHTML = marked(data.content);
                    }
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
        project: document.getElementById('metaProject').value,
        budget: JSON.stringify(collectBudgetData()),
        budget_comments: (document.getElementById('budgetComments') || {}).value || ''
    };

    let content;
    if (currentEditor === 'markdown') {
        content = document.getElementById('contentMarkdown').value;
    } else {
        content = htmlToMarkdown(document.getElementById('contentEditor').innerHTML);
    }

    try {
        await fetch('/api/save-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metadata, content })
        });
    } catch (error) {
        showToast('Error saving content', 'danger');
    }
}

function autoSave() {
    saveContent();
}

// Generate report - accepts optional button element
async function generateReport(format, btn) {
    await saveContent();

    const button = btn || (event && event.target);
    let originalText = '';
    if (button) {
        originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        button.disabled = true;
    }

    const metadata = {
        title: document.getElementById('metaTitle').value,
        author: document.getElementById('metaAuthor').value,
        date: document.getElementById('metaDate').value,
        project: document.getElementById('metaProject').value,
        budget: JSON.stringify(collectBudgetData()),
        budget_comments: (document.getElementById('budgetComments') || {}).value || ''
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
            showToast('Report generated: ' + data.filename, 'success');
            if (format === 'pdf' || format === 'html') {
                window.open(data.download_url, '_blank');
            } else {
                window.location.href = data.download_url;
            }
            loadHistory();
        } else {
            showToast('Error: ' + data.error, 'danger');
        }
    } catch (error) {
        showToast('Error generating report', 'danger');
    } finally {
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
}

// Excel
async function uploadExcel() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload-excel', { method: 'POST', body: formData });
        const data = await response.json();
        if (data.success) {
            document.getElementById('excelPreview').innerHTML = `
                <div class="alert alert-success p-2 mt-2">
                    <small><strong>${data.filename}</strong><br>
                    ${data.rows} rows x ${data.columns.length} columns</small>
                </div>
                ${data.preview}
            `;
            loadExcelFiles();
        } else {
            showToast(data.error, 'danger');
        }
    } catch (error) {
        showToast('Error uploading file', 'danger');
    }
}

async function loadExcelFiles() {
    try {
        const response = await fetch('/api/list-excel-files');
        const data = await response.json();
        const container = document.getElementById('excelFiles');
        if (data.files.length > 0) {
            container.innerHTML = '<small class="text-muted">Available files:</small><ul class="list-unstyled small mt-1">';
            data.files.forEach(file => {
                container.innerHTML += '<li><i class="bi bi-file-earmark-excel text-success"></i> ' + file.filename + '</li>';
            });
            container.innerHTML += '</ul>';
        }
    } catch (error) {
        console.error('Error loading Excel files:', error);
    }
}

// Budget
function addBudgetRow(item, budgeted, actual) {
    budgetData.push({ item: item || '', budgeted: budgeted || '', actual: actual || '' });
    renderBudgetTable();
}

function removeBudgetRow(index) {
    budgetData.splice(index, 1);
    renderBudgetTable();
}

function renderBudgetTable() {
    const tbody = document.getElementById('budgetRows');
    if (!tbody) return;
    tbody.innerHTML = '';
    budgetData.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="form-control form-control-sm" value="${row.item}" onchange="budgetData[${i}].item=this.value"></td>
            <td><input type="number" class="form-control form-control-sm" value="${row.budgeted}" step="0.01" onchange="budgetData[${i}].budgeted=this.value"></td>
            <td><input type="number" class="form-control form-control-sm" value="${row.actual}" step="0.01" onchange="budgetData[${i}].actual=this.value"></td>
            <td><button class="btn btn-sm btn-link text-danger p-0" onclick="removeBudgetRow(${i})"><i class="bi bi-x"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
}

function collectBudgetData() {
    const rows = document.querySelectorAll('#budgetRows tr');
    const data = [];
    rows.forEach((tr) => {
        const inputs = tr.querySelectorAll('input');
        if (inputs.length >= 3) {
            data.push({ item: inputs[0].value, budgeted: inputs[1].value, actual: inputs[2].value });
        }
    });
    return data;
}

function renderBudgetMarkdown(data, comments) {
    if (!data || data.length === 0) return '';
    let md = '| Item | Budgeted | Actual |\n|------|----------|--------|\n';
    data.forEach(row => {
        if (row.item) md += '| ' + row.item + ' | ' + (row.budgeted || '0') + ' | ' + (row.actual || '0') + ' |\n';
    });
    if (comments) md += '\n**Budget Comments:**\n\n' + comments + '\n';
    return md;
}

// Snippets
async function loadSnippets() {
    try {
        const response = await fetch('/api/snippets');
        const data = await response.json();
        snippets = data.snippets;
        renderSnippetsPanel();
    } catch (error) {
        console.error('Error loading snippets:', error);
    }
}

function renderSnippetsPanel() {
    const container = document.getElementById('snippetsPanelBody');
    if (!container) return;
    if (snippets.length === 0) {
        container.innerHTML = '<p class="text-muted small text-center mt-2 mb-0">No snippets yet.</p>';
        return;
    }
    container.innerHTML = '';
    snippets.forEach(snippet => {
        const div = document.createElement('div');
        div.className = 'snippet-card';
        div.draggable = true;
        div.dataset.snippetId = snippet.id;
        div.dataset.content = snippet.content;
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="snippet-title">${snippet.title}</div>
                <div class="snippet-actions">
                    <button class="btn btn-sm btn-link text-danger p-0 ms-1" onclick="event.stopPropagation(); deleteSnippet(${snippet.id})" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="snippet-preview">${snippet.content.substring(0, 80)}${snippet.content.length > 80 ? '...' : ''}</div>
        `;

        div.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;
            insertSnippet(snippet.content);
        });

        div.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', snippet.content);
            e.dataTransfer.effectAllowed = 'copy';
            div.classList.add('dragging');
        });

        div.addEventListener('dragend', function() {
            div.classList.remove('dragging');
        });

        container.appendChild(div);
    });

    initEditorDropZone();
}

function initEditorDropZone() {
    const editor = document.getElementById('contentEditor');
    if (!editor || editor.dataset.dropInit) return;
    editor.dataset.dropInit = '1';

    editor.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        editor.classList.add('drag-over');
    });

    editor.addEventListener('dragleave', function() {
        editor.classList.remove('drag-over');
    });

    editor.addEventListener('drop', function(e) {
        e.preventDefault();
        editor.classList.remove('drag-over');
        const content = e.dataTransfer.getData('text/plain');
        if (content) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const node = document.createTextNode(content);
                range.insertNode(node);
                range.setStartAfter(node);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                editor.innerHTML += '<p>' + content + '</p>';
            }
            updatePreview();
        }
    });

    const textarea = document.getElementById('contentMarkdown');
    if (textarea) {
        textarea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        textarea.addEventListener('drop', function(e) {
            e.preventDefault();
            const content = e.dataTransfer.getData('text/plain');
            if (content) {
                textarea.value += '\n\n' + content;
                updatePreview();
            }
        });
    }
}

function showNewSnippet() {
    document.getElementById('newSnippetForm').style.display = 'block';
    document.getElementById('snippetTitle').focus();
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
            renderSnippetsPanel();
            hideNewSnippet();
        }
    } catch (error) {
        showToast('Error saving snippet', 'danger');
    }
}

async function deleteSnippet(id) {
    if (!confirm('Delete this snippet?')) return;
    try {
        const response = await fetch('/api/snippets/' + id, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            snippets = data.snippets;
            renderSnippetsPanel();
        }
    } catch (error) {
        showToast('Error deleting snippet', 'danger');
    }
}

function insertSnippet(content) {
    if (currentEditor === 'markdown') {
        const textarea = document.getElementById('contentMarkdown');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + content + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + content.length;
        textarea.focus();
    } else {
        const editor = document.getElementById('contentEditor');
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const node = document.createTextNode(content);
            range.insertNode(node);
            range.setStartAfter(node);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            editor.innerHTML += '<p>' + content + '</p>';
        }
        editor.focus();
    }
    updatePreview();
}

// History
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
    new bootstrap.Modal(document.getElementById('historyModal')).show();
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
    return { 'docx': 'primary', 'pdf': 'danger', 'html': 'info', 'md': 'secondary' }[format] || 'secondary';
}

// Gallery
async function showGallery() {
    new bootstrap.Modal(document.getElementById('galleryModal')).show();
    await loadGallery();
}

async function loadGallery() {
    const container = document.getElementById('galleryList');
    container.innerHTML = '<div class="col-12 text-center text-muted py-4"><div class="spinner-border spinner-border-sm"></div> Loading...</div>';
    try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        if (!data.reports || data.reports.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-4">No saved reports yet.</div>';
            return;
        }
        container.innerHTML = '';
        data.reports.forEach(report => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';
            col.innerHTML = `
                <div class="card h-100 gallery-card" style="cursor:pointer" onclick="loadSavedReport('${report.name}')">
                    <div class="card-body">
                        <h6 class="card-title mb-1">${report.title}</h6>
                        <small class="text-muted d-block">${report.name}</small>
                        ${report.project ? '<small class="text-muted d-block">' + report.project + '</small>' : ''}
                        ${report.date ? '<small class="text-muted d-block">' + report.date + '</small>' : ''}
                    </div>
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">Modified: ${new Date(report.modified).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    } catch (error) {
        container.innerHTML = '<div class="col-12 text-center text-danger py-4">Error loading reports.</div>';
    }
}

async function loadSavedReport(name) {
    try {
        const response = await fetch('/api/load-saved/' + name);
        const data = await response.json();
        if (data.success) {
            document.getElementById('metaTitle').value = data.metadata.title || '';
            document.getElementById('metaAuthor').value = data.metadata.author || '';
            document.getElementById('metaDate').value = data.metadata.date || '';
            document.getElementById('metaProject').value = data.metadata.project || '';

            if (data.metadata.budget) {
                try {
                    budgetData = JSON.parse(data.metadata.budget);
                    renderBudgetTable();
                } catch (e) { budgetData = []; }
            }
            const commentsEl = document.getElementById('budgetComments');
            if (commentsEl && data.metadata.budget_comments) {
                commentsEl.value = data.metadata.budget_comments;
            }

            if (data.content) {
                if (currentEditor === 'markdown') {
                    document.getElementById('contentMarkdown').value = data.content;
                } else {
                    if (typeof marked !== 'undefined' && marked.parse) {
                        document.getElementById('contentEditor').innerHTML = marked.parse(data.content);
                    } else if (typeof marked === 'function') {
                        document.getElementById('contentEditor').innerHTML = marked(data.content);
                    }
                }
                updatePreview();
            }

            bootstrap.Modal.getInstance(document.getElementById('galleryModal')).hide();
        } else {
            showToast(data.error, 'danger');
        }
    } catch (error) {
        showToast('Error loading report', 'danger');
    }
}

// Save As
function showSaveAs() {
    const title = document.getElementById('metaTitle').value;
    document.getElementById('saveAsName').value = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
    new bootstrap.Modal(document.getElementById('saveAsModal')).show();
}

async function saveAs() {
    const name = document.getElementById('saveAsName').value.trim();
    if (!name) {
        alert('Please enter a report name');
        return;
    }
    await saveContent();
    try {
        const response = await fetch('/api/save-as', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await response.json();
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('saveAsModal')).hide();
        } else {
            showToast(data.error, 'danger');
        }
    } catch (error) {
        showToast('Error saving report', 'danger');
    }
}

// Toast
function showToast(message, type) {
    type = type || 'info';
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast align-items-center text-white bg-' + type + ' border-0';
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
    setTimeout(function() { toastContainer.remove(); }, 5000);
}
