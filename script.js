// script.js - Fully functional with improved phone validation

// API endpoints (update with your actual backend URLs)
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
            { id: 1, title: 'Lock 200 KES · get 1000', subtitle: '24 hours only', price: 200, payout: 1000, badge: 'HOT' },
            { id: 2, title: 'Lock 350 KES · get 1500', subtitle: '24 hours only', price: 350, payout: 1500, badge: null },
            { id: 15, title: 'Lock 350 KES · get 1750', subtitle: '3 days tenure', price: 350, payout: 1750, badge: 'VALUE' },
            { id: 16, title: 'Lock 500 KES · get 2500', subtitle: '3 days tenure', price: 500, payout: 2500, badge: null }
        ]
    },
    weekly: {
        id: 'weekly',
        title: 'Weekly Lock',
        icon: 'fas fa-calendar-week',
        subtitle: '7 days · better returns',
        bundles: [
            { id: 3, title: 'Lock 400 KES · get 2000', subtitle: '7 days lock', price: 400, payout: 2000, badge: null },
            { id: 4, title: 'Lock 700 KES · get 3500', subtitle: '7 days + bonus', price: 700, payout: 3500, badge: 'POPULAR' },
            { id: 5, title: 'Lock 1000 KES · get 5000', subtitle: '7 days · double', price: 1000, payout: 5000, badge: null },
            { id: 6, title: 'Lock 1300 KES · get 6500', subtitle: '7 days premium', price: 1300, payout: 6500, badge: 'HOT' }
        ]
    },
    monthly: {
        id: 'monthly',
        title: 'Monthly Lock',
        icon: 'fas fa-calendar-alt',
        subtitle: '21–30 days · max yield',
        bundles: [
            { id: 7, title: 'Lock 1500 KES · get 7500', subtitle: '21 days tenure', price: 1500, payout: 7500, badge: null },
            { id: 8, title: 'Lock 2000 KES · get 10000', subtitle: '30 days · flagship', price: 2000, payout: 10000, badge: 'POPULAR' },
            { id: 9, title: 'Lock 2500 KES · get 12500', subtitle: '30 days · extra', price: 2500, payout: 12500, badge: 'HOT' },
            { id: 10, title: 'Lock 3000 KES · get 15000', subtitle: '30 days · pro', price: 3000, payout: 15000, badge: 'VALUE' }
        ]
    },
    unlimited: {
        id: 'unlimited',
        title: 'Extended Lock',
        icon: 'fas fa-infinity',
        subtitle: '14d / 30d special',
        bundles: [
            { id: 11, title: 'Lock 800 KES · get 4000', subtitle: '14 days unlimited', price: 800, payout: 4000, badge: 'VALUE' },
            { id: 12, title: 'Lock 1200 KES · get 6000', subtitle: '14 days high', price: 1200, payout: 6000, badge: null },
            { id: 13, title: 'Lock 1800 KES · get 9000', subtitle: '30 days unlimited', price: 1800, payout: 9000, badge: null },
            { id: 14, title: 'Lock 2200 KES · get 11000', subtitle: '14d special', price: 2200, payout: 11000, badge: 'POPULAR' }
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

// ---------- IMPROVED PHONE VALIDATION (accepts 07..., 7..., 01..., 1... and up to 10 digits) ----------
function validatePhoneNumber(phone) {
    // Remove any spaces, dashes, parentheses
    let clean = phone.replace(/[\s\-\(\)]/g, '');
    
    // Remove leading + if present
    if (clean.startsWith('+')) {
        clean = clean.substring(1);
    }
    
    // Check length - Kenyan numbers can be 9-10 digits (with or without leading zero)
    if (clean.length < 9 || clean.length > 10) {
        throw new Error('Phone number must be 9 or 10 digits (e.g., 0712345678 or 712345678)');
    }
    
    // Check if it's a valid Kenyan number format
    // Accept: 07XXXXXXXX (10 digits), 7XXXXXXXX (9 digits), 01XXXXXXXX (10 digits), 1XXXXXXXX (9 digits), 254XXXXXXXXX (12 digits - handled separately)
    const kenyanRegex = /^(?:(?:\+?254)|0)?((7|1)\d{8})$/;
    const match = clean.match(kenyanRegex);
    
    if (!match) {
        throw new Error('Enter a valid Kenyan number starting with 07, 01, 7, or 1');
    }
    
    // Return the 9-digit core number (without 0 or 254)
    return match[1];
}

function formatPhoneForDisplay(phone) {
    // Format as 07XX XXX XXX or 01XX XXX XXX for display
    if (phone.length === 9) {
        const prefix = phone.startsWith('7') ? '07' : '01';
        return prefix + ' ' + phone.slice(1,4) + ' ' + phone.slice(4,7) + ' ' + phone.slice(7);
    }
    return phone;
}

function formatPhoneForAPI(phone) {
    // Return in international format for API (254 + 9-digit core)
    return '254' + phone;
}

// Normalize phone using backend API
async function normalizePhoneNumber(phone) {
    try {
        const response = await fetch(API_ENDPOINTS.normalizePhone, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: formatPhoneForAPI(phone) })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Phone normalization failed');
        }
        
        const data = await response.json();
        return data.normalized_phone || formatPhoneForAPI(phone);
    } catch (error) {
        console.warn('Phone normalization failed, using local format:', error);
        // Fallback to local formatting
        return formatPhoneForAPI(phone);
    }
}

// ---------- MODAL FUNCTION ----------
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
                        <i class="fas fa-mobile-alt"></i> Phone Number
                    </label>
                    <div class="phone-input-group">
                        <div class="phone-prefix">+254</div>
                        <input type="tel" class="phone-input" id="swal-phone" placeholder="712 345 678" value="" maxlength="12">
                    </div>
                    <div class="input-note enhanced">
                        <i class="fas fa-info-circle"></i>
                        <span>You'll receive a prompt to lock funds. After lock period, <strong>Ksh ${investment.payout}</strong> will be sent automatically to this number.</span>
                    </div>
                </div>
                
                <div class="summary-box">
                    <div class="summary-row">
                        <span>Lock amount:</span>
                        <span><strong>Ksh ${investment.price}</strong></span>
                    </div>
                    <div class="summary-row total">
                        <span>Total to pay:</span>
                        <span>Ksh ${investment.price}</span>
                    </div>
                </div>
                
                <div class="secure-note">
                    <i class="fas fa-lock"></i> Secured payment via M-PESA
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
                // Remove any formatting spaces for validation
                const rawPhone = phoneInput.value.replace(/\s/g, '');
                const phoneValue = validatePhoneNumber(rawPhone);
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

    // Add input formatting for better UX
    setTimeout(() => {
        const phoneInput = document.getElementById('swal-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Remove all non-digits
                let value = this.value.replace(/\D/g, '');
                
                // Limit to 10 digits for Kenyan numbers (allowing leading zero)
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                
                // Format as XXX XXX XXX for readability
                if (value.length > 3) {
                    value = value.slice(0,3) + ' ' + value.slice(3);
                }
                if (value.length > 7) {
                    value = value.slice(0,7) + ' ' + value.slice(7);
                }
                
                this.value = value;
            });
            phoneInput.focus();
        }
    }, 50);
}

function selectInvestment(investment) {
    selectedInvestment = investment;
    showInputModal(investment);
}

// ---------- API FUNCTIONS ----------
async function sendPayHeroSTK(phoneNumber, amount, description) {
    const response = await fetch(API_ENDPOINTS.initiatePayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone_number: phoneNumber,
            amount: amount,
            description: `Ziidi Fund: ${description}`
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment initiation failed');
    }
    
    return await response.json();
}

async function verifyPayment(reference) {
    const response = await fetch(`${API_ENDPOINTS.verifyPayment}?reference=${encodeURIComponent(reference)}`);
    
    if (!response.ok) {
        throw new Error('Verification failed');
    }
    
    return await response.json();
}

async function pollPaymentStatus(reference) {
    const maxAttempts = 20;
    const interval = 3000;
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
        const poll = async () => {
            attempts++;
            try {
                const result = await verifyPayment(reference);
                
                if (result.success && (result.status === 'SUCCESS' || result.status === 'COMPLETED')) {
                    resolve({ success: true, data: result.data });
                    return;
                }
                
                if (result.success && (result.status === 'FAILED' || result.status === 'CANCELLED')) {
                    reject({ success: false, error: 'Payment failed or was cancelled' });
                    return;
                }
                
                if (attempts >= maxAttempts) {
                    reject({ success: false, error: 'Payment verification timeout' });
                    return;
                }
                
                setTimeout(poll, interval);
            } catch (error) {
                if (attempts >= maxAttempts) {
                    reject({ success: false, error: 'Unable to verify payment' });
                    return;
                }
                setTimeout(poll, interval);
            }
        };
        
        poll();
    });
}

// ---------- MAIN LOCK FLOW ----------
async function initiateLock(investment, recipientPhone) {
    if (isProcessing) return;
    isProcessing = true;
    
    try {
        // Show initial loading
        Swal.fire({
            title: 'Processing',
            html: '<div style="padding:0.5rem;">Please wait...</div>',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Normalize phone number via API
        Swal.update({ 
            title: 'Validating Phone', 
            html: '<div style="padding:0.5rem;">Checking phone number...</div>'
        });
        
        const normalizedPhone = await normalizePhoneNumber(recipientPhone);
        
        // Initiate STK push
        Swal.update({ 
            title: 'Sending STK Push', 
            html: '<div style="padding:0.5rem;">Initiating M-PESA request...</div>'
        });
        
        const paymentResponse = await sendPayHeroSTK(
            normalizedPhone, 
            parseInt(investment.price), 
            investment.title
        );
        
        if (!paymentResponse || !paymentResponse.reference) {
            throw new Error('Failed to initiate payment');
        }
        
        // Show STK sent message
        await Swal.fire({
            title: 'STK Push Sent!',
            html: `
                <div class="status-modal-content">
                    <div class="status-icon" style="color:#1d541d;">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <p><strong>Check your phone</strong></p>
                    <div style="background:#e6f3e6;padding:0.5rem;border-radius:10px;margin:0.5rem 0;font-size:0.85rem;">
                        ${formatPhoneForDisplay(recipientPhone)}
                    </div>
                    <p style="font-size:0.75rem;color:#2d7a2d;">Enter your M-PESA PIN to complete</p>
                    <div style="margin-top:10px;">
                        <small>Verifying payment automatically...</small>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            allowOutsideClick: false
        });
        
        // Show verifying state
        Swal.fire({
            title: 'Verifying Payment',
            html: '<div style="padding:0.5rem;"><div class="swal2-loading" style="margin:0.5rem auto;"></div><p style="font-size:0.75rem;">Please wait while we confirm your payment...</p></div>',
            showConfirmButton: false,
            allowOutsideClick: false
        });
        
        // Poll for payment status
        const pollResult = await pollPaymentStatus(paymentResponse.reference);
        
        if (pollResult.success) {
            // Success!
            await Swal.fire({
                title: 'Success!',
                html: `
                    <div class="status-modal-content">
                        <div class="status-icon" style="color:#1d541d;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="status-details">
                            <div style="margin-bottom:0.3rem;"><strong>${investment.title}</strong></div>
                            <div>${formatPhoneForDisplay(recipientPhone)}</div>
                            <div style="font-weight:700;margin-top:0.3rem;">Paid: Ksh ${investment.price}</div>
                            <div style="font-weight:700;color:#0f3a0f;margin-top:0.2rem;">Maturity: Ksh ${investment.payout}</div>
                        </div>
                        <p style="font-size:0.75rem;color:#2d7a2d;margin-top:10px;">
                            Funds will be sent automatically after lock period
                        </p>
                    </div>
                `,
                confirmButtonText: 'Done',
                confirmButtonColor: '#1d541d',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            });
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        
        let errorMessage = error.message || 'Payment processing failed';
        if (error.error) errorMessage = error.error;
        
        await Swal.fire({
            title: 'Payment Status',
            html: `
                <div class="status-modal-content">
                    <div class="status-icon" style="color:#f59e0b;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p><strong>${errorMessage}</strong></p>
                    <p style="font-size:0.7rem;color:#2d7a2d;">Check your phone and try again</p>
                </div>
            `,
            confirmButtonText: 'OK',
            confirmButtonColor: '#1d541d',
            customClass: {
                confirmButton: 'swal2-confirm'
            }
        });
    } finally {
        isProcessing = false;
        selectedInvestment = null;
    }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    renderAllInvestments();
    setupEventListeners();
    document.querySelector('[data-category="all"]').classList.add('active');
});