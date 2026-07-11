if (sessionStorage.getItem('visited')) {
    document.getElementById('splash').style.display = 'none';
    document.querySelector('.content').style.animation = 'none';
    document.querySelector('.content').style.opacity = '1';
} else {
    sessionStorage.setItem('visited', 'true');
}
const cloudName = 'ycvrsako';
const folder = 'featured';
let page = 0;
let totalPages = 0;
let allImages = [];
let currentModalIndex = 0;

fetch(`https://res.cloudinary.com/${cloudName}/image/list/${folder}.json`)
.then(res => res.json())
.then(data => {
    const track = document.getElementById('galleryTrack');
    const images = data.resources.sort((a, b) =>
    a.public_id.localeCompare(b.public_id, undefined, { numeric: true })
    );
    const perPage = 10;

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

    totalPages = Math.ceil(images.length / perPage);

    document.querySelector('.arrow.left').addEventListener('click', () => {
        if (page > 0) page--;
        track.style.transform = `translateX(-${page * 100}%)`;
    });

    document.querySelector('.arrow.right').addEventListener('click', () => {
        if (page < totalPages - 1) page++;
        track.style.transform = `translateX(-${page * 100}%)`;
    });
});

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

const sections = {
    home: document.querySelector('.gallery'),
    about: document.getElementById('aboutSection'),
    shop: document.getElementById('shopSection')
};

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const section = link.textContent.toLowerCase();

        if (section === 'archive') return;

        e.preventDefault();
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        Object.values(sections).forEach(s => s.style.display = 'none');
        if (section === 'home') {
            sections.home.style.display = 'flex';
        } else if (section === 'about') {
            sections.about.style.display = 'block';
        } else if (section === 'shop') {
            sections.shop.style.display = 'block';
        }
    });
});

function openModal(src) {
    currentModalIndex = allImages.indexOf(src);
    document.getElementById('modalImg').src = src;
    document.getElementById('modal').classList.add('active');
}

function updateModal(index) {
    currentModalIndex = (index + allImages.length) % allImages.length;
    document.getElementById('modalImg').src = allImages[currentModalIndex];
}

document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        document.getElementById('modal').classList.remove('active');
    }
});

document.getElementById('modalPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    updateModal(currentModalIndex - 1);
});

document.getElementById('modalNext').addEventListener('click', (e) => {
    e.stopPropagation();
    updateModal(currentModalIndex + 1);
});

const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('open');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav').classList.remove('open');
    });
});
