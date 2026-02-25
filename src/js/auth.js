import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    // Register Form Handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const msgBox = document.getElementById('auth-message');
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            // Reset UI
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Creating account...';
            msgBox.classList.add('hidden');

            try {
                // Warning: To actually sign up, you need real Firebase Config above.
                // Assuming it's configured, here is the flow:

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // Update profile with name
                await updateProfile(userCredential.user, {
                    displayName: name
                });

                msgBox.textContent = 'Account created successfully! Redirecting to login...';
                msgBox.className = 'text-sm py-2 px-3 rounded-lg mt-2 bg-green-500/20 text-green-400 block';

                // Firebase auto-logs in on creation. The user requested a manual login flow,
                // so we sign them out immediately before redirecting.
                await signOut(auth);

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);

            } catch (error) {
                console.error("Registration error:", error.code, error.message);

                // Friendly error messages
                let displayError = error.message;
                if (error.code === 'auth/email-already-in-use') {
                    displayError = 'This email is already registered. Please log in.';
                } else if (error.code === 'auth/invalid-api-key' || error.message.includes('API key')) {
                    displayError = 'Firebase is not configured! Please add your config in src/js/auth.js';
                } else if (error.code === 'auth/weak-password') {
                    displayError = 'Password should be at least 6 characters.';
                }

                msgBox.textContent = displayError;
                msgBox.className = 'text-sm py-2 px-3 rounded-lg mt-2 bg-red-500/20 text-red-400 block';
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Create Account';
            }
        });
    }

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const msgBox = document.getElementById('auth-message');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Reset UI
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Logging in...';
            msgBox.classList.add('hidden');

            try {
                // Warning: Requires real Firebase Config
                await signInWithEmailAndPassword(auth, email, password);

                msgBox.textContent = 'Login successful! Redirecting...';
                msgBox.className = 'text-sm py-2 px-3 rounded-lg mt-2 bg-green-500/20 text-green-400 block';

                setTimeout(() => {
                    window.location.href = 'materials.html';
                }, 1000);

            } catch (error) {
                console.error("Login error:", error.code, error.message);

                let displayError = 'Invalid email or password.';
                if (error.code === 'auth/invalid-api-key' || error.message.includes('API key')) {
                    displayError = 'Firebase is not configured! Please add your config in src/js/auth.js';
                } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    displayError = 'Invalid email or password. Please try again.';
                }

                msgBox.textContent = displayError;
                msgBox.className = 'text-sm py-2 px-3 rounded-lg mt-2 bg-red-500/20 text-red-400 block';
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Log In';
            }
        });
    }

    // Auth State Observer to protect dashboard.html and redirect away from login/register if already logged in
    onAuthStateChanged(auth, (user) => {
        const path = window.location.pathname;
        const isAuthPage = path.includes('login') || path.includes('register') || path.endsWith('index.html') || path === '/' || path === '/frontend/';
        const isProtectedPage = path.includes('dashboard') || path.includes('materials') || path.includes('activities') || path.includes('team_directory') || path.includes('profile');
        const isDashboard = path.includes('dashboard') || path.includes('materials') || path.includes('activities') || path.includes('team_directory');
        const isProfile = path.includes('profile');

        if (user) {
            // User is signed in
            if (isAuthPage) {
                // Redirect authenticated users away from public pages
                window.location.href = 'materials.html';
            } else if (isProtectedPage) {
                // Determine user first name and initial
                const displayFallback = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
                const firstName = displayFallback.split(' ')[0];
                const initial = displayFallback.charAt(0).toUpperCase();

                // Populate user info on navigation headers (all protected pages)
                const userNameElement = document.getElementById('mobile-user-name');
                const userAvatarElement = document.getElementById('user-avatar');
                const mobileAvatarElement = document.getElementById('mobile-user-avatar');

                if (userNameElement) {
                    // Recreate the mobile menu header format
                    userNameElement.innerHTML = `
                        <div class="w-16 h-16 rounded-full bg-grid-blue border-2 border-grid-blue flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_15px_rgba(0,255,198,0.3)]">${initial}</div>
                        Welcome, ${firstName}
                    `;
                }
                if (userAvatarElement) {
                    userAvatarElement.textContent = initial;
                }

                // Populate Profile Page Specific Content
                if (isProfile) {
                    const profileName = document.getElementById('profile-name');
                    const profileEmail = document.getElementById('profile-email');
                    const profileLargeAvatar = document.getElementById('profile-initial');

                    if (profileName) profileName.textContent = user.displayName || displayFallback || 'G.R.I.D. Student';
                    if (profileEmail) profileEmail.textContent = user.email || 'No Email Found';
                    if (profileLargeAvatar) profileLargeAvatar.textContent = initial;
                }

                // Populate Dynamic Events from Firebase Firestore (Dashboard & Profile)
                if (path.includes('dashboard') || path.includes('profile')) {
                    const dynamicEventsContainer = document.getElementById('dynamic-events-container') || document.getElementById('profile-events-container');

                    if (dynamicEventsContainer) {
                        try {
                            const userEmail = user.email;

                            // Fetch from Firebase Firestore directly instead of Spring Boot Backend
                            const q = query(collection(db, "registrations"), where("email", "==", userEmail));

                            getDocs(q).then((querySnapshot) => {
                                if (querySnapshot.empty) {
                                    dynamicEventsContainer.innerHTML = `
                                        <div class="col-span-1 border border-gray-700/50 rounded-xl p-6 bg-gray-800/30 text-center">
                                            <p class="text-gray-400">You are not registered for any events yet!</p>
                                        </div>
                                    `;
                                } else {
                                    let htmlContent = '';
                                    querySnapshot.forEach((doc) => {
                                        const event = doc.data();
                                        htmlContent += `
                                            <div class="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-grid-blue/50 transition-colors reveal delay-100 active">
                                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-grid-blue to-grid-emerald"></div>
                                                <div class="flex justify-between items-start mb-2">
                                                    <h3 class="text-lg font-bold text-white">${event.title}</h3>
                                                    <span class="text-xs font-semibold text-grid-blue bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">${event.category}</span>
                                                </div>
                                                <p class="text-gray-400 text-sm mt-2">${event.description || 'Event Details...'}</p>
                                                <div class="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                                                     <span class="text-xs text-grid-emerald font-bold">Registered</span>
                                                     <button class="text-xs text-blue-400 hover:text-blue-300 font-medium">View Result</button>
                                                </div>
                                            </div>
                                        `;
                                    });
                                    dynamicEventsContainer.innerHTML = htmlContent;
                                }
                            }).catch((error) => {
                                console.error('Error fetching registrations from Firestore:', error);
                                dynamicEventsContainer.innerHTML = `
                                    <div class="col-span-1 border border-red-700/50 rounded-xl p-6 bg-red-900/20 text-center">
                                        <p class="text-red-400">Failed to load event data from Firestore.</p>
                                    </div>
                                `;
                            });
                        } catch (err) {
                            console.error("Dashboard Event Error: ", err);
                        }
                    }
                }
            }
        } else {
            // User is signed out
            if (isProtectedPage) {
                // Redirect unauthenticated users back to login
                window.location.href = 'login.html';
            }
        }
    });

    // Logout Handling
    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
});
