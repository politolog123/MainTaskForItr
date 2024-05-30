document.addEventListener('DOMContentLoaded', () => {
    const collectionsLink = document.getElementById('collectionsLink');

    collectionsLink.addEventListener('click', () => {
        window.location.href = '/pageCollections/pageProfileUser.html';
    });
});