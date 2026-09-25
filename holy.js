document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Kattintásra nyitás / csukás
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Megakadályozza, hogy azonnal lefusson a külső kattintás esemény
        dropdownContent.classList.toggle('show');
    });

    // Ha bárhova máshova kattintasz az oldalon, zárja be a menüt
    document.addEventListener('click', (e) => {
        if (!dropdownContent.contains(e.target) && !dropdownBtn.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Ha rákattintasz valamelyik menüpontra, szintén záródjon be
    dropdownContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            dropdownContent.classList.remove('show');
        });
    });
});

