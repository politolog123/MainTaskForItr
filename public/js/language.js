document.addEventListener("DOMContentLoaded", () => {
  const toggleLanguageButton = document.getElementById("toggleLanguageButton");
  const currentLanguage = localStorage.getItem("language") || "en";

  setLanguage(currentLanguage);

  toggleLanguageButton.addEventListener("click", () => {
    const newLanguage = currentLanguage === "en" ? "ru" : "en";
    setLanguage(newLanguage);
  });

  function setLanguage(language) {
    const elementsToTranslate = document.querySelectorAll("[data-key]");
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute("data-key");
      element.textContent = translations[language][key];
    });
    localStorage.setItem("language", language);
  }
});

const translations = {
  en: {
    // pageTitle: "Page Title",
    // collectionTitle: "Collection",
    // itemsTitle: "Items Table",
    // createNewItem: "Create New Item",
    id: "ID",
    name: "Name",
    description: "Description",
    category: "Category",
    image: "Image",
    // collectionId: "Collection ID",
    // itemName: "Item Name",
    // itemTags: "Item Tags",
    // itemFields: "Item Fields:",
    // integer: "Integer",
    // string: "String",
    // addField: "Add Field",
    // createItem: "Create Item"
  },
  ru: {
    // pageTitle: "Заголовок страницы",
    // collectionTitle: "Коллекция",
    // itemsTitle: "Таблица предметов",
    // createNewItem: "Создать новый предмет",
    id: "ИД",
    name: "Имя",
    description: "Описание",
    category: "Категория",
    image: "Изображение",
    // collectionId: "ИД коллекции",
    // itemName: "Имя предмета",
    // itemTags: "Теги предмета",
    // itemFields: "Поля предмета:",
    // integer: "Целое число",
    // string: "Строка",
    // addField: "Добавить поле",
    // createItem: "Создать предмет"
  },
};
