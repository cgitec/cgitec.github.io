document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .section-title, .hero-content').forEach(el => {
        el.style.opacity = '0'; // Initial state
        observer.observe(el);
    });
    // Contact Form Handling (Google Apps Script)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerText;
            submitButton.innerText = 'Sending...';
            submitButton.disabled = true;

            // TODO: Google Apps Script 배포 후 생성된 URL을 아래에 입력하세요.
            // 예: const scriptURL = 'https://script.google.com/macros/s/AKfycbx.../exec';
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwm-vFzqnaJb7of9Rhs8Nc4aiV5kh9qdDLi6ueHvmJeX53J5V67hUP75cCy3Wfvo8c4/exec';

            const formData = new FormData(this);
            const data = new URLSearchParams();
            for (const pair of formData) {
                data.append(pair[0], pair[1]);
            }

            fetch(scriptURL, {
                method: 'POST',
                body: data
            })
                .then(response => {
                    if (response.ok) {
                        alert('문의가 성공적으로 발송되었습니다!');
                        contactForm.reset();
                    } else {
                        alert('발송 중 오류가 발생했습니다. 다시 시도해주세요.');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('발송 중 오류가 발생했습니다. 다시 시도해주세요.');
                })
                .finally(() => {
                    submitButton.innerText = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }
});
