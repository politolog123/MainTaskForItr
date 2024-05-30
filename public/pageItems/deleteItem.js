document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const collectionId = urlParams.get("id");
  if (collectionId) {
    fetchAllItems(collectionId);
  } else {
    fetchAllItems();
  }
});

async function fetchAllItems(collectionid) {
  try {
    const response = await fetch(
      `http://localhost:3001/items/all/${collectionid}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

function renderItems(items) {
  const ItemsTitle = document.getElementById("ItemsTitle");
  ItemsTitle.textContent = "Items";

  const ItemTableBody = document.getElementById("ItemTableBody");
  ItemTableBody.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.tags}</td>
            <td>
                <button type="button" class="btn btn-primary btn-sm" onclick="editItem(${item.id})">Edit</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
    ItemTableBody.appendChild(row);
  });
}

async function deleteItem(itemId) {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      const response = await fetch(`http://localhost:3001/items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      const row = document
        .querySelector(`button[onclick="deleteItem(${itemId})"]`)
        .closest("tr");
      if (row) {
        row.remove();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
}
