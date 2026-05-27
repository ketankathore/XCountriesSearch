const API_URL = 'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries';

const searchInput = document.getElementById('searchInput');
const countriesContainer = document.getElementById('countriesContainer');

let countries = [];

function getCountryName(c){
  if(!c) return '';
  return (c.name && (c.name.common || c.name)) || c.country || c.name || c.alpha2 || '';
}

function getFlagUrl(c){
  if(!c) return '';
  if(c.flags){
    if(typeof c.flags === 'string') return c.flags;
    return c.flags.png || c.flags.svg || c.flags[0] || '';
  }
  return c.flag || c.flagUrl || '';
}

function render(list){
  countriesContainer.innerHTML = '';
  if(!list || list.length === 0) return;

  const fragment = document.createDocumentFragment();

  list.forEach(c => {
    const name = getCountryName(c) || '';
    const flag = getFlagUrl(c) || '';

    const card = document.createElement('div');
    card.className = 'countryCard';

    const img = document.createElement('img');
    img.alt = name;
    img.src = flag;

    const p = document.createElement('div');
    p.className = 'countryName';
    p.textContent = name;

    card.appendChild(img);
    card.appendChild(p);
    fragment.appendChild(card);
  });

  countriesContainer.appendChild(fragment);
}

function filterAndRender(query){
  if(!query) return render(countries);
  const q = query.trim().toLowerCase();
  if(q === '') return render(countries);
  const filtered = countries.filter(c => getCountryName(c).toLowerCase().includes(q));
  render(filtered);
}

searchInput.addEventListener('input', (e) => {
  filterAndRender(e.target.value);
});

async function loadCountries(){
  try{
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error('Network response was not ok: ' + res.status);
    const data = await res.json();
    countries = Array.isArray(data) ? data : (data.countries || []);
    render(countries);
  }catch(err){
    console.error('Failed to load countries:', err);
  }
}

loadCountries();
