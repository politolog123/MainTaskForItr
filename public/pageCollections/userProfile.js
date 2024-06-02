async function editCollection(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/collections/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.ok) {
      const collection = await response.json();
      populateEditModal(collection);
      $("#editCollectionModal").modal("show");
    } else {
      console.error("Failed to fetch collection details:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching collection details:", error);
  }
}

let collections = [];

async function fetchCollections() {
  const token = localStorage.getItem("token");
  const formattedToken = `Bearer ${token}`;
  try {
    const response = await fetch("/collections", {
      method: "GET",
      headers: {
        Authorization: formattedToken,
      },
    });
    const data = await response.json();
    collections = data;
    renderCollections(collections);
  } catch (error) {
    console.error("Ошибка при получении коллекций:", error);
  }
}

function renderCollections() {
  const collectionsTableBody = document.getElementById("collectionsBody");
  collectionsTableBody.innerHTML = "";
  collections.forEach((collection) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${collection.id}</td>
            <td>${collection.name}</td>
            <td>${collection.description}</td>
            <td>${collection.category}</td>
            <td><img src="${collection.image}" alt="Collection Image" style="max-width: 100px;"></td>
            <td>
                <button onclick="editCollection(${collection.id})">Edit</button>
                <button onclick="deleteCollection(${collection.id})">Delete</button>
            </td>
            <td><a href="/pageItems/pageCollections.html?id=${collection.id}" class="collection-link">View Details</a></td>

        `;
    collectionsTableBody.appendChild(row);
  });
}

function populateEditModal(collection) {
  console.log("Populating edit modal with collection:", collection);
  document.getElementById("editCollectionId").value = collection.id;
  document.getElementById("editCollectionName").value = collection.name;
  document.getElementById("editCollectionDescription").value =
    collection.description;
  document.getElementById("editCollectionCategoryEdit").value =
    collection.category;
  document.getElementById("editCollectionImage").value = collection.image;
}

async function saveCollectionChanges() {
  const id = document.getElementById("editCollectionId").value;
  const name = document.getElementById("editCollectionName").value;
  const description = document.getElementById(
    "editCollectionDescription"
  ).value;
  const category = document.getElementById("editCollectionCategoryEdit").value;
  const image = document.getElementById("editCollectionImage").value;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/collections/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name, description, category, image }),
    });

    if (response.ok) {
      alert("Collection updated successfully");
      $("#editCollectionModal").modal("hide");
      document.getElementById("showCollectionsBtn").click();
    } else {
      alert("Error updating collection");
    }
  } catch (error) {
    console.error("Error updating collection:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const collectionsBody = document.getElementById("collectionsBody");

  collectionsBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("collection-link")) {
      const collectionId = event.target.dataset.collectionId;
      window.location.href = `/html/pageCollections.html?id=${collectionId}`;
    }
  });
});
function displayCollections(collections) {
  const collectionsBody = document.getElementById("collectionsBody");
  collectionsBody.innerHTML = "";

  collections.forEach((collection) => {
    const collectionUrl = `/collections/${collection.id}`;

    const collectionRow = `
            <tr>
                <td>${collection.id}</td>
                <td>${collection.userid}</td>
                <td>${collection.name}</td>
                <td>${collection.description}</td>
                <td>${collection.category}</td>
                <td>${collection.image}</td>
                <td>
                    <!-- Здесь добавляем кнопку "Edit" для редактирования коллекции -->
                    <button class="btn btn-primary btn-sm" onclick="editCollection(${collection.id})">Edit</button>
                    <!-- Добавляем кнопку "Delete" для удаления коллекции -->
                    <button class="btn btn-danger btn-sm" onclick="deleteCollection(${collection.id})">Delete</button>
                </td>
                <!-- Добавляем ссылку на страницу с подробностями коллекции -->
                <td><a href="${collectionUrl}" class="collection-link">View Details</a></td>
            </tr>
        `;

    collectionsBody.insertAdjacentHTML("beforeend", collectionRow);
  });
}

function closeEditModal() {
  $("#editCollectionModal").modal("hide");
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("collectionsBody")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("collection-link")) {
        event.preventDefault();

        const collectionUrl = event.target.getAttribute("href");

        window.location.href = collectionUrl;
      }
    });
  const collectionsTableBody = document.getElementById("collectionsBody");
  const createCollectionBtn = document.getElementById("create-collection-btn");
  const createCollectionForm = document.getElementById(
    "create-collection-form"
  );
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const themeStylesheet = document.getElementById("theme-stylesheet");
  const collectionMessagePlaceholder = document.getElementById(
    "collectionMessagePlaceholder"
  );
  let currentTheme = "light";
  let currentLang = "EN";

  createCollectionBtn.addEventListener("click", () => {
    $("#createCollectionModal").modal("show");
  });

  createCollectionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const collectionName = document.getElementById("collection-name").value;
    const collectionDescription = document.getElementById(
      "collection-description"
    ).value;
    const collectionCategory = document.getElementById(
      "collection-category"
    ).value;
    const collectionImage = document.getElementById("collection-image").value;

    const collectionData = {
      name: collectionName,
      description: collectionDescription,
      category: collectionCategory,
      image: collectionImage,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/collections/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(collectionData),
      });

      console.log(collectionData);

      if (response.ok) {
        const newCollection = await response.json();
        collectionMessagePlaceholder.textContent =
          "Коллекция успешно добавлена!";
        collections.push(newCollection);
        renderCollections();
        createCollectionForm.reset();
        $("#createCollectionModal").modal("hide");
      } else {
        const errorData = await response.json();
        collectionMessagePlaceholder.textContent = `Ошибка: ${errorData.error}`;
      }
    } catch (error) {
      console.error("Ошибка при добавлении коллекции:", error);
      collectionMessagePlaceholder.textContent =
        "Ошибка при добавлении коллекции";
    }
  });

  fetchCollections();
  window.deleteCollection = deleteCollection;
});

document
  .getElementById("showCollectionsBtn")
  .addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/collections", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await response.json();
      collections = data;
      renderCollections();
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  });

document
  .getElementById("collectionNameHeader")
  .addEventListener("click", () => {
    const sortedCollections = window.collectionsData.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const collectionsBody = document.getElementById("collectionsBody");
    collectionsBody.innerHTML = "";

    sortedCollections.forEach((collection) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${collection.id}</td>
            <td>${collection.userid}</td>
            <td>${collection.name}</td>
            <td>${collection.description}</td>
            <td>${collection.category}</td>
            <td><img src="${collection.image}" alt="Collection Image" style="max-width: 100px;"></td>
            <td>
                <button onclick="editCollection(${collection.id})">Edit</button>
                <button onclick="deleteCollection(${collection.id})">Delete</button>
            </td>
            <td><a href="/collections/${collection.id}" class="collection-link">View Details</a></td>
        `;
      collectionsBody.appendChild(row);
    });
  });

async function deleteCollection(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Are you sure you want to delete this collection?")) {
    return;
  }

  try {
    const response = await fetch(`/collections/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer" + token,
      },
    });

    if (response.ok) {
      alert("Collection deleted successfully");
      document.getElementById("showCollectionsButton").click();
    } else {
      alert("Error deleting collection");
    }
  } catch (error) {
    console.error("Error deleting collection:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const goToMain = document.getElementById("goToMain");

  goToMain.addEventListener("click", () => {
    window.location.href = "/mainPage/mainPage.html";
  });
});
