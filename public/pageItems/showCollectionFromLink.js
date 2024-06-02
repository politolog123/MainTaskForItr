document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('id');
    if (collectionId) {
        fetchCollectionItems(collectionId);
    }
});

async function fetchCollectionItems(collectionId) {
    try {
        const response = await fetch(`/collections/byId/${collectionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch collection items');
        }
        const collection = await response.json();
        renderCollectionItems(collection);
    } catch (error) {
        console.error('Error fetching collection items:', error);
    }
}

function renderCollectionItems(collection) {
    const collectionTitle = document.getElementById('collectionTitle');
    if (collection && collection.name) {
        collectionTitle.textContent = `${collection.name}`;
    } else {
        console.error('Collection name is not defined');
        return;
    }

    const collectionTableBody = document.getElementById('CollectionTableBody');
    collectionTableBody.innerHTML = '';

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${collection.id}</td>
        <td>${collection.name}</td>
        <td>${collection.description}</td>
        <td>${collection.category}</td>
        <td><img src="${collection.image}" alt="Item Image" style="max-width: 100px;"></td>
    `;
    collectionTableBody.appendChild(row);
}