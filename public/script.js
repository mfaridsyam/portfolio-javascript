document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }
});

emailjs.init("UrpG9fqigxq0B2m7k");

let showAllProjects = false;
let projectsAnimated = false;
let portfolioObserved = false;

let firebaseLoaded = false;
let commentsRef = null;

function waitForFirebase() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (window.firebaseDb && window.firebaseRef) {
                clearInterval(checkInterval);
                firebaseLoaded = true;
                commentsRef = window.firebaseRef(window.firebaseDb, 'comments');
                resolve();
            }
        }, 100);
    });
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (!savedTheme) {
            localStorage.setItem('theme', 'dark');
        }
    }
}

loadTheme();

window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    showLoadingScreen();
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const typedUrl = document.getElementById('typedUrl');
    const mainContent = document.getElementById('portfolioPage');
    const nav = document.querySelector('nav');
    
    loadingScreen.style.display = 'flex';
    mainContent.style.display = 'none';
    nav.style.display = 'none';
    
    const urlText = 'faridsyam.web.app';
    let index = 0;
    
    setTimeout(() => {
        const typingInterval = setInterval(() => {
            if (index < urlText.length) {
                typedUrl.textContent += urlText.charAt(index);
                index++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        mainContent.style.display = 'block';
                        nav.style.display = 'flex';
                        initializeAnimations();
                        handleMusicPlayerVisibility();
                    }, 500);
                }, 800);
            }
        }, 100);
    }, 1500);
}

async function initializeAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (typeof lottie !== 'undefined') {
        const lottieAnimation = lottie.loadAnimation({
            container: document.getElementById('lottie-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/foto/uisvg.json'
        });
    }
    
    setTimeout(() => {
        heroContent.classList.add('animate-in-left');
    }, 200);
    
    setTimeout(() => {
        heroImage.classList.add('animate-in-right');
    }, 400);
    
    setTimeout(() => {
        scrollIndicator.classList.add('animate-in-bottom');
    }, 600);
    
    await waitForFirebase();
    loadComments();
    
    const sections = document.querySelectorAll('section:not(#home)');
    sections.forEach(section => {
        section.classList.add('animate-section');
        observer.observe(section);
    });
}

function saveCommentTime() {
    try {
        localStorage.setItem('lastCommentTime', Date.now().toString());
    } catch (error) {
        console.error('Error saving comment time:', error);
    }
}

function canPostComment() {
    try {
        const lastCommentTime = localStorage.getItem('lastCommentTime');
        
        if (!lastCommentTime) {
            return true;
        }
        
        const lastTime = new Date(parseInt(lastCommentTime));
        const now = new Date();
        
        const lastDay = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return today > lastDay;
    } catch (error) {
        console.error('Error checking comment permission:', error);
        return true;
    }
}

function getTimeUntilNextComment() {
    try {
        const lastCommentTime = localStorage.getItem('lastCommentTime');
        
        if (!lastCommentTime) {
            return null;
        }
        
        const lastTime = new Date(parseInt(lastCommentTime));
        const tomorrow = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate() + 1);
        const now = new Date();
        
        const diff = tomorrow - now;
        
        if (diff <= 0) {
            return null;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours} hours ${minutes} minutes`;
    } catch (error) {
        console.error('Error calculating time:', error);
        return null;
    }
}

const audio = document.getElementById("audioPlayer");
const musicTitleSimple = document.getElementById("musicTitleSimple");
const musicStatusSimple = document.getElementById("musicStatusSimple");
const musicIconSimple = document.getElementById("musicIconSimple");
const musicPlayerSimple = document.getElementById("musicPlayerSimple");

const playlist = [
    { 
        title: "Tabola Bale – Silet Open Up", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162714/SiletOpenUp-TabolaBale_nuotw9.mp3"
    },
    { 
        title: "Ngapain Repot – Toton Caribo", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162585/TotonCaribo-NgapainRepot_lhmbgf.mp3"
    },
    { 
        title: "Monitor Ketua – Ecko Show", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162707/EckoShow-TorMonitor_rl55yh.mp3"
    },
    { 
        title: "Bintang 5 – Tenxii Remix", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162750/Tenxii-Bintang5_ilfc8r.mp3"
    },
    { 
        title: "Alamak – Rizky Febian", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162722/RizkyFebian-Alamak_yiohla.mp3"
    },
    { 
        title: "Teruntuk Mia – Nuh", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162721/Nuh-TeruntukMia_uggo8r.mp3"
    },
    { 
        title: "Ngga Dulu – Akbar Chalay", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162742/AkbarChalay-NggaDulu_p0gzj6.mp3"
    },
    { 
        title: "Mejikuhibinu – Tenxii", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162671/TenxiSuisei-Mejikuhibiniu_wmz0dl.mp3"
    },
    { 
        title: "Berubah – Tenxi Jemsii", 
        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162712/TenxiJemsii-Berubah_cjdfyf.mp3"
    }
];

let currentTrack = 0;
let isPlaying = false;
let isMusicLoaded = false;

musicTitleSimple.innerText = playlist[currentTrack].title;
musicStatusSimple.innerText = "Tap to play";

function togglePlaySimple() {
    if (!audio) return;

    if (!isMusicLoaded) {
        musicStatusSimple.innerText = "Loading...";
        musicIconSimple.className = "fas fa-spinner fa-spin";
        
        audio.src = playlist[currentTrack].src;
        isMusicLoaded = true;
        
        audio.addEventListener('canplay', function onCanPlay() {
            audio.play().catch(err => {
                console.error('Play error:', err);
                musicStatusSimple.innerText = "Error playing";
                musicIconSimple.className = "fas fa-exclamation-circle";
            });
            musicStatusSimple.innerText = "Playing";
            musicIconSimple.className = "fas fa-pause";
            isPlaying = true;
            audio.removeEventListener('canplay', onCanPlay);
        }, { once: true });
        
        audio.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            musicStatusSimple.innerText = "Failed to load";
            musicIconSimple.className = "fas fa-exclamation-circle";
            isMusicLoaded = false;
        }, { once: true });
        
        return;
    }

    if (isPlaying) {
        audio.pause();
        musicStatusSimple.innerText = "Paused";
        musicIconSimple.className = "fas fa-music";
    } else {
        audio.play().catch(err => {
            console.error('Play error:', err);
            musicStatusSimple.innerText = "Error";
        });
        musicStatusSimple.innerText = "Playing";
        musicIconSimple.className = "fas fa-pause";
    }

    isPlaying = !isPlaying;
}

audio.addEventListener("ended", () => {
    currentTrack++;
    if (currentTrack >= playlist.length) {
        currentTrack = 0;
    }
    
    musicStatusSimple.innerText = "Loading next...";
    musicIconSimple.className = "fas fa-spinner fa-spin";
    
    audio.src = playlist[currentTrack].src;
    musicTitleSimple.innerText = playlist[currentTrack].title;
    
    if (isPlaying) {
        audio.play().then(() => {
            musicStatusSimple.innerText = "Playing";
            musicIconSimple.className = "fas fa-pause";
        }).catch(err => {
            console.error('Play error:', err);
            musicStatusSimple.innerText = "Error";
            musicIconSimple.className = "fas fa-exclamation-circle";
        });
    }
});

function handleMusicPlayerVisibility() {
    if (window.innerWidth <= 768) {
        const contactSection = document.getElementById('contact');
        const footer = document.querySelector('footer');
        
        const contactRect = contactSection.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        
        const isInContactOrFooter = contactRect.top < window.innerHeight || footerRect.top < window.innerHeight;
        
        if (isInContactOrFooter) {
            musicPlayerSimple.classList.add('hidden');
        } else {
            musicPlayerSimple.classList.remove('hidden');
        }
    } else {
        musicPlayerSimple.classList.remove('hidden');
    }
}

window.addEventListener('scroll', handleMusicPlayerVisibility, { passive: true });
window.addEventListener('resize', handleMusicPlayerVisibility, { passive: true });

function toggleBurgerMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerMenu = document.querySelector('.burger-menu');
    
    mobileMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerMenu = document.querySelector('.burger-menu');
    
    mobileMenu.classList.remove('active');
    burgerMenu.classList.remove('active');
    document.body.style.overflow = '';
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

function setActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('onclick');
        
        if (href && href.includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav, { passive: true });

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

function switchTab(tabName) {
    const projectsContent = document.getElementById('projectsContent');
    const certificatesContent = document.getElementById('certificatesContent');
    const techstackContent = document.getElementById('techstackContent');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    projectsContent.classList.remove('active');
    certificatesContent.classList.remove('active');
    techstackContent.classList.remove('active');
    
    if (tabName === 'projects') {
        projectsContent.classList.add('active');
        tabBtns[0].classList.add('active');
    } else if (tabName === 'certificates') {
        certificatesContent.classList.add('active');
        tabBtns[1].classList.add('active');
    } else if (tabName === 'techstack') {
        techstackContent.classList.add('active');
        tabBtns[2].classList.add('active');
    }
}

const techStack = [
    { 
        name: "HTML", 
        category: "Frontend Markup", 
        iconLight: "assets/icons/htmld.png",
        iconDark: "assets/icons/html.png"
    },
    { 
        name: "CSS", 
        category: "Styling & Layout", 
        iconLight: "assets/icons/cssd.png",
        iconDark: "assets/icons/css.png"
    },
    { 
        name: "JavaScript", 
        category: "Programming Language", 
        iconLight: "assets/icons/jsd.png",
        iconDark: "assets/icons/js.png"
    },
    { 
        name: "C++", 
        category: "Programming Language", 
        iconLight: "assets/icons/cplusd.png",
        iconDark: "assets/icons/cplus.png"
    },
    { 
        name: "VueJS", 
        category: "Frontend Framework", 
        iconLight: "assets/icons/vued.png",
        iconDark: "assets/icons/vue.png"
    },
    { 
        name: "Firebase", 
        category: "Backend & Hosting", 
        iconLight: "assets/icons/firebased.png",
        iconDark: "assets/icons/firebase.png"
    },
    { 
        name: "Figma", 
        category: "UI / UX Design", 
        iconLight: "assets/icons/figmad.png",
        iconDark: "assets/icons/figma.png"
    },
    { 
        name: "Canva", 
        category: "Design Tool", 
        iconLight: "assets/icons/canvad.png",
        iconDark: "assets/icons/canva.png"
    },
    { 
        name: "Adobe Lightroom", 
        category: "Photo Editing", 
        iconLight: "assets/icons/lrd.png",
        iconDark: "assets/icons/lr.png"
    },
    { 
        name: "Microsoft Word", 
        category: "Office Productivity", 
        iconLight: "assets/icons/wordd.png",
        iconDark: "assets/icons/word.png"
    },
    { 
        name: "Microsoft Excel", 
        category: "Office Productivity", 
        iconLight: "assets/icons/exceld.png",
        iconDark: "assets/icons/excel.png"
    },
    { 
        name: "PowerPoint", 
        category: "Office Productivity", 
        iconLight: "assets/icons/pwpd.png",
        iconDark: "assets/icons/pwp.png"
    }
];

const techstackDisplay = document.getElementById("techstackDisplay");

if (techstackDisplay) {
    techStack.forEach(tech => {
        const card = document.createElement("div");
        card.className = "techstack-card";

        card.innerHTML = `
            <div class="techstack-icon">
                <img src="${tech.iconLight}" alt="${tech.name}" class="icon-light">
                <img src="${tech.iconDark}" alt="${tech.name}" class="icon-dark">
            </div>
            <div class="techstack-info">
                <div class="techstack-name">${tech.name}</div>
                <div class="techstack-category">${tech.category}</div>
            </div>
        `;

        techstackDisplay.appendChild(card);
    });
}

const certificates = [
    {
        title: "Figma for UI/UX Design",
        issuer: "MySkill - Skill Specialization",
        date: "2026",
        images: ["assets/certificates/figmaforui-uxdesign.jpg"]
    },
    {
        title: "Fundamental UI Design",
        issuer: "Coding Studio",
        date: "2025",
        images: ["assets/certificates/fundamental-ui.jpg"]
    },
    {
        title: "Fundamental UX Design",
        issuer: "Coding Studio",
        date: "2025",
        images: ["assets/certificates/fundamental-ux.jpg"]
    },
    {
        title: "Digital Representative",
        issuer: "MAGENTA & PT Pegadaian",
        date: "2025",
        images: [
            "assets/certificates/magenta.jpg",
            "assets/certificates/magenta1.jpg"
        ]
    },
    {
        title: "Microsoft Office",
        issuer: "Kursus Digital & LKP Borju Komputer",
        date: "2024",
        images: ["assets/certificates/office.png"]
    },
    {
        title: "Toefl Prediction",
        issuer: "Global Operation Indonesia",
        date: "2025",
        images: ["assets/certificates/toeflp.jpeg"]
    }
];

const certificatesDisplay = document.getElementById("certificatesDisplay");
let currentCertImages = [];
let currentImageIndex = 0;

if (certificatesDisplay) {
    certificates.forEach(cert => {
        const card = document.createElement("div");
        card.className = "certificate-card";
        card.onclick = () => openCertificateModal(cert.images, cert.title);
        
        card.innerHTML = `
            <div class="certificate-image">
                <img src="${cert.images[0]}" alt="${cert.title}">
                <div class="certificate-glow"></div>
                ${cert.images.length > 1 ? '<div class="multi-badge"><i class="fas fa-images"></i> ' + cert.images.length + '</div>' : ''}
            </div>
            <div class="certificate-content">
                <h3 class="certificate-title">${cert.title}</h3>
                <p class="certificate-issuer">${cert.issuer}</p>
                <p class="certificate-date">${cert.date}</p>
            </div>
        `;
        
        certificatesDisplay.appendChild(card);
    });
}

function openCertificateModal(images, title) {
    currentCertImages = images;
    currentImageIndex = 0;
    
    const modal = document.getElementById('certificateModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = '';
    
    if (images.length === 1) {
        modalContent.innerHTML = `
            <div class="modal-main-image">
                <img src="${images[0]}" alt="${title}">
            </div>
        `;
    } else {
        const isDesktop = window.innerWidth > 1024;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isMobile = window.innerWidth <= 768;
        
        if (isDesktop) {
            modalContent.innerHTML = `
                <div class="modal-desktop-layout">
                    <div class="modal-preview-left" onclick="selectPrevImage(event)">
                        <img src="${images[1]}" alt="Previous">
                    </div>
                    
                    <div class="modal-main-image">
                        <img id="modalMainImage" src="${images[0]}" alt="${title}">
                    </div>
                    
                    <div class="modal-preview-right" onclick="selectNextImage(event)">
                        <img src="${images[1]}" alt="Next">
                    </div>
                </div>
            `;
        } else if (isTablet) {
            modalContent.innerHTML = `
                <div class="modal-tablet-layout">
                    <button class="modal-nav-btn modal-prev" onclick="prevImage(event)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="modal-main-image">
                        <img id="modalMainImage" src="${images[0]}" alt="${title}">
                    </div>
                    
                    <button class="modal-nav-btn modal-next" onclick="nextImage(event)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div class="modal-mobile-layout">
                    <div class="modal-main-image">
                        <img id="modalMainImage" src="${images[0]}" alt="${title}">
                    </div>
                    
                    <div class="modal-thumbnails-bottom">
                        ${images.map((img, index) => `
                            <div class="modal-thumb ${index === 0 ? 'active' : ''}" onclick="selectImage(${index}, event)">
                                <img src="${img}" alt="Image ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function selectImage(index, event) {
    event.stopPropagation();
    currentImageIndex = index;
    updateModalImage();
}

function selectPrevImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + currentCertImages.length) % currentCertImages.length;
    updateModalImage();
}

function selectNextImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % currentCertImages.length;
    updateModalImage();
}

function prevImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + currentCertImages.length) % currentCertImages.length;
    updateModalImage();
}

function nextImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % currentCertImages.length;
    updateModalImage();
}

function updateModalImage() {
    const mainImage = document.getElementById('modalMainImage');
    const currentNum = document.getElementById('currentImageNum');
    const thumbnails = document.querySelectorAll('.modal-thumb');
    const previewLeft = document.querySelector('.modal-preview-left img');
    const previewRight = document.querySelector('.modal-preview-right img');
    
    if (mainImage) {
        mainImage.src = currentCertImages[currentImageIndex];
    }
    
    if (currentNum) {
        currentNum.textContent = currentImageIndex + 1;
    }
    
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
    
    if (previewLeft && previewRight) {
        const prevIndex = (currentImageIndex - 1 + currentCertImages.length) % currentCertImages.length;
        const nextIndex = (currentImageIndex + 1) % currentCertImages.length;
        
        previewLeft.src = currentCertImages[prevIndex];
        previewRight.src = currentCertImages[nextIndex];
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentCertImages = [];
    currentImageIndex = 0;
}

const projects = [
    {
        title: "Personal Portfolio",
        desc: "A professional portfolio website designed and developed to showcase my creative profile, technical skills, and latest projects.",
        image: "assets/thumbproject/portfolio.png",
        badges: ["UI/UX Design", "Web Development"],
        role: "UI/UX Designer & Web Developer",
        images: [
            "assets/modalproject/porto1.png",
            "assets/modalproject/porto2.png",
            "assets/modalproject/porto3.png",
            "assets/modalproject/porto4.png",
            "assets/modalproject/porto5.png",
            "assets/modalproject/porto6.png",
            "assets/modalproject/porto7.png",
            "assets/modalproject/porto8.png",
            "assets/modalproject/porto9.png"
        ]
    },
    {
        title: "Kirke Beta",
        desc: "A marketplace platform for digital illustrators to showcase their work and manage artwork sales through a streamlined interface.",
        image: "assets/thumbproject/kirke.png",
        badges: ["UI/UX Design"],
        role: "UI/UX Designer",
        images: [
            "assets/modalproject/comingsoon.png"
        ]
    },
    {
        title: "Oura Store",
        desc: "A specialized e-commerce web design for game currency top-ups, featuring a fast and secure flow for purchasing in-game diamonds.",
        image: "assets/thumbproject/oura.png",
        badges: ["UI/UX Design"],
        role: "UI/UX Designer",
        images: [
            "assets/modalproject/comingsoon.png"
        ]
    },
    {
        title: "LaundryXpress",
        desc: "A zone-based web platform for local laundry services that allows users to check regional pricing and book laundry packages.",
        image: "assets/thumbproject/laundry.png",
        badges: ["UI/UX Design"],
        role: "UI/UX Designer",
        images: [
            "assets/modalproject/comingsoon.png"
        ]
    },
    {
        title: "Internet Rakyat",
        desc: "The cheapest internet service provider website with speeds comparable to its more expensive competitors.",
        image: "assets/thumbproject/internetrakyat.png",
        badges: ["UI/UX Design"],
        role: "UI/UX Designer",
        images: [
            "assets/modalproject/internet1.png",
            "assets/modalproject/internet2.png",
            "assets/modalproject/internet3.png",
            "assets/modalproject/internet4.png",
            "assets/modalproject/internet5.png",
            "assets/modalproject/internet6.png",
            "assets/modalproject/internet7.png",
            "assets/modalproject/internet8.png",
            "assets/modalproject/internet9.png",
            "assets/modalproject/internet10.png",
            "assets/modalproject/internet11.png"
        ]
    },
    {
        title: "Rimba Planner",
        desc: "A consultation-based web platform for mountain trekking that provides trip planning services and travel booking for hikers.",
        image: "assets/thumbproject/rimba.png",
        badges: ["UI/UX Design"],
        role: "UI/UX Designer",
        images: [
            "assets/modalproject/rimba1.png",
            "assets/modalproject/rimba2.png",
            "assets/modalproject/rimba3.png",
            "assets/modalproject/rimba4.png",
            "assets/modalproject/rimba5.png",
            "assets/modalproject/rimba6.png",
            "assets/modalproject/rimba7.png",
            "assets/modalproject/rimba8.png"
        ]
    },
    {
        title: "Smart Queue",
        desc: "A multi-purpose queue system featuring real-time tracking, administrative controls, and a customer feedback management portal.",
        image: "assets/thumbproject/queue.png",
        badges: ["UI/UX Design", "Web Development"],
        role: "UI/UX Designer & Web Developer",
        images: [
            "assets/modalproject/comingsoon.png"
        ]
    },
    {
        title: "Wind Monitor",
        desc: "An Internet of Things-based weather monitoring website designed to collect environmental data in real time and serve as an early warning system for natural disasters.",
        image: "assets/thumbproject/iot.png",
        badges: ["UI/UX Design", "Web Development"],
        role: "UI/UX Designer & Web Developer",
        images: [
            "assets/modalproject/comingsoon.png"
        ]
    }
];

function renderProjects() {
    const projectsDisplay = document.getElementById("projectsDisplay");
    const seeMoreContainer = document.getElementById("seeMoreContainer");
    const btnSeeMore = document.getElementById("btnSeeMore");
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const initialCount = isMobile ? 4 : 6;
    
    if (!projectsDisplay) return;
    
    const projectsToShow = showAllProjects ? projects : projects.slice(0, initialCount);
    
    if (showAllProjects && projectsDisplay.children.length <= initialCount) {
        for (let i = projectsDisplay.children.length; i < projects.length; i++) {
            const project = projects[i];
            const card = document.createElement("div");
            card.className = "project-card";
            card.setAttribute('data-index', i);
            card.style.opacity = '1';
            card.style.transform = 'translate(0, 0)';
            card.onclick = () => openProjectModal(i);
            
            const badgesHTML = project.badges.map(badge => 
                `<span class="project-badge">${badge}</span>`
            ).join('');
            
            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.desc}</p>
                    <div class="project-badges">${badgesHTML}</div>
                </div>
            `;
            
            projectsDisplay.appendChild(card);
        }
    } else if (!showAllProjects && projectsDisplay.children.length > initialCount) {
        while (projectsDisplay.children.length > initialCount) {
            projectsDisplay.removeChild(projectsDisplay.lastChild);
        }
    } else {
        projectsDisplay.innerHTML = '';
        
        projectsToShow.forEach((project, index) => {
            const card = document.createElement("div");
            card.className = "project-card";
            card.setAttribute('data-index', index);
            card.onclick = () => openProjectModal(index);
            
            if (isSmallMobile || projectsAnimated || portfolioObserved) {
                card.style.opacity = '1';
            }
            
            const badgesHTML = project.badges.map(badge => 
                `<span class="project-badge">${badge}</span>`
            ).join('');
            
            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.desc}</p>
                    <div class="project-badges">${badgesHTML}</div>
                </div>
            `;
            
            projectsDisplay.appendChild(card);
        });
        
        if (isSmallMobile) {
            projectsAnimated = true;
            projectsDisplay.classList.add('rendered');
        } else if (portfolioObserved && !projectsAnimated) {
            setTimeout(() => animateProjects(), 100);
        }
    }
    
    if (seeMoreContainer && btnSeeMore) {
        if (projects.length <= initialCount) {
            seeMoreContainer.style.display = 'none';
        } else {
            seeMoreContainer.style.display = 'flex';
            
            if (showAllProjects) {
                btnSeeMore.innerHTML = '<span>Show Less Projects</span>';
            } else {
                btnSeeMore.innerHTML = '<span>See More Projects</span>';
            }
        }
        
        if (portfolioObserved && !seeMoreContainer.classList.contains('animate-in')) {
            setTimeout(() => {
                seeMoreContainer.classList.add('animate-in');
            }, 500);
        }
    }
}

function openProjectModal(index) {
    const project = projects[index];
    const modal = document.getElementById('projectModal');
    const modalContent = modal.querySelector('.modal-content');
    
    const badgesHTML = project.badges.map(badge => 
        `<span class="project-badge">${badge}</span>`
    ).join('');
    
    const imagesHTML = project.images.map(imgPath => 
        `<img src="${imgPath}" alt="${project.title}" loading="lazy">`
    ).join('');
    
    modalContent.innerHTML = `
        <div class="project-modal-sidebar">
            <h2>${project.title}</h2>
            
            <div class="project-modal-meta">
                <span class="project-modal-role">My role. ${project.role}</span>
            </div>
            
            <div class="project-modal-section">
                <h3>Project description.</h3>
                <p>${project.desc}</p>
            </div>
            
            <div class="project-modal-section">
                <h3>Skills and deliverables</h3>
                <div class="project-modal-badges">
                    ${badgesHTML}
                </div>
            </div>
            
            <div class="project-modal-section">
                <h3>Published on Dec 25, 2025</h3>
            </div>
        </div>
        
        <div class="project-modal-main">
            <div class="project-modal-images">
                ${imagesHTML}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function scrollToPortfolioSection(section) {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        setTimeout(() => {
            if (section === 'projects') {
                switchTab('projects');
            } else if (section === 'certificates') {
                switchTab('certificates');
            }
        }, 800);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (index === 0) {
                scrollToPortfolioSection('projects');
            } else if (index === 1) {
                scrollToPortfolioSection('certificates');
            }
        });
    });
});

function toggleShowAllProjects() {
    showAllProjects = !showAllProjects;
    renderProjects();
    
    if (!showAllProjects) {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function animateProjects() {
    const isSmallMobile = window.innerWidth <= 480;
    
    if (isSmallMobile) {
        projectsAnimated = true;
        return;
    }
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const position = index % 3;
        setTimeout(() => {
            card.style.opacity = '1';
            
            if (position === 0) {
                card.classList.add('animate-bottom-left');
            } else if (position === 1) {
                card.classList.add('animate-bottom-center');
            } else {
                card.classList.add('animate-bottom-right');
            }
        }, 100 * index);
    });
    
    projectsAnimated = true;
}

window.addEventListener('resize', () => {
    if (!showAllProjects) {
        renderProjects();
    }
});

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const templateParams = {
            name: name,
            email: email,
            message: message,
            title: 'Contact Us'
        };
        
        emailjs.send('service_d1bb4t2', 'template_whcrepp', templateParams)
            .then(function() {
                showNotification(
                    'success',
                    'Message Sent!',
                    'Your message has been sent successfully!'
                );
                contactForm.reset();
            }, function(error) {
                showNotification(
                    'error',
                    'Send Failed!',
                    'Failed to send message. Please try again or contact me directly via Instagram.'
                );
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            });
    });
}

function showNotification(type, title, message) {
    const popup = document.getElementById('notificationPopup');
    const icon = document.getElementById('notificationIcon');
    const titleElement = document.getElementById('notificationTitle');
    const textElement = document.getElementById('notificationText');
    
    if (type === 'success') {
        icon.className = 'notification-icon';
        icon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon.className = 'notification-icon error';
        icon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    
    titleElement.textContent = title;
    textElement.textContent = message;
    
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const popup = document.getElementById('notificationPopup');
    popup.classList.remove('show');
    document.body.style.overflow = '';
}

const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');
const commentCount = document.getElementById('commentCount');

function formatDate(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function updateCommentCount() {
    if (!commentsRef) return;
    
    const onceQuery = window.firebaseQuery(commentsRef);
    window.firebaseOnValue(onceQuery, (snapshot) => {
        const count = snapshot.size || 0;
        if (commentCount) {
            commentCount.textContent = count + 1;
        }
    }, { onlyOnce: true });
}

function renderComment(commentId, commentData) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.id = `comment-${commentId}`;
    
    const avatarHTML = commentData.photoURL 
        ? `<img src="${commentData.photoURL}" alt="${commentData.name}">`
        : `<div class="default-avatar"><i class="fas fa-user"></i></div>`;
    
    commentItem.innerHTML = `
        <div class="comment-avatar">
            ${avatarHTML}
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-name">${commentData.name}</span>
                <span class="comment-date">${formatDate(commentData.timestamp)}</span>
            </div>
            <p class="comment-text">${commentData.message}</p>
        </div>
    `;
    
    return commentItem;
}

function loadComments() {
    if (!commentsList || !commentsRef) return;
    
    const commentsQuery = window.firebaseQuery(
        commentsRef, 
        window.firebaseOrderByChild('timestamp')
    );
    
    window.firebaseOnValue(commentsQuery, (snapshot) => {
        commentsList.innerHTML = '';
        
        const comments = [];
        snapshot.forEach((childSnapshot) => {
            comments.push({
                id: childSnapshot.key,
                data: childSnapshot.val()
            });
        });
        
        comments.reverse().forEach(comment => {
            const commentElement = renderComment(comment.id, comment.data);
            commentsList.appendChild(commentElement);
        });
        
        updateCommentCount();
    });
}

if (commentForm) {
    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!canPostComment()) {
            const timeLeft = getTimeUntilNextComment();
            showNotification(
                'error',
                'Comment Limit Reached!',
                `You can only post one comment per day. Please try again in ${timeLeft}.`
            );
            return;
        }
        
        const name = document.getElementById('commentName').value.trim();
        const message = document.getElementById('commentMessage').value.trim();
        
        if (!name || !message) {
            showNotification(
                'error',
                'Incomplete Form!',
                'Please fill in all required fields (Name and Message).'
            );
            return;
        }
        
        if (name.length < 3) {
            showNotification(
                'error',
                'Invalid Name!',
                'Name must be at least 3 characters long.'
            );
            return;
        }
        
        if (message.length < 10) {
            showNotification(
                'error',
                'Message Too Short!',
                'Message must be at least 10 characters long.'
            );
            return;
        }
        
        const submitBtn = commentForm.querySelector('.btn-submit');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
        
        try {
            await waitForFirebase();
            
            const timestamp = Date.now();
            
            const newComment = {
                name: name,
                message: message,
                photoURL: null,
                timestamp: timestamp,
                date: new Date(timestamp).toISOString()
            };
            
            await window.firebasePush(commentsRef, newComment);
            
            saveCommentTime();
            commentForm.reset();
            
            showNotification(
                'success',
                'Comment Posted!',
                'Your comment has been posted successfully.'
            );
            
        } catch (error) {
            console.error('Error posting comment:', error);
            
            let errorMessage = 'Failed to post comment. Please try again later.';
            
            if (error.code === 'PERMISSION_DENIED') {
                errorMessage = 'Permission denied. Please check Firebase rules.';
            } else if (error.message && error.message.includes('network')) {
                errorMessage = 'Network error. Please check your internet connection.';
            }
            
            showNotification(
                'error',
                'Post Failed!',
                errorMessage
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Comment';
        }
    });
    
    window.addEventListener('DOMContentLoaded', function() {
        if (!canPostComment()) {
            const submitBtn = commentForm.querySelector('.btn-submit');
            const timeLeft = getTimeUntilNextComment();
            
            if (submitBtn && timeLeft) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-clock"></i> Available in ${timeLeft}`;
                submitBtn.style.opacity = '0.6';
                submitBtn.style.cursor = 'not-allowed';
                
                const updateInterval = setInterval(() => {
                    if (canPostComment()) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Comment';
                        submitBtn.style.opacity = '1';
                        submitBtn.style.cursor = 'pointer';
                        clearInterval(updateInterval);
                    } else {
                        const newTimeLeft = getTimeUntilNextComment();
                        if (newTimeLeft) {
                            submitBtn.innerHTML = `<i class="fas fa-clock"></i> Available in ${newTimeLeft}`;
                        }
                    }
                }, 60000);
            }
        }
    });
}

const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            if (entry.target.id === 'about') {
                animateAboutSection();
            }
            
            if (entry.target.id === 'portfolio') {
                portfolioObserved = true;
                animatePortfolioSection();
            }
        }
    });
}, observerOptions);

function animateAboutSection() {
    const aboutHeader = document.querySelector('.about-header');
    const aboutContent = document.querySelector('.about-content');
    const aboutStats = document.querySelector('.about-stats-wrapper');
    
    setTimeout(() => {
        aboutHeader.classList.add('animate-in');
        animateAboutText();
    }, 400);
    
    setTimeout(() => {
        aboutContent.classList.add('animate-in');
    }, 700);
    
    setTimeout(() => {
        aboutStats.classList.add('animate-in');
    }, 1000);
}

function animatePortfolioSection() {
    const portfolioHeader = document.querySelector('.portfolio-header');
    const tabNavigation = document.querySelector('.tab-navigation');
    const activeTabContent = document.querySelector('.tab-content.active');
    const seeMoreContainer = document.getElementById('seeMoreContainer');
    
    if (portfolioHeader) {
        portfolioHeader.classList.add('animate-in');
    }
    
    if (tabNavigation) {
        tabNavigation.classList.add('animate-in');
    }
    
    if (activeTabContent) {
        activeTabContent.classList.add('animate-in');
        
        if (activeTabContent.id === 'projectsContent') {
            setTimeout(() => animateProjects(), 100);
            
            if (seeMoreContainer) {
                setTimeout(() => {
                    seeMoreContainer.classList.add('animate-in');
                }, 500);
            }
        }
        
        if (activeTabContent.id === 'certificatesContent') {
            const certificateCards = document.querySelectorAll('.certificate-card');
            certificateCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.classList.add('animate-in');
                }, 50 * index);
            });
        }
        
        if (activeTabContent.id === 'techstackContent') {
            const techstackCards = document.querySelectorAll('.techstack-card');
            techstackCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.classList.add('animate-in');
                }, 50 * index);
            });
        }
    }
}

function animateAboutText() {
    const name = document.getElementById('aboutName');
    
    if (!name || name.hasAttribute('data-animated')) return;
    
    name.setAttribute('data-animated', 'true');
    
    const nameText = "Muhammad Farid Syam";
    
    name.innerHTML = '';
    
    nameText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'name-letter';
        span.style.animationDelay = `${index * 0.09}s`;
        name.appendChild(span);
    });
}

renderProjects();