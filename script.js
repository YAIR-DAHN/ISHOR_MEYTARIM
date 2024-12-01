// תדכון תאריך היעד
const EVENT_DATE = new Date('2024-12-26T08:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // אנימציה לעדכון המספרים
    updateTimeBlockWithAnimation('.days', days);
    updateTimeBlockWithAnimation('.hours', hours);
    updateTimeBlockWithAnimation('.minutes', minutes);
    updateTimeBlockWithAnimation('.seconds', seconds);

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = '<h2>יום הגיבוש התחיל!</h2>';
    }
}

function updateTimeBlockWithAnimation(selector, value) {
    const element = document.querySelector(selector);
    const currentValue = parseInt(element.textContent);
    const newValue = String(value).padStart(2, '0');
    
    if (currentValue !== value) {
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 300);
    }
}

// הוספת סגנונות מעבר לאלמנטים של הספירה לאחור
document.querySelectorAll('.time-block span').forEach(el => {
    el.style.transition = 'all 0.3s ease-out';
});

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// טיפול במודאל
const modal = document.getElementById('registrationModal');
const registerBtn = document.getElementById('registerBtn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('registrationForm');

registerBtn.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// טיפול בשליחת הטופס
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // בדיקת תקינות הטלפון
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        alert('אנא הזיני מספר טלפון תקין');
        return;
    }

    // הצגת אנימציית טעינה
    showLoadingAnimation();

    try {
        const response = await submitForm(name, phone);
        if (response && response.success) {
            showSuccessMessage();
        } else {
            throw new Error(response.error || 'שגיאה בשליחת הטופס');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('אירעה שגיאה. אנא נסי שוב מאוחר יותר');
        hideLoadingAnimation();
    }
}
);

// פונקציות עזר לאנימציות
function showLoadingAnimation() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="loading-animation">
            <img src="./img/bus.gif" alt="אוטובוס בטעינה" class="loading-gif">
            <p>שניה אנחנו רושמים אותך...</p>
        </div>
    `;
}

function showSuccessMessage() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="success-message">
                <div class="success-icon">✨</div>
                <h3>תודה שאישרת את הגעתך!</h3>
                <p>מחכות לך ביום הגיבוש</p>
                <div class="confetti"></div>
                <button onclick="closeModal()" class="close-btn">סגירה</button>
            </div>
        `;
        
        // אנימציית קונפטי
        createConfetti();
    }
}
function closeModal() {
    modal.style.display = 'none';
}

// פונקציה לשיחת הטופס ל-Google Apps Script
async function submitForm(name, phone) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwRhkxAIxBVnD6u2xh_yBfnJaOvjvn09QWDb8rIN_GybVHJ1YUNN24FhBF6JuiYB2AyqA/exec'; // החלף עם ה-URL שלך
    
    try {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('phone', phone);
        
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // בדיקה אם התגובה תקינה
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('שגיאה בשליחת הטופס');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// הוספת פונקציית hideLoadingAnimation החסרה
function hideLoadingAnimation() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <span class="close">&times;</span>
            <h3>אישור הגעה</h3>
            <form id="registrationForm">
                <div class="form-group">
                    <label for="name">שם מלא:</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="phone">מספר טלפון:</label>
                    <input type="tel" id="phone" required>
                </div>
                <button type="submit" class="submit-btn">אישור</button>
            </form>
        `;
        
        // חידוש האזנה לאירועים
        const newCloseBtn = modalContent.querySelector('.close');
        if (newCloseBtn) {
            newCloseBtn.onclick = () => modal.style.display = 'none';
        }
    }
}

// הוספה לתחילת הקובץ
document.addEventListener('DOMContentLoaded', () => {
    initializeWindyText();
    // אנימציית כניסה לאלמנטים
    const elements = document.querySelectorAll('.time-block, .register-btn, h1, h2');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// פונציית קונפטי
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.querySelector('.confetti').appendChild(confetti);
    }
}

// נוסיף פונקציה חדשה לאנימציית הטקסט
function initializeWindyText() {
    const title = document.querySelector('h1');
    const text = ['מתבדרות', 'ברוח'];
    title.innerHTML = text.map(word => 
        `<div class="word">${
            [...word].map(char => 
                `<span class="char">${char}</span>`
            ).join('')
        }</div>`
    ).join(' ');
}

// פונקציות למודאל יצירת קשר
function showContactModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// סגירת המודאל בלחיצה מחוץ לתוכן
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeContactModal();
    }
}

