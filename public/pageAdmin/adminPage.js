const usersList = document.getElementById("usersList");

window.onload = async function () {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    const response = await fetch("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      throw new Error("Access denied");
    }

    const users = await response.json();
    if (!Array.isArray(users)) {
      throw new Error("Users data is not an array");
    }
    displayUsers(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

async function displayUsers() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    const response = await fetch("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      throw new Error("Access denied");
    }

    const users = await response.json();
    if (!Array.isArray(users)) {
      throw new Error("Users data is not an array");
    }

    usersList.innerHTML = "";
    users.forEach((user) => {
      console.log("User ID:", user.id);
      console.log("Is Admin:", user.isadmin);
      console.log("Blocked:", user.blocked);

      const userDiv = document.createElement("div");
      userDiv.classList.add("user");
      userDiv.innerHTML = `
                <p>ID: ${user.id}</p>
                <p>Email: ${user.email}</p>
                <p>Admin: ${user.isadmin ? "Yes" : "No"}</p>
                <p>Blocked: ${user.blocked ? "Yes" : "No"}</p>
                <button onclick="blockUser('${user.id}')">${
        user.blocked ? "Unblock" : "Block"
      }</button>
                ${
                  user.isadmin
                    ? ""
                    : `<button onclick="addAdmin('${user.id}')">Add Admin</button>`
                }
                ${
                  user.isadmin
                    ? `<button onclick="removeAdmin('${user.id}')">Remove Admin</button>`
                    : ""
                }
                <button onclick="deleteUser('${user.id}')">Delete</button>
            `;
      usersList.appendChild(userDiv);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    usersList.innerHTML = `<p>Error fetching users: ${error.message}</p>`;
  }
}

async function blockUser(userId) {
  await updateUserStatus(userId, true);
}

async function unblockUser(userId) {
  await updateUserStatus(userId, false);
}

async function updateUserStatus(userId, blocked) {
  try {
    const response = await fetch(
      `/admin/users/${userId}/${blocked ? "block" : "unblock"}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 403) {
      throw new Error("Access denied");
    }

    const updatedUser = await response.json();
    const users = await (
      await fetch("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).json();
    displayUsers(users);
  } catch (error) {
    console.error(`Error ${blocked ? "blocking" : "unblocking"} user:`, error);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 403) {
      throw new Error("Access denied");
    }

    const users = await (
      await fetch("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).json();
    displayUsers(users);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

async function addAdmin(userId) {
  await updateAdminStatus(userId, true);
}

async function removeAdmin(userId) {
  await updateAdminStatus(userId, false);
}

async function updateAdminStatus(userId, isAdmin) {
  try {
    const response = await fetch(
      `/admin/users/${userId}/${isAdmin ? "add-admin" : "remove-admin"}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 403) {
      throw new Error("Access denied");
    }

    const updatedUser = await response.json();
    const users = await (
      await fetch("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).json();
    displayUsers(users);
  } catch (error) {
    console.error(
      `Error ${isAdmin ? "adding" : "removing"} admin role:`,
      error
    );
  }
}
