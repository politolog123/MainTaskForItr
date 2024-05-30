const logButton = document.getElementById("loggin");
const loginLi = document.getElementById("logginLi");
const logoutLi = document.getElementById("logoutLi");
const collectionsLink = document.getElementById("collectionsLink");
const messagePlaceholder = document.getElementById("messagePlaceholder");

window.onload = async function () {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Токен не найден. Пользователь не авторизован.");
      loginLi.classList.remove("d-none");
      logoutLi.classList.add("d-none");
      return;
    }

    const response = await fetch("/users/status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении статуса пользователя");
    }

    const { isAuthenticated } = await response.json();

    console.log("Статус авторизации:", isAuthenticated);

    if (isAuthenticated) {
      console.log("Пользователь авторизован");
      loginLi.classList.add("d-none");
      logoutLi.classList.remove("d-none");
    } else {
      console.log("Пользователь не авторизован");
      loginLi.classList.remove("d-none");
      logoutLi.classList.add("d-none");
      localStorage.removeItem("token");
    }

    const latestItemsResponse = await fetch("/items/latest");
    const latestItemsData = await latestItemsResponse.json();
    const latestItemsTableBody = document.getElementById(
      "latestItemsTableBody"
    );

    latestItemsTableBody.innerHTML = "";

    latestItemsData.forEach((item) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${(JSON.parse(item.tags||'[]').join(','))}</td>
            `;
      latestItemsTableBody.appendChild(tableRow);
    });

    const topCollectionResponse = await fetch("/collections/top");
    const topCollectionsData = await topCollectionResponse.json();
    const topCollectionsTableBody = document.getElementById(
      "topCollectionsTableBody"
    );

    topCollectionsTableBody.innerHTML = "";

    if (Array.isArray(topCollectionsData)) {
      topCollectionsData.forEach((collection) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
                    <td>${collection.name}</td>
                    <td>${collection.description}</td>
                    <td>${collection.category}</td>
                `;
        topCollectionsTableBody.appendChild(tableRow);
      });
    } else {
      console.error(
        "Top collections data is not an array:",
        topCollectionsData
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

logButton.addEventListener("click", async function () {
  const isAuthenticated = !loginLi.classList.contains("d-none");
  console.log('Клик по кнопке "Login"', isAuthenticated);

  if (isAuthenticated) {
    try {
      localStorage.removeItem("token");
      window.location.href = "/pageLogin/login.html";
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  }
});

logoutLi.addEventListener("click", async function () {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/users/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при выходе пользователя");
    }

    console.log("Пользователь успешно вышел из системы");
    localStorage.removeItem("token");
    window.location.href = "/pageLogin/login.html";
  } catch (error) {
    console.error("Ошибка при выходе пользователя:", error);
  }
});

collectionsLink.addEventListener("click", function (event) {
  const isAuthenticated = logoutLi.classList.contains("d-none") === false;

  if (!isAuthenticated) {
    event.preventDefault();
    messagePlaceholder.textContent =
      "Для просмотра коллекций необходимо авторизоваться.";
  }
});
