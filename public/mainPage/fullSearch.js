document.querySelector('.search').addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchTerm = this.querySelector('input[type="search"]').value;
    let searchURL = '/api/search';

    if (searchTerm.includes('tag:')) {
        const tag = searchTerm.replace('tag:', '').trim();
        searchURL = `${searchURL}?tag=${encodeURIComponent(tag)}`;
    } else if (searchTerm.includes('name:')) {
        const name = searchTerm.replace('name:', '').trim();
        searchURL = `${searchURL}?name=${encodeURIComponent(name)}`;
    } else {
        searchURL = `${searchURL}?tag=${encodeURIComponent(searchTerm)}&name=${encodeURIComponent(searchTerm)}`;
    }

    try {
        const response = await fetch(searchURL);
        const searchData = await response.json();
        updateSearchResults(searchData);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
});

function updateSearchResults(searchData) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; 
    if (searchData.error) {
        searchResultsContainer.innerHTML = `<p>${searchData.error}</p>`;
    } else if (searchData.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found</p>';
    } else {
        searchData.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.textContent = item.name; 
            searchResultsContainer.appendChild(resultItem);
        });
    }
}