const logButton = document.getElementById("logButton");
const regButton = document.getElementById("regButton");

logButton.addEventListener("click", async function (event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("loginForm"));

  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  try {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
    });

    if (!response.ok) {
      throw new Error("Ошибка регистрации пользователя");
    }

    const data = await response.json();

    console.log("Пользователь успешно залогинился:", data);
    alert("Пользователь успешно залогинился!");

    localStorage.setItem("token", data.token);

    window.location.href = "/mainPage/mainPage.html";
  } catch (error) {
    console.error("Ошибка при логине пользователя:", error);
    alert(
      "Произошла ошибка при логине пользователя. Пожалуйста, попробуйте еще раз."
    );
  }
});

// regButton.addEventListener("click", function () {
//   window.location.href = "/pageRegistration/registration.html";
// });
