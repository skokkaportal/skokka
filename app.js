let adsList = JSON.parse(localStorage.getItem('skokka_ads')) || [];
let isAdminLoggedIn = false;

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

function loginAdmin() {
    const passwordInput = document.getElementById('adminPassword').value;
    if (passwordInput === "admin123") {
        isAdminLoggedIn = true;
        document.getElementById('loginNavBtn').style.display = 'none';
        document.getElementById('logoutNavBtn').style.display = 'block';
        closeLoginModal();
        displayAds();
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

// కొత్త యాడ్ సлизации
document.getElementById('adForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('adTitle').value;
    const desc = document.getElementById('adDesc').value;
    const contact = document.getElementById('adContact').value;
    const imageFile = document.getElementById('adImage').files[0]; // మొదటి ఫైల్ తీసుకుంటుంది

    const newAd = {
        id: Date.now(),
        title: title,
        desc: desc,
        contact: contact,
        image: ""
    };

    // ఒకవేళ యూజర్ ఫోటో సెలెక్ట్ చేస్తే
    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
            newAd.image = reader.result; // ఫోటోను టెక్స్ట్ డేటాగా మారుస్తుంది
            saveAndDisplay(newAd);
        }
        reader.readAsDataURL(imageFile);
    } else {
        saveAndDisplay(newAd);
    }
});

function saveAndDisplay(newAd) {
    adsList.push(newAd);
    try {
        localStorage.setItem('skokka_ads', JSON.stringify(adsList));
    } catch (error) {
        alert("Image size is too large! Please upload a smaller image.");
        adsList.pop();
        return;
    }
    document.getElementById('adForm').reset();
    displayAds();
}

// యాడ్స్ డిస్ప్లే చేయడం
function displayAds() {
    const container = document.getElementById('adsContainer');
    container.innerHTML = '';

    if (adsList.length === 0) {
        container.innerHTML = '<p style="color:#777; grid-column: 1/-1; text-align: center;">No ads published yet. Be the first to post!</p>';
        return;
    }

    adsList.forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'ad-card';

        let deleteBtnHtml = '';
        if (isAdminLoggedIn) {
            deleteBtnHtml = `<button class="delete-btn" onclick="deleteAd(${ad.id})">Delete</button>`;
        }

        // ఫోటో ఉంటే చూపించు, లేదంటే వదిలేయ్
        let imageHtml = '';
        if (ad.image) {
            imageHtml = `<img src="${ad.image}" alt="Ad Image" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:15px;">`;
        }

        adCard.innerHTML = `
            <div>
                ${imageHtml}
                <h3>${ad.title}</h3>
                <p>${ad.desc}</p>
            </div>
            <div style="margin-top: 15px;">
                <span class="contact-info">📞 ${ad.contact}</span>
            </div>
            ${deleteBtnHtml}
        `;
        container.appendChild(adCard);
    });
}

function deleteAd(id) {
    adsList = adsList.filter(ad => ad.id !== id);
    localStorage.setItem('skokka_ads', JSON.stringify(adsList));
    displayAds();
}
