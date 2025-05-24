'use strict'

const themeToggle = document.querySelector('.theme');

const containerCard = document.getElementById('container-card');


const searchBar = document.getElementById('searchBar');
const dropdown = document.querySelector('.selected');
const dropdownList = document.querySelector('.dropdown-list');

let allCountries = [];
let searchTerm = '';
let selectedRegion = '';

const fetchCountry = async () => {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        allCountries = data;
        renderCard(allCountries);

    } catch (error) {
        alert('error loading', error);
        console.log('fail fetch');
    }
}


const renderCard = (countries) => {
    containerCard.innerHTML = '';

    containerCard.innerHTML = countries.map((country) => `
        <div class="card">
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
            <div class="card-info" >
                <h3>${country.name}</h3>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital : 'N/A'}</p>
            </div>
        </div>
    `).join('');
};

searchBar.addEventListener('input', () => {
    searchTerm = searchBar.value.toLowerCase().trim();
    applyFilters();
})

dropdown.addEventListener('click', () => {
    dropdownList.classList.toggle('open');

})
dropdownList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const clickedRegion = e.target.textContent;

        if (selectedRegion === clickedRegion) {
            selectedRegion = '';
            dropdown.innerHTML = `Filter by Region <span><i class="fa-solid fa-angle-down"></i></span>`;
        } else {
            selectedRegion = clickedRegion;
            dropdown.innerHTML = `${clickedRegion} <span><i class="fa-solid fa-angle-down"></i></span>`;
        }

        dropdownList.querySelectorAll('li').forEach(li => {
            li.classList.remove('active');
        });

        if (selectedRegion !== '') {
            e.target.classList.add('active');
        }
        applyFilters();
    }

});

const applyFilters = () => {
    let filtered = allCountries;

    if (selectedRegion && selectedRegion !== 'All') {
        filtered = filtered.filter(country => country.region === selectedRegion);
    }

    if (searchTerm) {
        filtered = filtered.filter(country =>
            country.name.toLowerCase().includes(searchTerm)
        );
    }

    renderCard(filtered);
};

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('darkmode');
    isDark ? localStorage.setItem('theme', 'dark') : localStorage.setItem('theme', 'light');
});

window.addEventListener('load', () => {
    const saveTheme = localStorage.getItem('theme');
    saveTheme === 'dark' ? document.body.classList.add('darkmode') : document.body.classList.remove('darkmode');

    document.querySelectorAll('*').forEach(el => {
        el.classList.add('no-transition');
    });

    requestAnimationFrame(() => {
        document.querySelectorAll('*').forEach(el => {
            el.classList.remove('no-transition');
        });
    });
});

fetchCountry();