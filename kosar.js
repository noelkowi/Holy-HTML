// Kosár lekérése a memóriából
function getKosar() {
    const kosar = localStorage.getItem('jako_kosar');
    return kosar ? JSON.parse(kosar) : [];
}

// Mentés és fejléc frissítés
function saveKosar(kosar) {
    localStorage.setItem('jako_kosar', JSON.stringify(kosar));
    frissitSzamlalo();
}

// Fejléc számláló
function frissitSzamlalo() {
    const szamlalo = document.getElementById('kosar-szamlalo');
    if (!szamlalo) return;
    const kosar = getKosar();
    const osszDb = kosar.reduce((osszeg, elem) => osszeg + elem.db, 0);
    szamlalo.innerText = osszDb;
}

// 1. Étlapról kosárba rakás
function kosarbaRak(nev, ar) {
    let kosar = getKosar();
    const letezo = kosar.find(item => item.nev === nev);

    if (letezo) {
        letezo.db += 1;
    } else {
        kosar.push({ nev: nev, ar: ar, db: 1 });
    }

    saveKosar(kosar);
    mutatToast(`"${nev}" bekerült a kosárba! 🔥`);
}

// 2. Darabszám módosítás (+ / -)
function modositDb(nev, valtozas) {
    let kosar = getKosar();
    const elem = kosar.find(item => item.nev === nev);

    if (elem) {
        elem.db += valtozas;
        if (elem.db <= 0) {
            kosar = kosar.filter(item => item.nev !== nev);
        }
        saveKosar(kosar);
        renderKosarOldal();
    }
}

// 3. Törlés
function torolTetel(nev) {
    let kosar = getKosar();
    kosar = kosar.filter(item => item.nev !== nev);
    saveKosar(kosar);
    renderKosarOldal();
}

// 4. Kosár oldal renderelése
function renderKosarOldal() {
    const kontener = document.getElementById('kosar-elemek');
    const reszosszegEl = document.getElementById('reszosszeg');
    const vegosszegEl = document.getElementById('vegosszeg');
    const form = document.getElementById('rendeles-form');

    if (!kontener) return;

    const kosar = getKosar();
    kontener.innerHTML = '';

    if (kosar.length === 0) {
        kontener.innerHTML = `<p style="color: #ff9800; font-size: 1.1rem; padding: 20px 0;">A kosarad jelenleg üres.</p>`;
        if (reszosszegEl) reszosszegEl.innerText = '0 Ft';
        if (vegosszegEl) vegosszegEl.innerText = '0 Ft';
        if (form) form.style.display = 'none';
        return;
    }

    if (form) form.style.display = 'block';

    let osszeg = 0;
    kosar.forEach(item => {
        osszeg += item.ar * item.db;
        const sor = document.createElement('div');
        sor.className = 'cart-item';
        sor.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.nev}</h4>
                <span class="cart-item-price">${item.ar.toLocaleString('hu-HU')} Ft / db</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="modositDb('${item.nev}', -1)">-</button>
                <span class="qty-count">${item.db} db</span>
                <button class="qty-btn" onclick="modositDb('${item.nev}', 1)">+</button>
                <button class="del-btn" onclick="torolTetel('${item.nev}')">🗑️</button>
            </div>
        `;
        kontener.appendChild(sor);
    });

    const szallitas = 500;
    if (reszosszegEl) reszosszegEl.innerText = `${osszeg.toLocaleString('hu-HU')} Ft`;
    if (vegosszegEl) vegosszegEl.innerText = `${(osszeg + szallitas).toLocaleString('hu-HU')} Ft`;
}

// 5. Toast üzenet
function mutatToast(szoveg) {
    let toast = document.getElementById('jako-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'jako-toast';
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerText = szoveg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

// 6. Űrlap validáció
function initRendelesForm() {
    const form = document.getElementById('rendeles-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const kosar = getKosar();
        const visszajelzes = document.getElementById('rendeles-visszajelzes');
        const nevInput = document.getElementById('nev');
        const telInput = document.getElementById('tel');
        const cimInput = document.getElementById('cim');

        let hibas = false;

        if (nevInput.value.trim().length < 4) {
            document.getElementById('hiba-nev').innerText = 'Add meg a neved (min. 4 betű)!';
            nevInput.classList.add('input-error');
            hibas = true;
        } else {
            document.getElementById('hiba-nev').innerText = '';
            nevInput.classList.remove('input-error');
        }

        const telRegex = /^[0-9+ ]{9,15}$/;
        if (!telRegex.test(telInput.value.trim())) {
            document.getElementById('hiba-tel').innerText = 'Helytelen szám (pl. 06301234567)!';
            telInput.classList.add('input-error');
            hibas = true;
        } else {
            document.getElementById('hiba-tel').innerText = '';
            telInput.classList.remove('input-error');
        }

        if (cimInput.value.trim().length < 6) {
            document.getElementById('hiba-cim').innerText = 'Add meg a pontos címet!';
            cimInput.classList.add('input-error');
            hibas = true;
        } else {
            document.getElementById('hiba-cim').innerText = '';
            cimInput.classList.remove('input-error');
        }

        if (hibas) return;

        // Sikeres leadás
        localStorage.removeItem('jako_kosar');
        frissitSzamlalo();
        renderKosarOldal();

        visszajelzes.style.display = 'block';
        visszajelzes.className = 'order-feedback success';
        visszajelzes.innerHTML = `
            <h4>Köszönjük a rendelést, ${nevInput.value.trim()}! 🎉</h4>
            <p>A rendelésed rögzítettük, hamarosan visszük!</p>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    frissitSzamlalo();
    renderKosarOldal();
    initRendelesForm();
});