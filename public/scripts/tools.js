async function fetchData() {
    // fetch supplier data for tools.html "Supplier" dropdown
    try {
        const SupplierResponse = await fetch('http://localhost:5500/suppliers/');
        if (!SupplierResponse.ok) {
            throw new Error('Failed to fetch suppliers');
        }
        const SupplierData = await SupplierResponse.json();
        const SupplierElement = document.getElementById("SupplierID");
        SupplierData.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.text = supplier.SupplierName;
            SupplierElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch suppliers:', error);
    }

    // fetch role data for tools.html "Role" dropdown
    try {
        const RoleResponse = await fetch('http://localhost:5500/roles/');
        if (!RoleResponse.ok) {
            throw new Error('Failed to fetch roles');
        }
        const RoleData = await RoleResponse.json();
        const RoleElement = document.getElementById("RoleID");
        RoleData.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.text = role.Title;
            RoleElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }
}

// function to add a new user
async function newProduct() {
    const supplier = document.getElementById("SupplierID");
    const dataToInsert = {
        ProductName: document.getElementById("ProductName").value,
        Number: parseInt(document.getElementById("ProductNumber").value, 10),
        SupplierID: parseInt(supplier.value, 10)
    };

    try {
        const response = await fetch('http://localhost:5500/products/', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToInsert)
         });

         if (response.ok) {
            alert("Product added successfully");
         } else {
            const errorData = await response.text();
            alert(`Failed to add product: ${errorData}`);
         }
    } catch (error) {
        console.error('Failed to add product:', error);
        alert("Failed to add product.");
    }
}

// Function to add a new supplier
async function newSupplier() {
    const dataToInsert = {
        SupplierName: document.getElementById("SupplierName").value
    };

    try {
        const response = await fetch('http://localhost:5500/suppliers/', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToInsert)
         });

         if (response.ok) {
            alert("Supplier added successfully");
         } else {
            const errorData = await response.text();
            alert(`Failed to add supplier: ${errorData}`);
         }
    } catch (error) {
        console.error('Failed to add supplier:', error);
        alert("Failed to add supplier.");
    }
}

// Function to add a new user
async function newUser() {
    const role = document.getElementById("RoleID");
    const dataToInsert = {
        FName: document.getElementById("FName").value,
        MName: document.getElementById("MName").value,
        LName: document.getElementById("LName").value,
        Email: document.getElementById("Email").value,
        Password: document.getElementById("Password").value,
        RoleID: parseInt(role.value, 10)
    };

    try {
        const response = await fetch('http://localhost:5500/users/', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToInsert)
         });

         if (response.ok) {
            alert("User added successfully");
         } else {
            const errorData = await response.text();
            alert(`Failed to add user: ${errorData}`);
         }
    } catch (error) {
        console.error('Failed to add user:', error);
        alert("Failed to add user.");
    }
}