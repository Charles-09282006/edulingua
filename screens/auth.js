export function renderAuth({ onSubmit, onLogin, onGuestAccess, getIsNewUser, lastEmail = '' }) {
  const authForm = document.getElementById('authForm');
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginButtonAuth = document.getElementById('loginButtonAuth');
  const guestAccessButton = document.getElementById('guestAccessButton');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const authErrorMessage = document.getElementById('authErrorMessage');
  const authHeading = document.getElementById('authHeading');
  const authMessage = document.getElementById('authMessage');
  const authNote = document.getElementById('authNote');
  const termsWrapper = document.getElementById('termsWrapper');
  const authSubmitButton = document.getElementById('authSubmitButton');

  let authMode = 'signup';

  const setAuthError = (message) => {
    if (authErrorMessage) {
      authErrorMessage.textContent = message;
      authErrorMessage.classList.remove('hidden');
    }
  };

  const clearAuthError = () => {
    if (authErrorMessage) {
      authErrorMessage.textContent = '';
      authErrorMessage.classList.add('hidden');
    }
  };

  const setMode = (mode) => {
    authMode = mode;
    if (authHeading) {
      authHeading.textContent = mode === 'login' ? 'Log in to your account' : 'Sign up or login';
    }
    if (authMessage) {
      authMessage.textContent = mode === 'login'
        ? 'Enter your existing email and password below to sign in.'
        : 'New users complete a short quiz to personalize the learning path.';
    }
    if (authNote) {
      authNote.textContent = mode === 'login'
        ? 'Use your existing account credentials to sign in.'
        : 'New users will answer 7 onboarding questions before entering the app.';
    }
    if (authSubmitButton) {
      authSubmitButton.textContent = mode === 'login' ? 'Continue' : 'Sign up';
    }
    if (termsWrapper) {
      termsWrapper.classList.toggle('hidden', mode === 'login');
    }
    if (mode === 'login' && emailInput && lastEmail) {
      emailInput.value = lastEmail;
    }
    clearAuthError();
  };

  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearAuthError();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (authMode === 'login') {
      if (!email || !password) {
        setAuthError('Please enter both email and password to log in.');
        return;
      }
      const userName = nameInput.value.trim() || email.split('@')[0] || 'EduLingua Learner';
      onLogin?.({ userName, email, password });
      return;
    }

    const agreedToTerms = termsCheckbox?.checked;
    if (!agreedToTerms) {
      setAuthError('You must agree to the Terms and Conditions before signing up.');
      return;
    }
    const userName = nameInput.value.trim() || 'EduLingua Learner';
    const userEmail = emailInput.value.trim();
    const isNewUser = getIsNewUser ? getIsNewUser() : true;
    onSubmit({ userName, isNewUser, email: userEmail, password });
  });

  if (loginButtonAuth) {
    loginButtonAuth.addEventListener('click', () => {
      clearAuthError();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      if (!email || !password) {
        setAuthError('Please enter both email and password to log in.');
        return;
      }
      const userName = nameInput.value.trim() || email.split('@')[0] || 'EduLingua Learner';
      onLogin?.({ userName, email, password });
    });
  }

  if (guestAccessButton) {
    guestAccessButton.addEventListener('click', () => {
      onGuestAccess?.();
    });
  }

  setMode('signup');

  return {
    setMode,
    setError: setAuthError,
  };
}
