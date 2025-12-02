
import { renderMarkdown } from "./markdown-renderer.js";

// Cache DOM elements
const els = {
  inputs: {
    projectName: document.getElementById('projectName'),
    tagline: document.getElementById('tagline'),
    description: document.getElementById('description'),
    techStack: document.getElementById('techStack'),
    features: document.getElementById('features'),
    installation: document.getElementById('installation'),
    usage: document.getElementById('usage'),
    license: document.getElementById('license'),
    contributing: document.getElementById('contributing')
  },
  buttons: {
    generate: document.getElementById('generateBtn'),
    tabPreview: document.getElementById('tabPreview'),
    tabRaw: document.getElementById('tabRaw'),
    copy: document.getElementById('copyBtn'),
    download: document.getElementById('downloadBtn')
  },
  containers: {
    contentArea: document.getElementById('contentArea'),
    preview: document.getElementById('previewContainer'),
    raw: document.getElementById('rawContainer')
  }
};

let currentState = {};

/**
 * Initializes UI event listeners.
 * @param {Object} state - The application state object.
 * @param {Function} onGenerate - Callback for generate button.
 */
export function initUI(state, onGenerate) {
  currentState = state;

  // Bind Input Events
  Object.keys(els.inputs).forEach(key => {
    const el = els.inputs[key];
    if (!el) return;
    
    // Set initial values
    if (el.type === 'checkbox') {
        el.checked = state.details[key];
    } else {
        el.value = state.details[key];
    }

    el.addEventListener('input', () => {
      const val = el.type === 'checkbox' ? el.checked : el.value;
      state.details[key] = val;
      updateGenerateButton(state);
    });
  });

  // Bind Buttons
  els.buttons.generate.addEventListener('click', onGenerate);
  
  els.buttons.tabPreview.addEventListener('click', () => switchTab('preview'));
  els.buttons.tabRaw.addEventListener('click', () => switchTab('raw'));
  
  els.buttons.copy.addEventListener('click', handleCopy);
  els.buttons.download.addEventListener('click', handleDownload);
  
  // Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  updateGenerateButton(state);
}

/**
 * Updates the generate button state (loading/disabled).
 */
export function updateGenerateButton(state) {
  const hasName = !!state.details.projectName.trim();
  const btn = els.buttons.generate;
  
  btn.disabled = !hasName || state.isGenerating;
  
  if (state.isGenerating) {
    btn.innerHTML = `
      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      <span>Generating...</span>
    `;
  } else {
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      <span>Generate Readme</span>
    `;
  }
}

/**
 * Updates the content area with the generated markdown.
 */
export function updateDisplay(state) {
  const { markdown, activeTab } = state;
  
  // Update Preview HTML
  els.containers.preview.innerHTML = renderMarkdown(markdown);
  // Update Raw Textarea
  els.containers.raw.value = markdown;

  // Empty State Logic
  if(!markdown && activeTab === 'preview') {
      els.containers.preview.innerHTML = `
          <div class="h-[500px] flex flex-col items-center justify-center text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code mb-4 opacity-20"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <p>Fill out the form and click generate</p>
          </div>
      `;
  }
}

function switchTab(tab) {
  currentState.activeTab = tab;
  
  if (tab === 'preview') {
    els.buttons.tabPreview.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 bg-indigo-600 text-white shadow-lg";
    els.buttons.tabRaw.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 text-slate-400 hover:text-white";
    els.containers.preview.classList.remove('hidden');
    els.containers.raw.classList.add('hidden');
  } else {
    els.buttons.tabRaw.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 bg-indigo-600 text-white shadow-lg";
    els.buttons.tabPreview.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 text-slate-400 hover:text-white";
    els.containers.raw.classList.remove('hidden');
    els.containers.preview.classList.add('hidden');
  }
  updateDisplay(currentState);
}

function handleCopy() {
  if (!currentState.markdown) return;
  navigator.clipboard.writeText(currentState.markdown);
  
  const originalIcon = els.buttons.copy.innerHTML;
  els.buttons.copy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-5 h-5 text-green-400"><path d="M20 6 9 17l-5-5"/></svg>`;
  
  setTimeout(() => {
    els.buttons.copy.innerHTML = originalIcon;
  }, 2000);
}

function handleDownload() {
  if (!currentState.markdown) return;
  const blob = new Blob([currentState.markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'README.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
