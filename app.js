// LocalStorage ఉపయోగించి రీఫ్రెష్ చేసినా డేటా పోకుండా సేవ్ చేస్తాం
let adsList = JSON.parse(localStorage.getItem('skokka_ads')) || [];
let isAdminLoggedIn = false;

// పేజీ లోడ్ అవ్వగానే పాత యాడ్స్ చూపిస్తుంది
window.onload = function() {
    displayAds();
};

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// అడ్మిన్ లాగిన్ ఫంక్షన్ (ఇక్కడ మీ పాస్‌వర్డ్ సెట్ చేసుకోండి)
function loginAdmin() {
    const passwordInput = document.getElementById('adminPassword').value;
    
    // ఇక్కడ "admin123" కు బదులు మీకు నచ్చిన పాస్‌వర్డ్ పెట్టుకోవచ్చు
    if (passwordInput === "Kothakota123") {
        isAdminLoggedIn = true;
        document.getElementById('loginNavBtn').style.display = 'none';
        document.getElementById('logoutNavBtn').style.display = 'block';
        closeLoginModal();
        displayAds(); // డిలీట్ బటన్లు చూపించడానికి రీ-లోడ్
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    document.getElementById('loginNavBtn').style.display = 'block';
    document.getElementById('logoutNavBtn').style.display = 'none';
    displayAds();
}

// కొత్త యాడ్ సబ్మిషన్
document.getElementById('adForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('adTitle').value;
    const desc = document.getElementById('adDesc').value;
    const contact = document.getElementById('adContact').value;

    const newAd = {
        id: Date.now(),
        title: title,
        desc: desc,
        contact: contact
    };

    adsList.push(newAd);
    localStorage.setItem('skokka_ads', JSON.stringify(adsList)); // బ్రౌజర్‌లో సేవ్ అవుతుంది
    document.getElementById('adForm').reset();
    displayAds();
});

// యాడ్స్ డిస్ప్లే చేయడం
function displayAds() {
    const container = document.getElementById('adsContainer');
    container.innerHTML = '';

    if (adsList.length === 0) {
        container.innerHTML = '<p style="color:#777;">No ads published yet. Be the first to post!</p>';
        return;
    }

    adsList.forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'ad-card';

        let deleteBtnHtml = '';
        // అడ్మిన్ లాగిన్ అయితేనే డిలీట్ బటన్ వస్తుంది
        if (isAdminLoggedIn) {
            deleteBtnHtml = `<button class="delete-btn" onclick="deleteAd(${ad.id})">Delete</button>`;
        }

        adCard.innerHTML = `
            <h3>${ad.title}</h3>
            <p>${ad.desc}</p>
            <p><strong>Contact Info:</strong> ${ad.contact}</p>
            ${deleteBtnHtml}
        `;
        container.appendChild(adCard);
    });
}

// అడ్మిన్ యాడ్ డిలీట్ చేయడం
function deleteAd(id) {
    adsList = adsList.filter(ad => ad.id !== id);
    localStorage.setItem('skokka_ads', JSON.stringify(adsList));
    displayAds();
}
