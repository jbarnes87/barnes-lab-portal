/**
 * =============================================================================
 * BARNES LAB - Home Lab Portal Scripts
 * Version: 1.0.0
 * 
 * This module contains all interactive functionality for the Barnes Lab portal,
 * including time zone clocks, animations, and user interactions.
 * 
 * Dependencies: None (vanilla JavaScript ES6+)
 * Browser Support: Modern browsers (Chrome 90+, Firefox 85+, Safari 14+)
 * =============================================================================
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURATION & STATE
    // ==========================================================================
    
    const config = {
        updateInterval: 1000,           // Clock update interval (ms)
        timezoneAliases: {
            zulu: 'UTC',
            mountain: 'America/Denver',
            eastern: 'America/New_York'
        },
        animationSettings: {
            enableParallax: true,
            enableScrollReveal: true,
            cursorEffects: true
        }
    };

    const state = {
        lastMouseX: 0,
        lastMouseY: 0,
        mouseX: 0,
        mouseY: 0,
        isHoveringClocks: false
    };

    // ==========================================================================
    // CLOCK FUNCTIONALITY
    // ==========================================================================

    /**
     * Updates all clock displays with current time for each timezone
     */
    function updateAllClocks() {
        const now = new Date();

        Object.entries(config.timezoneAliases).forEach(([key, tz]) => {
            updateTimezoneDisplay(key, tz, now);
        });

        // Update last updated timestamp in footer
        updateLastUpdated(now.getFullYear());
    }

    /**
     * Updates a single timezone display
     * @param {string} key - Clock identifier (zulu, mountain, eastern)
     * @param {string} tz - IANA timezone string
     * @param {Date} now - Current date object
     */
    function updateTimezoneDisplay(key, tz, now) {
        const timeElement = document.getElementById(`${key}-clock`);
        const dateElement = document.getElementById(`${key}-date`);

        if (!timeElement || !dateElement) return;

        // Format time in 24-hour format
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: tz,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Format date with weekday
        const dateString = now.toLocaleDateString('en-US', {
            timeZone: tz,
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        timeElement.textContent = timeString;
        dateElement.textContent = dateString;

        // Add subtle visual indicator for current hour (6am - 10pm local)
        const hourInTz = now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric' });
        if (hourInTz >= 6 && hourInTz < 22) {
            timeElement.style.textShadow = `0 0 30px rgba(0, 245, 255, ${0.3 + Math.sin(Date.now() / 1000) * 0.2})`;
        } else {
            timeElement.style.textShadow = 'var(--glow-primary)';
        }
    }

    /**
     * Updates the last updated year in footer
     * @param {number} year - Current year
     */
    function updateLastUpdated(year) {
        const element = document.getElementById('last-updated');
        if (element) {
            element.textContent = year;
        }
    }

    // ==========================================================================
    // MOUSE PARALLAX EFFECTS
    // ==========================================================================

    /**
     * Initializes mouse tracking for parallax effects on gradient orbs
     */
    function initParallaxEffects() {
        if (!config.animationSettings.enableParallax) return;

        document.addEventListener('mousemove', (e) => {
            state.lastMouseX = e.clientX;
            state.lastMouseY = e.clientY;
        });

        // Smooth mouse tracking with lerp for smoother animation
        function smoothMouseMove() {
            const dx = state.lastMouseX - state.mouseX;
            const dy = state.lastMouseY - state.mouseY;

            state.mouseX += dx * 0.05; // Lerp factor
            state.mouseY += dy * 0.05;

            // Apply parallax to gradient orbs
            applyOrbParallax();

            requestAnimationFrame(smoothMouseMove);
        }

        smoothMouseMove();
    }

    /**
     * Applies parallax transformation to background gradient orbs based on mouse position
     */
    function applyOrbParallax() {
        const orbs = document.querySelectorAll('.gradient-orb');
        if (orbs.length === 0) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Calculate normalized mouse position (-1 to 1)
        const mouseX = (state.mouseX - centerX) / centerX;
        const mouseY = (state.mouseY - centerY) / centerY;

        orbs.forEach((orb, index) => {
            // Different parallax speeds for each orb (depth effect)
            const speed = [0.15, 0.1, 0.2][index] || 0.1;
            
            const translateX = mouseX * window.innerWidth * speed;
            const translateY = mouseY * window.innerHeight * speed;

            orb.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    }

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================================================

    /**
     * Initializes scroll-based reveal animations using Intersection Observer
     */
    function initScrollReveal() {
        if (!config.animationSettings.enableScrollReveal) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should be revealed on scroll
        const revealElements = document.querySelectorAll(
            '.clock-section, .welcome-section, footer, .time-zone-card, .feature-item'
        );

        revealElements.forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }

    // ==========================================================================
    // INTERACTIVE CARD EFFECTS
    // ==========================================================================

    /**
     * Initializes interactive effects for clock cards (tilt on hover, click to view)
     */
    function initCardInteractions() {
        const clockCards = document.querySelectorAll('.time-zone-card');

        clockCards.forEach(card => {
            // Tilt effect tracking
            card.addEventListener('mouseenter', handleCardEnter);
            card.addEventListener('mouseleave', handleCardLeave);
            card.addEventListener('mousemove', handleCardMove);
            
            // Click to show time in alert/tooltip
            card.addEventListener('click', handleCardClick);
        });
    }

    /**
     * Handles mouse enter on clock cards - adds hover state
     */
    function handleCardEnter(e) {
        state.isHoveringClocks = true;
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    }

    /**
     * Handles mouse leave on clock cards - resets transform
     */
    function handleCardLeave(e) {
        e.currentTarget.style.transform = '';
    }

    /**
     * Handles mouse move on card for subtle tilt effect
     */
    function handleCardMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on mouse position (subtle 3D effect)
        const rotateX = ((y / rect.height) - 0.5) * 4; // Max ±2deg
        const rotateY = ((x / rect.width) - 0.5) * -4;

        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    /**
     * Handles click on clock cards - shows time in custom tooltip or alert
     */
    function handleCardClick(e) {
        const card = e.currentTarget;
        const timezone = card.dataset.timezone || 'local';
        const timeElement = card.querySelector('.clock-display');
        
        if (timeElement) {
            // Show current time in a custom tooltip instead of alert for better UX
            showTimeTooltip(card, timeElement.textContent);
        }
    }

    /**
     * Shows a custom tooltip with the time when clicking on a clock card
     * @param {HTMLElement} card - The clicked card element
     * @param {string} timeText - Current time text to display
     */
    function showTimeTooltip(card, timeText) {
        // Check if tooltip already exists
        let tooltip = document.getElementById('time-tooltip');

        if (!tooltip) {
            // Create tooltip element
            tooltip = document.createElement('div');
            tooltip.id = 'time-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(10, 10, 18, 0.95);
                border: 2px solid var(--primary);
                border-radius: 16px;
                padding: 24px 32px;
                font-family: 'Orbitron', sans-serif;
                font-size: clamp(1.5rem, 3vw, 2.5rem);
                color: var(--text-primary);
                text-shadow: var(--glow-primary);
                z-index: 9999;
                pointer-events: none;
                animation: tooltipPop 0.3s ease-out forwards;
            `;

            // Add to body
            document.body.appendChild(tooltip);

            // Auto-hide after 2 seconds
            setTimeout(() => {
                if (tooltip && tooltip.parentNode) {
                    tooltip.style.animation = 'tooltipFade 0.3s ease-out forwards';
                    setTimeout(() => tooltip.remove(), 300);
                }
            }, 2500);

            // Click away to close
            document.addEventListener('click', function onClickAway(e) {
                if (!e.target.closest('.time-zone-card') && !e.target.closest('#time-tooltip')) {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.style.animation = 'tooltipFade 0.3s ease-out forwards';
                        setTimeout(() => tooltip.remove(), 300);
                        document.removeEventListener('click', onClickAway);
                    }
                }
            }, { once: false });

            // Add animation styles if not already present
            addTooltipAnimations();
        } else {
            // Reset animation
            tooltip.style.animation = 'tooltipPop 0.3s ease-out forwards';
        }

        // Position tooltip near the card
        const rect = card.getBoundingClientRect();
        const padding = 20;
        
        tooltip.style.left = `${Math.max(padding, Math.min(rect.right + 16, window.innerWidth - rect.width - padding))}px`;
        tooltip.style.top = `${Math.max(padding, Math.min(rect.bottom + 8, window.innerHeight - 50))}px`;
        tooltip.textContent = timeText;

        // Add click handler to close on next card click
        const handleClickOnNewCard = (e) => {
            if (e.target.closest('.time-zone-card') && e.target !== card) {
                if (tooltip && tooltip.parentNode) {
                    tooltip.style.animation = 'tooltipFade 0.3s ease-out forwards';
                    setTimeout(() => tooltip.remove(), 300);
                    document.removeEventListener('mousedown', handleClickOnNewCard);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOnNewCard, { once: true });
    }

    /**
     * Adds tooltip animation keyframes to the page if not already present
     */
    function addTooltipAnimations() {
        const existingStyle = document.getElementById('tooltip-animations');
        if (existingStyle) return;

        const style = document.createElement('style');
        style.id = 'tooltip-animations';
        style.textContent = `
            @keyframes tooltipPop {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes tooltipFade {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.95);
                }
            }
        `;

        document.head.appendChild(style);
    }

    // ==========================================================================
    // CURSOR EFFECTS
    // ==========================================================================

    /**
     * Initializes custom cursor effects when enabled in config
     */
    function initCursorEffects() {
        if (!config.animationSettings.cursorEffects) return;

        const cursor = createCustomCursor();
        
        document.addEventListener('mousemove', (e) => {
            animateCursor(cursor, e.clientX, e.clientY);
        });

        // Add click ripple effect
        document.addEventListener('click', (e) => {
            createRippleEffect(e.clientX, e.clientY);
        });
    }

    /**
     * Creates a custom cursor element
     */
    function createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background-color 0.3s;
            mix-blend-mode: difference;
        `;

        document.body.appendChild(cursor);
        return cursor;
    }

    /**
     * Animates custom cursor to follow mouse with slight delay for smoothness
     */
    function animateCursor(cursor, x, y) {
        // Smooth follow using requestAnimationFrame
        const currentLeft = parseFloat(cursor.style.left || 0);
        const currentTop = parseFloat(cursor.style.top || 0);

        cursor.style.left = `${currentLeft + (x - currentLeft) * 0.3}px`;
        cursor.style.top = `${currentTop + (y - currentTop) * 0.3}px`;
    }

    /**
     * Creates a ripple effect at click position
     */
    function createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 245, 255, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleEffect 0.6s ease-out forwards;
        `;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        document.body.appendChild(ripple);

        // Remove after animation completes
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Adds ripple effect keyframes to the page
     */
    function addRippleAnimations() {
        const existingStyle = document.getElementById('ripple-animations');
        if (existingStyle) return;

        const style = document.createElement('style');
        style.id = 'ripple-animations';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // ==========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================================================

    /**
     * Implements requestIdleCallback for non-critical initialization
     */
    function scheduleNonCriticalTasks() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                initCursorEffects();
                addRippleAnimations();
            });
        } else {
            // Fallback for older browsers
            setTimeout(initCursorEffects, 500);
            addRippleAnimations();
        }
    }

    /**
     * Debounces function calls to prevent excessive execution
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttles function calls to a maximum frequency
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================

    /**
     * Formats time with leading zeros
     */
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Gets current UTC offset in hours
     */
    function getUTCOffset() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const localDate = new Date(utc);
        return localDate.getHours() - now.getHours();
    }

    /**
     * Logs initialization status to console (easter egg)
     */
    function logInitializationStatus() {
        console.log('%c⚡ BARNES LAB PORTAL', 'color: #00f5ff; font-size: 24px; font-weight: bold;');
        console.log('%cHome Lab Portal — Where curiosity meets experimentation.', 'color: #a0a0b0; font-size: 14px;');
        console.log('%cVersion: 1.0.0', 'color: var(--primary); font-size: 12px;');
        
        // Log active features
        console.log('Active Features:', {
            parallax: config.animationSettings.enableParallax,
            scrollReveal: config.animationSettings.enableScrollReveal,
            cursorEffects: config.animationSettings.cursorEffects
        });

        // Console command to toggle features (easter egg)
        window.toggleBarnesFeatures = function() {
            config.animationSettings.enableParallax = !config.animationSettings.enableParallax;
            config.animationSettings.cursorEffects = !config.animationSettings.cursorEffects;
            console.log('Toggled Barnes Lab features:', JSON.stringify(config.animationSettings, null, 2));
        };

        console.log('%cType toggleBarnesFeatures() in console to toggle effects.', 'color: #00ff88; font-size: 11px;');
    }

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    /**
     * Main initialization function - called when DOM is ready
     */
    function init() {
        console.time('Barnes Lab Portal Initialization');

        // Start clock immediately, then update on interval
        updateAllClocks();
        setInterval(updateAllClocks, config.updateInterval);

        // Initialize all modules
        initParallaxEffects();
        initScrollReveal();
        initCardInteractions();
        
        // Schedule non-critical tasks
        scheduleNonCriticalTasks();

        // Log status (developer easter egg)
        logInitializationStatus();

        console.timeEnd('Barnes Lab Portal Initialization');
    }

    /**
     * Wait for DOM to be ready before initializing
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready, initialize immediately
        init();
    }

})();

/**
 * =============================================================================
 * END OF SCRIPTS
 * 
 * To customize behavior:
 * - Edit the config object at the top of this file
 * - Modify individual functions for specific behaviors
 * - Add new features following the existing pattern
 * 
 * For debugging, open browser DevTools and look for "Barnes Lab Portal" logs.
 * =============================================================================
 */
