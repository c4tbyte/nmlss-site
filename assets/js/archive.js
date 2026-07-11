const cloudName = 'ycvrsako';
const tag = 'archive';
let allImages = [];
let currentModalIndex = 0;

fetch(`https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`)
.then(res => res.json())
.then(data => {
    const grid = document.getElementById('archiveGrid');
    allImages = data.resources
    .sort((a, b) => a.public_id.localeCompare(b.public_id, undefined, { numeric: true }))
    .map(img => `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}`);

    allImages.forEach(imgUrl => {
        grid.innerHTML += `
        <div class="archive-item" onclick="openModal('${imgUrl}')">
        <img src="${imgUrl}" alt="">
        </div>`;
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
