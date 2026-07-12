const splash = document.getElementById('splash');
const audio = document.getElementById('bgAudio');

splash.addEventListener('click', () => {
    audio.volume = 0.0001;
    audio.play();

    let vol = 0;
    const fadeIn = setInterval(() => {
        vol += 0.001;
        if (vol >= 0.12) {
            audio.volume = 0.12;
            clearInterval(fadeIn);
        } else {
            audio.volume = vol;
        }
    }, 100);

    document.getElementById('splashText').style.display = 'none';
    document.getElementById('splashLogo').style.animation = 'splashShrink 1s ease forwards';

    setTimeout(() => {
        splash.style.display = 'none';
        document.querySelector('.content').style.animation = 'none';
        document.querySelector('.content').style.opacity = '1';
    }, 1000);

    sessionStorage.setItem('visited', 'true');
});

if (sessionStorage.getItem('visited')) {
    splash.style.display = 'none';
    document.querySelector('.content').classList.add('visible');
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        audio.pause();
    } else {
        audio.play();
    }
});

const cloudName = 'ycvrsako';
const shopSlug = 'officiallynmlssentity';
const folder = 'featured';
let page = 0;
let allImages = [];
let currentModalIndex = 0;

const modal = document.getElementById('modal');
const shopModal = document.getElementById('shopModal');

// gallery
fetch(`https://res.cloudinary.com/${cloudName}/image/list/${folder}.json`)
.then(res => res.json())
.then(data => {
    const track = document.getElementById('galleryTrack');
    const images = data.resources.sort((a, b) =>
    a.public_id.localeCompare(b.public_id, undefined, { numeric: true })
    );
    const perPage = 10;
    const totalPages = Math.ceil(images.length / perPage);

    for (let i = 0; i < images.length; i += perPage) {
        const galleryPage = document.createElement('div');
        galleryPage.className = 'gallery-page';
        images.slice(i, i + perPage).forEach(img => {
            const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}`;
            allImages.push(imgUrl);
            galleryPage.innerHTML += `
            <div class="gallery-item" onclick="openModal('${imgUrl}')">
            <img src="${imgUrl}" alt="">
            </div>`;
        });
        track.appendChild(galleryPage);
    }

    document.querySelector('.arrow.left').addEventListener('click', () => {
        if (page > 0) page--;
        track.style.transform = `translateX(-${page * 100}%)`;
    });

    document.querySelector('.arrow.right').addEventListener('click', () => {
        if (page < totalPages - 1) page++;
        track.style.transform = `translateX(-${page * 100}%)`;
    });
});

// rec blink
const words = ['REC', 'DEATH', 'VOID', 'DECAY', 'ROT', 'PAIN', 'DARK', 'FEAR', 'SORROW', 'ANGUISH', 'MOURN', 'SUFFER'];
let i = 0;
let blinks = 0;
const recText = document.querySelector('.rec-text');
const recDot = document.querySelector('.rec-dot');

setInterval(() => {
    recDot.style.opacity = recDot.style.opacity === '0' ? '1' : '0';
    blinks++;
    if (blinks % 4 === 0) {
        i = (i + 1) % words.length;
        recText.textContent = words[i];
    }
}, 600);

// timestamp
function updateTimestamp() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = String(hours % 12 || 12).padStart(2, '0');
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    document.querySelector('.timestamp-time').textContent = `${ampm} ${h}:${minutes}:${seconds}`;
    document.querySelector('.timestamp-date').textContent = date;
}
updateTimestamp();
setInterval(updateTimestamp, 1000);

// shop
function loadShop() {
    const grid = document.getElementById('shopGrid');
    if (grid.children.length > 0) return;

    fetch(`https://api.bigcartel.com/${shopSlug}/products.json`)
    .then(res => res.json())
    .then(products => {
        if (products.length === 0) {
            grid.innerHTML = '<p class="shop-empty">COMING SOON...</p>';
            return;
        }
        products.forEach(product => {
            const img = product.images[0]?.secure_url || '';
            const price = `$${parseFloat(product.price).toFixed(2)}`;
            grid.innerHTML += `
            <div class="shop-card" onclick="openShopModal(${product.id})">
            <img src="${img}" alt="${product.name}">
            <p class="shop-card-title">${product.name}</p>
            <p class="shop-card-price">${price}</p>
            </div>`;
        });
        window.shopProducts = products;
    });
}

function openShopModal(id) {
    const product = window.shopProducts.find(p => p.id === id);
    if (!product) return;

    document.getElementById('shopModalImg').src = product.images[0]?.secure_url || '';
    document.getElementById('shopModalTitle').textContent = product.name;
    document.getElementById('shopModalPrice').textContent = `$${parseFloat(product.price).toFixed(2)}`;
    document.getElementById('shopModalDesc').innerHTML = product.description;

    const select = document.getElementById('shopModalSelect');
    select.innerHTML = '';
    if (product.options.length > 1) {
        product.options.forEach(opt => {
            select.innerHTML += `<option value="${opt.id}">${opt.name}</option>`;
        });
        select.style.display = 'block';
    } else {
        select.style.display = 'none';
    }

    document.getElementById('shopModalBtn').href = `https://${shopSlug}.bigcartel.com${product.url}`;

    select.addEventListener('change', () => {
        document.getElementById('shopModalBtn').href = `https://${shopSlug}.bigcartel.com/cart/add?id=${select.value}`;
    });

    shopModal.classList.add('active');
}

document.getElementById('shopModalClose').addEventListener('click', () => shopModal.classList.remove('active'));

shopModal.addEventListener('click', (e) => {
    if (e.target === shopModal) shopModal.classList.remove('active');
});

// nav
const sections = {
    home: document.querySelector('.gallery'),
    about: document.getElementById('aboutSection'),
    shop: document.getElementById('shopSection')
};

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const section = link.textContent.toLowerCase();
        document.querySelector('nav').classList.remove('open');

        if (section === 'archive') return;

        e.preventDefault();
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        Object.values(sections).forEach(s => s.style.display = 'none');

        if (section === 'home') sections.home.style.display = 'flex';
        else if (section === 'about') sections.about.style.display = 'block';
        else if (section === 'shop') {
            sections.shop.style.display = 'flex';
            loadShop();
        }
    });
});

// gallery modal
function openModal(src) {
    currentModalIndex = allImages.indexOf(src);
    document.getElementById('modalImg').src = src;
    modal.classList.add('active');
}

function updateModal(index) {
    currentModalIndex = (index + allImages.length) % allImages.length;
    document.getElementById('modalImg').src = allImages[currentModalIndex];
}

document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('active'));

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

document.getElementById('modalPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    updateModal(currentModalIndex - 1);
});

document.getElementById('modalNext').addEventListener('click', (e) => {
    e.stopPropagation();
    updateModal(currentModalIndex + 1);
});

// hamburger
document.getElementById('hamburger').addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('open');
});

// noise
const canvas = document.getElementById('noise');
const ctx = canvas.getContext('2d');

function generateNoise() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const val = Math.random() * 255;
        imageData.data[i] = val;
        imageData.data[i+1] = val;
        imageData.data[i+2] = val;
        imageData.data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(generateNoise);
}

generateNoise();
