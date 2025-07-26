// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Mobile Menu Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Smooth Scrolling for Navigation Links - Fixed implementation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (navToggle) {
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

// Initialize smooth scrolling
setupSmoothScrolling();

// Navbar Scroll Effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class for styling
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current section's nav link
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Contact Form Submission - Fixed implementation
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic form validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Create mailto link with form data
            const mailtoLink = `mailto:krishnameghwal635@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`
            )}`;
            
            // Open email client
            window.open(mailtoLink, '_blank');
            
            showNotification('Thank you for your message! Your email client should open now.', 'success');
            
            // Reset form
            this.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system - Enhanced
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Set base styles
    const baseStyles = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        font-family: var(--font-family-base);
        font-size: 14px;
        line-height: 1.5;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    // Set type-specific styles
    let bgColor, textColor;
    switch(type) {
        case 'success':
            bgColor = '#10B981';
            textColor = '#FFFFFF';
            break;
        case 'error':
            bgColor = '#EF4444';
            textColor = '#FFFFFF';
            break;
        default:
            bgColor = '#3B82F6';
            textColor = '#FFFFFF';
    }
    
    notification.style.cssText = baseStyles + `background: ${bgColor}; color: ${textColor};`;
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: ${textColor}; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Resume Download Function - Fixed implementation
function downloadResume() {
    try {
        // Create resume content
        const resumeContent = generateResumeContent();
        const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // Create temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Krishna_Meghwal_Resume.txt';
        link.style.display = 'none';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
        showNotification('Resume download started successfully!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed. Please try again.', 'error');
    }
}

// Make downloadResume function globally available
window.downloadResume = downloadResume;

// Generate resume content
function generateResumeContent() {
    return `KRISHNA MEGHWAL
Software Engineer | Full Stack Developer

Contact Information:
Email: krishnameghwal635@gmail.com
Phone: +91-8278649874
Location: Jaipur, Rajasthan
LinkedIn: https://www.linkedin.com/in/krishna-meghwal
GitHub: https://github.com/point8290

PROFILE SUMMARY:
Accomplishment-driven and solutions-focused professional offering 4+ years of experience; targeting senior-level job roles in Software Engineering (Full stack Development) with an esteemed organization. Gained hands-on exposure in Web application development using ReactJS, state management using Redux, Redux tool-kit, React Query, and implementing dynamic features in Hybrid mobile applications for iOS and Android using Cordova with Salesforce Mobile SDK.

CORE COMPETENCIES:
• Full stack Development
• Application Development Lifecycle
• Mobile Development
• State Management
• Database Integration
• Agile Methodology
• Requirement Analysis
• Unit Testing
• Troubleshooting & Debugging

TECHNICAL SKILLS:
Frontend: React.js, HTML/CSS, Material UI, TailwindCSS, Bootstrap, Browser APIs, Local Storage, Session Storage, WebSocket API, Chrome/Safari Dev Tools
Backend: Node.js, Express.js, GraphQL, REST APIs development
Databases: MongoDB, MySQL, PostgreSQL
State Management: Redux, Redux-toolkit, React Query, Zustand
Programming Languages: JavaScript, TypeScript, Python
Tools: Xcode, Android Studio, Git/GitHub, SVN, Docker, AWS

WORK EXPERIENCE:

Software Engineer | Metacube Software | February 2021 – Present | Jaipur
• Spearheaded the development of a web application using ReactJS, ensuring seamless integration with MongoDB, PostgreSQL and MySQL databases
• Implemented Authentication using Libraries like PassportJS and cloud platforms like Firebase
• Integrated third party payment integration for platforms like Phonepe
• Developed a Hybrid mobile application using Cordova, and Salesforce Mobile SDK
• Managed API responses and created dynamic UI components for effective content presentation
• Conducted thorough debugging to solve defects, resulting in significant performance improvements
• Automated team tasks through BASH and Node.js scripts, enhancing overall workflow and development cycle efficiency
• Served as a lead developer, providing mentorship to junior team members and collaborating with the project manager

Python Developer Intern | FoodVybe Pvt. Ltd. | December 2020 - February 2021 | Noida
• Developed Python scripts leveraging PyMongo, Pandas, BeautifulSoup, and Requests for seamless data migrations and web scraping tasks
• Optimized code efficiency through the implementation of Python multithreading and multiprocessing modules
• Used AWS SDK for Python (Boto3) to upload and retrieve data from S3 buckets
• Developed microservices using AWS Lambda, contributing to streamlined and scalable architecture
• Applied machine learning expertise by training language models using GPT-2

EDUCATION:
B.Tech. in Computer Science Engineering
JECRC University, Jaipur, Rajasthan
2018 – 2021

CERTIFICATIONS:
• Full Stack Development with React & Node JS - GeeksForGeeks
• The Ultimate React Course 2024: React, Redux - Udemy (Jonas Schmedtmann)
• Become a certified Web Developer from Scratch - Eduonix
• Algorithmic Toolbox - University of San Diego on Coursera
• Python Intermediate - Hacker Rank
• Introduction to Cybersecurity - New York University on Coursera (Dr. Edward G. Amoroso)

LANGUAGES:
English, Hindi`;
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function createScrollToTopButton() {
    // Check if button already exists
    if (document.querySelector('.scroll-to-top')) {
        return;
    }
    
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.onclick = scrollToTop;
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    const btnStyles = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #218B8C;
        color: white;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    scrollBtn.style.cssText = btnStyles;
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
}

// Intersection Observer for animations
function setupScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .certification-card, .timeline-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Typing effect for hero title
function createTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '2px solid #218B8C';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                titleElement.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Fix social media links
function fixSocialLinks() {
    // Update LinkedIn link
    const linkedinLink = document.querySelector('a[href="https://www.linkedin.com/in/krishna-meghwal"]');
    if (linkedinLink) {
        linkedinLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, '_blank', 'noopener,noreferrer');
        });
    }
    
    // Update GitHub link
    const githubLink = document.querySelector('a[href="https://github.com/point8290"]');
    if (githubLink) {
        githubLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, '_blank', 'noopener,noreferrer');
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    setupScrollAnimations();
    
    // Create scroll to top button
    createScrollToTopButton();
    
    // Add typing effect to hero title
    createTypingEffect();
    
    // Fix social media links
    fixSocialLinks();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && navMenu) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        }
    });
    
    // Add focus management for accessibility
    navLinks.forEach(link => {
        link.addEventListener('focus', () => {
            if (window.innerWidth <= 768 && navMenu && !navMenu.classList.contains('active')) {
                navMenu.classList.add('active');
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
            }, 0);
        });
    }
}