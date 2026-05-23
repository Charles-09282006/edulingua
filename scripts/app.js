import { renderLanding } from '../screens/landing.js';
import { renderAuth } from '../screens/auth.js';
import { renderQuestions } from '../screens/questions.js';
import { renderHome } from '../screens/home.js';
import { renderLesson } from '../screens/lesson.js';
import { renderProfile } from '../screens/profile.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js';

window.__edulinguaAppLoaded = true;

const screens = {
  landing: document.getElementById('landingScreen'),
  auth: document.getElementById('authScreen'),
  questions: document.getElementById('questionsScreen'),
  home: document.getElementById('homeScreen'),
  lesson: document.getElementById('lessonScreen'),
  profile: document.getElementById('profileScreen'),
};

const state = {
  isNewUser: true,
  currentQuestion: 0,
  userName: '',
  currentCourseId: null,
  streak: 0,
  xp: 0,
  badges: [],
  completedLessons: [],
  pathName: 'Beginner path',
  recommendedCourseLevels: ['beginner'],
  userEmail: '',
  userId: null,
  lastEmail: window.localStorage.getItem('edulinguaLastEmail') || '',
  reminderMessage: 'Start your first lesson today to begin your streak.',
  profileSyncMessage: '',
  dailyChallenge: {
    title: 'Daily challenge',
    description: 'Complete any lesson today to finish the challenge and earn bonus XP.',
    completed: false,
  },
};

let homeApi = null;
let profileApi = null;

const profileButton = document.getElementById('profileButton');
const backToLandingButton = document.getElementById('backToLandingButton');
const backToHomeButton = document.getElementById('backToHomeButton');
const getStartedButton = document.getElementById('getStartedButton');
const loginButton = document.getElementById('loginButton');
const loginButtonAuth = document.getElementById('loginButtonAuth');
const guestAccessButton = document.getElementById('guestAccessButton');
const profileCloseButton = document.getElementById('profileCloseButton');
const logoutButton = document.getElementById('logoutButton');
const loadingScreen = document.getElementById('loadingScreen');
const loadingHeadline = document.getElementById('loadingHeadline');
const loadingSubtext = document.getElementById('loadingSubtext');

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function updateUI() {
  const journeyState = getLearningPathState();
  state.pathName = journeyState.pathName;
  state.recommendedCourseLevels = journeyState.recommendedCourseLevels;
  if (homeApi) homeApi.update(state);
  if (profileApi) profileApi.update(state);
}

function updateLoadingText(screenName) {
  if (!loadingHeadline || !loadingSubtext) return;
  const messages = {
    landing: {
      title: 'Welcome back to EduLingua',
      subtitle: 'Opening your language adventure.',
    },
    auth: {
      title: 'Signing you in',
      subtitle: 'Preparing your account experience.',
    },
    questions: {
      title: 'Personalizing your path',
      subtitle: 'A few quick questions to get started.',
    },
    home: {
      title: 'Loading home dashboard',
      subtitle: 'Ready to pick your next lesson.',
    },
    lesson: {
      title: 'Loading lesson',
      subtitle: 'Get ready for your next practice step.',
    },
    profile: {
      title: 'Opening profile',
      subtitle: 'Gathering your progress and badges.',
    },
  };
  const nextText = messages[screenName] || messages.landing;
  loadingHeadline.textContent = nextText.title;
  loadingSubtext.textContent = nextText.subtitle;
}

function showLoading(screenName = 'landing') {
  if (loadingScreen) {
    updateLoadingText(screenName);
    loadingScreen.classList.remove('hidden');
  }
}

function hideLoading() {
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

const firebaseConfig = {
  apiKey: 'AIzaSyA6pzt7qM-6e1gjw_n8qNL9Ngflh4QaBlM',
  authDomain: 'appdev-edulingua-project.firebaseapp.com',
  projectId: 'appdev-edulingua-project',
  storageBucket: 'appdev-edulingua-project.firebasestorage.app',
  messagingSenderId: '181650308606',
  appId: '1:181650308606:web:f744dd0f98b769015114af',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function logoutFirebase() {
  return firebaseSignOut(auth);
}

async function saveUserProfile(uid, profileData) {
  if (!uid) return;
  await setDoc(doc(db, 'users', uid), profileData, { merge: true });
}

async function loadUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

function setProfileSyncMessage(message) {
  state.profileSyncMessage = message || '';
  updateUI();
}

async function persistUserProfile() {
  if (!state.userId) return;
  await saveUserProfile(state.userId, {
    userName: state.userName,
    email: state.userEmail,
    streak: state.streak,
    xp: state.xp,
    badges: state.badges,
    completedLessons: state.completedLessons,
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    state.userId = user.uid;
    state.userEmail = user.email || '';
    const profile = await loadUserProfile(user.uid);
    if (profile) {
      if (profile.userName) state.userName = profile.userName;
      if (profile.streak != null) state.streak = profile.streak;
      if (profile.xp != null) state.xp = profile.xp;
      if (profile.badges) state.badges = profile.badges;
      if (profile.completedLessons) state.completedLessons = profile.completedLessons;
    }
    updateUI();
  } else {
    state.userId = null;
    state.userEmail = '';
    updateUI();
  }
});

function refreshReminder() {
  if (state.streak > 0) {
    state.reminderMessage = `Keep your ${state.streak}-day streak alive by completing a lesson today.`;
  } else {
    state.reminderMessage = 'Start your first lesson today to begin your streak.';
  }
}

function getLearningPathState() {
  const completedCount = state.completedLessons.length;
  if (completedCount === 0) {
    return {
      pathName: 'Beginner path',
      recommendedCourseLevels: ['beginner'],
    };
  }
  if (completedCount <= 2) {
    return {
      pathName: 'Medium path',
      recommendedCourseLevels: ['medium'],
    };
  }
  if (completedCount <= 4) {
    return {
      pathName: 'Intermediate path',
      recommendedCourseLevels: ['intermediate'],
    };
  }
  return {
    pathName: 'Advanced path',
    recommendedCourseLevels: ['advanced'],
  };
}

function handleDailyChallengeProgress() {
  if (state.dailyChallenge.completed) return;
  state.dailyChallenge.completed = true;
  state.badges.push('Daily challenge completed');
  state.xp += 15;
}

async function handleLessonComplete(courseId) {
  if (!courseId) return;
  const isNewCompletion = !state.completedLessons.includes(courseId);
  if (isNewCompletion) {
    state.completedLessons.push(courseId);
    if (!state.badges.includes('Lesson complete')) {
      state.badges.push('Lesson complete');
    }
    if (!state.badges.includes('Streak starter')) {
      state.badges.push('Streak starter');
    }
    state.xp += 60;
    state.streak += 1;
    handleDailyChallengeProgress();
  } else {
    state.xp += 20;
  }

  if (state.streak >= 3 && !state.badges.includes('3-day streak')) {
    state.badges.push('3-day streak');
  }

  refreshReminder();
  updateUI();
  persistUserProfile()
    .then(() => setProfileSyncMessage(''))
    .catch((saveError) => {
      console.error('Profile save failed after lesson:', saveError);
      setProfileSyncMessage('Profile sync failed. Your progress is saved locally and will retry soon.');
    });
}

function handleNavigation(target) {
  if (target === 'questions' && !state.isNewUser) {
    transitionToScreen('home');
    return;
  }
  transitionToScreen(target);
}

function transitionToScreen(screenName) {
  showLoading(screenName);
  window.setTimeout(() => {
    hideLoading();
    showScreen(screenName);
  }, 320);
}

function wireEvents() {
  let authApi = null;

  getStartedButton.addEventListener('click', () => {
    state.isNewUser = true;
    authApi?.setMode('signup');
    handleNavigation('auth');
  });
  loginButton.addEventListener('click', () => {
    state.isNewUser = false;
    authApi?.setMode('login');
    handleNavigation('auth');
  });
  backToLandingButton.addEventListener('click', () => handleNavigation('landing'));
  backToHomeButton.addEventListener('click', () => handleNavigation('home'));
  profileButton.addEventListener('click', () => handleNavigation('profile'));
  profileCloseButton.addEventListener('click', () => handleNavigation('home'));
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      handleLogout();
    });
  }

  async function handleLogout() {
    await logoutFirebase();
    state.userName = '';
    state.userEmail = '';
    state.userId = null;
    profileButton.classList.add('hidden');
    handleNavigation('landing');
  }

  authApi = renderAuth({
    getIsNewUser: () => state.isNewUser,
    lastEmail: state.lastEmail,
    onSubmit: async ({ userName, isNewUser, email, password }) => {
      try {
        const result = await signUpWithEmail(email, password);
        const user = result.user;
        state.userName = userName;
        state.userId = user.uid;
        state.userEmail = email;
        state.isNewUser = isNewUser;
        if (email) {
          state.lastEmail = email;
          window.localStorage.setItem('edulinguaLastEmail', email);
        }
        profileButton.classList.remove('hidden');
        handleNavigation('questions');
        persistUserProfile()
          .then(() => setProfileSyncMessage(''))
          .catch((saveError) => {
            console.error('Profile save failed after signup:', saveError);
            setProfileSyncMessage('Profile sync failed. Your progress is saved locally and will retry soon.');
          });
      } catch (error) {
        authApi?.setError?.(error.message || 'Unable to sign up.');
      }
    },
    onLogin: async ({ userName, email, password }) => {
      try {
        const result = await loginWithEmail(email, password);
        const user = result.user;
        state.userName = userName;
        state.userId = user.uid;
        state.userEmail = email;
        state.isNewUser = false;
        if (email) {
          state.lastEmail = email;
          window.localStorage.setItem('edulinguaLastEmail', email);
        }
        const profile = await loadUserProfile(user.uid).catch((loadError) => {
          console.error('Failed to load profile on login:', loadError);
          return null;
        });
        if (profile) {
          state.streak = profile.streak || state.streak;
          state.xp = profile.xp || state.xp;
          state.badges = profile.badges || state.badges;
          state.completedLessons = profile.completedLessons || state.completedLessons;
        }
        profileButton.classList.remove('hidden');
        handleNavigation('home');
        persistUserProfile()
          .then(() => setProfileSyncMessage(''))
          .catch((saveError) => {
            console.error('Profile save failed after login:', saveError);
            setProfileSyncMessage('Profile sync failed. Your progress is saved locally and will retry soon.');
          });
      } catch (error) {
        authApi?.setError?.(error.message || 'Unable to log in.');
      }
    },
    onGuestAccess: () => {
      state.userName = 'Guest Learner';
      state.isNewUser = false;
      profileButton.classList.add('hidden');
      handleNavigation('home');
    },
  });

  renderQuestions({
    onComplete: () => handleNavigation('home'),
  });

  const lessonApi = renderLesson({
    onComplete: () => {
      handleLessonComplete(state.currentCourseId);
      handleNavigation('home');
    },
    onCancel: () => handleNavigation('home'),
  });

  homeApi = renderHome({
    onLessonOpen: (course) => {
      state.currentCourseId = course.id;
      lessonApi.open(course);
      handleNavigation('lesson');
    },
  });

  profileApi = renderProfile({});

  updateUI();
}

function init() {
  renderLanding();
  wireEvents();
  showScreen('landing');
  showLoading('landing');
  window.setTimeout(() => {
    hideLoading();
  }, 900);
}

init();
