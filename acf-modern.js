/* =====================================================
   ACF - Associação Criança Mais Feliz
   Modern Institutional JavaScript
   ===================================================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeTabs();
    initializeModals();
    initializeForm();
    initializeAnimations();
});

/* =====================================================
   THEME MANAGEMENT
   ===================================================== */

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Get saved theme or default to light mode
    const savedTheme = localStorage.getItem('acf-theme');
    const initialTheme = savedTheme || 'light'; // Default to light mode
    
    // Set initial theme
    setTheme(initialTheme);
    
    // Theme toggle button event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            localStorage.setItem('acf-theme', newTheme);
            
            // Announce theme change for screen readers
            announceToScreenReader(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`);
        });
    }
    
    // Listen for system theme changes (only apply if user hasn't set a preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('acf-theme')) {
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

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    }

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
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
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
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

    // Back to top button
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

// Get campaign data
function getCampaignData(campaignId) {
    const campaigns = {
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
                                <li>70 famílias aquecidas</li>
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
                                <li>250 presentes distribuídos</li>
                                <li>180 crianças participaram da festa</li>
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
                    <img src="./assets/natal/logo_natal.jpg" alt="Natal Solidário 2025" class="campaign-modal__image">
                    <div class="campaign-modal__info">
                        <h3>Natal Solidário 2025</h3>
                        <p>Campanha ativa! Faça parte da magia do Natal e ajude-nos a levar alegria e presentes especiais para nossas crianças e suas famílias.</p>
                        <div class="campaign-modal__info-active">
                            <p><strong>🎄 Como Participar:</strong></p>
                            <ul>
                                <li>📱 Entre em contato via WhatsApp</li>
                                <li>🎁 Doe brinquedos, roupas ou alimentos</li>
                                <li>💰 Contribua com doações em dinheiro</li>
                                <li>👥 Seja um voluntário no evento</li>
                                <li>📢 Compartilhe nossa campanha</li>
                            </ul>
                            <p><strong>📅 Cronograma:</strong></p>
                            <ul>
                                <li>🗓️ Arrecadações: até 20 de dezembro</li>
                                <li>🎭 Festa de Natal: 22 de dezembro</li>
                                <li>🏠 Entregas domiciliares: 23-24 de dezembro</li>
                            </ul>
                            <div class="campaign-modal__contact">
                                <a href="https://api.whatsapp.com/send/?phone=5511918596727&text=Quero+colaborar+com+o+Natal+Solidário+2025" target="_blank" class="btn btn--primary">
                                    <i class="fab fa-whatsapp"></i> Colaborar via WhatsApp
                                </a>
                            </div>
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
                                <li>200 presentes distribuídos</li>
                                <li>120 crianças participaram da festa</li>
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
                            <ul>
                                <li>3 toneladas de alimentos arrecadados</li>
                                <li>120 cestas básicas distribuídas</li>
                                <li>90 famílias beneficiadas</li>
                                <li>Engajamento de 100% dos funcionários</li>
                            </ul>
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
                            <ul>
                                <li>300 presentes distribuídos</li>
                                <li>150 crianças contempladas</li>
                                <li>80 famílias beneficiadas</li>
                                <li>Ceia solidária para 200 pessoas</li>
                            </ul>
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
                                <li>180 ovos de chocolate distribuídos</li>
                                <li>120 crianças atendidas</li>
                                <li>Caça aos ovos organizada</li>
                                <li>Café da manhã especial</li>
                            </ul>
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
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Clear form
        e.target.reset();
        const formInputs = e.target.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            input.classList.remove('has-value', 'focused');
        });
        
        // Show success message
        showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Log form data (for development)
        console.log('Form submitted:', data);
        
    }, 2000);
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
    alert(message); // Replace with a more elegant error display
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
    
    // Counter animation
    const counters = document.querySelectorAll('.stat__number');
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