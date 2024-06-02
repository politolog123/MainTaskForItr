let items = [];

const createItemBtn = document.getElementById("createItemModal");
const createItemForm = document.getElementById("create-item-form");
const itemsBody = document.getElementById("itemsTableBody");
const itemsMessagePlaceholder = document.getElementById(
  "itemsMessagePlaceholder"
);

createItemBtn.addEventListener("click", () => {
  console.log("Create item button clicked");
  $("#createItemModal").modal("show");
});
function getAdditionalProperties() {
  const itemData = [];
  const additionalFields = document.querySelectorAll(".extra-field");
  additionalFields.forEach((input) => {
    const fieldType = input.type;
    const fieldName = input.name;

    if (fieldName === "") {
      alert("Please enter a field name for all selected field types.");
      return;
    }
    const classname = `extra-prop-${fieldName.replace(/\s/gi, "")}`;
    const fieldValue = input.value;
    itemData.push({ name: fieldName, type: fieldType, value: fieldValue });
  });
  return itemData;
}
document
  .getElementById("create-item-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const collectionid = $(".modal:visible .collection-id").val().trim();
    console.log(collectionid);
    const itemName = $(".modal:visible #item-name").val().trim();
    const itemTags =  $(".modal:visible #item-tags").val().split(",").map((tag) => tag.trim());

    if (!collectionid || !itemName || !itemTags.length) {
      console.log("All fields must be filled out.");
      document.getElementById("itemsMessagePlaceholder").textContent =
        "All fields must be filled out.";
      return;
    }

    const itemData = {
      collectionid: parseInt(collectionid, 10),
      name: itemName,
      tags: itemTags,
      props: getAdditionalProperties(),
    };

    console.log("Data to be sent:", itemData);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/items/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      console.log("Server response:", response);

      if (response.ok) {
        const newItem = await response.json();
        console.log("Created item:", newItem);
        document.getElementById("itemsMessagePlaceholder").textContent =
          "Item successfully added!";
        items.push(newItem);

        document.getElementById("create-item-form").reset();
        $("#createItemModal").modal("hide");
        renderItems();
      } else {
        const errorData = await response.json();
        console.error("Error adding item:", errorData);
        document.getElementById(
          "itemsMessagePlaceholder"
        ).textContent = `Error: ${errorData.error}`;
      }
    } catch (error) {
      console.error("Error adding item:", error);
      document.getElementById("itemsMessagePlaceholder").textContent =
        "Error adding item";
    }
  });

function renderItems() {
  const itemsTableBody = document.getElementById("itemsTableBody");
  itemsTableBody.innerHTML = "";

  if (items.length === 0) {
    console.log("No items to render.");
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = item.id;
    row.appendChild(idCell);

    const collectionIdCell = document.createElement("td");
    collectionIdCell.textContent = item.collectionid;
    row.appendChild(collectionIdCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    const tagsCell = document.createElement("td");
    if (Array.isArray(item.tags)) {
      tagsCell.textContent = item.tags.join(", ");
    } else {
      tagsCell.textContent = item.tags.toString();
    }
    row.appendChild(tagsCell);

    itemsTableBody.appendChild(row);
  });
}
function createNewField(listId,inputId) {
  const fieldContainer = document.getElementById(listId);

  const fieldName = document.getElementById(inputId).value;
  const fieldType = $(".modal:visible #dataTypeDropDown").val();
  createNewFieldByValues(fieldName,'',fieldType,fieldContainer)
}
function createNewFieldByValues(fieldName, fieldValue,fieldType,fieldContainer) {
  if (fieldName.trim() === "") {
    alert("Please enter a field name");
    return;
  }
  const classname = `extra-prop-${fieldName.replace(/\s/gi, "")}`;
  if (document.querySelectorAll(`.${classname}`).length) {
    alert("Please enter a unique name");
    return;
  }
  if (document.querySelectorAll('.extra-field').length==3) {
    alert("Only 3 additional fields");
    return;
  }

  const div = document.createElement("div");
  div.classList.add("form-inline");
  div.classList.add("field-container");
  fieldContainer.appendChild(div);
  const label = document.createElement("label");
  label.textContent = `${fieldName}:`;
  div.appendChild(label);

  const inputElement = document.createElement(
    fieldType == "text-area" ? "textarea" : "input"
  );

  inputElement.classList.add("form-control");
  inputElement.type = fieldType;
  inputElement.name = fieldName;
  inputElement.value = fieldValue;
  inputElement.classList.add(classname);
  inputElement.classList.add('extra-field');
  div.appendChild(inputElement);
  const removeBtns = document.createElement("button");
  removeBtns.textContent = 'remove';
  removeBtns.addEventListener('click',function(){
    div.remove();
  })
  removeBtns.classList.add("form-control");
  div.appendChild(removeBtns);
  // fieldContainer.appendChild(document.createElement("br"));
}
// function addField() {
//   const fieldContainer = document.getElementById("fieldContainer");

//   const fieldTypeInputs = document.getElementsByName("fieldType");
//   const fieldNameInputs = document.getElementsByName("fieldName");

//   fieldTypeInputs.forEach((input, index) => {
//     if (input.checked) {
//       const fieldType = input.value;
//       const fieldName = fieldNameInputs[index].value;

//       if (fieldName.trim() === "") {
//         alert("Please enter a field name");
//         return;
//       }
//       const classname = `extra-prop-${fieldName.replace(/\s/gi, "")}`;
//       if (document.querySelectorAll(`.${classname}`).length) {
//         alert("Please enter a unique name");
//         return;
//       }
//       const label = document.createElement("label");
//       label.textContent = `${fieldName}:`;
//       fieldContainer.appendChild(label);

//       const inputElement = document.createElement("input");
//       inputElement.type = fieldType;
//       inputElement.name = `field_${fieldType}`;
//       inputElement.classList.add(classname);
//       fieldContainer.appendChild(inputElement);

//       fieldContainer.appendChild(document.createElement("br"));
//     }
//   });
// }

$(".modal").on("hide.bs.modal", function (event) {
  $('.field-container').remove();
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", () => {
    window.location.href = "/mainPage/mainPage.html";
  });
});
