const cloudName = 'ycvrsako';
const tag = 'archive';
let allImages = [];
let currentModalIndex = 0;

const archiveGrid = document.getElementById('archiveGrid');
const aboutSection = document.getElementById('aboutSection');
const modal = document.getElementById('modal');

fetch(`https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`)
.then(res => res.json())
.then(data => {
    allImages = data.resources
    .sort((a, b) => a.public_id.localeCompare(b.public_id, undefined, { numeric: true }))
    .map(img => `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}`);

    allImages.forEach(imgUrl => {
        archiveGrid.innerHTML += `
        <div class="archive-item" onclick="openModal('${imgUrl}')">
        <img src="${imgUrl}" alt="">
        </div>`;
    });
});

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

document.getElementById('hamburger').addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('open');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const section = link.textContent.toLowerCase();
        document.querySelector('nav').classList.remove('open');

        if (section === 'archive') {
            e.preventDefault();
            archiveGrid.style.display = 'block';
            aboutSection.style.display = 'none';
        } else if (section === 'about') {
            e.preventDefault();
            archiveGrid.style.display = 'none';
            aboutSection.style.display = 'block';
        }

        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
    });
});
