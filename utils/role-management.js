// Role management system
let currentUserRole = null;
let currentUsername = null;

// User credentials database (in real app, this would be server-side)
const userCredentials = {
    // Team Members
    'Kvillecfa': { password: '1248', role: 'team' },
    'kvillecfa': { password: '1248', role: 'team' }, // lowercase version
    'Kvillecfa_4772': { password: '4772', role: 'team' },
    'kvillecfa_4772': { password: '4772', role: 'team' }, // lowercase version
    
    // Managers
    'Kvillecfamgr': { password: '1248mgr', role: 'manager' },
    'kvillecfamgr': { password: '1248mgr', role: 'manager' }, // lowercase version
    'Kvillecfamgr_4772': { password: '4772mgr', role: 'manager' },
    'kvillecfamgr_4772': { password: '4772mgr', role: 'manager' }, // lowercase version
    
    // Admins
    'Admin': { password: 'AdminCFA', role: 'admin' },
    'admin': { password: 'AdminCFA', role: 'admin' } // lowercase version
};

// Initialize role management when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Role management system loading...');
    setupLoginForm();
    setupRoleBasedNavigation();
    setupLogoutFunction();
    console.log('Role management system loaded successfully');
});

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, attaching event listener');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            handleLogin();
        });
    } else {
        console.error('Login form not found!');
    }
}

function handleLogin() {
    console.log('handleLogin called');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const selectedRole = document.getElementById('loginRole').value;
    const errorDiv = document.getElementById('loginError');
    
    console.log('Login attempt:', { username, password: password ? 'provided' : 'empty', selectedRole });
    
    // Clear previous errors
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    
    // Validate inputs
    if (!username || !password || !selectedRole) {
        console.log('Validation failed: missing fields');
        showLoginError('Please fill in all fields');
        return;
    }
    
    // Check if user exists
    if (!userCredentials[username]) {
        console.log('User not found:', username);
        showLoginError('Invalid username or password');
        return;
    }
    
    const user = userCredentials[username];
    console.log('User found:', { username, expectedRole: user.role, selectedRole });
    
    // Validate password
    if (user.password !== password) {
        console.log('Password mismatch');
        showLoginError('Invalid username or password');
        return;
    }
    
    // Validate role matches user's assigned role
    if (user.role !== selectedRole) {
        console.log('Role mismatch:', { expected: user.role, selected: selectedRole });
        showLoginError('Selected role does not match your account');
        return;
    }
    
    console.log('Login successful');
    // Successful login
    currentUsername = username;
    currentUserRole = selectedRole;
    
    // Apply role-based styling
    applyRoleView(selectedRole);
    
    // Show appropriate content
    showRoleBasedContent(selectedRole);
    
    // Hide login screen and show main portal
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPortal').style.display = 'block';
    
    // Update user info display
    updateUserInfo(username, selectedRole);
    
    // Initialize navigation for the role
    initializeNavigationForRole(selectedRole);
}

function showLoginError(message) {
    console.log('Showing error:', message);
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.padding = '0.5rem';
        errorDiv.style.background = '#ffeaa7';
        errorDiv.style.border = '1px solid #e74c3c';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.style.display = 'block';
        errorDiv.style.fontSize = '0.9rem';
    } else {
        console.error('Error div not found');
        alert(message); // Fallback
    }
}

function applyRoleView(role) {
    // Remove existing role classes
    document.body.classList.remove('team-view', 'manager-view', 'admin-view');
    
    // Apply new role class
    document.body.classList.add(`${role}-view`);
}

function showRoleBasedContent(role) {
    // Hide all role-specific content first
    const allRoleElements = document.querySelectorAll('.manager-only, .admin-only, .team-only');
    allRoleElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // Show content based on role
    if (role === 'team') {
        // Team members see only team content
        document.querySelectorAll('.team-only').forEach(el => {
            el.style.display = 'block';
        });
    } else if (role === 'manager') {
        // Managers see team + manager content
        document.querySelectorAll('.team-only, .manager-only').forEach(el => {
            el.style.display = 'block';
        });
    } else if (role === 'admin') {
        // Admins see everything
        document.querySelectorAll('.team-only, .manager-only, .admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }
}

function updateUserInfo(username, role) {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        const roleDisplayName = {
            'team': 'Team Member',
            'manager': 'Manager',
            'admin': 'Admin'
        };
        
        userInfo.innerHTML = `
            ${formatUsername(username)}
            <span class="role">${roleDisplayName[role]}</span>
        `;
    }
}

function formatUsername(username) {
    // Convert username to display name (e.g., john_doe -> John Doe)
    return username.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function setupRoleBasedNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.logout-link)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            if (section) {
                navigateToSection(section);
                updateActiveNavLink(this);
            }
        });
    });
}

function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateActiveNavLink(clickedLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    clickedLink.classList.add('active');
}

function initializeNavigationForRole(role) {
    // Set default section based on role
    let defaultSection = 'home';
    
    if (role === 'manager') {
        // Managers might want to start on dashboard
        defaultSection = 'dashboard';
    }
    
    // Navigate to default section
    navigateToSection(defaultSection);
    
    // Update nav link
    const defaultNavLink = document.querySelector(`[data-section="${defaultSection}"]`);
    if (defaultNavLink) {
        updateActiveNavLink(defaultNavLink);
    }
}

function setupLogoutFunction() {
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    // Reset user state
    currentUserRole = null;
    currentUsername = null;
    
    // Remove role classes
    document.body.classList.remove('team-view', 'manager-view', 'admin-view');
    
    // Clear form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginRole').value = '';
    document.getElementById('loginError').textContent = '';
    
    // Show login screen and hide main portal
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainPortal').style.display = 'none';
    
    // Reset to home section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('homeSection').classList.add('active');
    
    // Reset navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('[data-section="home"]').classList.add('active');
}

// Utility functions for role checking
function isTeamMember() {
    return currentUserRole === 'team';
}

function isManager() {
    return currentUserRole === 'manager';
}

function isAdmin() {
    return currentUserRole === 'admin';
}

function hasManagerAccess() {
    return currentUserRole === 'manager' || currentUserRole === 'admin';
}

function hasAdminAccess() {
    return currentUserRole === 'admin';
}

// Export functions for use in other scripts
window.RoleManager = {
    currentUserRole: () => currentUserRole,
    currentUsername: () => currentUsername,
    isTeamMember,
    isManager,
    isAdmin,
    hasManagerAccess,
    hasAdminAccess,
    handleLogout
};
