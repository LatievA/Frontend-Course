// jQuery Document Ready
$(document).ready(function() {
    console.log("SecureBank website loaded successfully!");
    
    // Initialize animations
    initAnimations();
    
    // Initialize counter animation
    animateCounters();
    
    // Initialize form validations
    initFormValidation();
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
    
    // Add fade-in effect to elements on scroll
    $(window).on('scroll', function() {
        $('.feature-card, .service-card, .account-card, .team-card').each(function() {
            const bottom_of_element = $(this).offset().top + $(this).outerHeight() / 3;
            const bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if (bottom_of_window > bottom_of_element) {
                $(this).addClass('fade-in-up');
            }
        });
    });
    
    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').css('background', 'rgba(37, 99, 235, 0.95)');
        } else {
            $('.navbar').css('background', 'transparent');
        }
    });
    
    // Service card toggle details
    $('.service-card button').on('click', function() {
        $(this).closest('.service-card').find('.service-features').slideToggle();
    });
});

// Initialize animations
function initAnimations() {
    // Animate feature cards on hover
    $('.feature-card, .service-card, .account-card').hover(
        function() {
            $(this).find('i').addClass('animated-icon');
        },
        function() {
            $(this).find('i').removeClass('animated-icon');
        }
    );
    
    // Add animation class
    $('<style>')
        .prop('type', 'text/css')
        .html('.animated-icon { animation: pulse 0.5s ease-in-out; } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }')
        .appendTo('head');
}

// Counter animation for statistics
function animateCounters() {
    let hasAnimated = false;
    
    $(window).on('scroll', function() {
        const statsSection = $('.stats-section');
        if (statsSection.length && !hasAnimated) {
            const statsSectionTop = statsSection.offset().top;
            const statsSectionBottom = statsSectionTop + statsSection.outerHeight();
            const scrollPosition = $(window).scrollTop() + $(window).height();
            
            if (scrollPosition > statsSectionTop && scrollPosition < statsSectionBottom + 200) {
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

// Form validation and submission
function initFormValidation() {
    // Login form validation
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        if (username && password) {
            // Show loading animation
            const submitBtn = $(this).find('button[type="submit"]');
            const originalText = submitBtn.html();
            submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Logging in...').prop('disabled', true);
            
            // Simulate login process
            setTimeout(function() {
                alert('Login successful! Welcome to SecureBank.');
                submitBtn.html(originalText).prop('disabled', false);
                $('#loginModal').modal('hide');
            }, 1500);
        }
        
        return false;
    });
    
    // Contact form validation
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Remove previous validation states
        $(this).removeClass('was-validated');
        
        // Check validity
        if (this.checkValidity() === false) {
            e.stopPropagation();
            $(this).addClass('was-validated');
            return false;
        }
        
        // Get form data
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            subject: $('#subject').val(),
            message: $('#message').val(),
            newsletter: $('#newsletter').is(':checked')
        };
        
        // Show loading animation
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...').prop('disabled', true);
        
        // Simulate form submission
        setTimeout(function() {
            // Show success message
            $('#formSuccess').slideDown();
            $('#contactForm')[0].reset();
            $(this).removeClass('was-validated');
            submitBtn.html(originalText).prop('disabled', false);
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                $('#formSuccess').slideUp();
            }, 5000);
            
            console.log('Form submitted:', formData);
        }, 1500);
        
        return false;
    });
    
    // Account form validation
    $('#accountForm').on('submit', function(e) {
        e.preventDefault();
        
        if (this.checkValidity() === false) {
            e.stopPropagation();
            $(this).addClass('was-validated');
            return false;
        }
        
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        setTimeout(function() {
            alert('Thank you! Your account application has been submitted. We will contact you within 24 hours.');
            $('#accountModal').modal('hide');
            $('#accountForm')[0].reset();
            $(this).removeClass('was-validated');
            submitBtn.html(originalText).prop('disabled', false);
        }, 2000);
        
        return false;
    });
    
    // Real-time email validation
    $('#email').on('input', function() {
        const email = $(this).val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    // Real-time phone validation
    $('#phone').on('input', function() {
        const phone = $(this).val();
        const phoneRegex = /^[0-9]{10,}$/;
        
        if (phone && !phoneRegex.test(phone.replace(/\D/g, ''))) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
}

// Toggle service details
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

// Open account form modal
function openAccountForm(accountType) {
    $('#accountModalTitle').text('Open ' + accountType + ' Account');
    $('#accountModal').modal('show');
}

// Savings calculator
function calculateSavings() {
    const principal = parseFloat($('#principal').val()) || 0;
    const rate = parseFloat($('#rate').val()) / 100 || 0;
    const time = parseFloat($('#time').val()) || 0;
    const monthly = parseFloat($('#monthly').val()) || 0;
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
        alert('Please enter valid values for all fields.');
        return;
    }
    
    // Calculate compound interest with monthly contributions
    const n = 12; // Compound monthly
    const totalMonths = time * 12;
    
    // Future value of initial deposit
    const futureValuePrincipal = principal * Math.pow((1 + rate / n), n * time);
    
    // Future value of monthly contributions (annuity)
    const monthlyRate = rate / 12;
    const futureValueMonthly = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const futureValue = futureValuePrincipal + futureValueMonthly;
    const totalDeposits = principal + (monthly * totalMonths);
    const interestEarned = futureValue - totalDeposits;
    
    // Animate the result display
    $('#result').slideDown(500);
    
    // Animate numbers
    animateValue('#futureValue', 0, futureValue, 1500, true);
    animateValue('#totalDeposits', 0, totalDeposits, 1500, true);
    animateValue('#interestEarned', 0, interestEarned, 1500, true);
}

// Animate number values
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

// Show map
function showMap() {
    $('#mapSection').slideToggle(500);
    $('html, body').animate({
        scrollTop: $('#mapSection').offset().top - 100
    }, 500);
}

// jQuery effects for interactive elements
$(document).ready(function() {
    // Fade effect for alerts
    $('.alert').hide().fadeIn(1000);
    
    // Slide toggle for FAQ items
    $('.accordion-button').on('click', function() {
        const target = $(this).data('bs-target');
        if (!$(this).hasClass('collapsed')) {
            $(target).slideDown(300);
        }
    });
    
    // Hover effect for cards
    $('.feature-card, .service-card, .account-card').hover(
        function() {
            $(this).stop().animate({
                marginTop: '-10px',
            }, 200);
        },
        function() {
            $(this).stop().animate({
                marginTop: '0px',
            }, 200);
        }
    );
    
    // Modal show/hide animations
    $('.modal').on('show.bs.modal', function() {
        $(this).find('.modal-dialog').addClass('fade-in-up');
    });
    
    $('.modal').on('hide.bs.modal', function() {
        $(this).find('.modal-dialog').removeClass('fade-in-up');
    });
    
    // Tooltip initialization (if Bootstrap tooltips are used)
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert-success, .alert-info').fadeOut('slow');
    }, 5000);
});

// Loading animation for page transitions
$(window).on('load', function() {
    $('body').css('opacity', '0').animate({opacity: 1}, 500);
});

// Add active class to current navigation item
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

// Console greeting
console.log('%c Welcome to SecureBank! ', 'background: #2563eb; color: white; font-size: 20px; padding: 10px;');
console.log('%c Your trusted partner in financial security ', 'color: #2563eb; font-size: 14px;');

// Error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
    return false;
};

// Service Worker registration (for PWA - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js').then(function(registration) {
        //     console.log('ServiceWorker registration successful');
        // }, function(err) {
        //     console.log('ServiceWorker registration failed: ', err);
        // });
    });
}