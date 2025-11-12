// ============================================
// ADVANCED FEATURES IMPLEMENTATION
// 1. Local Storage for User Data & Theme
// 2. API Integration (News & Currency)
// 3. Dark/Light Mode Toggle
// 4. Enhanced Form Validation
// ============================================

// Global variables for API data
let exchangeRates = {};
let currentUser = null;

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

// Initialize app on page load
$(document).ready(function() {
    console.log("SecureBank Enhanced Edition loaded!");
    
    // Load theme preference
    loadTheme();
    
    // Load user session
    loadUserSession();
    
    // Initialize all features
    initAnimations();
    animateCounters();
    initFormValidation();
    initThemeToggle();
    
    // Load API data
    loadExchangeRates();
    loadFinancialNews();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup navbar background
    setupNavbarScroll();
});

// ======================
// DARK/LIGHT MODE TOGGLE
// ======================

function initThemeToggle() {
    $('#themeToggle').on('click', function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Save to local storage
        localStorage.setItem('theme', newTheme);
        
        // Apply theme
        applyTheme(newTheme);
        
        // Animate button
        $(this).addClass('theme-toggle-animate');
        setTimeout(() => {
            $(this).removeClass('theme-toggle-animate');
        }, 300);
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        $('body').addClass('dark-mode');
        $('#themeToggle i').removeClass('fa-moon').addClass('fa-sun');
        $('#themeToggle').attr('title', 'Switch to Light Mode');
    } else {
        $('body').removeClass('dark-mode');
        $('#themeToggle i').removeClass('fa-sun').addClass('fa-moon');
        $('#themeToggle').attr('title', 'Switch to Dark Mode');
    }
}

// ============================================
// USER SESSION WITH LOCAL STORAGE
// ============================================

function loadUserSession() {
    const userData = localStorage.getItem('securebank_user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUserGreeting();
            $('#logoutBtn').show();
        } catch (e) {
            console.error('Error loading user session:', e);
            localStorage.removeItem('securebank_user');
        }
    }
}

function saveUserSession(username) {
    const userData = {
        username: username,
        loginTime: new Date().toISOString(),
        preferences: {
            theme: localStorage.getItem('theme') || 'light'
        }
    };
    localStorage.setItem('securebank_user', JSON.stringify(userData));
    currentUser = userData;
}

function clearUserSession() {
    localStorage.removeItem('securebank_user');
    currentUser = null;
}

function updateUserGreeting() {
    if (currentUser) {
        const greeting = `Hello, ${currentUser.username}`;
        $('#userGreeting').text(greeting);
    } else {
        $('#userGreeting').text('Login');
    }
}

// ============================
// API INTEGRATION - EXCHANGE RATES
// ============================

function loadExchangeRates() {
    // Using Exchange Rate API (free tier)
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            exchangeRates = data.rates;
            displayExchangeRates(data.rates);
            
            // Save to local storage with timestamp
            const cacheData = {
                rates: data.rates,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('exchange_rates', JSON.stringify(cacheData));
        },
        error: function(error) {
            console.error('Error fetching exchange rates:', error);
            
            // Try to load from cache
            const cached = localStorage.getItem('exchange_rates');
            if (cached) {
                try {
                    const cacheData = JSON.parse(cached);
                    exchangeRates = cacheData.rates;
                    displayExchangeRates(cacheData.rates);
                    showCacheNotice();
                } catch (e) {
                    showRatesError();
                }
            } else {
                showRatesError();
            }
        }
    });
}

function displayExchangeRates(rates) {
    const currencies = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];
    let html = '';
    
    currencies.forEach(currency => {
        if (rates[currency]) {
            html += `
                <div class="col-md-4 col-6 mb-3">
                    <div class="rate-box p-3 text-center">
                        <h5 class="mb-1">USD → ${currency}</h5>
                        <h4 class="text-primary">${rates[currency].toFixed(4)}</h4>
                    </div>
                </div>
            `;
        }
    });
    
    $('#ratesContainer').html(html).hide().fadeIn(500);
}

function showRatesError() {
    $('#ratesContainer').html(`
        <div class="col-12 text-center text-danger">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to load exchange rates. Please try again later.</p>
        </div>
    `);
}

function showCacheNotice() {
    const notice = $(`
        <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
            <i class="fas fa-info-circle"></i> Showing cached exchange rates
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    $('#exchangeRates').prepend(notice);
}

function convertCurrency() {
    const amount = parseFloat($('#currencyAmount').val());
    const from = $('#fromCurrency').val();
    const to = $('#toCurrency').val();
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (Object.keys(exchangeRates).length === 0) {
        alert('Exchange rates are still loading. Please try again.');
        return;
    }
    
    // Convert through USD as base
    let result;
    if (from === 'USD') {
        result = amount * exchangeRates[to];
    } else if (to === 'USD') {
        result = amount / exchangeRates[from];
    } else {
        // Convert from -> USD -> to
        const usdAmount = amount / exchangeRates[from];
        result = usdAmount * exchangeRates[to];
    }
    
    const rate = result / amount;
    
    $('#resultValue').text(`${amount} ${from} = ${result.toFixed(2)} ${to}`);
    $('#resultRate').text(`Exchange Rate: 1 ${from} = ${rate.toFixed(4)} ${to}`);
    $('#conversionResult').slideDown(300);
    
    // Save conversion history to local storage
    saveConversionHistory(amount, from, to, result);
}

function saveConversionHistory(amount, from, to, result) {
    let history = JSON.parse(localStorage.getItem('conversion_history') || '[]');
    
    history.unshift({
        amount,
        from,
        to,
        result: result.toFixed(2),
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 conversions
    history = history.slice(0, 10);
    
    localStorage.setItem('conversion_history', JSON.stringify(history));
}

// ============================
// API INTEGRATION - FINANCIAL NEWS
// ============================

function loadFinancialNews() {
    // Using a free news API - you may need to get your own API key
    // For demo purposes, using mock data if API fails
    
    // Try to load from cache first
    const cached = localStorage.getItem('financial_news');
    const cacheTime = localStorage.getItem('news_cache_time');
    const now = new Date().getTime();
    
    // Use cache if less than 1 hour old
    if (cached && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
        displayFinancialNews(JSON.parse(cached));
        return;
    }
    
    // For demo: using mock data (in production, use real API)
    setTimeout(() => {
        const mockNews = [
            {
                title: "Stock Market Reaches New Heights Amid Economic Recovery",
                description: "Major indices show strong gains as investor confidence returns with positive economic indicators.",
                url: "#",
                publishedAt: new Date().toISOString(),
                source: { name: "Financial Times" }
            },
            {
                title: "Federal Reserve Maintains Interest Rates",
                description: "Central bank keeps rates steady while monitoring inflation and employment data.",
                url: "#",
                publishedAt: new Date().toISOString(),
                source: { name: "Reuters" }
            },
            {
                title: "Tech Sector Leads Market Growth",
                description: "Technology companies report strong quarterly earnings, driving market optimism.",
                url: "#",
                publishedAt: new Date().toISOString(),
                source: { name: "Bloomberg" }
            }
        ];
        
        displayFinancialNews(mockNews);
        
        // Cache the news
        localStorage.setItem('financial_news', JSON.stringify(mockNews));
        localStorage.setItem('news_cache_time', now.toString());
    }, 1000);
}

function displayFinancialNews(articles) {
    let html = '';
    
    articles.slice(0, 3).forEach(article => {
        const date = new Date(article.publishedAt).toLocaleDateString();
        html += `
            <div class="col-md-4">
                <div class="news-card p-4">
                    <div class="news-source mb-2">
                        <small class="text-muted">
                            <i class="fas fa-newspaper"></i> ${article.source.name} • ${date}
                        </small>
                    </div>
                    <h5>${article.title}</h5>
                    <p>${article.description}</p>
                    <a href="${article.url}" class="btn btn-sm btn-outline-primary" target="_blank">
                        Read More <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
    });
    
    $('#newsContainer').html(html).hide().fadeIn(500);
}

// ============================================
// ENHANCED FORM VALIDATION
// ============================================

function initFormValidation() {
    // Login form with session management
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val().trim();
        const password = $('#password').val();
        const remember = $('#remember').is(':checked');
        
        if (!username || !password) {
            showFormError('Please fill in all fields');
            return false;
        }
        
        // Validate username (alphanumeric, 3-20 chars)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            showFormError('Username must be 3-20 characters (letters, numbers, underscore only)');
            return false;
        }
        
        // Validate password (min 6 chars)
        if (password.length < 6) {
            showFormError('Password must be at least 6 characters');
            return false;
        }
        
        // Show loading
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Logging in...').prop('disabled', true);
        
        // Simulate authentication
        setTimeout(() => {
            // Save user session
            saveUserSession(username);
            
            // Update UI
            updateUserGreeting();
            $('#logoutBtn').show();
            
            // Show success message
            showSuccessMessage(`Welcome back, ${username}!`);
            
            submitBtn.html(originalText).prop('disabled', false);
            $('#loginModal').modal('hide');
            
            // Reset form
            $(this)[0].reset();
        }, 1500);
        
        return false;
    });
    
    // Logout functionality
    $('#logoutBtn, .logout-link').on('click', function(e) {
        e.preventDefault();
        clearUserSession();
        updateUserGreeting();
        $('#logoutBtn').hide();
        showSuccessMessage('You have been logged out successfully');
    });
    
    // Contact form validation
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        $(this).removeClass('was-validated');
        
        if (this.checkValidity() === false) {
            e.stopPropagation();
            $(this).addClass('was-validated');
            return false;
        }
        
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            subject: $('#subject').val(),
            message: $('#message').val(),
            timestamp: new Date().toISOString()
        };
        
        // Save to local storage
        saveContactSubmission(formData);
        
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...').prop('disabled', true);
        
        setTimeout(() => {
            $('#formSuccess').slideDown();
            $('#contactForm')[0].reset();
            $(this).removeClass('was-validated');
            submitBtn.html(originalText).prop('disabled', false);
            
            setTimeout(() => $('#formSuccess').slideUp(), 5000);
        }, 1500);
        
        return false;
    });
    
    // Real-time validation
    $('#email').on('input', validateEmailField);
    $('#phone').on('input', validatePhoneField);
}

function validateEmailField() {
    const email = $(this).val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        $(this).addClass('is-invalid').removeClass('is-valid');
    } else if (email) {
        $(this).addClass('is-valid').removeClass('is-invalid');
    } else {
        $(this).removeClass('is-invalid is-valid');
    }
}

function validatePhoneField() {
    const phone = $(this).val();
    const phoneRegex = /^[0-9]{10,}$/;
    
    if (phone && !phoneRegex.test(phone.replace(/\D/g, ''))) {
        $(this).addClass('is-invalid').removeClass('is-valid');
    } else if (phone) {
        $(this).addClass('is-valid').removeClass('is-invalid');
    } else {
        $(this).removeClass('is-invalid is-valid');
    }
}

function saveContactSubmission(formData) {
    let submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    submissions.unshift(formData);
    submissions = submissions.slice(0, 20); // Keep last 20
    localStorage.setItem('contact_submissions', JSON.stringify(submissions));
}

function showFormError(message) {
    const alert = $(`
        <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <i class="fas fa-exclamation-triangle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    $('#loginForm').prepend(alert);
    setTimeout(() => alert.fadeOut(() => alert.remove()), 5000);
}

function showSuccessMessage(message) {
    const alert = $(`
        <div class="alert alert-success alert-dismissible fade show" 
             style="position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    $('body').append(alert);
    setTimeout(() => alert.fadeOut(() => alert.remove()), 3000);
}

// ============================================
// ANIMATIONS & INTERACTIONS
// ============================================

function initAnimations() {
    $('.feature-card, .service-card, .account-card').hover(
        function() {
            $(this).find('i').addClass('animated-icon');
        },
        function() {
            $(this).find('i').removeClass('animated-icon');
        }
    );
    
    $('<style>')
        .prop('type', 'text/css')
        .html('.animated-icon { animation: pulse 0.5s ease-in-out; } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }')
        .appendTo('head');
}

function animateCounters() {
    let hasAnimated = false;
    
    $(window).on('scroll', function() {
        const statsSection = $('.stats-section');
        if (statsSection.length && !hasAnimated) {
            const statsSectionTop = statsSection.offset().top;
            const scrollPosition = $(window).scrollTop() + $(window).height();
            
            if (scrollPosition > statsSectionTop) {
                hasAnimated = true;
                $('.counter').each(function() {
                    const $this = $(this);
                    const countTo = $this.attr('data-target');
                    
                    $({countNum: 0}).animate({
                        countNum: countTo
                    }, {
                        duration: 2000,
                        easing: 'linear',
                        step: function() {
                            $this.text(Math.floor(this.countNum).toLocaleString());
                        },
                        complete: function() {
                            $this.text(this.countNum.toLocaleString());
                        }
                    });
                });
            }
        }
    });
}

function setupSmoothScrolling() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
}

function setupScrollAnimations() {
    $(window).on('scroll', function() {
        $('.feature-card, .service-card, .account-card, .team-card, .news-card').each(function() {
            const bottom_of_element = $(this).offset().top + $(this).outerHeight() / 3;
            const bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if (bottom_of_window > bottom_of_element) {
                $(this).addClass('fade-in-up');
            }
        });
    });
}

function setupNavbarScroll() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').css('background', 'rgba(37, 99, 235, 0.95)');
        } else {
            $('.navbar').css('background', 'transparent');
        }
    });
}

// ============================================
// SAVINGS CALCULATOR
// ============================================

function calculateSavings() {
    const principal = parseFloat($('#principal').val()) || 0;
    const rate = parseFloat($('#rate').val()) / 100 || 0;
    const time = parseFloat($('#time').val()) || 0;
    const monthly = parseFloat($('#monthly').val()) || 0;
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
        alert('Please enter valid values for all fields');
        return;
    }
    
    const n = 12;
    const totalMonths = time * 12;
    const futureValuePrincipal = principal * Math.pow((1 + rate / n), n * time);
    const monthlyRate = rate / 12;
    const futureValueMonthly = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const futureValue = futureValuePrincipal + futureValueMonthly;
    const totalDeposits = principal + (monthly * totalMonths);
    const interestEarned = futureValue - totalDeposits;
    
    $('#result').slideDown(500);
    animateValue('#futureValue', 0, futureValue, 1500, true);
    animateValue('#totalDeposits', 0, totalDeposits, 1500, true);
    animateValue('#interestEarned', 0, interestEarned, 1500, true);
    
    // Save calculation to history
    saveCalculationHistory({
        principal,
        rate: rate * 100,
        time,
        monthly,
        result: futureValue,
        timestamp: new Date().toISOString()
    });
}

function saveCalculationHistory(calculation) {
    let history = JSON.parse(localStorage.getItem('calculation_history') || '[]');
    history.unshift(calculation);
    history = history.slice(0, 10);
    localStorage.setItem('calculation_history', JSON.stringify(history));
}

function animateValue(id, start, end, duration, isCurrency) {
    const element = $(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(function() {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        if (isCurrency) {
            element.text('$' + current.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        } else {
            element.text(Math.floor(current));
        }
    }, 16);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function toggleDetails(button) {
    const card = $(button).closest('.service-card');
    const features = card.find('.service-features');
    
    features.slideToggle(300, function() {
        if (features.is(':visible')) {
            $(button).text('Show Less');
        } else {
            $(button).text('Learn More');
        }
    });
}

function openAccountForm(accountType) {
    $('#accountModalTitle').text('Open ' + accountType + ' Account');
    $('#accountModal').modal('show');
}

function showMap() {
    $('#mapSection').slideToggle(500);
    $('html, body').animate({
        scrollTop: $('#mapSection').offset().top - 100
    }, 500);
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

$(window).on('load', function() {
    $('body').css('opacity', '0').animate({opacity: 1}, 500);
});

// ============================================
// NAVIGATION ACTIVE STATE
// ============================================

$(document).ready(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.nav-link').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
});

// ============================================
// CONSOLE GREETING
// ============================================

console.log('%c SecureBank Enhanced Edition ', 'background: #2563eb; color: white; font-size: 20px; padding: 10px;');
console.log('%c Features: Dark Mode, API Integration, Local Storage ', 'color: #10b981; font-size: 14px;');

// Error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
    return false;
};