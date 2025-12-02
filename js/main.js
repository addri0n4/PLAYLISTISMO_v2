
import { INITIAL_DETAILS } from "./constants.js";
import { generateReadme } from "./gemini-service.js";
import { initUI, updateGenerateButton, updateDisplay } from "./ui-handler.js";

// Global App State
const state = {
  details: { ...INITIAL_DETAILS },
  markdown: '',
  isGenerating: false,
  activeTab: 'preview'
};

/**
 * Handles the generation flow.
 */
async function onGenerate() {
  if (!state.details.projectName) return;
  
  state.isGenerating = true;
  updateGenerateButton(state);
  
  try {
    const markdown = await generateReadme(state.details);
    state.markdown = markdown;
  } catch (error) {
    state.markdown = `# Error\n\n${error.message}`;
  } finally {
    state.isGenerating = false;
    updateGenerateButton(state);
    updateDisplay(state);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initUI(state, onGenerate);
});
