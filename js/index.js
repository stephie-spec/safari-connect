const destinationsGrid = document.getElementById('destinationsGrid');
const destinationDetail = document.getElementById('destinationDetail');
const mainContent = document.querySelector('.main-content');
const categories = document.querySelector('.categories');
const categoryBtns = document.querySelectorAll('.category-btn');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let currentDestinations = [];
let currentCategory = 'all';
let currentDetailId = null;

fetchDestinations();

function fetchDestinations() {

    fetch(`http://localhost:3000/destinations`)
        .then(response => {
            return response.json();
        })
        .then(destinations => {
            console.log('Fetched destinations:', destinations);
            currentDestinations = destinations;
            displayDestinations(destinations);
        })
        .catch(error => {
            console.error('Error fetching destinations:', error);
        });
}

function displayDestinations(destinations) {
    console.log('Displaying destinations:', destinations);
    destinationsGrid.innerHTML = '';

    destinations.forEach(destination => {
        const destinationCard = document.createElement('div');
        destinationCard.className = 'destination-card';
        destinationCard.innerHTML = `
            <div class="card-image">
                <img src="${destination.images[0]}" alt="${destination.name}">
            </div>
            <div class="card-content">
                <span class="category-tag">${destination.category}</span>
                <h3>${destination.name}</h3>
                <p>${destination.description.substring(0, 120) + '...'}</p>
                <div class="card-loc">
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${destination.location}</span>
                    </div>
                    <button class="view-btn" data-id="${destination.id}">Explore</button>
                </div>
            </div>
        `;
        destinationsGrid.appendChild(destinationCard);
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            console.log('View button clicked, ID:', id);
            viewDestination(id);
        });
    });

    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.querySelector('.view-btn').getAttribute('data-id'));
            console.log('Card clicked, ID:', id);
            viewDestination(id);
        });
    });
}

function viewDestination(id) {
    console.log('View destination with ID:', id);
    const destination = currentDestinations.find(dest => dest.id == id);

    currentDetailId = id;
    destinationsGrid.style.display = 'none';
    document.querySelector('.categories').style.display = 'none';

    destinationDetail.innerHTML = `
        <button class="back-btn" id="backToGridBtn">
            <i class="fas fa-arrow-left"></i> Back to All Destinations
        </button>
        <div class="detail-header">
            <div class="images-half">
                <div class="detail-image">
                    <img src="${destination.images[0]}" alt="${destination.name}" id="mainDetailImage">
                </div>
                <div class="image-gallery">
                    ${(destination.images).map((img, index) => `
                        <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                            <img src="${img}" alt="${destination.name}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="info-half">
                <h2>${destination.name}</h2>
                <span class="category-tag">${destination.category}</span>
                <div class="detail-info">
                    <div class="detail-item-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${destination.location}</span>
                    </div>
                    <div class="detail-item-info">
                        <i class="fas fa-star"></i>
                        <span>${destination.keyFeature}</span>
                    </div>
                    <div class="detail-item-info">
                        <i class="fas fa-mountain"></i>
                        <span>${destination.area}</span>
                    </div>
                    <div class="detail-item-info">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Est. ${destination.established}</span>
                    </div>
                </div>
                <div class="detail-description">
                    <p>${destination.description}</p>
                </div>
            </div>
        </div>
    `;
    destinationDetail.classList.add('active');

    document.getElementById('backToGridBtn').addEventListener('click', backToGrid);

    document.querySelectorAll('.gallery-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            document.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            document.getElementById('mainDetailImage').src = thumbnail.getAttribute('data-image');
        });
    });
}

function backToGrid() {
    destinationDetail.classList.remove('active');
    destinationsGrid.style.display = 'flex';
    document.querySelector('.categories').style.display = 'block';
    currentDetailId = null;
}

function filterDestinations(category) {
    currentCategory = category;

    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    if (category === 'all') {
        displayDestinations(currentDestinations);
    } else {
        const filtered = currentDestinations.filter(dest =>
            dest.category === category
        );
        displayDestinations(filtered);
    }
}

function searchDestinations(query) {
    if (!query) {
        filterDestinations(currentCategory);
        return;
    }

    const filtered = currentDestinations.filter(dest =>
        (dest.name && dest.name.toLowerCase().includes(query.toLowerCase())) ||
        (dest.description && dest.description.toLowerCase().includes(query.toLowerCase())) ||
        (dest.location && dest.location.toLowerCase().includes(query.toLowerCase())) ||
        (dest.keyFeature && dest.keyFeature.toLowerCase().includes(query.toLowerCase()))
    );

    displayDestinations(filtered);
}

function handleNavigation(page) {
    const mainContent = document.querySelector('.main-content');
    const categories = document.querySelector('.categories');
    const destinationsGrid = document.getElementById('destinationsGrid');
    const destinationDetail = document.getElementById('destinationDetail');
    const blogPage = document.getElementById('blogPage');
    const uploadPage = document.getElementById('uploadPage');
    const settingsPage = document.getElementById('settingsPage');


    categories.style.display = 'none';
    destinationsGrid.style.display = 'none';
    destinationDetail.classList.remove('active');
    blogPage.style.display = 'none';
    uploadPage.style.display = 'none';
    settingsPage.style.display = 'none';

    if (page === 'home') {
        backToGrid();
    } if (page === 'blog') {
        blogPage.style.display = 'block';
    }
    if (page === 'upload') {
        uploadPage.style.display = 'block';
    }
    if (page === 'settings') {
        settingsPage.style.display = 'block';
    }
}

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterDestinations(btn.getAttribute('data-category'));
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        handleNavigation(link.getAttribute('data-page'));
    });
});

searchBtn.addEventListener('click', () => {
    searchDestinations(searchInput.value);
});