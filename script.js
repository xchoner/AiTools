/**
 * Aether AI — Tools Directory
 * Pure Vanilla JavaScript (ES6+), Zero Dependencies, GitHub Pages Ready.
 */

// ==========================================
// 1. SUBMISSION & SERVICE CONFIGURATION
// ==========================================
// Configure your email submission provider below.
// Replace placeholder values with your real Formspree endpoint or Web3Forms access key.
const SUBMISSION_CONFIG = {
  // Provider: 'formspree' | 'web3forms'
  provider: 'formspree',

  // Formspree: Create a free form at https://formspree.io/ and paste your form endpoint here:
  // Example: 'https://formspree.io/f/xvgowqkp'
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',

  // Web3Forms: Obtain a free access key at https://web3forms.com/ and paste it here:
  // Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  web3FormsAccessKey: 'YOUR_ACCESS_KEY'
};

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
const state = {
  tools: [],
  filteredTools: [],
  isLoading: true,
  loadError: null,
  activeCategory: 'All',
  activePricing: 'All',
  searchQuery: '',
  sortBy: 'featured',
  isSubmitting: false
};

// ==========================================
// 3. DOM ELEMENT REFERENCES
// ==========================================
const elements = {
  // Theme
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeIcon: document.getElementById('theme-icon'),

  // Search
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  searchStatsCount: document.getElementById('search-stats-count'),

  // Filters
  categoryContainer: document.getElementById('category-scroll-container'),
  pricingButtons: document.querySelectorAll('.pricing-btn'),
  sortSelect: document.getElementById('sort-select'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),

  // Results & Grids
  featuredSection: document.getElementById('featured-section'),
  featuredGrid: document.getElementById('featured-grid'),
  toolsGrid: document.getElementById('tools-grid'),
  resultsCountTitle: document.getElementById('results-count-title'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  emptyState: document.getElementById('empty-state'),
  retryLoadBtn: document.getElementById('retry-load-btn'),
  clearEmptyFiltersBtn: document.getElementById('clear-empty-filters-btn'),

  // Submission Form
  submissionForm: document.getElementById('submission-form'),
  submitBtn: document.getElementById('submit-btn'),
  submitBtnText: document.getElementById('submit-btn-text'),
  submitSpinner: document.getElementById('submit-spinner'),
  formAlertSuccess: document.getElementById('form-alert-success'),
  formAlertError: document.getElementById('form-alert-error'),
  formAlertErrorText: document.getElementById('form-alert-error-text'),

  // Modal
  guideModal: document.getElementById('guide-modal'),
  openGuideBtn: document.getElementById('open-guide-btn'),
  openGuideBtnHero: document.getElementById('open-guide-btn-hero'),
  closeGuideBtn: document.getElementById('close-guide-btn')
};

// ==========================================
// 4. UTILITIES & SANITIZATION
// ==========================================

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string} Safe string
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates that an external URL starts with http:// or https://.
 * @param {string} url 
 * @returns {boolean}
 */
function isValidExternalUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates email address format.
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim().toLowerCase());
}

/**
 * Debounce helper function.
 * @param {Function} func 
 * @param {number} wait 
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==========================================
// 5. THEME TOGGLE (Light / Dark)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (elements.themeIcon) {
    if (theme === 'dark') {
      // Moon / Sun toggle
      elements.themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      elements.themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      elements.themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      elements.themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

// ==========================================
// 6. DATA FETCHING (tools.json)
// ==========================================
async function fetchToolsData() {
  state.isLoading = true;
  state.loadError = null;
  renderState();

  try {
    // Relative path works universally on root and GitHub Pages project subdirectories
    const response = await fetch('./tools.json', { cache: 'no-cache' });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Failed to load tools database.`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid format: tools.json must contain an array of tools.');
    }

    state.tools = data;
    state.isLoading = false;
    applyFilters();
    renderCategories();
  } catch (err) {
    console.error('Error loading tools.json:', err);
    state.isLoading = false;
    state.loadError = err.message || 'Unable to load tools. Please check your network or try again.';
    renderState();
  }
}

// ==========================================
// 7. FILTERING & SORTING LOGIC
// ==========================================
function applyFilters() {
  const query = state.searchQuery.trim().toLowerCase();

  let results = state.tools.filter(tool => {
    // 1. Search Query (name or description)
    if (query) {
      const matchName = tool.name && tool.name.toLowerCase().includes(query);
      const matchDesc = tool.description && tool.description.toLowerCase().includes(query);
      const matchCat = tool.category && tool.category.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat) {
        return false;
      }
    }

    // 2. Category Filter
    if (state.activeCategory !== 'All' && tool.category !== state.activeCategory) {
      return false;
    }

    // 3. Pricing Filter
    if (state.activePricing !== 'All') {
      if (tool.pricing.toLowerCase() !== state.activePricing.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // 4. Sorting
  if (state.sortBy === 'featured') {
    results.sort((a, b) => {
      if (a.featured === b.featured) {
        return a.name.localeCompare(b.name);
      }
      return a.featured ? -1 : 1;
    });
  } else if (state.sortBy === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.sortBy === 'name-desc') {
    results.sort((a, b) => b.name.localeCompare(a.name));
  }

  state.filteredTools = results;
  renderState();
  renderTools();
  renderFeaturedTools();
  updateSearchStats();
}

function clearAllFilters() {
  state.searchQuery = '';
  state.activeCategory = 'All';
  state.activePricing = 'All';
  state.sortBy = 'featured';

  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.searchClearBtn) elements.searchClearBtn.style.display = 'none';
  if (elements.sortSelect) elements.sortSelect.value = 'featured';

  // Reset category buttons active state
  document.querySelectorAll('.filter-chip').forEach(btn => {
    if (btn.dataset.category === 'All') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Reset pricing buttons active state
  elements.pricingButtons.forEach(btn => {
    if (btn.dataset.pricing === 'All') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyFilters();
}

// ==========================================
// 8. RENDERING FUNCTIONS
// ==========================================

function renderState() {
  // Hide all state containers first
  elements.loadingState.style.display = 'none';
  elements.errorState.style.display = 'none';
  elements.emptyState.style.display = 'none';
  elements.toolsGrid.style.display = 'none';

  if (state.isLoading) {
    elements.loadingState.style.display = 'block';
    if (elements.featuredSection) elements.featuredSection.style.display = 'none';
    return;
  }

  if (state.loadError) {
    elements.errorState.style.display = 'block';
    const errorMsgEl = document.getElementById('error-message-text');
    if (errorMsgEl) errorMsgEl.textContent = state.loadError;
    if (elements.featuredSection) elements.featuredSection.style.display = 'none';
    return;
  }

  if (state.filteredTools.length === 0) {
    elements.emptyState.style.display = 'block';
    return;
  }

  // If there are results
  elements.toolsGrid.style.display = 'grid';
}

function renderTools() {
  if (state.filteredTools.length === 0) return;

  elements.toolsGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  state.filteredTools.forEach(tool => {
    const card = createToolCard(tool);
    fragment.appendChild(card);
  });

  elements.toolsGrid.appendChild(fragment);

  // Update counter title
  if (elements.resultsCountTitle) {
    const catText = state.activeCategory !== 'All' ? ` in ${state.activeCategory}` : '';
    const priceText = state.activePricing !== 'All' ? ` (${state.activePricing})` : '';
    elements.resultsCountTitle.innerHTML = `Showing <strong>${state.filteredTools.length}</strong> AI Tools${escapeHTML(catText)}${escapeHTML(priceText)}`;
  }
}

function renderFeaturedTools() {
  if (!elements.featuredGrid || !elements.featuredSection) return;

  // Show featured section only when in default browsing mode (no query and 'All' category)
  const isDefaultView = !state.searchQuery && state.activeCategory === 'All' && state.activePricing === 'All';

  if (!isDefaultView) {
    elements.featuredSection.style.display = 'none';
    return;
  }

  const featured = state.tools.filter(t => t.featured).slice(0, 4);
  if (featured.length === 0) {
    elements.featuredSection.style.display = 'none';
    return;
  }

  elements.featuredSection.style.display = 'block';
  elements.featuredGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  featured.forEach(tool => {
    const card = createToolCard(tool);
    fragment.appendChild(card);
  });

  elements.featuredGrid.appendChild(fragment);
}

/**
 * Creates an accessible, safe DOM card element for a tool.
 * @param {Object} tool 
 * @returns {HTMLElement}
 */
function createToolCard(tool) {
  const article = document.createElement('article');
  article.className = 'tool-card';
  article.setAttribute('aria-labelledby', `tool-name-${tool.id}`);

  // Safe pricing class
  const pricingLower = (tool.pricing || 'freemium').toLowerCase();
  const pricingClass = `badge-${pricingLower}`;

  // Safe initials for fallback logo
  const initials = (tool.name || 'AI')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  // Validate URL
  const safeUrl = isValidExternalUrl(tool.url) ? tool.url : '#';

  article.innerHTML = `
    <div>
      <div class="card-top">
        <div class="tool-logo-container" aria-hidden="true">
          ${tool.logo ? `
            <img 
              src="${escapeHTML(tool.logo)}" 
              alt="${escapeHTML(tool.name)} logo" 
              class="tool-logo-img" 
              loading="lazy" 
              referrerpolicy="no-referrer"
              onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'tool-fallback-icon\\'>${escapeHTML(initials)}</div>';"
            />
          ` : `
            <div class="tool-fallback-icon">${escapeHTML(initials)}</div>
          `}
        </div>
        <div class="card-title-group">
          <h3 class="tool-name" id="tool-name-${escapeHTML(tool.id)}" title="${escapeHTML(tool.name)}">${escapeHTML(tool.name)}</h3>
          <span class="tool-category-label">${escapeHTML(tool.category || 'General')}</span>
        </div>
      </div>

      <div class="card-body">
        <p class="tool-description">${escapeHTML(tool.description)}</p>
      </div>
    </div>

    <div class="card-footer">
      <div class="badge-group">
        <span class="badge ${pricingClass}">${escapeHTML(tool.pricing)}</span>
        ${tool.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
      </div>

      <a 
        href="${escapeHTML(safeUrl)}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="visit-btn"
        aria-label="Visit official website for ${escapeHTML(tool.name)} (opens in a new tab)"
      >
        <span>Visit</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
  `;

  return article;
}

function renderCategories() {
  if (!elements.categoryContainer) return;

  const categories = [
    'All',
    'Writing',
    'Image Generation',
    'Video',
    'Coding',
    'Audio',
    'Productivity',
    'Research',
    'Business',
    'Education'
  ];

  // Count tools per category
  const counts = { All: state.tools.length };
  state.tools.forEach(tool => {
    if (tool.category) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
  });

  elements.categoryContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-chip ${state.activeCategory === cat ? 'active' : ''}`;
    btn.dataset.category = cat;
    btn.innerHTML = `
      <span>${escapeHTML(cat)}</span>
      <span class="chip-count">${counts[cat] || 0}</span>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = cat;
      applyFilters();
    });

    fragment.appendChild(btn);
  });

  elements.categoryContainer.appendChild(fragment);
}

function updateSearchStats() {
  if (elements.searchStatsCount) {
    elements.searchStatsCount.textContent = state.tools.length;
  }
}

// ==========================================
// 9. EVENT LISTENERS SETUP
// ==========================================
function initEventListeners() {
  // Search Input with Debounce
  const handleSearch = debounce(event => {
    state.searchQuery = event.target.value;
    if (elements.searchClearBtn) {
      elements.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
    }
    applyFilters();
  }, 150);

  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', handleSearch);
  }

  // Clear Search Button
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';
      state.searchQuery = '';
      applyFilters();
      elements.searchInput.focus();
    });
  }

  // Pricing Filter Buttons
  elements.pricingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.pricingButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activePricing = btn.dataset.pricing;
      applyFilters();
    });
  });

  // Sort Select Dropdown
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', e => {
      state.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Reset Filter Buttons
  if (elements.resetFiltersBtn) {
    elements.resetFiltersBtn.addEventListener('click', clearAllFilters);
  }
  if (elements.clearEmptyFiltersBtn) {
    elements.clearEmptyFiltersBtn.addEventListener('click', clearAllFilters);
  }

  // Retry Load Button
  if (elements.retryLoadBtn) {
    elements.retryLoadBtn.addEventListener('click', fetchToolsData);
  }

  // Submission Form Handler
  if (elements.submissionForm) {
    elements.submissionForm.addEventListener('submit', handleFormSubmission);
  }

  // Modal Open/Close
  if (elements.openGuideBtn) {
    elements.openGuideBtn.addEventListener('click', () => openModal(elements.guideModal));
  }
  if (elements.openGuideBtnHero) {
    elements.openGuideBtnHero.addEventListener('click', () => openModal(elements.guideModal));
  }
  if (elements.closeGuideBtn) {
    elements.closeGuideBtn.addEventListener('click', () => closeModal(elements.guideModal));
  }
  if (elements.guideModal) {
    elements.guideModal.addEventListener('click', e => {
      if (e.target === elements.guideModal) {
        closeModal(elements.guideModal);
      }
    });
  }

  // Close modal on Escape
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && elements.guideModal && elements.guideModal.classList.contains('is-active')) {
      closeModal(elements.guideModal);
    }
  });
}

function openModal(modal) {
  if (modal) {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// 10. SUBMISSION FORM HANDLING
// ==========================================
async function handleFormSubmission(event) {
  event.preventDefault();

  if (state.isSubmitting) return;

  hideAlerts();
  clearFieldErrors();

  const form = elements.submissionForm;
  const toolName = form.elements['tool_name'].value.trim();
  const toolUrl = form.elements['tool_url'].value.trim();
  const toolDesc = form.elements['tool_desc'].value.trim();
  const toolCategory = form.elements['tool_category'].value;
  const toolPricing = form.elements['tool_pricing'].value;
  const contactEmail = form.elements['contact_email'].value.trim();
  const toolLogo = form.elements['tool_logo'].value.trim();
  const consent = form.elements['consent'].checked;

  // Validation
  let hasErrors = false;

  if (!toolName || toolName.length < 2) {
    showFieldError('tool_name', 'Please enter a valid tool name (at least 2 characters).');
    hasErrors = true;
  }

  if (!toolUrl || !isValidExternalUrl(toolUrl)) {
    showFieldError('tool_url', 'Please enter a valid website URL starting with http:// or https://');
    hasErrors = true;
  }

  if (!toolDesc || toolDesc.length < 10) {
    showFieldError('tool_desc', 'Please enter a short description (at least 10 characters).');
    hasErrors = true;
  }

  if (!toolCategory) {
    showFieldError('tool_category', 'Please select a category for this tool.');
    hasErrors = true;
  }

  if (!toolPricing) {
    showFieldError('tool_pricing', 'Please select a pricing model.');
    hasErrors = true;
  }

  if (!contactEmail || !isValidEmail(contactEmail)) {
    showFieldError('contact_email', 'Please enter a valid contact email address.');
    hasErrors = true;
  }

  if (toolLogo && !isValidExternalUrl(toolLogo)) {
    showFieldError('tool_logo', 'Optional logo URL must start with http:// or https://');
    hasErrors = true;
  }

  if (!consent) {
    showFieldError('consent', 'You must agree to the directory submission terms.');
    hasErrors = true;
  }

  if (hasErrors) {
    showFormError('Please correct the highlighted fields above before submitting.');
    return;
  }

  // Set Submitting State
  setSubmittingState(true);

  // Check if real provider endpoint is configured
  const isFormspreeConfigured = 
    SUBMISSION_CONFIG.provider === 'formspree' &&
    SUBMISSION_CONFIG.formspreeEndpoint &&
    !SUBMISSION_CONFIG.formspreeEndpoint.includes('YOUR_FORM_ID');

  const isWeb3FormsConfigured =
    SUBMISSION_CONFIG.provider === 'web3forms' &&
    SUBMISSION_CONFIG.web3FormsAccessKey &&
    !SUBMISSION_CONFIG.web3FormsAccessKey.includes('YOUR_ACCESS_KEY');

  const formData = {
    toolName,
    toolUrl,
    toolDesc,
    toolCategory,
    toolPricing,
    contactEmail,
    toolLogo: toolLogo || 'Not provided',
    submittedAt: new Date().toISOString()
  };

  try {
    if (isFormspreeConfigured) {
      // Real Formspree submission
      const response = await fetch(SUBMISSION_CONFIG.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Formspree rejected the submission. Please verify your form endpoint.');
      }

      handleSuccessfulSubmission();

    } else if (isWeb3FormsConfigured) {
      // Real Web3Forms submission
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: SUBMISSION_CONFIG.web3FormsAccessKey,
          subject: `New AI Tool Submission: ${toolName}`,
          ...formData
        })
      });

      const resData = await response.json().catch(() => ({}));
      if (!resData.success) {
        throw new Error(resData.message || 'Web3Forms submission failed. Please verify your access key.');
      }

      handleSuccessfulSubmission();

    } else {
      // Configuration simulation mode with full validation and instruction
      // Simulate network latency (600ms)
      await new Promise(resolve => setTimeout(resolve, 600));

      // Successfully validated! Inform the user about Formspree/Web3Forms setup
      handleDemoSubmission(toolName);
    }
  } catch (err) {
    console.error('Submission error:', err);
    showFormError(err.message || 'Network error occurred while submitting. Your entered data has been preserved; please try again.');
  } finally {
    setSubmittingState(false);
  }
}

function handleSuccessfulSubmission() {
  if (elements.formAlertSuccess) {
    elements.formAlertSuccess.style.display = 'flex';
    elements.formAlertSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  elements.submissionForm.reset();
}

function handleDemoSubmission(toolName) {
  if (elements.formAlertSuccess) {
    elements.formAlertSuccess.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top: 2px;">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <div>
        <strong>Submission Validated Successfully!</strong><br />
        "${escapeHTML(toolName)}" passed all form validations. Because this directory is deployed statically, configure your free Formspree or Web3Forms access key in <code>script.js</code> to deliver submissions straight to your email. Click "Setup Guide" above to see the 2-minute setup.
      </div>
    `;
    elements.formAlertSuccess.style.display = 'flex';
    elements.formAlertSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  elements.submissionForm.reset();
}

function setSubmittingState(isSubmitting) {
  state.isSubmitting = isSubmitting;
  if (elements.submitBtn) {
    elements.submitBtn.disabled = isSubmitting;
  }
  if (elements.submitSpinner) {
    elements.submitSpinner.style.display = isSubmitting ? 'inline-block' : 'none';
  }
  if (elements.submitBtnText) {
    elements.submitBtnText.textContent = isSubmitting ? 'Submitting Tool...' : 'Submit AI Tool for Review';
  }
}

function showFieldError(fieldName, message) {
  const inputEl = elements.submissionForm.elements[fieldName];
  if (inputEl) {
    inputEl.classList.add('is-invalid');
  }
  const errorEl = document.getElementById(`error-${fieldName}`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearFieldErrors() {
  const inputs = elements.submissionForm.querySelectorAll('.is-invalid');
  inputs.forEach(input => input.classList.remove('is-invalid'));
  const errorMsgs = elements.submissionForm.querySelectorAll('.form-error-msg');
  errorMsgs.forEach(msg => { msg.textContent = ''; });
}

function showFormError(message) {
  if (elements.formAlertError && elements.formAlertErrorText) {
    elements.formAlertErrorText.textContent = message;
    elements.formAlertError.style.display = 'flex';
    elements.formAlertError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function hideAlerts() {
  if (elements.formAlertSuccess) elements.formAlertSuccess.style.display = 'none';
  if (elements.formAlertError) elements.formAlertError.style.display = 'none';
}

// ==========================================
// 11. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEventListeners();
  fetchToolsData();
});
