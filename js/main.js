/**
 * Main Interactive Logic for Candy Catering Website (Reorganized Structure)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Prefix Resolution based on script tag src path
    const scriptTag = document.querySelector('script[src*="main.js"]');
    let prefix = '';
    if (scriptTag) {
        const src = scriptTag.getAttribute('src');
        const index = src.indexOf('js/main.js');
        if (index >= 0) {
            prefix = src.substring(0, index);
        }
    }

    // Render Header and Footer templates if placeholders exist
    // (Disabled: Header and Footer are now statically included in HTML for better SEO)
    /*
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const isTransparent = headerPlaceholder.getAttribute('data-transparent') === 'true';
        const headerClass = isTransparent 
            ? "fixed top-0 left-0 w-full z-50 transition-all duration-300 header-transparent shadow-none" 
            : "sticky top-0 z-50 bg-surface dark:bg-surface-container shadow-sm dark:shadow-none transition-all duration-300 w-full";
        
        headerPlaceholder.outerHTML = `
        <header class="${headerClass}" id="main-header">
            ...
        </header>
        `;
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = `
        <footer class="footer">
            ...
        </footer>
        `;
    }
    */

    const navLinksMap = {
        'Trang chủ': prefix + 'index.html',
        'Dịch vụ': prefix + 'services/index.html',
        'Thư viện': prefix + 'gallery/index.html',
        'Báo giá': prefix + 'pricing/index.html',
        'Tin tức': prefix + 'blog/index.html',
        'Liên hệ': prefix + 'contact/index.html'
    };

    // Correct logo links to point to home page
    const logoLinks = document.querySelectorAll('header a.font-display-lg, nav a.font-display-lg, header a.font-headline-xl, nav a.font-headline-xl, footer a.font-display-lg');
    logoLinks.forEach(logo => {
        logo.setAttribute('href', prefix + 'index.html');
    });

    // Determine active menu item based on current pathname
    const path = window.location.pathname;
    let activeKey = 'Trang chủ';
    if (path.includes('/services/')) activeKey = 'Dịch vụ';
    else if (path.includes('/gallery/')) activeKey = 'Thư viện';
    else if (path.includes('/pricing/')) activeKey = 'Báo giá';
    else if (path.includes('/blog/')) activeKey = 'Tin tức';
    else if (path.includes('/contact/')) activeKey = 'Liên hệ';

    // Find and update all navigation anchors (Desktop & Mobile)
    const updateNavLinks = (container) => {
        if (!container) return;
        const anchors = container.querySelectorAll('a');
        anchors.forEach(a => {
            const text = a.textContent.trim();
            if (navLinksMap[text]) {
                const targetFile = navLinksMap[text];
                a.setAttribute('href', targetFile);

                // Highlight active state
                if (text === activeKey) {
                    a.className = "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-label-bold text-label-bold hover:text-primary transition-colors scale-95 duration-200";
                    a.setAttribute('aria-current', 'page');
                } else {
                    a.className = "text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-bold text-label-bold scale-95 duration-200";
                    a.removeAttribute('aria-current');
                }
            }
        });
    };

    // Update all existing desktop menu elements
    const desktopNavContainers = document.querySelectorAll('.hidden.md\\:flex');
    desktopNavContainers.forEach(updateNavLinks);

    // Update links in footer
    const footers = document.querySelectorAll('footer');
    footers.forEach(footer => {
        const footerAnchors = footer.querySelectorAll('a');
        footerAnchors.forEach(a => {
            const text = a.textContent.trim();
            if (navLinksMap[text]) {
                a.setAttribute('href', navLinksMap[text]);
            }
        });
    });

    // Correct CTAs (Nhận báo giá / Xem dịch vụ) links
    const ctaButtons = document.querySelectorAll('button');
    ctaButtons.forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Nhận báo giá') || text.includes('báo giá miễn phí') || text.includes('Đặt tiệc ngay')) {
            btn.addEventListener('click', () => {
                window.location.href = prefix + 'pricing/index.html';
            });
        } else if (text.includes('Xem dịch vụ') || text.includes('Chi tiết')) {
            btn.addEventListener('click', () => {
                window.location.href = prefix + 'services/index.html';
            });
        }
    });

    // Redirect news card to detail page dynamically
    const featuredArticles = document.querySelectorAll('article');
    featuredArticles.forEach(article => {
        const h2 = article.querySelector('h2');
        const h3 = article.querySelector('h3');
        const readMore = article.querySelector('a');

        if (readMore) {
            const href = readMore.getAttribute('href');
            if (href && href !== '#') {
                const goToDetail = (e) => {
                    e.preventDefault();
                    window.location.href = href;
                };

                if (h2) h2.addEventListener('click', goToDetail);
                if (h3) h3.addEventListener('click', goToDetail);
                readMore.addEventListener('click', goToDetail);
                
                // Let the entire card block be clickable except for nested elements
                article.style.cursor = 'pointer';
                article.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                        window.location.href = href;
                    }
                });
            }
        }
    });


    // 2. Dynamic Mobile Menu Drawer
    const setupMobileMenu = () => {
        const mobileToggleBtns = document.querySelectorAll('button[aria-label="Toggle Menu"], button.md\\:hidden');
        if (mobileToggleBtns.length === 0) return;

        // Create Drawer Container if not exists
        let drawer = document.getElementById('mobile-menu-drawer');
        let backdrop = document.getElementById('mobile-menu-backdrop');
        
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'mobile-menu-drawer';
            drawer.className = 'fixed inset-y-0 right-0 z-[100] w-64 bg-surface dark:bg-surface-container shadow-2xl transform translate-x-full opacity-0 transition-all duration-300 ease-in-out border-l border-outline-variant/30 flex flex-col p-6';
            
            backdrop = document.createElement('div');
            backdrop.id = 'mobile-menu-backdrop';
            backdrop.className = 'fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300';
            
            const drawerHeader = document.createElement('div');
            drawerHeader.className = 'flex justify-between items-center mb-8 border-b border-outline-variant/20 pb-4';
            
            const drawerTitle = document.createElement('span');
            drawerTitle.className = 'font-display-lg text-lg font-bold text-primary';
            drawerTitle.textContent = 'Candy Catering';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'text-secondary hover:text-primary focus:outline-none';
            closeBtn.innerHTML = '<span class="material-symbols-outlined text-2xl">close</span>';
            
            drawerHeader.appendChild(drawerTitle);
            drawerHeader.appendChild(closeBtn);
            drawer.appendChild(drawerHeader);

            const drawerNav = document.createElement('nav');
            drawerNav.className = 'flex flex-col gap-5 flex-grow';
            
            Object.entries(navLinksMap).forEach(([text, file]) => {
                const link = document.createElement('a');
                link.href = file;
                link.className = 'text-lg font-label-bold py-2 border-b border-outline-variant/10 hover:text-primary transition-colors';
                link.textContent = text;
                
                if (text === activeKey) {
                    link.classList.add('text-primary');
                    link.classList.add('font-bold');
                } else {
                    link.classList.add('text-secondary');
                }
                drawerNav.appendChild(link);
            });

            const mobileInquiryBtn = document.createElement('button');
            mobileInquiryBtn.className = 'mt-auto bg-primary-container text-on-primary w-full py-4 rounded-xl font-label-bold text-label-bold hover:brightness-95 transition-all shadow-md';
            mobileInquiryBtn.textContent = 'Nhận báo giá ngay';
            mobileInquiryBtn.addEventListener('click', () => {
                closeMenu();
                window.location.href = prefix + 'pricing/index.html';
            });
            
            drawer.appendChild(drawerNav);
            drawer.appendChild(mobileInquiryBtn);

            document.body.appendChild(backdrop);
            document.body.appendChild(drawer);

            const openMenu = () => {
                drawer.classList.add('mobile-drawer-open');
                backdrop.classList.remove('pointer-events-none');
                backdrop.classList.add('opacity-100');
                document.body.classList.add('overflow-hidden-mobile');
            };

            const closeMenu = () => {
                drawer.classList.remove('mobile-drawer-open');
                backdrop.classList.add('pointer-events-none');
                backdrop.classList.remove('opacity-100');
                document.body.classList.remove('overflow-hidden-mobile');
            };

            mobileToggleBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMenu();
                });
            });

            closeBtn.addEventListener('click', closeMenu);
            backdrop.addEventListener('click', closeMenu);
        }
    };
    setupMobileMenu();

    // 3. Header Scroll Shadow Transition
    const header = document.querySelector('header, nav.sticky, #main-header');
    if (header) {
        const isTransparent = header.classList.contains('header-transparent');
        
        const handleScroll = () => {
            if (window.scrollY > 30) {
                if (isTransparent) {
                    header.classList.remove('header-transparent');
                    header.classList.remove('shadow-none');
                    header.classList.add('bg-surface', 'shadow-md');
                } else {
                    header.classList.add('shadow-md');
                    header.classList.remove('shadow-sm');
                }
            } else {
                if (isTransparent) {
                    header.classList.add('header-transparent');
                    header.classList.add('shadow-none');
                    header.classList.remove('bg-surface', 'shadow-md');
                } else {
                    header.classList.remove('shadow-md');
                    header.classList.add('shadow-sm');
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        // Run once on load in case page is already scrolled
        handleScroll();
    }

    // 4. Loading Screen Logic
    const hideLoadingScreen = () => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 800);
        }
    };
    hideLoadingScreen();

    // 5. Inject Floating Buttons Dynamically
    const setupFloatingButtons = () => {
        if (document.getElementById('floating-buttons-container')) return;

        const container = document.createElement('div');
        container.id = 'floating-buttons-container';
        container.className = 'floating-buttons';

        container.innerHTML = `
            <a href="#" class="float-btn top-btn" id="backToTop" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">
                <span class="material-symbols-outlined text-2xl">arrow_upward</span>
                <span class="tooltip">Lên đầu trang</span>
            </a>
            <a href="https://www.messenger.com/t/1576062102666875" target="_blank" class="float-btn messenger-btn" title="Messenger">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-6 h-6">
                    <path d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"/>
                </svg>
                <span class="tooltip">Messenger</span>
            </a>
            <a href="https://zalo.me/0969166453" target="_blank" class="float-btn zalo-btn">
                <img src="${prefix}imgs/zalo.png" alt="Zalo" class="w-full h-full object-contain rounded-full">
                <span class="tooltip">Zalo: 0969166453</span>
            </a>
            <a href="https://ai.tiecluudongcandy.site/" target="_blank" class="float-btn ai-btn">
                <span class="material-symbols-outlined text-2xl">smart_toy</span>
                <span class="tooltip">Chat với AI</span>
            </a>
            <a href="tel:0969166453" class="float-btn phone-btn">
                <span class="material-symbols-outlined text-2xl">call</span>
                <span class="tooltip">Gọi ngay: 0969 166 453 / 0978 902 394</span>
            </a>
        `;
        document.body.appendChild(container);

        const backToTopBtn = container.querySelector('#backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    };
    setupFloatingButtons();

    // 6. Hero Slider (Homepage only)
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 7. Testimonials Slider (Homepage only)
    const testimonials = [
        { text: '"Tiệc bánh trà của Candy rất đẹp và ngon! Mọi người trong công ty đều rất ấn tượng. Setup sang trọng, bánh tươi ngon, phục vụ chu đáo. Chắc chắn sẽ đặt lại!"', name: 'Chị Anh Thư', role: 'HR Manager — Công ty ABC', avatar: 'A' },
        { text: '"Mình đặt set tiệc sinh nhật cho con, Candy setup đẹp lung linh luôn! Bánh ngon, trình bày rất bắt mắt. Khách đến ai cũng khen. 10 điểm!"', name: 'Chị Minh Ngọc', role: 'Khách hàng cá nhân', avatar: 'M' },
        { text: '"Chuyên nghiệp từ khâu tư vấn đến setup. Sự kiện ra mắt sản phẩm của công ty mình được Candy lo phần tea break hoàn hảo. Recommend mạnh!"', name: 'Anh Hùng Nguyễn', role: 'Marketing Director — Startup XYZ', avatar: 'H' },
        { text: '"Giá rất hợp lý so với chất lượng. Bánh ngọt tươi, trái cây đẹp, trang trí hoa thật sang. Candy đúng là lựa chọn tuyệt vời cho tea break!"', name: 'Chị Thu Hà', role: 'Office Manager — Công ty DEF', avatar: 'T' }
    ];
    let currentTestimonial = 0;
    const testimonialCard = document.getElementById('testimonialCard');
    if (testimonialCard) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            const t = testimonials[currentTestimonial];
            testimonialCard.style.opacity = '0';
            testimonialCard.style.transform = 'translateY(15px)';
            setTimeout(() => {
                const textEl = document.getElementById('testimonialText');
                const nameEl = document.getElementById('testimonialName');
                const roleEl = document.getElementById('testimonialRole');
                const avatarEl = document.getElementById('testimonialAvatar');
                if (textEl) textEl.textContent = t.text;
                if (nameEl) nameEl.textContent = t.name;
                if (roleEl) roleEl.textContent = t.role;
                if (avatarEl) avatarEl.textContent = t.avatar;
                testimonialCard.style.opacity = '1';
                testimonialCard.style.transform = 'translateY(0)';
            }, 300);
        }, 6000);
    }

    // 8. Scroll animations observer
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        fadeObserver.observe(el);
    });

    // 9. Gallery Data Definitions (77 images)
    const validImageIds = [3, 4, 5, 10, 12, 13, 14, 15, 16, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 37, 38, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 87, 88, 89, 90, 91, 92, 94, 95, 96, 98];
    
    const getCategoryFromId = (id) => {
        const teabreakIds = [3, 4, 5, 10, 12, 13, 15, 23, 24, 26, 27, 28, 29, 43, 44, 45, 48, 49, 50, 51, 54, 56, 57, 59, 62, 63, 64, 69, 71, 72, 73, 75, 77, 78, 79, 81, 82, 85, 86, 88, 89, 90, 91, 98];
        const openingIds = [14, 16, 19, 21, 22, 25, 41, 46, 47, 52, 53, 58, 60, 61, 65, 66, 68, 74, 76, 80, 83, 87, 92, 94, 95, 96];
        const birthdayIds = [30, 31, 33, 34, 35, 37, 38];
        
        if (birthdayIds.includes(id)) return 'birthday';
        if (openingIds.includes(id)) return 'opening';
        if (teabreakIds.includes(id)) return 'teabreak';
        return 'events'; // Rest are events
    };

    const CATEGORY_NAMES = {
        'teabreak': 'Tea Break',
        'opening': 'Khai Trương',
        'birthday': 'Sinh Nhật',
        'events': 'Sự kiện công ty'
    };

    const getTitleFromCategory = (cat, id) => {
        if (cat === 'birthday') return `Tiệc Sinh Nhật Bé - Candy ${id}`;
        if (cat === 'opening') return `Tiệc Khai Trương Showroom - Candy ${id}`;
        if (cat === 'teabreak') return `Tiệc Trà Teabreak Cao Cấp - Candy ${id}`;
        return `Sự Kiện Hội Nghị Doanh Nghiệp - Candy ${id}`;
    };

    const allImages = validImageIds.map((id, index) => {
        const category = getCategoryFromId(id);
        return {
            id: id,
            src: `${prefix}imgs/tiec-teabreak-ha-noi-candy-${id}.webp`,
            alt: `Hình ảnh tiệc teabreak bánh trà sự kiện tại Hà Nội - Candy ${id}`,
            title: getTitleFromCategory(category, id),
            category: category,
            index: index
        };
    });

    // 10. Gallery dynamic rendering logic (on gallery page)
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        let currentFilter = 'all';
        let currentPage = 0;
        const INITIAL_PAGE_SIZE = 12;
        const MORE_PAGE_SIZE = 24;
        let filteredImages = [];

        // Set up lazy loader IntersectionObserver
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                        imgObserver.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0 });

        const renderGallery = (reset = false) => {
            if (reset) {
                galleryGrid.innerHTML = '';
                currentPage = 0;
            }
            
            filteredImages = currentFilter === 'all' 
                ? allImages 
                : allImages.filter(img => img.category === currentFilter);
            
            const start = currentPage === 0 ? 0 : INITIAL_PAGE_SIZE + (currentPage - 1) * MORE_PAGE_SIZE;
            const pageSize = currentPage === 0 ? INITIAL_PAGE_SIZE : MORE_PAGE_SIZE;
            const end = Math.min(start + pageSize, filteredImages.length);
            const pageImages = filteredImages.slice(start, end);
            
            const fragment = document.createDocumentFragment();
            pageImages.forEach((img) => {
                const item = document.createElement('div');
                item.className = 'gallery-item break-inside-avoid mb-6 masonry-item group relative overflow-hidden rounded-xl shadow-[0px_8px_24px_rgba(136,14,79,0.08)] bg-surface-container-lowest cursor-pointer';
                
                item.addEventListener('click', () => {
                    openLightbox(img.index);
                });

                item.innerHTML = `
                    <div class="w-full overflow-hidden">
                        <img class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                             src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 4 3'%2F%3E" 
                             data-src="${img.src}" 
                             alt="${img.alt}">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                        <span class="text-on-primary font-label-bold text-label-bold mb-2 uppercase tracking-wider">${CATEGORY_NAMES[img.category]}</span>
                        <h3 class="text-on-primary font-headline-md text-headline-md text-lg">${img.title}</h3>
                    </div>
                `;
                fragment.appendChild(item);
            });
            
            galleryGrid.appendChild(fragment);
            
            // Staggered animation
            const newItems = galleryGrid.querySelectorAll('.masonry-item:not(.visible-init)');
            requestAnimationFrame(() => {
                newItems.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('visible-init');
                    }, 40 * i);
                });
            });
            
            // Lazy load images
            const images = galleryGrid.querySelectorAll('img[data-src]');
            images.forEach(img => imgObserver.observe(img));
            
            currentPage++;
            
            // Update counter
            const shown = start + pageImages.length;
            const shownCountEl = document.getElementById('galleryShownCount');
            if (shownCountEl) shownCountEl.textContent = shown;
            
            // Update load more button
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                if (shown >= filteredImages.length) {
                    loadMoreBtn.innerHTML = '<span class="material-symbols-outlined mr-2">check</span> Đã Xem Hết';
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.style.opacity = '0.5';
                } else {
                    const remaining = filteredImages.length - shown;
                    loadMoreBtn.innerHTML = `<span class="material-symbols-outlined mr-2">images</span> Xem Thêm (còn ${remaining} ảnh)`;
                    loadMoreBtn.disabled = false;
                    loadMoreBtn.style.opacity = '1';
                }
            }
        };

        // Attach filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderGallery(true);
            });
        });

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                renderGallery(false);
            });
        }

        // Render first batch
        renderGallery(true);
    }

    // 11. Lightbox Slider
    let lightboxIndex = 0;
    
    const setupLightbox = () => {
        // Create Modal HTML if not exists
        let modal = document.getElementById('lightbox-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'lightbox-modal';
            modal.className = 'fixed inset-0 z-[200] hidden bg-black/95 flex flex-col justify-between items-center py-8 px-4 select-none';
            
            modal.innerHTML = `
                <button id="lightbox-close" class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none">
                    <span class="material-symbols-outlined text-4xl">close</span>
                </button>
                <button id="lightbox-prev" class="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 p-3 rounded-full focus:outline-none">
                    <span class="material-symbols-outlined text-3xl">chevron_left</span>
                </button>
                <button id="lightbox-next" class="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 p-3 rounded-full focus:outline-none">
                    <span class="material-symbols-outlined text-3xl">chevron_right</span>
                </button>
                <div class="flex-grow flex items-center justify-center max-w-4xl max-h-[75vh] w-full mt-10">
                    <img id="lightbox-img" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300" src="" alt="Gallery Image">
                </div>
                <div class="text-center text-white/90 mt-4">
                    <p id="lightbox-caption" class="font-label-bold text-lg mb-2"></p>
                    <p id="lightbox-counter" class="text-sm text-white/50"></p>
                </div>
            `;
            document.body.appendChild(modal);

            const imgEl = modal.querySelector('#lightbox-img');
            const captionEl = modal.querySelector('#lightbox-caption');
            const counterEl = modal.querySelector('#lightbox-counter');
            const closeBtn = modal.querySelector('#lightbox-close');
            const prevBtn = modal.querySelector('#lightbox-prev');
            const nextBtn = modal.querySelector('#lightbox-next');

            const showImage = (index) => {
                if (index < 0) index = allImages.length - 1;
                if (index >= allImages.length) index = 0;
                
                lightboxIndex = index;
                const currentImg = allImages[lightboxIndex];
                
                imgEl.style.opacity = 0;
                setTimeout(() => {
                    imgEl.setAttribute('src', currentImg.src);
                    captionEl.textContent = currentImg.title;
                    counterEl.textContent = `${lightboxIndex + 1} / ${allImages.length}`;
                    imgEl.style.opacity = 1;
                }, 150);

                // Preload adjacent images
                const preloadNext = allImages[(lightboxIndex + 1) % allImages.length];
                const preloadPrev = allImages[(lightboxIndex - 1 + allImages.length) % allImages.length];
                [preloadNext, preloadPrev].forEach(p => { if (p) new Image().src = p.src; });
            };

            window.openLightbox = (index) => {
                showImage(index);
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden-mobile');
            };

            window.openLightboxBySrc = (src) => {
                const cleanedSrc = src.substring(src.lastIndexOf('/') + 1);
                const matchedIdx = allImages.findIndex(img => img.src.includes(cleanedSrc));
                if (matchedIdx >= 0) {
                    window.openLightbox(matchedIdx);
                } else {
                    imgEl.setAttribute('src', src);
                    captionEl.textContent = 'Hình ảnh sự kiện thực tế';
                    counterEl.textContent = '1 / 1';
                    modal.classList.remove('hidden');
                    document.body.classList.add('overflow-hidden-mobile');
                }
            };

            const closeLightbox = () => {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden-mobile');
            };

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(lightboxIndex + 1);
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(lightboxIndex - 1);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.id === 'lightbox-close' || e.target.closest('#lightbox-close')) {
                    closeLightbox();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (modal.classList.contains('hidden')) return;
                
                if (e.key === 'ArrowRight') {
                    showImage(lightboxIndex + 1);
                } else if (e.key === 'ArrowLeft') {
                    showImage(lightboxIndex - 1);
                } else if (e.key === 'Escape') {
                    closeLightbox();
                }
            });
        }
    };
    setupLightbox();

    // 12. Support clicking images in collapsible customer events
    const attachEventImageListeners = () => {
        const eventImages = document.querySelectorAll('.event-gallery .gallery-item img');
        eventImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            const parentItem = img.closest('.gallery-item');
            const handler = (e) => {
                e.stopPropagation();
                const src = img.getAttribute('src');
                if (window.openLightboxBySrc) {
                    window.openLightboxBySrc(src);
                }
            };
            img.addEventListener('click', handler);
            if (parentItem) {
                const overlay = parentItem.querySelector('.gallery-overlay');
                if (overlay) {
                    overlay.style.cursor = 'zoom-in';
                    overlay.addEventListener('click', handler);
                }
            }
        });
    };
    attachEventImageListeners();

    // Collapsible Events Toggle logic
    window.toggleEvent = function(header) {
        const body = header.nextElementSibling;
        const toggleBtn = header.querySelector('.event-toggle span');
        if (body) {
            body.classList.toggle('hidden');
            body.classList.toggle('open');
        }
        if (toggleBtn) {
            if (body && body.classList.contains('open')) {
                toggleBtn.textContent = 'expand_less';
            } else {
                toggleBtn.textContent = 'expand_more';
            }
        }
    };

    // Load More & Collapse Events Section (Show 3 initially)
    const INITIAL_EVENTS = 3;
    let currentVisibleEvents = INITIAL_EVENTS;

    window.initEventsLoadMore = function() {
        const events = document.querySelectorAll('#events .event-card');
        const wrap = document.getElementById('loadMoreEventsWrap');
        const loadMoreBtn = document.getElementById('loadMoreEventsBtn');
        const collapseBtn = document.getElementById('collapseEventsBtn');
        
        if (!events.length) return;
        
        events.forEach((ev, i) => {
            if (i >= currentVisibleEvents) {
                ev.style.display = 'none';
                ev.classList.remove('visible'); 
            } else {
                ev.style.display = 'block';
                ev.classList.add('visible');
            }
        });

        if (wrap && loadMoreBtn && collapseBtn) {
            if (events.length <= currentVisibleEvents) {
                wrap.style.display = 'none';
            } else {
                wrap.style.display = 'block';
                loadMoreBtn.style.display = 'inline-flex';
                collapseBtn.style.display = 'none';
            }
        }
    };

    window.loadMoreEvents = function() {
        const events = document.querySelectorAll('#events .event-card');
        const loadMoreBtn = document.getElementById('loadMoreEventsBtn');
        const collapseBtn = document.getElementById('collapseEventsBtn');
        
        currentVisibleEvents = events.length;
        
        events.forEach((ev, i) => {
            if (i < currentVisibleEvents && ev.style.display === 'none') {
                ev.style.display = 'block';
                void ev.offsetWidth; 
                ev.classList.add('visible');
            }
        });

        if (loadMoreBtn && collapseBtn) {
            loadMoreBtn.style.display = 'none';
            collapseBtn.style.display = 'inline-flex';
        }
    };

    window.collapseEvents = function() {
        const events = document.querySelectorAll('#events .event-card');
        const loadMoreBtn = document.getElementById('loadMoreEventsBtn');
        const collapseBtn = document.getElementById('collapseEventsBtn');
        
        currentVisibleEvents = INITIAL_EVENTS;
        
        events.forEach((ev, i) => {
            if (i >= currentVisibleEvents) {
                ev.style.display = 'none';
                ev.classList.remove('visible');
                const body = ev.querySelector('.event-body');
                const toggleBtn = ev.querySelector('.event-toggle span');
                if (body) {
                    body.classList.add('hidden');
                    body.classList.remove('grid', 'open');
                }
                if (toggleBtn) {
                    toggleBtn.textContent = 'expand_more';
                }
            }
        });

        if (loadMoreBtn && collapseBtn) {
            loadMoreBtn.style.display = 'inline-flex';
            collapseBtn.style.display = 'none';
        }

        const eventsSection = document.getElementById('events');
        if (eventsSection) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = eventsSection.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    // Initialize loading logic on page load
    initEventsLoadMore();
});
