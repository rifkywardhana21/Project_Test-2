const cardContainer = document.getElementById('card-container');
const metaInfo = document.getElementById('meta-info');
const pageSizeSelect = document.getElementById('page-size');
const sortSelect = document.getElementById('sort');
const pagination = document.getElementById('pagination');
const API_URL = 'https://suitmedia-backend.suitdev.com/api/ideas';



// ✅ Gunakan localStorage agar state tidak hilang saat refresh
let currentPage = parseInt(localStorage.getItem('page')) || 1;
let totalItems = 100; // fallback
let totalPages = 10;

// Ambil state tersimpan jika ada
if (localStorage.getItem('pageSize')) {
    pageSizeSelect.value = localStorage.getItem('pageSize');
}
if (localStorage.getItem('sort')) {
    sortSelect.value = localStorage.getItem('sort');
}

function loadArticles() {
    const pageSize = parseInt(pageSizeSelect.value);
    const sort = sortSelect.value;

    // Simpan state
    localStorage.setItem('page', currentPage);
    localStorage.setItem('pageSize', pageSize);
    localStorage.setItem('sort', sort);

    fetch(`https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`, {
            headers: { 'Accept': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            const articles = data.data;
            totalItems = data.meta.total || 100;
            totalPages = Math.ceil(totalItems / pageSize);
            renderArticles(articles);
            renderPagination();
            metaInfo.textContent = `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`;
        })
        .catch(err => {
            console.error('API failed, fallback to demoData():', err);
            const articles = demoData();
            totalItems = 100;
            totalPages = Math.ceil(totalItems / pageSize);
            renderArticles(articles);
            renderPagination();
            metaInfo.textContent = `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`;
        });
}

function renderArticles(articles) {
    cardContainer.innerHTML = '';
    articles.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const link = document.createElement('a');
        link.href = `detail.html?slug=${article.slug || article.id}`;
        link.className = 'card-link';

        // Ganti thumbnail lokal dengan URL dari artikel
        const imageUrl = article.image_url || 'https://placehold.co/300x200?text=No+Image';

        link.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}" loading="lazy">
            <h4 class="truncate">${article.title}</h4>
            <p>${new Date(article.published_at).toLocaleDateString()}</p>
        `;

        card.appendChild(link);
        cardContainer.appendChild(card);
    });
}




function renderPagination() {
    pagination.innerHTML = '';

    const createButton = (text, page, disabled = false, active = false) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'pagination-btn';
        if (disabled) btn.disabled = true;
        if (active) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = page;
            loadArticles();
        });
        return btn;
    };

    const addDots = () => {
        const span = document.createElement('span');
        span.textContent = '...';
        span.className = 'pagination-dots';
        pagination.appendChild(span);
    };

    pagination.appendChild(createButton('«', 1, currentPage === 1));
    pagination.appendChild(createButton('‹', currentPage - 1, currentPage === 1));

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    if (currentPage > 2) {
        pagination.appendChild(createButton('1', 1));
        if (start > 2) addDots();
    }

    for (let i = start; i <= end; i++) {
        pagination.appendChild(createButton(i, i, false, i === currentPage));
    }

    if (currentPage < totalPages - 1) {
        if (end < totalPages - 1) addDots();
        pagination.appendChild(createButton(totalPages, totalPages));
    }

    pagination.appendChild(createButton('›', currentPage + 1, currentPage === totalPages));
    pagination.appendChild(createButton('»', totalPages, currentPage === totalPages));
}

function demoData() {
    const pageSize = parseInt(pageSizeSelect.value);
    return Array(pageSize).fill(0).map((_, i) => ({
        small_image: `https://placekitten.com/300/200?${i + (currentPage - 1) * pageSize}`,
        title: `Demo Article ${i + 1 + (currentPage - 1) * pageSize}`,
        published_at: "2022-09-05",
        slug: `demo-article-${i + 1 + (currentPage - 1) * pageSize}`
    }));
}

pageSizeSelect.addEventListener('change', () => {
    currentPage = 1;
    loadArticles();
});
sortSelect.addEventListener('change', () => {
    currentPage = 1;
    loadArticles();
});

loadArticles();
card.innerHTML = `
  <a href="detail.html?slug=${article.slug}" class="card-link">
    <img src="demo-img/thumb${imgIndex}.jpg" alt="${article.title}" loading="lazy">
    <h4 class="truncate">${article.title}</h4>
    <p>${new Date(article.published_at).toLocaleDateString()}</p>
  </a>
`;