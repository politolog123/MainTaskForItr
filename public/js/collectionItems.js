function addField() {
  const fieldContainer = document.getElementById("fieldContainer");

  const fieldType = document.querySelector(
    'input[name="fieldType"]:checked'
  ).value;

  const label = document.createElement("label");
  label.textContent = "Field Name:";
  fieldContainer.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.name = "fieldName";
  fieldContainer.appendChild(input);

  fieldContainer.appendChild(document.createElement("br"));
}

document
  .getElementById("collectionForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const collectionName = document.getElementById("collectionName").value;

    const fieldNames = [];
    const fieldNameInputs = document.getElementsByName("fieldName");
    fieldNameInputs.forEach((input) => {
      fieldNames.push(input.value);
    });

    const formData = {
      collectionName: collectionName,
      fieldNames: fieldNames,
    };

    try {
      const response = await fetch("/collections/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Collection created successfully");
        window.location.href = "/collections";
      } else {
        alert("Error creating collection");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection");
    }
  });
