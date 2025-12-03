// =========================================
// PhysiCollective - Interactive Features
// =========================================

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCalendar();
    initModals();
    initSmoothScroll();
    initAnimations();
});

// =========================================
// Navigation
// =========================================

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('nav-open');
        });
    });
}

// =========================================
// Calendar
// =========================================

function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const calendarMonth = document.getElementById('calendar-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        
        calendarMonth.textContent = `${months[currentMonth]} ${currentYear}`;
        calendarDays.innerHTML = '';
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            const thisDate = new Date(currentYear, currentMonth, day);
            
            // Check if this is today
            if (thisDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Check if day is in the past
            if (thisDate < today && thisDate.toDateString() !== today.toDateString()) {
                dayEl.classList.add('past');
            } else {
                // Random availability for demo purposes
                const rand = Math.random();
                if (rand > 0.7) {
                    dayEl.classList.add('full');
                } else if (rand > 0.4) {
                    dayEl.classList.add('limited');
                } else {
                    dayEl.classList.add('available');
                }
                
                // Click handler for available days
                dayEl.addEventListener('click', () => {
                    if (!dayEl.classList.contains('past')) {
                        selectDate(currentYear, currentMonth, day);
                    }
                });
            }
            
            calendarDays.appendChild(dayEl);
        }
    }
    
    function selectDate(year, month, day) {
        const selectedDate = new Date(year, month, day);
        const dateStr = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        openModal('booking', dateStr);
    }
    
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    renderCalendar();
}

// =========================================
// Modals
// =========================================

function initModals() {
    const overlay = document.getElementById('modal-overlay');
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(type, data = null) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    let html = '';
    
    switch (type) {
        case 'tour':
            html = `
                <h3>Book a Tour</h3>
                <p>Schedule a visit to see our spaces and learn how PhysiCollective can support your practice.</p>
                <form onsubmit="handleFormSubmit(event, 'tour')">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tour-first">First Name</label>
                            <input type="text" id="tour-first" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="tour-last">Last Name</label>
                            <input type="text" id="tour-last" name="lastName" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="tour-email">Email</label>
                        <input type="email" id="tour-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="tour-phone">Phone</label>
                        <input type="tel" id="tour-phone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="tour-specialty">Specialty</label>
                        <select id="tour-specialty" name="specialty" required>
                            <option value="">Select your specialty</option>
                            <option value="pt">Physical Therapy</option>
                            <option value="ot">Occupational Therapy</option>
                            <option value="slp">Speech-Language Pathology</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tour-date">Preferred Tour Date</label>
                        <input type="date" id="tour-date" name="tourDate" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Request Tour</button>
                </form>
            `;
            break;
            
        case 'apply':
            html = `
                <h3>Apply as a Therapist</h3>
                <p>Join our community of independent therapists. Fill out this form and we'll be in touch.</p>
                <form onsubmit="handleFormSubmit(event, 'apply')">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="apply-first">First Name</label>
                            <input type="text" id="apply-first" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="apply-last">Last Name</label>
                            <input type="text" id="apply-last" name="lastName" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="apply-email">Email</label>
                        <input type="email" id="apply-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="apply-phone">Phone</label>
                        <input type="tel" id="apply-phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="apply-license">License Type</label>
                        <select id="apply-license" name="license" required>
                            <option value="">Select your license</option>
                            <option value="pt">Physical Therapist (PT)</option>
                            <option value="pta">Physical Therapist Assistant (PTA)</option>
                            <option value="ot">Occupational Therapist (OT)</option>
                            <option value="cota">Certified Occupational Therapy Assistant (COTA)</option>
                            <option value="slp">Speech-Language Pathologist (SLP)</option>
                            <option value="slpa">Speech-Language Pathology Assistant (SLPA)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="apply-hours">Estimated Hours/Week</label>
                        <select id="apply-hours" name="hours" required>
                            <option value="">Select estimated hours</option>
                            <option value="1-5">1-5 hours</option>
                            <option value="5-10">5-10 hours</option>
                            <option value="10-20">10-20 hours</option>
                            <option value="20+">20+ hours</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="apply-message">Tell us about your practice</label>
                        <textarea id="apply-message" name="message" placeholder="Share your background, client population, and what you're looking for..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Submit Application</button>
                </form>
            `;
            break;
            
        case 'waitlist':
            html = `
                <h3>Join the Waitlist</h3>
                <p>Be the first to know when new spaces become available.</p>
                <form onsubmit="handleFormSubmit(event, 'waitlist')">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="wait-first">First Name</label>
                            <input type="text" id="wait-first" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="wait-last">Last Name</label>
                            <input type="text" id="wait-last" name="lastName" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="wait-email">Email</label>
                        <input type="email" id="wait-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="wait-specialty">Specialty</label>
                        <select id="wait-specialty" name="specialty" required>
                            <option value="">Select your specialty</option>
                            <option value="pt">Physical Therapy</option>
                            <option value="ot">Occupational Therapy</option>
                            <option value="slp">Speech-Language Pathology</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Join Waitlist</button>
                </form>
            `;
            break;
            
        case 'booking':
            const dateStr = data || 'your selected date';
            html = `
                <h3>Book a Room</h3>
                <p>Reserve a therapy room for ${dateStr}.</p>
                <form onsubmit="handleFormSubmit(event, 'booking')">
                    <div class="form-group">
                        <label for="book-room">Room Type</label>
                        <select id="book-room" name="room" required>
                            <option value="">Select a room</option>
                            <option value="large-treatment">Large Treatment Room ($45/hr)</option>
                            <option value="consultation">Consultation Room ($30/hr)</option>
                            <option value="sensory">Sensory Room ($40/hr)</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="book-start">Start Time</label>
                            <select id="book-start" name="startTime" required>
                                <option value="">Select time</option>
                                <option value="7:00">7:00 AM</option>
                                <option value="8:00">8:00 AM</option>
                                <option value="9:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="book-duration">Duration</label>
                            <select id="book-duration" name="duration" required>
                                <option value="">Select duration</option>
                                <option value="1">1 hour</option>
                                <option value="2">2 hours</option>
                                <option value="3">3 hours</option>
                                <option value="4">4 hours</option>
                                <option value="8">Full day</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="book-email">Your Email</label>
                        <input type="email" id="book-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="book-notes">Special Requests</label>
                        <textarea id="book-notes" name="notes" placeholder="Any equipment or setup requests..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Request Booking</button>
                </form>
            `;
            break;
    }
    
    content.innerHTML = html;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function handleFormSubmit(event, type) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // In a real implementation, you would send this data to a server
    console.log(`Form submitted (${type}):`, data);
    
    // Show success message
    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin: 0 auto 1rem;">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 style="margin-bottom: 0.5rem;">Thank You!</h3>
            <p style="color: var(--text-light); margin-bottom: 1.5rem;">We've received your submission and will be in touch soon.</p>
            <button class="btn btn-primary" onclick="closeModal()">Close</button>
        </div>
    `;
}

// =========================================
// Smooth Scroll
// =========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// =========================================
// Scroll Animations
// =========================================

function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll(
        '.therapist-card, .space-card, .pricing-card, .amenity-card, .resource-card, .testimonial-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Add CSS class for animated elements
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

