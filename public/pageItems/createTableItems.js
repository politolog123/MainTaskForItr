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
      `/items/all/${collectionid}`
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
            <td>${item.props}</td>
            <td>
            <button type="button" class="btn btn-primary btn-sm" onclick="editItem(1)">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteItem(1)">Delete</button>
            </td>
        `;
    ItemTableBody.appendChild(row);
  });
}

// async function updateTagsFormat() {
//   try {
//     const items = await Item.findAll();
//     for (const item of items) {
//       const tags = JSON.parse(item.tags);
//       item.tags = JSON.stringify({ tags });
//       await item.save();
//     }

//     console.log("Формат поля tags успешно обновлен.");
//   } catch (error) {
//     console.error("Ошибка при обновлении формата поля tags:", error);
//   }
// }
// updateTagsFormat();
