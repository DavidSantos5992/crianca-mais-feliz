/* =====================================================
   ACF - Associação Criança Mais Feliz
   Modern Institutional JavaScript
   ===================================================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    [
        initializeTheme,
        initializeNavigation,
        initializeScrollEffects,
        initializeTabs,
        initializeModals,
        initializeForm,
        initializeGallery,
        initializeAnimations,
        initializeImageLoading
    ].forEach(runInitializer);
});

function runInitializer(initializer) {
    try {
        initializer();
    } catch (error) {
        console.warn(`Could not initialize ${initializer.name}:`, error);
    }
}

/* =====================================================
   THEME MANAGEMENT
   ===================================================== */

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Get saved theme or default to light mode
    const savedTheme = getStorageValue('acf-theme');
    const initialTheme = savedTheme || 'light'; // Default to light mode
    
    // Set initial theme
    setTheme(initialTheme);
    
    // Theme toggle button event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            setStorageValue('acf-theme', newTheme);
            
            // Announce theme change for screen readers
            announceToScreenReader(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`);
        });
    }
    
    // Listen for system theme changes (only apply if user hasn't set a preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getStorageValue('acf-theme')) {
            // Even if system changes, keep light as default
            setTheme('light');
        }
    });
}

function setTheme(theme) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#1e40af');
    }
    
    // Update any charts or graphics that need theme awareness
    updateChartsTheme(theme);
}

function updateChartsTheme(theme) {
    // Update any charts, maps, or other graphics based on theme
    // This can be expanded as needed
    const progressBars = document.querySelectorAll('.progress__bar');
    progressBars.forEach(bar => {
        // Force redraw of progress bars with new theme colors
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

/* =====================================================
   NAVIGATION
   ===================================================== */

function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    function setMobileMenuState(isOpen) {
        if (!navMenu) return;

        navMenu.classList.toggle('show', isOpen);

        if (navToggle) {
            navToggle.setAttribute('aria-expanded', String(isOpen));
        }
    }

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            setMobileMenuState(true);
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            setMobileMenuState(false);
        });
    }

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setMobileMenuState(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu && navMenu.classList.contains('show')) {
            setMobileMenuState(false);
            navToggle?.focus();
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight && navLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
}

/* =====================================================
   SCROLL EFFECTS
   ===================================================== */

function initializeScrollEffects() {
    const backToTop = document.getElementById('back-to-top');
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const hero = document.querySelector('.hero');

    function updateFloatingActions() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const showWhatsapp = !isMobile || !hero || window.scrollY > hero.offsetHeight * 0.75;

        whatsappFloat?.classList.toggle('show', showWhatsapp);
    }

    updateFloatingActions();
    window.addEventListener('scroll', updateFloatingActions);
    window.addEventListener('resize', updateFloatingActions);

    // Back to top button
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero scroll indicator
    const heroScroll = document.querySelector('.hero__scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            const aboutSection = document.getElementById('sobre');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/* =====================================================
   GALLERY PAGE
   ===================================================== */

function initializeGallery() {
    const galleryGrid = document.querySelector('[data-gallery-grid]');
    const galleryGroups = Array.isArray(window.acfGalleryGroups) ? window.acfGalleryGroups : [];

    if (!galleryGrid || galleryGroups.length === 0) return;

    const yearSelect = document.getElementById('gallery-year');
    const campaignSelect = document.getElementById('gallery-campaign');
    const allButton = document.querySelector('[data-gallery-filter="all"]');
    const counter = document.getElementById('gallery-counter');
    const emptyState = document.getElementById('gallery-empty');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('gallery-lightbox-image');
    const lightboxCaption = document.getElementById('gallery-lightbox-caption');
    const lightboxMeta = document.getElementById('gallery-lightbox-meta');
    const lightboxClose = document.getElementById('gallery-lightbox-close');
    const lightboxPrev = document.getElementById('gallery-lightbox-prev');
    const lightboxNext = document.getElementById('gallery-lightbox-next');
    let activePhotos = [];
    let activeIndex = 0;

    const photos = [];

    galleryGroups.forEach(group => {
        group.files.forEach((file, index) => {
            const caption = group.captionPrefix + (group.numbered ? ` - foto ${index + 1}` : '');

            photos.push({
                src: group.base + file,
                alt: caption,
                caption,
                year: group.year,
                campaign: group.campaign,
                category: group.category
            });
        });
    });

    populateGallerySelect(yearSelect, [...new Set(photos.map(photo => photo.year))].sort().reverse());
    populateGallerySelect(campaignSelect, [...new Set(photos.map(photo => photo.campaign))].sort((a, b) => a.localeCompare(b, 'pt-BR')));

    function renderGallery() {
        const selectedYear = yearSelect ? yearSelect.value : '';
        const selectedCampaign = campaignSelect ? campaignSelect.value : '';

        activePhotos = photos.filter(photo => {
            const matchesYear = !selectedYear || photo.year === selectedYear;
            const matchesCampaign = !selectedCampaign || photo.campaign === selectedCampaign;
            return matchesYear && matchesCampaign;
        });

        galleryGrid.innerHTML = activePhotos.map((photo, index) => `
            <article class="gallery-card" data-gallery-index="${index}" tabindex="0">
                <div class="gallery-card__image-wrap">
                    <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" class="gallery-card__image">
                </div>
                <div class="gallery-card__content">
                    <span class="gallery-card__tag">${photo.year} · ${photo.campaign}</span>
                    <h3 class="gallery-card__caption">${photo.caption}</h3>
                </div>
            </article>
        `).join('');

        if (counter) {
            counter.textContent = `${activePhotos.length} ${activePhotos.length === 1 ? 'foto encontrada' : 'fotos encontradas'}`;
        }

        if (emptyState) {
            emptyState.hidden = activePhotos.length > 0;
        }
    }

    function resetFilters() {
        if (yearSelect) yearSelect.value = '';
        if (campaignSelect) campaignSelect.value = '';
        renderGallery();
    }

    function openGalleryLightbox(index) {
        if (!lightbox || !activePhotos[index]) return;

        activeIndex = index;
        const photo = activePhotos[activeIndex];

        if (lightboxImage) {
            lightboxImage.src = photo.src;
            lightboxImage.alt = photo.alt;
        }

        if (lightboxCaption) {
            lightboxCaption.textContent = photo.caption;
        }

        if (lightboxMeta) {
            lightboxMeta.textContent = `${photo.campaign} · ${photo.year}`;
        }

        lightbox.classList.add('show');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeGalleryLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove('show');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    function showAdjacentPhoto(direction) {
        if (activePhotos.length === 0) return;
        activeIndex = (activeIndex + direction + activePhotos.length) % activePhotos.length;
        openGalleryLightbox(activeIndex);
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', renderGallery);
    }

    if (campaignSelect) {
        campaignSelect.addEventListener('change', renderGallery);
    }

    if (allButton) {
        allButton.addEventListener('click', resetFilters);
    }

    galleryGrid.addEventListener('click', event => {
        const card = event.target.closest('.gallery-card');
        if (!card) return;
        openGalleryLightbox(Number(card.dataset.galleryIndex));
    });

    galleryGrid.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const card = event.target.closest('.gallery-card');
        if (!card) return;
        event.preventDefault();
        openGalleryLightbox(Number(card.dataset.galleryIndex));
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeGalleryLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => showAdjacentPhoto(-1));
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => showAdjacentPhoto(1));
    }

    if (lightbox) {
        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) {
                closeGalleryLightbox();
            }
        });
    }

    document.addEventListener('keydown', event => {
        if (!lightbox || !lightbox.classList.contains('show')) return;

        if (event.key === 'Escape') closeGalleryLightbox();
        if (event.key === 'ArrowLeft') showAdjacentPhoto(-1);
        if (event.key === 'ArrowRight') showAdjacentPhoto(1);
    });

    renderGallery();
}

function populateGallerySelect(select, options) {
    if (!select) return;

    options.forEach(option => {
        const element = document.createElement('option');
        element.value = option;
        element.textContent = option;
        select.appendChild(element);
    });
}

/* =====================================================
   TABS FUNCTIONALITY
   ===================================================== */

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab__btn');
    const tabContents = document.querySelectorAll('.tab__content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('tab__btn--active'));
            tabContents.forEach(content => content.classList.remove('tab__content--active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('tab__btn--active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('tab__content--active');
            }
        });
    });
}

/* =====================================================
   MODALS
   ===================================================== */

function initializeModals() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                openModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        }
    });
}

// Donation Modal
function openDonateModal() {
    const modal = document.getElementById('donate-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }
}

function closeDonateModal() {
    const modal = document.getElementById('donate-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

// Copy PIX function
function copyPix() {
    const pixCode = '34.863.177/0001-33';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(pixCode).then(() => {
            showSuccessMessage('Chave PIX copiada com sucesso!');
        }).catch(() => {
            fallbackCopyPix(pixCode);
        });
    } else {
        fallbackCopyPix(pixCode);
    }
}

function fallbackCopyPix(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccessMessage('Chave PIX copiada com sucesso!');
    } catch (err) {
        showSuccessMessage('Chave PIX: 34.863.177/0001-33');
    }
    
    textArea.remove();
}

// Campaign Modal
function openCampaignModal(campaignId) {
    const modal = document.getElementById('campaign-modal');
    const modalTitle = document.getElementById('campaign-modal-title');
    const modalContent = document.getElementById('campaign-modal-content');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    const campaignData = getCampaignData(campaignId);
    
    modalTitle.textContent = campaignData.title;
    modalContent.innerHTML = campaignData.content;
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function closeCampaignModal() {
    const modal = document.getElementById('campaign-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

function openImageModal(imageSrc) {
    let modal = document.getElementById('image-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'image-modal';
        modal.innerHTML = `
            <div class="modal__content image-modal__content">
                <div class="modal__header">
                    <h2 class="modal__title">Galeria</h2>
                    <button class="modal__close" onclick="closeModal('image-modal')" aria-label="Fechar imagem">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal__body image-modal__body">
                    <img src="" alt="Foto ampliada da campanha" class="image-modal__image">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const image = modal.querySelector('.image-modal__image');
    if (image) {
        image.src = imageSrc;
    }
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

// Get campaign data
function getCampaignData(campaignId) {
    const campaigns = {
        voltaasaulas: {
            title: 'Volta às Aulas 2026',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/CAMPANHA_ATIVA/VOLTA_AS_AULAS.jpg" alt="Volta às Aulas 2026" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Volta às Aulas 2026</h3>
                        <p>Campanha ativa para garantir que mais de 20 crianças tenham acesso a todos os materiais escolares necessários para começar o ano letivo com dignidade e oportunidades iguais de aprendizado.</p>
                        
                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-bullseye"></i> Objetivo da Campanha</h4>
                            <p>Arrecadar materiais escolares completos para mais de 20 crianças em situação de vulnerabilidade social, garantindo que iniciem o ano letivo com tudo que precisam para estudar.</p>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-list-check"></i> Materiais Necessários</h4>
                            <ul>
                                <li>📓 Cadernos (brochura e espiral)</li>
                                <li>✏️ Lápis, canetas, borrachas e apontadores</li>
                                <li>🎨 Material de arte (lápis de cor, giz de cera, canetinhas)</li>
                                <li>📐 Material de geometria (régua, transferidor, compasso)</li>
                                <li>🎒 Mochilas escolares</li>
                                <li>📚 Livros didáticos e paradidáticos</li>
                                <li>✂️ Tesoura sem ponta, cola, fita adesiva</li>
                                <li>📝 Pasta plástica, pastas com elástico</li>
                            </ul>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-hand-holding-heart"></i> Como Ajudar</h4>
                            <ul>
                                <li><strong>Doação de Materiais:</strong> Entre em contato conosco para agendar a entrega dos materiais escolares</li>
                                <li><strong>Doação Financeira:</strong> Contribua via PIX para que possamos comprar os materiais necessários</li>
                                <li><strong>Apadrinhamento:</strong> Adote uma criança e forneça todo o kit escolar completo</li>
                                <li><strong>Divulgação:</strong> Compartilhe nossa campanha nas redes sociais e ajude a alcançar mais pessoas</li>
                            </ul>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-heart"></i> Impacto Esperado</h4>
                            <p>Com sua ajuda, conseguiremos:</p>
                            <ul>
                                <li>✅ Atender mais de 20 crianças com material escolar completo</li>
                                <li>✅ Reduzir a evasão escolar causada pela falta de materiais</li>
                                <li>✅ Aumentar a autoestima e confiança das crianças</li>
                                <li>✅ Proporcionar igualdade de oportunidades no aprendizado</li>
                                <li>✅ Aliviar o orçamento de famílias em vulnerabilidade</li>
                            </ul>
                        </div>

                        <div class="campaign-modal__cta">
                            <p><strong>Juntos podemos transformar o futuro dessas crianças através da educação! 📚❤️</strong></p>
                            <a href="https://api.whatsapp.com/send/?phone=5511918596727&text=Vim+pelo+site%2C+gostaria+de+doar+materiais+escolares+para+a+campanha+Volta+às+Aulas" 
                               target="_blank" rel="noopener noreferrer" class="btn btn--primary">
                                <i class="fas fa-graduation-cap"></i> Quero Ajudar Agora
                            </a>
                        </div>
                    </div>
                </div>
            `
        },
        pascoa2025: {
            title: 'Páscoa Solidária 2025',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/pascoa2025/capa.png" alt="Páscoa 2025" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Páscoa Solidária 2025</h3>
                        <p>Nossa campanha de Páscoa levou alegria e doces momentos para mais de 100 crianças da comunidade.</p>
                        <div class="campaign-modal__gallery">
                            <p><strong>Resultados da Campanha:</strong></p>
                            <ul>
                                <li>150 ovos de chocolate distribuídos</li>
                                <li>100 crianças atendidas</li>
                                <li>20 famílias beneficiadas</li>
                                <li>Festa com atividades recreativas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        pascoa2026: {
            title: 'Páscoa Solidária 2026 - Distribuição de Chocolates para Crianças em Situação de Vulnerabilidade',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz1.jpeg" alt="Páscoa Solidária 2026 - Criança Mais Feliz distribuindo chocolates de Páscoa" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Páscoa Solidária 2026</h3>
                        <p><strong>Celebrando a Páscoa com Solidariedade e Amor</strong></p>
                        <p>A Associação Criança Mais Feliz realizou com sucesso mais uma edição de sua tradicional campanha de Páscoa Solidária, levando chocolates, alegria e esperança para crianças em situação de vulnerabilidade social na região de Jundiaí.</p>
                        
                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-heart"></i> Sobre a Campanha</h4>
                            <p>A Páscoa Solidária 2026 foi uma celebração especial da Criança Mais Feliz, com foco em distribuir chocolates de qualidade e criar momentos memoráveis de alegria para as crianças atendidas pela ONG. A campanha reforça nosso compromisso com a transformação social e o bem-estar das famílias mais necessitadas.</p>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-chart-bar"></i> Impacto e Resultados</h4>
                            <ul>
                                <li>✅ Centenas de chocolates de Páscoa distribuídos</li>
                                <li>✅ Dezenas de crianças atendidas com alegria</li>
                                <li>✅ Momentos especiais de celebração em família</li>
                                <li>✅ Reforço do apoio social continuado da ACF</li>
                                <li>✅ Voluntários engajados na causa</li>
                            </ul>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-images"></i> Galeria de Momentos</h4>
                            <div class="campaign-modal__gallery">
                                <div class="gallery-grid">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz1.jpeg" alt="Distribuição de chocolates - Páscoa Solidária 2026">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz2.jpeg" alt="Criança recebendo chocolate de Páscoa - ACF">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz3.jpeg" alt="Momento especial da Páscoa Solidária - ONG Jundiaí">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz4.jpeg" alt="Voluntários da ACF - Páscoa 2026">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz5.jpeg" alt="Celebração de Páscoa com crianças necessitadas">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz6.jpeg" alt="Distribuição de presentes - Páscoa Solidária">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz7.jpeg" alt="Crianças felizes na Páscoa - Criança Mais Feliz">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz8.jpeg" alt="Ação social ACF - Páscoa 2026">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz9.jpeg" alt="Voluntariado solidário - Páscoa Criança Mais Feliz">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz10.jpeg" alt="Momento de alegria - Páscoa 2026 ACF">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz11.jpeg" alt="Distribuição solidária - Pascoa Jundiaí">
                                    <img src="./assets/campanhas_realizadas/pascoa2026/pascoaCriancaMaisFeliz12.jpeg" alt="Crianças celebrando a Páscoa - Associação Criança Mais Feliz">
                                </div>
                            </div>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-lightbulb"></i> Por Que Realizamos Essa Campanha?</h4>
                            <p>A Páscoa é um momento de celebração, esperança e renovação. Acreditamos que toda criança merece vivenciar a magia dessa data, independentemente de sua situação econômica. A Campanha de Páscoa Solidária da Criança Mais Feliz existe para garantir que nenhuma criança fica de fora dessa celebração especial.</p>
                        </div>

                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-hands-helping"></i> Próximas Campanhas</h4>
                            <p>Continuamos nossa missão de transformar vidas através de ações solidárias. Acompanhe nossas próximas campanhas e saiba como você pode ajudar crianças em situação de vulnerabilidade social na região de Jundiaí-SP.</p>
                        </div>

                        <div class="campaign-modal__cta">
                            <p><strong>Obrigado pelo apoio! Sua solidariedade faz a diferença na vida de nossas crianças! 🐰❤️</strong></p>
                            <a href="https://api.whatsapp.com/send/?phone=5511918596727&text=Vim+pelo+site%2C+gostaria+de+saber+como+participar+das+próximas+campanhas+da+ACF" 
                               target="_blank" rel="noopener noreferrer" class="btn btn--primary">
                                <i class="fas fa-hand-holding-heart"></i> Participar de Futuras Campanhas
                            </a>
                        </div>
                    </div>
                </div>
            `
        },
        motoclub: {
            title: 'Motoclub Contra a Fome',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/motoclub_contra_fome/capa.png" alt="Motoclub" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Motoclub Contra a Fome</h3>
                        <p>Parceria especial com motoclubes da região para arrecadação de alimentos não perecíveis.</p>
                        <div class="campaign-modal__gallery">
                            <p><strong>Resultados da Campanha:</strong></p>
                            <ul>
                                <li>2 toneladas de alimentos arrecadados</li>
                                <li>80 cestas básicas montadas</li>
                                <li>50 famílias beneficiadas</li>
                                <li>Participação de 5 motoclubes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        inverno2025: {
            title: 'Inverno Solidário 2025',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/inverno2025/Design sem nome.png" alt="Inverno 2025" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Inverno Solidário 2025</h3>
                        <p>Campanha de arrecadação de roupas e cobertores para proteger famílias do frio.</p>
                        <div class="campaign-modal__gallery">
                            <img src="./assets/campanhas_realizadas/inverno2025/361d21d1-40c2-4591-a07f-bb97e7784ff6.jpg" alt="Distribuição 1" class="gallery-image">
                            <img src="./assets/campanhas_realizadas/inverno2025/597a7ab6-2b3d-4c57-9dc6-1e8a7aaa84d2.jpg" alt="Distribuição 2" class="gallery-image">
                            <p><strong>Resultados da Campanha:</strong></p>
                            <ul>
                                <li>500 peças de roupas distribuídas</li>
                                <li>150 cobertores entregues</li>
                                <li>Parceria com 8 empresas locais</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        mcdia: {
            title: 'MC Dia Feliz',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/mc_dia_feliz/capa.jpg" alt="MC Dia Feliz" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>MC Dia Feliz</h3>
                        <p>Parceria especial que trouxe alegria e momentos únicos para nossas crianças.</p>
                        <div class="campaign-modal__gallery">
                            <p><strong>Sobre a Campanha:</strong></p>
                            <ul>
                                <li>Evento especial para as crianças</li>
                                <li>Lanches e brindes distribuídos</li>
                                <li>Atividades recreativas</li>
                                <li>Momentos de pura alegria</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        diacriancas2025: {
            title: 'Dia das Crianças 2025',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/diadascrianças2025/foto1.jpeg" alt="Dia das Crianças 2025" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Dia das Crianças 2025</h3>
                        <p>Nossa mais recente celebração do Dia das Crianças, repleta de alegria, presentes e momentos inesquecíveis para toda a comunidade.</p>
                        <div class="campaign-modal__gallery">
                            <img src="./assets/campanhas_realizadas/diadascrianças2025/foto2.jpeg" alt="Festa 1" class="gallery-image">
                            <img src="./assets/campanhas_realizadas/diadascrianças2025/foto3.jpeg" alt="Festa 2" class="gallery-image">
                            <img src="./assets/campanhas_realizadas/diadascrianças2025/foto4.jpeg" alt="Festa 3" class="gallery-image">
                            <img src="./assets/campanhas_realizadas/diadascrianças2025/foto5.jpeg" alt="Festa 4" class="gallery-image">
                            <p><strong>Resultados da Campanha:</strong></p>
                            <ul>
                                <li>50 presentes distribuídos</li>
                                <li>40 crianças participaram da festa</li>
                                <li>25 voluntários engajados</li>
                                <li>Festa com brinquedos infláveis e recreação</li>
                                <li>Lanche especial e bolo comemorativo</li>
                                <li>Distribuição de doces e guloseimas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        natal2025: {
            title: 'Natal Solidário 2025',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/natal_2025/foto_acf1.jpeg" alt="Natal Solidário 2025" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Natal Solidário 2025 - Campanha Realizada com Sucesso! 🎄</h3>
                        <p>Nossa campanha de Natal 2025 foi um verdadeiro sucesso! Conseguimos levar alegria, amor e esperança para dezenas de famílias em situação de vulnerabilidade.</p>
                        
                        <div class="campaign-modal__results">
                            <h4>🎁 Resultados Alcançados:</h4>
                            <ul>
                                <li>✨ <strong>Mais de 20 presentes</strong> distribuídos</li>
                                <li>👨‍👩‍👧‍👦 <strong>Mais de 20 crianças</strong> atendidas</li>
                                <li>🏠 <strong>Mais de 20 famílias</strong> beneficiadas</li>
                                <li>🤝 <strong>10 voluntários</strong> engajados</li>
                                <li>🎄 Evento especial de Natal realizado com sucesso</li>
                            </ul>
                        </div>
                        
                        <div class="campaign-modal__description">
                            <h4>� Sobre a Campanha:</h4>
                            <p>O Natal Solidário 2025 foi marcado por momentos mágicos e inesquecíveis. Realizamos uma celebração especial com distribuição de presentes, lanches, brincadeiras e muita alegria para as crianças e suas famílias.</p>
                            <p>Contamos com o apoio fundamental de nossos parceiros, voluntários e doadores que tornaram esse sonho realidade. Cada sorriso, cada abraço e cada momento de alegria reforçaram nossa missão de transformar vidas.</p>
                        </div>
                        
                        <div class="campaign-modal__gallery">
                            <h4>📸 Galeria de Fotos:</h4>
                            <div class="gallery-grid">
                                <img src="./assets/natal_2025/foto_acf1.jpeg" alt="Natal 2025 - Foto 1" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf2.jpeg" alt="Natal 2025 - Foto 2" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf3.jpeg" alt="Natal 2025 - Foto 3" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf4.jpeg" alt="Natal 2025 - Foto 4" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf5.jpeg" alt="Natal 2025 - Foto 5" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf6.jpeg" alt="Natal 2025 - Foto 6" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf7.jpeg" alt="Natal 2025 - Foto 7" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf8.jpeg" alt="Natal 2025 - Foto 8" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf9.jpeg" alt="Natal 2025 - Foto 9" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf10.jpeg" alt="Natal 2025 - Foto 10" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf11.jpeg" alt="Natal 2025 - Foto 11" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf12.jpeg" alt="Natal 2025 - Foto 12" onclick="openImageModal(this.src)">
                                <img src="./assets/natal_2025/foto_acf13.jpeg" alt="Natal 2025 - Foto 13" onclick="openImageModal(this.src)">
                            </div>
                        </div>
                        
                        <div class="campaign-modal__testimonials">
                            <h4>💝 Depoimentos:</h4>
                            <blockquote>
                                <p>"Ver o sorriso no rosto dos meus filhos no Natal foi indescritível. Muito obrigada ACF por nos fazer acreditar na magia do Natal novamente!"</p>
                                <cite>- Mãe beneficiada</cite>
                            </blockquote>
                            <blockquote>
                                <p>"Participar como voluntário foi uma experiência transformadora. Ver a alegria das crianças me encheu de gratidão e esperança."</p>
                                <cite>- Voluntário da campanha</cite>
                            </blockquote>
                        </div>
                        
                        <div class="campaign-modal__thanks">
                            <h4>🙏 Agradecimentos:</h4>
                            <p>Nosso sincero agradecimento a todos que tornaram este Natal especial possível: doadores, voluntários, parceiros, empresas e a toda comunidade que abraçou nossa causa. Juntos somos mais fortes!</p>
                        </div>
                    </div>
                </div>
            `
        },
        diacriancas2024: {
            title: 'Dia das Crianças 2024',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/diaDasCriancas2024/capa.png" alt="Dia das Crianças 2024" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Dia das Crianças 2024</h3>
                        <p>Celebração especial com festa, presentes e muita diversão para nossas crianças.</p>
                        <div class="campaign-modal__gallery">
                            <img src="./assets/campanhas_realizadas/diaDasCriancas2024/entrega.jpeg" alt="Entrega 1" class="gallery-image">
                            <img src="./assets/campanhas_realizadas/diaDasCriancas2024/entrega2.jpeg" alt="Entrega 2" class="gallery-image">
                            <p><strong>Resultados da Campanha:</strong></p>
                            <ul>
                                <li>50 presentes distribuídos</li>
                                <li>30 crianças participaram da festa</li>
                                <li>Brinquedoteca montada</li>
                                <li>Lanche especial para todos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        dhl: {
            title: 'DHL Cabreúva Contra a Fome',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/dhl_contra_fome/capa.png" alt="DHL Contra Fome" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>DHL Cabreúva Contra a Fome</h3>
                        <p>Parceria corporativa de sucesso que mobilizou funcionários em prol da causa social.</p>
                        <div class="campaign-modal__gallery">
                            <img src="./assets/campanhas_realizadas/dhl_contra_fome/foto1.jpeg" alt="DHL 1" class="gallery-image">
                            <img src="./assets/campanhas_realizadas/dhl_contra_fome/foto2.jpeg" alt="DHL 2" class="gallery-image">
                            <p><strong>Resultados da Campanha:</strong></p>
                           
                        </div>
                    </div>
                </div>
            `
        },
        natal2024: {
            title: 'Natal Solidário 2024',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/natal2024/capa.png" alt="Natal 2024" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Natal Solidário 2024</h3>
                        <p>Celebração natalina que trouxe esperança e alegria para famílias em situação de vulnerabilidade.</p>
                        <div class="campaign-modal__gallery">
                            <p><strong>Resultados da Campanha:</strong></p>
                            
                        </div>
                    </div>
                </div>
            `
        },
        pascoa2024: {
            title: 'Páscoa Solidária 2024',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/campanhas_realizadas/pascoa2024/capa.png" alt="Páscoa 2024" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Páscoa Solidária 2024</h3>
                        <p>Distribuição de chocolates e momentos especiais de confraternização com as famílias.</p>
                        <div class="campaign-modal__gallery">
                            <p><strong>Resultados da Campanha:</strong></p>
                            <ul>
                                <li>80 ovos de chocolate distribuídos</li>
                                <li>40 crianças atendidas</li>
                                <li>Caça aos ovos organizada</li>
                                <li>Café da manhã especial</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        contrafome: {
            title: 'Contra a Fome',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/contra fome/logo_contra_fome.jpg" alt="Contra a Fome" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Campanha Contra a Fome - URGENTE! 🍽️</h3>
                        <p>Nossa campanha permanente de arrecadação de alimentos está ativa e precisa da sua ajuda! Milhares de famílias em situação de vulnerabilidade dependem dessa corrente de solidariedade.</p>
                        
                        <div class="campaign-modal__info-active">
                            <p><strong>🛒 O que você pode doar:</strong></p>
                            <ul>
                                <li>🍚 Arroz, feijão, macarrão</li>
                                <li>🥫 Enlatados e conservas</li>
                                <li>🧃 Leite em pó ou longa vida</li>
                                <li>🍪 Biscoitos e bolachas</li>
                                <li>🧂 Óleo, sal, açúcar</li>
                                <li>☕ Café, achocolatado</li>
                                <li>🥫 Molhos e temperos</li>
                                <li>📦 Produtos não perecíveis em geral</li>
                            </ul>
                            
                            <p><strong>📍 Como Doar:</strong></p>
                            <ul>
                                <li>🏠 <strong>Entrega na sede:</strong> R. Profa. Hilda Marques, 52 - Vila Cristo Redentor, Jundiaí-SP</li>
                                <li>📱 <strong>WhatsApp:</strong> Entre em contato para agendar coleta</li>
                                <li>💰 <strong>Doação financeira:</strong> Contribua via PIX para comprarmos cestas básicas</li>
                                <li>🤝 <strong>Campanha corporativa:</strong> Sua empresa pode ser parceira</li>
                            </ul>
                            
                            <p><strong>⏰ Horários de Recebimento:</strong></p>
                            <ul>
                                <li>Segunda a Sexta: 8h às 17h</li>
                                <li>Sábados: 8h às 12h</li>
                            </ul>
                            
                            <div class="campaign-modal__stats">
                                <h4>📊 Meta Mensal (Janeiro 2026):</h4>
                                <ul>
                                    <li>🎯 <strong>Meta:</strong> 200 cestas básicas</li>
                                    <li>✅ <strong>Arrecadado:</strong> 90 cestas</li>
                                    <li>⏳ <strong>Faltam:</strong> 110 cestas</li>
                                    <li>👨‍👩‍👧‍👦 <strong>Famílias aguardando:</strong> 150+</li>
                                </ul>
                            </div>
                            
                            <div class="campaign-modal__impact">
                                <h4>💝 Seu Impacto:</h4>
                                <p>Cada doação representa:</p>
                                <ul>
                                    <li>🍽️ Refeições garantidas para uma família</li>
                                    <li>😊 Dignidade e esperança restauradas</li>
                                    <li>👶 Crianças bem alimentadas e saudáveis</li>
                                    <li>💪 Fortalecimento da comunidade</li>
                                </ul>
                            </div>
                            
                            <div class="campaign-modal__contact">
                                <a href="https://api.whatsapp.com/send/?phone=5511918596727&text=Quero+doar+alimentos+para+a+campanha+Contra+a+Fome" target="_blank" class="btn btn--primary">
                                    <i class="fab fa-whatsapp"></i> Doar via WhatsApp
                                </a>
                            </div>
                            
                            <div class="campaign-modal__pix">
                                <h4>💰 Doação via PIX:</h4>
                                <p><strong>CNPJ:</strong> 34.863.177/0001-33</p>
                                <p><strong>Razão Social:</strong> Associação Criança Mais Feliz</p>
                                <p>Com sua doação em dinheiro, compramos cestas básicas completas e entregamos diretamente às famílias.</p>
                            </div>
                        </div>
                        
                        <div class="campaign-modal__urgency">
                            <p class="urgency-message">⚠️ <strong>CAMPANHA URGENTE!</strong> A fome não espera. Sua doação hoje pode fazer a diferença entre uma família passar fome ou ter dignidade na mesa. Participe!</p>
                        </div>
                    </div>
                </div>
            `
        },
        invernosolidario: {
            title: 'Inverno Solidário 2026',
            content: `
                <div class="campaign-modal__content">
                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/Capa.png" alt="Inverno Solidário 2026" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Inverno Solidário 2026 - Entregas Iniciadas ❄️</h3>
                        <p>A campanha segue ativa até 31/07/2026. As primeiras entregas de inverno já começaram e agasalhos foram entregues para as crianças atendidas pela ACF. Agora precisamos reforçar a arrecadação de toucas, meias, calçados e cobertores para completar a proteção contra o frio.</p>
                        
                        <div class="campaign-modal__section">
                            <h4><i class="fas fa-hand-holding-heart"></i> Entregas Iniciadas</h4>
                            <p>Com o apoio de doadores e voluntários, já iniciamos as entregas de inverno e conseguimos levar agasalhos para as crianças. A campanha continua porque ainda faltam itens essenciais para enfrentar os dias mais frios com segurança e dignidade.</p>
                            <div class="campaign-modal__gallery-grid" aria-label="Fotos do início das entregas do Inverno Solidário 2026">
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.27 (1).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 1">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.27 (1).jpeg" alt="Início das entregas do Inverno Solidário 2026 com agasalhos para crianças atendidas pela ACF - foto 1" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.27 (2).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 2">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.27 (2).jpeg" alt="Entrega de agasalhos da campanha Inverno Solidário 2026 para crianças atendidas pela ACF - foto 2" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.27.jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 3">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.27.jpeg" alt="Registro das primeiras entregas de agasalhos do Inverno Solidário 2026 - foto 3" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.28.jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 4">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.28.jpeg" alt="Ação de entrega de agasalhos do Inverno Solidário 2026 em Jundiaí - foto 4" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.29 (1).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 5">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.29 (1).jpeg" alt="Voluntários e famílias durante o início das entregas do Inverno Solidário 2026 - foto 5" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.29.jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 6">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.29.jpeg" alt="Entrega de agasalhos para proteção no inverno pela Associação Criança Mais Feliz - foto 6" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.30 (1).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 7">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.30 (1).jpeg" alt="Crianças recebendo apoio da campanha Inverno Solidário 2026 - foto 7" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.30 (2).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 8">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.30 (2).jpeg" alt="Registro da entrega de itens de inverno da campanha Inverno Solidário 2026 - foto 8" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.30.jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 9">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.30.jpeg" alt="Primeiras entregas de agasalhos para crianças na campanha Inverno Solidário 2026 - foto 9" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.31 (1).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 10">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.31 (1).jpeg" alt="Doações de inverno sendo entregues pela Associação Criança Mais Feliz - foto 10" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.31 (2).jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 11">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.31 (2).jpeg" alt="Apoio de inverno para crianças atendidas pela ACF durante as primeiras entregas - foto 11" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.31.jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 12">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.31.jpeg" alt="Registro solidário das entregas de agasalhos do Inverno Solidário 2026 - foto 12" loading="lazy" decoding="async">
                                </button>
                                <button class="campaign-modal__photo" type="button" onclick="openImageModal('./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.32.jpeg')" aria-label="Ampliar foto do início das entregas do Inverno Solidário 2026 - foto 13">
                                    <img src="./assets/CAMPANHA_ATIVA/Inverno solidario 2026/inicio de entrega/WhatsApp Image 2026-06-08 at 11.34.32.jpeg" alt="Entrega de agasalhos e cuidado com crianças no Inverno Solidário 2026 - foto 13" loading="lazy" decoding="async">
                                </button>
                            </div>
                        </div>

                        <div class="campaign-modal__info-active">
                            <h4><i class="fas fa-snowflake"></i> O Que Ainda Precisamos Arrecadar?</h4>
                            <p>Neste momento, a prioridade é completar a proteção das crianças com itens essenciais para o frio:</p>
                            <ul>
                                <li>🧥 <strong>Agasalhos:</strong> As primeiras peças já foram entregues, mas novas doações continuam ajudando mais crianças</li>
                                <li>🧦 <strong>Meias:</strong> Meias quentes para proteger os pequenos pés</li>
                                <li>🎩 <strong>Touca/Gorro:</strong> Proteção para a cabeça e orelhas do frio</li>
                                <li>👟 <strong>Calçados:</strong> Sapatos fechados e em bom estado para enfrentar o frio com segurança</li>
                                <li>🛏️ <strong>Cobertores:</strong> Proteção durante o dia e à noite</li>
                            </ul>
                            
                            <p><strong>❓ Por Que Essas Crianças Precisam?</strong></p>
                            <p>As crianças atendidas pela Associação Criança Mais Feliz vivem em situação de vulnerabilidade social. Durante o inverno, o risco de doenças respiratórias e hipotermia aumenta. Esses itens são essenciais para garantir saúde, conforto e segurança nos meses mais frios do ano.</p>
                            
                            <h4><i class="fas fa-heart"></i> Como Você Pode Ajudar</h4>
                            <ul>
                                <li>🛍️ <strong>Doação de Itens:</strong> Contribua com agasalhos, toucas, meias, calçados e cobertores em bom estado</li>
                                <li>💰 <strong>Doação Financeira via PIX:</strong> Contribua em dinheiro para comprarmos os itens necessários</li>
                                <li>🤝 <strong>Apadrinhamento:</strong> Adote uma criança e ajude a completar sua proteção de inverno</li>
                                <li>🏢 <strong>Parceria Corporativa:</strong> Sua empresa pode fazer uma doação em massa</li>
                            </ul>
                            
                            <p><strong>📍 Onde Entregar:</strong></p>
                            <ul>
                                <li>🏠 <strong>Sede da ACF:</strong> R. Profa. Hilda Marques, 52 - Vila Cristo Redentor, Jundiaí-SP</li>
                                <li>📱 <strong>WhatsApp:</strong> Agende a entrega ou coleta dos itens doados</li>
                                <li>⏰ <strong>Horários:</strong> Segunda a Sexta (8h-17h) | Sábado (8h-12h)</li>
                            </ul>
                            
                            <div class="campaign-modal__stats">
                                <h4>📊 Meta da Campanha de Inverno 2026:</h4>
                                <ul>
                                    <li>🎯 <strong>Status:</strong> Campanha ativa com entregas iniciadas</li>
                                    <li>📈 <strong>Progresso:</strong> 50% da meta atingida</li>
                                    <li>📅 <strong>Prazo:</strong> Doações até 31/07/2026</li>
                                    <li>⏳ <strong>Foco atual:</strong> Toucas, meias, calçados e cobertores</li>
                                </ul>
                            </div>
                            
                            <div class="campaign-modal__impact">
                                <h4>💝 Seu Impacto - O Que Uma Doação Significa:</h4>
                                <p>Ao contribuir com o Inverno Solidário, você:</p>
                                <ul>
                                    <li>❄️ Protege uma criança do frio intenso</li>
                                    <li>😊 Traz conforto e segurança</li>
                                    <li>🏥 Reduz o risco de doenças respiratórias</li>
                                    <li>📚 Permite que a criança compareça à escola sem faltar por frio</li>
                                    <li>❤️ Demonstra amor e cuidado genuíno</li>
                                </ul>
                            </div>
                            
                            <div class="campaign-modal__pix">
                                <h4>💰 Doação via PIX:</h4>
                                <p><strong>CNPJ:</strong> 34.863.177/0001-33</p>
                                <p><strong>Razão Social:</strong> Associação Criança Mais Feliz</p>
                                <p>Sua doação em dinheiro nos permite comprar itens de qualidade e distribuir kits completos para todas as crianças. Muito obrigado!</p>
                            </div>
                            
                            <div class="campaign-modal__contact">
                                <a href="https://api.whatsapp.com/send/?phone=5511918596727&text=Quero+participar+da+campanha+Inverno+Solidário+2026" target="_blank" class="btn btn--primary">
                                    <i class="fab fa-whatsapp"></i> Entrar em Contato
                                </a>
                            </div>
                        </div>
                        
                        <div class="campaign-modal__urgency">
                            <p class="urgency-message">❄️ <strong>CAMPANHA ATIVA!</strong> As entregas já começaram, mas ainda precisamos de toucas, meias, calçados e cobertores para proteger mais crianças até 31/07/2026. Sua solidariedade faz diferença!</p>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    return campaigns[campaignId] || {
        title: 'Campanha',
        content: '<p>Informações da campanha não encontradas.</p>'
    };
}

// Help Modal (Davi)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

// Success Modal
function showSuccessMessage(message) {
    const modal = document.getElementById('success-modal');
    const messageElement = document.getElementById('success-message');
    
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // Auto close after 3 seconds
        setTimeout(() => {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }, 3000);
    }
}

/* =====================================================
   FORM HANDLING
   ===================================================== */

function initializeForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add floating label effect
        const formInputs = contactForm.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            // Set initial state
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }
            
            // Handle focus and blur events
            input.addEventListener('focus', () => {
                input.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.classList.remove('focused');
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
            
            // Handle input event
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Abrindo contato...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        openContactChannel(data);
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Clear form
        e.target.reset();
        const formInputs = e.target.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            input.classList.remove('has-value', 'focused');
        });
        
        showSuccessMessage('Canal de contato aberto. Envie a mensagem para concluir o contato.');
        
    }, 500);
}

function openContactChannel(data) {
    const message = [
        `Nome: ${data.name}`,
        `Email: ${data.email}`,
        `Telefone: ${data.phone}`,
        `Preferência: ${data.preference}`,
        '',
        data.message
    ].join('\n');
    
    if (data.preference === 'email') {
        const subject = encodeURIComponent('Contato pelo site ACF');
        const body = encodeURIComponent(message);
        window.location.href = `mailto:doacoes@associacaocriancamaisfeliz.com.br?subject=${subject}&body=${body}`;
        return;
    }
    
    const whatsappText = encodeURIComponent(`Vim pelo site da ACF.\n\n${message}`);
    window.open(`https://wa.me/5511918596727?text=${whatsappText}`, '_blank', 'noopener,noreferrer');
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'preference', 'message'];
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${getFieldLabel(field)} é obrigatório`);
        }
    });
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Email inválido');
    }
    
    // Validate phone
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Telefone inválido');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

function getFieldLabel(field) {
    const labels = {
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
        preference: 'Preferência de contato',
        message: 'Mensagem'
    };
    return labels[field] || field;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showErrorMessage(message) {
    let modal = document.getElementById('error-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'error-modal';
        modal.innerHTML = `
            <div class="modal__content modal__content--small">
                <div class="modal__body">
                    <div class="feedback-modal__content">
                        <div class="feedback-modal__icon feedback-modal__icon--error">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 class="feedback-modal__title">Revise os campos</h2>
                        <p class="feedback-modal__message"></p>
                        <button class="btn btn--primary" onclick="closeModal('error-modal')">OK</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const messageElement = modal.querySelector('.feedback-modal__message');
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function initializeImageLoading() {
    document.querySelectorAll('img').forEach(image => {
        if (!image.closest('.hero') && !image.hasAttribute('loading')) {
            image.setAttribute('loading', 'lazy');
        }
        
        if (!image.hasAttribute('decoding')) {
            image.setAttribute('decoding', 'async');
        }
    });
}

/* =====================================================
   ANIMATIONS
   ===================================================== */

function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress__bar');
    if ('IntersectionObserver' in window) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                }
            });
        });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }
    
    // Counter animation
    const counters = document.querySelectorAll('.stat__number');
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } else {
        counters.forEach(animateCounter);
    }
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

// Format phone number
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set query parameter
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// Local storage helpers
function getStorageValue(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn('Could not read from localStorage:', error);
        return null;
    }
}

function setStorageValue(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('Could not load from localStorage:', error);
        return null;
    }
}

/* =====================================================
   ERROR HANDLING
   ===================================================== */

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send this to a logging service
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to a logging service
});

/* =====================================================
   ACCESSIBILITY ENHANCEMENTS
   ===================================================== */

// Keyboard navigation for modals
document.addEventListener('keydown', (e) => {
    const openModal = document.querySelector('.modal.show');
    if (!openModal) return;
    
    if (e.key === 'Tab') {
        trapFocus(e, openModal);
    }
});

function trapFocus(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
        }
    }
}

// Announce page changes for screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/* =====================================================
   PERFORMANCE OPTIMIZATIONS
   ===================================================== */

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

/* =====================================================
   EXPORT FUNCTIONS FOR GLOBAL ACCESS
   ===================================================== */

// Make functions available globally
window.ACF = {
    // Theme functions
    setTheme,
    getCurrentTheme,
    
    // Modal functions
    openDonateModal,
    closeDonateModal,
    copyPix,
    openCampaignModal,
    closeCampaignModal,
    openImageModal,
    openModal,
    closeModal,
    showSuccessMessage,
    
    // Utility functions
    formatCurrency,
    formatPhone
};

/* =====================================================
   CONSOLE WELCOME MESSAGE
   ===================================================== */

console.log(`
%c 
   ___   _____  _____ 
  / _ \\ /  __ \\|  ___|
 / /_\\ \\| /  \\/| |__  
 |  _  || |    |  __| 
 | | | || \\__/\\| |    
 \\_| |_/ \\____/\\_|    
                      
%c Associação Criança Mais Feliz
%c Desenvolvido com ❤️ para transformar vidas
%c Versão: 2.0.0 | Build: ${new Date().getFullYear()}
`, 
'color: #1e40af; font-family: monospace; font-size: 12px;',
'color: #1e40af; font-weight: bold; font-size: 16px;',
'color: #f59e0b; font-size: 14px;',
'color: #6b7280; font-size: 12px;'
);
