import { db, auth } from './auth.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.getElementById('close-modal-btn'); // Fixed missing -btn suffix
    const registerBtns = document.querySelectorAll('.register-btn');
    const form = document.getElementById('event-registration-form'); // Fixed form ID from activities.html
    const formMessage = document.getElementById('success-message');
    // Using a generic approach since modalEventName missing from activities.html modal
    const submitBtn = form?.querySelector('button[type="submit"]');
    const spinner = document.getElementById('loading-spinner');
    const eventIdInput = document.getElementById('event-id-input');

    // Store event details temporarily when a button is clicked
    let currentEventTitle = "";
    let currentEventCategory = "";

    if (!modal) return;

    // Open modal
    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.eventId;
            const card = e.target.closest('.whiteboard-card');
            currentEventTitle = card.querySelector('h3').textContent;
            currentEventCategory = card.querySelector('span').textContent;

            eventIdInput.value = eventId;

            modal.classList.remove('hidden');
            // Small delay for animation
            setTimeout(() => {
                modal.querySelector('div').classList.add('scale-100', 'opacity-100');
                modal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            }, 10);
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.querySelector('div').classList.remove('scale-100', 'opacity-100');
        modal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();
            formMessage.classList.add('hidden');
        }, 200);
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Handle form submission
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI states
        const submitText = submitBtn.querySelector('span');
        submitText.textContent = 'Processing...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;
        formMessage.classList.add('hidden');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("You must be logged in to register for events!");
            }

            // Extract form inputs safely from activities.html
            const studentName = document.getElementById('student-name').value;
            const rollNumber = document.getElementById('roll-number').value;
            const branch = document.getElementById('student-branch').value;

            // Push to Firebase Firestore
            await addDoc(collection(db, "registrations"), {
                eventId: eventIdInput.value,
                title: currentEventTitle,
                category: currentEventCategory,
                description: `Registered as ${branch} student.`,
                email: user.email,
                studentName: studentName,
                rollNumber: rollNumber,
                branch: branch,
                timestamp: serverTimestamp()
            });

            formMessage.textContent = 'Registration successful! Check your Dashboard.';
            formMessage.classList.remove('hidden', 'bg-red-500/20', 'text-red-400', 'border-red-500/20');
            formMessage.classList.add('bg-emerald-500/10', 'text-grid-emerald', 'border-emerald-500/20');

            setTimeout(() => {
                closeModal();
            }, 2000);

        } catch (error) {
            formMessage.textContent = error.message || 'An error occurred. Please try again.';
            formMessage.classList.remove('hidden', 'bg-emerald-500/10', 'text-grid-emerald', 'border-emerald-500/20');
            formMessage.classList.add('bg-red-500/20', 'text-red-400', 'border-red-500/20');
        } finally {
            submitText.textContent = 'Confirm Registration';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});
