// nav와 footer는 partials/ 안에서 한 번만 정의하고 모든 페이지가 공유합니다.
// 각 페이지의 <div id="nav-placeholder"> / <div id="footer-placeholder">를 실제 마크업으로 교체합니다.
async function loadPartial(placeholderId, path) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(path);
        placeholder.outerHTML = await response.text();
    } catch (err) {
        console.error(`${path} 로드 실패:`, err);
    }
}

async function loadLayout() {
    await Promise.all([
        loadPartial('nav-placeholder', 'partials/nav.html'),
        loadPartial('footer-placeholder', 'partials/footer.html'),
    ]);

    // 현재 페이지에 해당하는 메뉴 항목을 강조합니다.
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links > li > a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown.querySelector(`.dropdown-content a[href="${currentPage}"]`)) {
            const label = dropdown.querySelector('.dropdown-label');
            if (label) label.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();

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
    // YouTube Lightbox (data-youtube-id를 가진 링크에 적용)
    const videoLinks = document.querySelectorAll('[data-youtube-id]');
    if (videoLinks.length) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-frame">
                <button class="video-modal-close" type="button" aria-label="닫기">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        document.body.appendChild(modal);

        const frame = modal.querySelector('.video-modal-frame');
        const closeButton = modal.querySelector('.video-modal-close');
        let iframe = null;
        let lastFocused = null;

        const openModal = (videoId, startSeconds) => {
            const params = new URLSearchParams({ autoplay: '1', rel: '0' });
            if (startSeconds) {
                params.set('start', startSeconds);
            }
            iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?${params}`;
            iframe.title = 'YouTube video player';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            frame.appendChild(iframe);

            lastFocused = document.activeElement;
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            // visibility가 실제로 visible이 된 다음 프레임에서 포커스를 옮깁니다.
            requestAnimationFrame(() => closeButton.focus());
        };

        const closeModal = () => {
            if (!modal.classList.contains('active')) {
                return;
            }
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            // iframe을 제거해야 재생이 완전히 멈춥니다.
            if (iframe) {
                iframe.remove();
                iframe = null;
            }
            if (lastFocused) {
                lastFocused.focus();
            }
        };

        videoLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Ctrl/Cmd/가운데 클릭은 새 탭으로 열리도록 그대로 둡니다.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
                    return;
                }
                e.preventDefault();
                openModal(this.dataset.youtubeId, this.dataset.youtubeStart);
            });
        });

        // 유튜브 창 밖(어두운 배경)을 클릭하면 닫힙니다.
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                closeModal();
            }
        });
        closeButton.addEventListener('click', closeModal);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

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
