const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");

registerButton.addEventListener("click", async function (event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("registrationForm"));

  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  try {
    const response = await fetch("/users/register", {
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

    console.log("Пользователь успешно зарегистрирован:", data);
    alert("Пользователь успешно зарегистрирован!");
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    alert(
      "Произошла ошибка при регистрации пользователя. Пожалуйста, попробуйте еще раз."
    );
  }
});
// loginButton.addEventListener("click", function () {
//   window.location.href = "/pageLogin/login.html";
// });
