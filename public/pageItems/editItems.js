async function fetchAllItems(collectionId = "") {
  try {
    const response = await fetch(
      `/items/all/${collectionId}`
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
  const ItemTableBody = document.getElementById("ItemTableBody");
  ItemTableBody.innerHTML = "";
  items.forEach((item) => {
    const escapedName = escapeHtml(item.name);
    const escapedTags = escapeHtml(JSON.parse(item.tags||'[]').join(',')); // Обрабатываем item.tags
    const escapedProps = JSON.parse(item.props||'[]').map(x=>escapeHtml(`${x.name}=${x.value}`)).join('<br/>');
     if (!window.cachedItems){
      window.cachedItems = {}
     }
     window.cachedItems[item.id]=item;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.id}</td>
            <td>${escapedName}</td>
            <td>${escapedTags}</td>
            <td>${escapedProps}</td>
            <td>
                <button type="button" class="btn btn-primary btn-sm" onclick="editItem('${item.id}', '${escapedName}')">Edit</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
    ItemTableBody.appendChild(row);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const collectionId = urlParams.get("id");
  if (collectionId) {
    fetchAllItems(collectionId);
  } else {
    fetchAllItems();
  }
});

function escapeHtml(unsafe) {
  if(!unsafe) {
    return '';
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// function renderItems(items) {
//   const ItemTableBody = document.getElementById("ItemTableBody");
//   ItemTableBody.innerHTML = "";

//   items.forEach((item) => {
//     const escapedName = escapeHtml(item.name);
//     const escapedTags = escapeHtml(item.tags);
//     const escapedProps = escapeHtml(item.props);
//     const row = document.createElement("tr");
//     row.innerHTML = `
//             <td>${item.id}</td>
//             <td>${escapedName}</td>
//             <td>${escapedTags}</td>
//             <td>
//                 <button type="button" class="btn btn-primary btn-sm" onclick="editItem('${item.id}', '${escapedName}', '${escapedTags}')">Edit</button>
//                 <button type="button" class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
//             </td>
//         `;
//     ItemTableBody.appendChild(row);
//   });
// }

function editItem(itemId, name) {
  const item = window.cachedItems[itemId];
  console.log(item)
  $("#edit-item-id").val(itemId);
  $("#collection-id").val(item.collectionid);
  $("#edit-item-name").val(name);
  $("#edit-item-tags").val((JSON.parse(item.tags || '[]')).join(','));
  const container = document.getElementById('edit-input-list');

  (JSON.parse(item.props || '[]')).forEach(x=>createNewFieldByValues(x.name,x.value,x.type,container)) ;
  $("#editItemModal").modal("show");
}

async function saveEditedItem() {
  const itemId = $("#edit-item-id").val();
  const collectionId = $("#collection-id").val();
  const name = $("#edit-item-name").val();
  const tags = JSON.stringify(($("#edit-item-tags").val()||'').split(','));
  const props = JSON.stringify(getAdditionalProperties());

  console.log("Sending data:", { name, tags });

  try {
    const response = await fetch(`/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        tags: tags,
        props:props,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to save edited item: ${
          errorData.message || response.statusText
        }`
      );
    }

    $("#editItemModal").modal("hide");
    const urlParams = new URLSearchParams(window.location.search);
  const collectionId = urlParams.get("id");
    fetchAllItems(collectionId);
  } catch (error) {
    console.error("Error saving edited item:", error);
    alert(`Error saving edited item: ${error.message}`);
  }
}
