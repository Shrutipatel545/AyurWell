// Initialize Lucide icons for static elements defined with data-lucide
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});


// --- DOM Elements ---
const landingPage = document.getElementById('landing-page');
const dashboardPage = document.getElementById('dashboard-page');
const openLoginModalBtn = document.getElementById('open-login-modal-btn');
const heroCtaPrakritiBtn = document.getElementById('hero-cta-prakriti');
const navToLandingBtn = document.getElementById('nav-to-landing');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const loginModal = document.getElementById('login-modal');
const statusModal = document.getElementById('status-modal');
const statusTitle = document.getElementById('status-title');
const statusMessage = document.getElementById('status-message');
const statusIcon = document.getElementById('status-icon');
const closeModalBtns = document.querySelectorAll('.close-modal-btn');
const loginForm = document.getElementById('login-form');
const profileForm = document.getElementById('profile-form');

// Prakriti Elements
const prakritiSteps = document.querySelectorAll('.prakriti-step');
const prakritiResults = document.getElementById('prakriti-results');
const prakritiQuestionnaire = document.getElementById('prakriti-questionnaire');
const startFullAnalysisBtn = document.getElementById('start-full-analysis-btn');
const quickPrakritiCheckBtn = document.getElementById('quick-prakriti-check-btn');
const prevStepBtn = document.getElementById('prev-step-btn');
const nextStepBtn = document.getElementById('next-step-btn');
const submitAnalysisBtn = document.getElementById('submit-analysis-btn');
const currentStepIndicator = document.getElementById('current-step');
const prakritiProgress = document.getElementById('prakriti-progress');
const totalSteps = prakritiSteps.length;
let currentStep = 1;


// --- Utility Functions for Lucide Icon Fix ---

// Helper to convert kebab-case (e.g., 'alert-triangle') to PascalCase (e.g., 'AlertTriangle')
function kebabToPascal(s) {
    if (!s) return '';
    return s.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

// Helper to dynamically get Lucide icon SVG string
function getLucideIconSvg(name, classes) {
    const pascalName = kebabToPascal(name);
    // Access the Lucide icon constructor directly from the global lucide object
    const IconComponent = window.lucide && window.lucide[pascalName] ? window.lucide[pascalName] : null;
    
    if (IconComponent && typeof IconComponent.toSvg === 'function') {
        return IconComponent.toSvg({ class: classes });
    }
    
    console.error(`Lucide icon '${name}' or '${pascalName}' not found. Using fallback.`);
    
    // Fallback icon (Bell)
    if (window.lucide && window.lucide.Bell && typeof window.lucide.Bell.toSvg === 'function') {
        return window.lucide.Bell.toSvg({ class: classes });
    }

    // Final SVG fallback to prevent runtime error
    return `<svg class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
}

// --- Core Functions ---

function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Custom Popup Message Handler
function showStatusPopup(title, message, type = 'success') {
    let iconHTML = '';
    let iconName = 'bell';
    let iconClass = 'text-gray-500';
    const iconClasses = 'w-12 h-12 mx-auto mb-4';

    switch (type) {
        case 'success':
            iconName = 'check-circle';
            iconClass = 'text-emerald-500';
            break;
        case 'error':
            iconName = 'alert-triangle';
            iconClass = 'text-red-500';
            break;
        case 'info':
            iconName = 'info';
            iconClass = 'text-indigo-500';
            break;
    }

    iconHTML = getLucideIconSvg(iconName, iconClasses + ' ' + iconClass);

    statusIcon.innerHTML = iconHTML;
    statusTitle.textContent = title;
    statusTitle.classList.remove('text-emerald-500', 'text-red-500', 'text-indigo-500', 'text-gray-500');
    statusTitle.classList.add(iconClass);
    statusMessage.textContent = message;
    openModal(statusModal);
}

// Switches between Landing Page and Dashboard
function setPage(pageId) {
    landingPage.classList.remove('active');
    dashboardPage.classList.remove('active');
    
    if (pageId === 'landing') {
        landingPage.classList.add('active');
    } else if (pageId === 'dashboard') {
        dashboardPage.classList.add('active');
        showContentSection('dashboard-content'); 
    }
}

// Switches dashboard sections (SPA functionality)
function showContentSection(sectionId) {
    navItems.forEach(item => item.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));

    const targetNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    const targetSection = document.getElementById(sectionId);

    if (targetNav) {
        targetNav.classList.add('active');
    }
    if (targetSection) {
        targetSection.classList.add('active'); 
    }
}

// --- Event Listeners ---

// 1. Modal Open/Close Handlers
openLoginModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(loginModal);
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(loginModal);
        closeModal(statusModal);
    });
});

// 2. Simulated Login Logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email.length < 5 || password.length < 4) {
            showStatusPopup('Validation Failed', 'Please enter a valid email and a password of at least 4 characters.', 'error');
        return;
    }
    
    // SIMULATED successful login
    closeModal(loginModal);
    setPage('dashboard');
    showStatusPopup('Success!', 'Welcome back! You have successfully logged into AyurWell.', 'success');
});

// 3. Page Switching (Logout)
if (navToLandingBtn) {
    navToLandingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setPage('landing');
        showStatusPopup('Logged Out', 'You have been successfully logged out.', 'info');
    });
}

// 4. Dashboard Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        if (sectionId) {
            showContentSection(sectionId);
        }
    });
});

// 5. Profile Form Save (Validation & Popup)
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    
    if (!name || age < 18) {
        showStatusPopup('Validation Error', 'Please ensure your name is filled and you are over 18.', 'error');
        return;
    }

    showStatusPopup('Success!', 'Your profile details have been successfully updated.', 'success');
});

// 6. Follow-up/Compliance Button Wiring
document.getElementById('log-compliance-btn').addEventListener('click', () => {
    showStatusPopup('Compliance Logger', 'The Compliance Logger feature would open here. Routine logged successfully!', 'success');
});

// --- Sidebar Toggling Logic (for mobile) ---
openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
            if (window.innerWidth < 768) { 
            sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('-translate-x-full');
        }
    });
});


// --- Prakriti Analysis Functionality ---

function updatePrakritiUI() {
    // Hide all steps/views first
    prakritiSteps.forEach(step => step.style.display = 'none');
    prakritiResults.style.display = 'none';
    prakritiQuestionnaire.style.display = 'none';
    
    const currentStepElement = document.querySelector(`.prakriti-step[data-step="${currentStep}"]`);

    if (currentStepElement) {
        // Show questionnaire and current step
        prakritiQuestionnaire.style.display = 'block';
        currentStepElement.style.display = 'block';
        
        // Update progress bar
        const progressWidth = (currentStep / totalSteps) * 100;
        prakritiProgress.style.width = `${progressWidth}%`;
        currentStepIndicator.textContent = currentStep;

        // Update navigation buttons
        prevStepBtn.disabled = currentStep === 1;
        nextStepBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
        submitAnalysisBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    } else {
            // Show results when done
            prakritiResults.style.display = 'block';
            prakritiQuestionnaire.style.display = 'none';
            showContentSection('prakriti'); // Ensure the Prikriti section is active
            showStatusPopup('Analysis Complete', 'Your Prakriti analysis has been re-calculated. Check your new Dosha profile!', 'success');
    }
}

// Start button on the results view
startFullAnalysisBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentStep = 1;
    updatePrakritiUI();
});

// "Start Your Free Prakriti Analysis" button on the landing page
heroCtaPrakritiBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setPage('dashboard');
    currentStep = 1;
    updatePrakritiUI();
});

// Quick Prakriti Check button on the dashboard
quickPrakritiCheckBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Quick check navigates to the Prakriti page
    showContentSection('prakriti');
    currentStep = 1;
    updatePrakritiUI();
});

// Navigation buttons within the questionnaire
nextStepBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updatePrakritiUI();
    }
});

prevStepBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updatePrakritiUI();
    }
});

submitAnalysisBtn.addEventListener('click', () => {
    // Simulate submission/API call
    currentStep++; // Moves past the total steps to show results
    updatePrakritiUI();
});
