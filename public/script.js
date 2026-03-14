document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }
});

function setVH() {
    const vh = window.visualViewport
        ? window.visualViewport.height * 0.01
        : window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();

let lastViewportWidth = window.innerWidth;

window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastViewportWidth) {
        lastViewportWidth = currentWidth;
        setVH();
    }
}, { passive: true });

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        if (window.visualViewport.width !== lastViewportWidth) {
            lastViewportWidth = window.visualViewport.width;
            setVH();
        }
    }, { passive: true });
}

emailjs.init("UrpG9fqigxq0B2m7k");

let showAllProjects  = false;
let projectsAnimated = false;
let portfolioObserved = false;
let firebaseLoaded   = false;
let commentsRef      = null;

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
    const body      = document.body;
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
    const body       = document.body;
    const themeIcon  = document.getElementById('themeIcon');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (!savedTheme) localStorage.setItem('theme', 'dark');
    }
}

loadTheme();

window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    showLoadingScreen();
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent   = document.getElementById('portfolioPage');
    const nav           = document.querySelector('nav');

    loadingScreen.style.display = 'flex';
    mainContent.style.display   = 'none';
    nav.style.display           = 'none';

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display   = 'block';
            nav.style.display           = 'flex';
            initializeAnimations();
            handleMusicPlayerVisibility();
            setTimeout(() => showNewSitePopup(), 600);
        }, 600);
    }, 3200);
}

async function initializeAnimations() {
    const heroContent     = document.querySelector('.hero-content');
    const heroImage       = document.querySelector('.hero-image');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (typeof lottie !== 'undefined') {
        lottie.loadAnimation({
            container: document.getElementById('lottie-animation'),
            renderer:  'svg',
            loop:      true,
            autoplay:  true,
            path: 'https://res.cloudinary.com/dnacoymkh/raw/upload/v1772046333/uisvg_vqr13z.json'
        });
    }

    if (typeof lottie !== 'undefined') {
    lottie.loadAnimation({
        container: document.getElementById('lottie-contact'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://res.cloudinary.com/dnacoymkh/raw/upload/v1772692529/email_adxthp.json'
    });
}

    setTimeout(() => { heroContent.classList.add('animate-in-left'); }, 200);
    setTimeout(() => { heroImage.classList.add('animate-in-right'); }, 400);
    setTimeout(() => { scrollIndicator.classList.add('animate-in-bottom'); }, 600);

    await waitForFirebase();
    loadComments();

    document.querySelectorAll('section:not(#home)').forEach(section => {
        section.classList.add('animate-section');
        observer.observe(section);
    });
}

function saveCommentTime() {
    try { localStorage.setItem('lastCommentTime', Date.now().toString()); } catch(e) {}
}

function canPostComment() {
    try {
        const last = localStorage.getItem('lastCommentTime');
        if (!last) return true;
        const lastTime = new Date(parseInt(last));
        const now = new Date();
        const lastDay = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate());
        const today   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return today > lastDay;
    } catch(e) { return true; }
}

function getTimeUntilNextComment() {
    try {
        const last = localStorage.getItem('lastCommentTime');
        if (!last) return null;
        const lastTime = new Date(parseInt(last));
        const tomorrow = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate() + 1);
        const diff = tomorrow - new Date();
        if (diff <= 0) return null;
        const hours   = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hours ${minutes} minutes`;
    } catch(e) { return null; }
}

const audio             = document.getElementById("audioPlayer");
const musicTitleSimple  = document.getElementById("musicTitleSimple");
const musicStatusSimple = document.getElementById("musicStatusSimple");
const musicIconSimple   = document.getElementById("musicIconSimple");
const musicPlayerSimple = document.getElementById("musicPlayerSimple");

const playlist = [
    { title: "BOO – H3ADBAND",            src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1772042090/H3ADBAND_-_BOO_Bass_Boosted_qg6gc5.mp3" },
    { title: "Berubah – Tenxi Jemsii",    src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162712/TenxiJemsii-Berubah_cjdfyf.mp3" },
    { title: "Bintang 5 – Tenxii Remix",  src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162750/Tenxii-Bintang5_ilfc8r.mp3" },
    { title: "Tabola Bale – Silet Open Up",src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162714/SiletOpenUp-TabolaBale_nuotw9.mp3" },
    { title: "Alamak – Rizky Febian",     src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162722/RizkyFebian-Alamak_yiohla.mp3" },
    { title: "Teruntuk Mia – Nuh",        src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162721/Nuh-TeruntukMia_uggo8r.mp3" },
    { title: "Monitor Ketua – Ecko Show", src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162707/EckoShow-TorMonitor_rl55yh.mp3" },
    { title: "Ngga Dulu – Akbar Chalay",  src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162742/AkbarChalay-NggaDulu_p0gzj6.mp3" },
    { title: "Mejikuhibinu – Tenxii",     src: "https://res.cloudinary.com/dnacoymkh/video/upload/v1767162671/TenxiSuisei-Mejikuhibiniu_wmz0dl.mp3" }
];

let currentTrack  = 0;
let isPlaying     = false;
let isMusicLoaded = false;

musicTitleSimple.innerText  = playlist[currentTrack].title;
musicStatusSimple.innerText = "Tap to play";

function togglePlaySimple() {
    if (!audio) return;
    if (!isMusicLoaded) {
        musicStatusSimple.innerText = "Loading...";
        musicIconSimple.className   = "fas fa-spinner fa-spin";
        audio.src     = playlist[currentTrack].src;
        isMusicLoaded = true;
        audio.addEventListener('canplay', function onCanPlay() {
            audio.play().catch(() => {
                musicStatusSimple.innerText = "Error playing";
                musicIconSimple.className   = "fas fa-exclamation-circle";
            });
            musicStatusSimple.innerText = "Playing";
            musicIconSimple.className   = "fas fa-pause";
            isPlaying = true;
            audio.removeEventListener('canplay', onCanPlay);
        }, { once: true });
        audio.addEventListener('error', function() {
            musicStatusSimple.innerText = "Failed to load";
            musicIconSimple.className   = "fas fa-exclamation-circle";
            isMusicLoaded = false;
        }, { once: true });
        return;
    }
    if (isPlaying) {
        audio.pause();
        musicStatusSimple.innerText = "Paused";
        musicIconSimple.className   = "fas fa-music";
    } else {
        audio.play().catch(() => { musicStatusSimple.innerText = "Error"; });
        musicStatusSimple.innerText = "Playing";
        musicIconSimple.className   = "fas fa-pause";
    }
    isPlaying = !isPlaying;
}

audio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    musicStatusSimple.innerText = "Loading next...";
    musicIconSimple.className   = "fas fa-spinner fa-spin";
    audio.src = playlist[currentTrack].src;
    musicTitleSimple.innerText = playlist[currentTrack].title;
    if (isPlaying) {
        audio.play().then(() => {
            musicStatusSimple.innerText = "Playing";
            musicIconSimple.className   = "fas fa-pause";
        }).catch(() => {
            musicStatusSimple.innerText = "Error";
            musicIconSimple.className   = "fas fa-exclamation-circle";
        });
    }
});

function handleMusicPlayerVisibility() {
    if (window.innerWidth <= 768) {
        const contactSection = document.getElementById('contact');
        const footer         = document.querySelector('footer');
        const contactRect    = contactSection.getBoundingClientRect();
        const footerRect     = footer.getBoundingClientRect();
        const isInContactOrFooter = contactRect.top < window.innerHeight || footerRect.top < window.innerHeight;
        musicPlayerSimple.classList.toggle('hidden', isInContactOrFooter);
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
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

function setActiveNav() {
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= (section.offsetTop - 200)) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('onclick');
        if (href && href.includes(current)) link.classList.add('active');
    });
}

window.addEventListener('scroll', setActiveNav, { passive: true });

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
}

function switchTab(tabName) {
    const projectsContent     = document.getElementById('projectsContent');
    const certificatesContent = document.getElementById('certificatesContent');
    const techstackContent    = document.getElementById('techstackContent');
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    projectsContent.classList.remove('active');
    certificatesContent.classList.remove('active');
    techstackContent.classList.remove('active');

    if (tabName === 'projects')      { projectsContent.classList.add('active');     tabBtns[0].classList.add('active'); }
    else if (tabName === 'certificates') { certificatesContent.classList.add('active'); tabBtns[1].classList.add('active'); }
    else if (tabName === 'techstack')    { techstackContent.classList.add('active');    tabBtns[2].classList.add('active'); }
}

const techStack = [
    { name: "HTML",            category: "Frontend Markup",     iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772046290/htmld_qt0sag.png",    iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772046288/html_jtph2y.png" },
    { name: "CSS",             category: "Styling & Layout",    iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053363/cssd_xdk48f.png",     iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053360/css_cijcft.png" },
    { name: "JavaScript",      category: "Programming Language",iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053320/jsd_or72qf.png",      iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053317/js_te4lzi.png" },
    { name: "C++",             category: "Programming Language",iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053357/cplusd_hdh1ik.png",   iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053355/cplus_cqbgcv.png" },
    { name: "VueJS",           category: "Frontend Framework",  iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053342/vued_fjlrak.png",     iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053339/vue_w6emv4.png" },
    { name: "Firebase",        category: "Backend & Hosting",   iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053315/firebased_phoxgj.png",iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053313/firebase_xwj9qz.png" },
    { name: "Figma",           category: "UI / UX Design",      iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053310/figmad_rpiakb.png",   iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053310/figma_uulqls.png" },
    { name: "Canva",           category: "Design Tool",         iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053352/canvad_voan4u.png",   iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053349/canva_e7decv.png" },
    { name: "Adobe Lightroom", category: "Photo Editing",       iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053332/lrd_cbbljl.png",     iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053329/lr_tbbdcb.png" },
    { name: "Microsoft Word",  category: "Office Productivity", iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053347/wordd_omwuzc.png",   iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053344/word_rv8lfc.png" },
    { name: "Microsoft Excel", category: "Office Productivity", iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053368/exceld_sckyuz.png",  iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053365/excel_cz8tcd.png" },
    { name: "PowerPoint",      category: "Office Productivity", iconLight: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053337/pwpd_f6cyfk.png",    iconDark: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772053334/pwp_si1iml.png" }
];

const techstackDisplay = document.getElementById("techstackDisplay");
if (techstackDisplay) {
    techStack.forEach(tech => {
        const card = document.createElement("div");
        card.className = "techstack-card";
        card.innerHTML = `
            <div class="techstack-icon">
                <img src="${tech.iconLight}" alt="${tech.name}" class="icon-light">
                <img src="${tech.iconDark}"  alt="${tech.name}" class="icon-dark">
            </div>
            <div class="techstack-info">
                <div class="techstack-name">${tech.name}</div>
                <div class="techstack-category">${tech.category}</div>
            </div>`;
        techstackDisplay.appendChild(card);
    });
}

const certificates = [
    { title: "Figma for UI/UX Design",  issuer: "MySkill - Skill Specialization",       date: "2026", images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046386/figmaforui-uxdesign_egeno8.jpg"] },
    { title: "Fundamental UI Design",   issuer: "Coding Studio",                        date: "2025", images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046389/fundamental-ui_apkyoz.jpg"] },
    { title: "Fundamental UX Design",   issuer: "Coding Studio",                        date: "2025", images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046384/fundamental-ux_blrsyo.jpg"] },
    { title: "Digital Representative",  issuer: "MAGENTA & PT Pegadaian",               date: "2025", images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046378/magenta_sqgzcc.jpg","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046380/magenta1_ku23df.jpg"] },
    { title: "Microsoft Office",        issuer: "Kursus Digital & LKP Borju Komputer",  date: "2024", images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046388/office_qbmp9v.png"] },
    { title: "Toefl Prediction",        issuer: "Global Operation Indonesia",            date: "2025", images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772047391/toeflp_aebj3n.jpg"] }
];

const certificatesDisplay = document.getElementById("certificatesDisplay");
let currentCertImages = [];
let currentImageIndex = 0;

if (certificatesDisplay) {
    certificates.forEach(cert => {
        const card = document.createElement("div");
        card.className = "certificate-card";
        card.onclick   = () => openCertificateModal(cert.images, cert.title);
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
            </div>`;
        certificatesDisplay.appendChild(card);
    });
}

function openCertificateModal(images, title) {
    currentCertImages = images;
    currentImageIndex = 0;
    const modal       = document.getElementById('certificateModal');
    const modalContent= modal.querySelector('.modal-content');
    modalContent.innerHTML = '';

    if (images.length === 1) {
        modalContent.innerHTML = `<div class="modal-main-image"><img src="${images[0]}" alt="${title}"></div>`;
    } else {
        const isDesktop = window.innerWidth > 1024;
        const isTablet  = window.innerWidth > 768 && window.innerWidth <= 1024;
        if (isDesktop) {
            modalContent.innerHTML = `
                <div class="modal-desktop-layout">
                    <div class="modal-preview-left" onclick="selectPrevImage(event)"><img src="${images[1]}" alt="Previous"></div>
                    <div class="modal-main-image"><img id="modalMainImage" src="${images[0]}" alt="${title}"></div>
                    <div class="modal-preview-right" onclick="selectNextImage(event)"><img src="${images[1]}" alt="Next"></div>
                </div>`;
        } else if (isTablet) {
            modalContent.innerHTML = `
                <div class="modal-tablet-layout">
                    <button class="modal-nav-btn modal-prev" onclick="prevImage(event)"><i class="fas fa-chevron-left"></i></button>
                    <div class="modal-main-image"><img id="modalMainImage" src="${images[0]}" alt="${title}"></div>
                    <button class="modal-nav-btn modal-next" onclick="nextImage(event)"><i class="fas fa-chevron-right"></i></button>
                </div>`;
        } else {
            modalContent.innerHTML = `
                <div class="modal-mobile-layout">
                    <div class="modal-main-image"><img id="modalMainImage" src="${images[0]}" alt="${title}"></div>
                    <div class="modal-thumbnails-bottom">
                        ${images.map((img, i) => `<div class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="selectImage(${i}, event)"><img src="${img}" alt="Image ${i+1}"></div>`).join('')}
                    </div>
                </div>`;
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function selectImage(index, event)  { event.stopPropagation(); currentImageIndex = index; updateModalImage(); }
function selectPrevImage(event)     { event.stopPropagation(); currentImageIndex = (currentImageIndex - 1 + currentCertImages.length) % currentCertImages.length; updateModalImage(); }
function selectNextImage(event)     { event.stopPropagation(); currentImageIndex = (currentImageIndex + 1) % currentCertImages.length; updateModalImage(); }
function prevImage(event)           { event.stopPropagation(); currentImageIndex = (currentImageIndex - 1 + currentCertImages.length) % currentCertImages.length; updateModalImage(); }
function nextImage(event)           { event.stopPropagation(); currentImageIndex = (currentImageIndex + 1) % currentCertImages.length; updateModalImage(); }

function updateModalImage() {
    const mainImage    = document.getElementById('modalMainImage');
    const thumbnails   = document.querySelectorAll('.modal-thumb');
    const previewLeft  = document.querySelector('.modal-preview-left img');
    const previewRight = document.querySelector('.modal-preview-right img');
    if (mainImage) mainImage.src = currentCertImages[currentImageIndex];
    thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === currentImageIndex));
    if (previewLeft && previewRight) {
        previewLeft.src  = currentCertImages[(currentImageIndex - 1 + currentCertImages.length) % currentCertImages.length];
        previewRight.src = currentCertImages[(currentImageIndex + 1) % currentCertImages.length];
    }
}

function closeCertificateModal() {
    document.getElementById('certificateModal').classList.remove('active');
    document.body.style.overflow = '';
    currentCertImages = [];
    currentImageIndex = 0;
}

const projects = [
    {
        title: "Personal Portfolio",
        desc:  "A professional portfolio website designed and developed to showcase my creative profile, technical skills, and latest projects.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045888/portfolio_gs14uu.png",
        badges: ["UI/UX Design", "Web Development"],
        role:   "UI/UX Designer & Web Developer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046220/porto1_e96woi.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046222/porto2_zv9t7s.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046230/porto3_q9qsih.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046217/porto4_efmvoz.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046213/porto5_lka1rv.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/porto6_yfgvzv.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046229/porto7_nadgkn.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046226/porto8_adbiyg.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046218/porto9_reejul.png"]
    },
    {
        title: "TraceLink",
        desc:  "A real-time location sharing PWA with live GPS tracking, room-based groups, and Firebase sync — built for anyone to share their whereabouts instantly.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772294839/tracelink_valcit.png",
        badges: ["UI/UX Design", "Web Development"],
        role:   "UI/UX Designer & Web Developer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "Kirke Beta",
        desc:  "A marketplace platform for digital illustrators to showcase their work and manage artwork sales through a streamlined interface.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045900/kirke_useyxf.png",
        badges: ["UI/UX Design"],
        role:   "UI/UX Designer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "IGSave",
        desc:  "A web tool to download Instagram Reels, feed posts, carousel photos, and other people's Stories — all without watermark, straight from the browser.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1773052015/igsave_fr1sty.png",
        badges: ["UI/UX Design", "Web Development"],
        role:   "UI/UX Designer & Web Developer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "TikSave",
        desc:  "A web tool to download TikTok videos without watermark — fast, free, and works directly in the browser with no app required.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1773052015/tiksave_mu47xv.png",
        badges: ["UI/UX Design", "Web Development"],
        role:   "UI/UX Designer & Web Developer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "Oura Store",
        desc:  "A specialized e-commerce web design for game currency top-ups, featuring a fast and secure flow for purchasing in-game diamonds.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045914/oura_bfb9fg.png",
        badges: ["UI/UX Design"],
        role:   "UI/UX Designer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "LaundryXpress",
        desc:  "A zone-based web platform for local laundry services that allows users to check regional pricing and book laundry packages.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045912/laundry_g5omn2.png",
        badges: ["UI/UX Design"],
        role:   "UI/UX Designer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "Internet Rakyat",
        desc:  "The cheapest internet service provider website with speeds comparable to its more expensive competitors.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045859/internetrakyat_nyju3f.png",
        badges: ["UI/UX Design"],
        role:   "UI/UX Designer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046251/internet1_o92t98.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046240/internet2_yx0ku1.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046247/internet3_wbw43b.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046228/internet4_zfn7pj.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046217/internet5_l3an6e.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046257/internet6_yn4p2g.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046243/internet7_b611fh.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046258/internet8_iuesiv.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046240/internet9_gymfcs.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046233/internet10_nd90yi.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046231/internet11_bhcczh.png"]
    },
    {
        title: "Rimba Planner",
        desc:  "A consultation-based web platform for mountain trekking that provides trip planning services and travel booking for hikers.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045917/rimba_sf67ox.png",
        badges: ["UI/UX Design"],
        role:   "UI/UX Designer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046257/rimba1_yx20wx.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046245/rimba2_lszxoz.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046243/rimba3_x7hnmd.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046234/rimba4_cycnyj.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046225/rimba5_qltr3q.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046213/rimba6_desmxg.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046249/rimba7_l3mrgs.png","https://res.cloudinary.com/dnacoymkh/image/upload/v1772046249/rimba8_qaqscq.png"]
    },
    {
        title: "Smart Queue",
        desc:  "A multi-purpose queue system featuring real-time tracking, administrative controls, and a customer feedback management portal.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045912/queue_duzmgt.png",
        badges: ["UI/UX Design", "Web Development"],
        role:   "UI/UX Designer & Web Developer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    },
    {
        title: "Wind Monitor",
        desc:  "An Internet of Things-based weather monitoring website designed to collect environmental data in real time and serve as an early warning system for natural disasters.",
        image: "https://res.cloudinary.com/dnacoymkh/image/upload/v1772045914/iot_d4c5lm.png",
        badges: ["UI/UX Design", "Web Development"],
        role:   "UI/UX Designer & Web Developer",
        images: ["https://res.cloudinary.com/dnacoymkh/image/upload/v1772046221/comingsoon_ol3ycq.png"]
    }
];

function renderProjects() {
    const projectsDisplay  = document.getElementById("projectsDisplay");
    const seeMoreContainer = document.getElementById("seeMoreContainer");
    const btnSeeMore       = document.getElementById("btnSeeMore");
    const isMobile         = window.innerWidth <= 768;
    const isSmallMobile    = window.innerWidth <= 480;
    const initialCount     = isMobile ? 4 : 6;

    if (!projectsDisplay) return;

    const projectsToShow = showAllProjects ? projects : projects.slice(0, initialCount);

    if (showAllProjects && projectsDisplay.children.length <= initialCount) {
        for (let i = projectsDisplay.children.length; i < projects.length; i++) {
            const project = projects[i];
            const card = document.createElement("div");
            card.className = "project-card";
            card.setAttribute('data-index', i);
            card.style.opacity   = '1';
            card.style.transform = 'translate(0, 0)';
            card.onclick = () => openProjectModal(i);
            const badgesHTML = project.badges.map(b => `<span class="project-badge">${b}</span>`).join('');
            card.innerHTML = `
                <div class="project-image"><img src="${project.image}" alt="${project.title}"></div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.desc}</p>
                    <div class="project-badges">${badgesHTML}</div>
                </div>`;
            projectsDisplay.appendChild(card);
        }
    } else if (!showAllProjects && projectsDisplay.children.length > initialCount) {
        while (projectsDisplay.children.length > initialCount) projectsDisplay.removeChild(projectsDisplay.lastChild);
    } else {
        projectsDisplay.innerHTML = '';
        projectsToShow.forEach((project, index) => {
            const card = document.createElement("div");
            card.className = "project-card";
            card.setAttribute('data-index', index);
            card.onclick   = () => openProjectModal(index);
            if (isSmallMobile || projectsAnimated || portfolioObserved) card.style.opacity = '1';
            const badgesHTML = project.badges.map(b => `<span class="project-badge">${b}</span>`).join('');
            card.innerHTML = `
                <div class="project-image"><img src="${project.image}" alt="${project.title}"></div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.desc}</p>
                    <div class="project-badges">${badgesHTML}</div>
                </div>`;
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
        seeMoreContainer.style.display = projects.length <= initialCount ? 'none' : 'flex';
        btnSeeMore.innerHTML = showAllProjects ? '<span>Show Less Projects</span>' : '<span>See More Projects</span>';
        if (portfolioObserved && !seeMoreContainer.classList.contains('animate-in')) {
            setTimeout(() => seeMoreContainer.classList.add('animate-in'), 500);
        }
    }
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
}

function toggleShowAllProjects() {
    showAllProjects = !showAllProjects;
    renderProjects();
    if (!showAllProjects) {
        const currentScrollY   = window.scrollY;
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            const navHeight    = document.querySelector('nav')?.offsetHeight || 70;
            const portfolioTop = portfolioSection.getBoundingClientRect().top + window.scrollY - navHeight;
            if (currentScrollY > portfolioTop) {
                window.scrollTo({ top: portfolioTop, behavior: 'smooth' });
            }
        }
    }
}

function scrollToPortfolioSection(section) {
    const portfolioSection = document.getElementById('portfolio');
    if (!portfolioSection) return;
    if (section === 'projects')          switchTab('projects');
    else if (section === 'certificates') switchTab('certificates');
    requestAnimationFrame(() => {
        const navHeight    = document.querySelector('nav')?.offsetHeight || 70;
        const portfolioTop = portfolioSection.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: portfolioTop, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (index === 0)      scrollToPortfolioSection('projects');
            else if (index === 1) scrollToPortfolioSection('certificates');
        });
    });
});

function animateProjects() {
    if (window.innerWidth <= 480) { projectsAnimated = true; return; }
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const position = index % 3;
        setTimeout(() => {
            card.style.opacity = '1';
            if (position === 0)      card.classList.add('animate-bottom-left');
            else if (position === 1) card.classList.add('animate-bottom-center');
            else                     card.classList.add('animate-bottom-right');
        }, 100 * index);
    });
    projectsAnimated = true;
}

window.addEventListener('resize', () => { if (!showAllProjects) renderProjects(); }, { passive: true });

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const honeypot = document.getElementById('hp_contact');
        if (honeypot && honeypot.value !== '') return;

        const submitBtn = contactForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        emailjs.send('service_d1bb4t2', 'template_whcrepp', {
            name:    document.getElementById('contactName').value,
            email:   document.getElementById('contactEmail').value,
            message: document.getElementById('contactMessage').value,
            title:   'Contact Us'
        }).then(() => {
            showNotification('success', 'Message Sent!', 'Your message has been sent successfully!');
            contactForm.reset();
        }, (error) => {
            showNotification('error', 'Send Failed!', 'Failed to send message. Please try again or contact me directly via Instagram.');
            console.error('EmailJS Error:', error);
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
    });
}

function showNotification(type, title, message) {
    const popup        = document.getElementById('notificationPopup');
    const icon         = document.getElementById('notificationIcon');
    const titleElement = document.getElementById('notificationTitle');
    const textElement  = document.getElementById('notificationText');
    icon.className     = type === 'success' ? 'notification-icon' : 'notification-icon error';
    icon.innerHTML     = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    titleElement.textContent = title;
    textElement.textContent  = message;
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeNotification(), 5000);
}

function closeNotification() {
    document.getElementById('notificationPopup').classList.remove('show');
    document.body.style.overflow = '';
}

const commentForm  = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');
const commentCount = document.getElementById('commentCount');

function formatDate(timestamp) {
    const diff    = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24)   return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7)     return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function updateCommentCount() {
    if (!commentsRef) return;
    window.firebaseOnValue(window.firebaseQuery(commentsRef), (snapshot) => {
        if (commentCount) commentCount.textContent = (snapshot.size || 0) + 1;
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
        <div class="comment-avatar">${avatarHTML}</div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-name">${commentData.name}</span>
                <span class="comment-date">${formatDate(commentData.timestamp)}</span>
            </div>
            <p class="comment-text">${commentData.message}</p>
        </div>`;
    return commentItem;
}

function loadComments() {
    if (!commentsList || !commentsRef) return;
    window.firebaseOnValue(
        window.firebaseQuery(commentsRef, window.firebaseOrderByChild('timestamp')),
        (snapshot) => {
            commentsList.innerHTML = '';
            const comments = [];
            snapshot.forEach(child => comments.push({ id: child.key, data: child.val() }));
            comments.reverse().forEach(c => commentsList.appendChild(renderComment(c.id, c.data)));
            updateCommentCount();
        }
    );
}

const observerOptions = { threshold: 0.05, rootMargin: '0px 0px -100px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            if (entry.target.id === 'about')     animateAboutSection();
            if (entry.target.id === 'portfolio') { portfolioObserved = true; animatePortfolioSection(); }
        }
    });
}, observerOptions);

function animateAboutSection() {
    const aboutHeader  = document.querySelector('.about-header');
    const aboutContent = document.querySelector('.about-content');
    const aboutStats   = document.querySelector('.about-stats-wrapper');
    setTimeout(() => { aboutHeader.classList.add('animate-in'); animateAboutText(); }, 400);
    setTimeout(() => { aboutContent.classList.add('animate-in'); }, 700);
    setTimeout(() => { aboutStats.classList.add('animate-in'); }, 1000);
}

function animatePortfolioSection() {
    const portfolioHeader  = document.querySelector('.portfolio-header');
    const tabNavigation    = document.querySelector('.tab-navigation');
    const activeTabContent = document.querySelector('.tab-content.active');
    const seeMoreContainer = document.getElementById('seeMoreContainer');
    if (portfolioHeader)  portfolioHeader.classList.add('animate-in');
    if (tabNavigation)    tabNavigation.classList.add('animate-in');
    if (activeTabContent) {
        activeTabContent.classList.add('animate-in');
        if (activeTabContent.id === 'projectsContent') {
            setTimeout(() => animateProjects(), 100);
            if (seeMoreContainer) setTimeout(() => seeMoreContainer.classList.add('animate-in'), 500);
        }
    }
}

function animateAboutText() {
    const name = document.getElementById('aboutName');
    if (!name || name.hasAttribute('data-animated')) return;
    name.setAttribute('data-animated', 'true');
    name.innerHTML = '';
    "Muhammad Farid Syam".split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className   = 'name-letter';
        span.style.animationDelay = `${index * 0.09}s`;
        name.appendChild(span);
    });
}

renderProjects();
function showNewSitePopup() {
    const popup = document.getElementById('newSitePopup');
    if (!popup) return;
    popup.classList.add('nsp-visible');
    document.body.style.overflow = 'hidden';
}

function closeNewSitePopup() {
    const popup = document.getElementById('newSitePopup');
    if (!popup) return;
    popup.classList.remove('nsp-visible');
    popup.classList.add('nsp-hiding');
    setTimeout(() => {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }, 400);
}