// CREATE NEW PRODUCT
export async function newProduct(supplier, productName, productNumber) {
    try {
    const dataToInsert = {
        ProductName: productName.value,
        Number: parseInt(productNumber.value, 10),
        SupplierID: parseInt(supplier.value, 10)
    };
    
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

// CREATE NEW SUPPLIER
export async function newSupplier(supplier) {
    try {
        const dataToInsert = {
            SupplierName: supplier.value
        };

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

// CREATE NEW USER
export async function newUser(FName, MName, LName, Email, Password, RoleID) {
    try {
    const dataToInsert = {
        FName: FName.value,
        MName: MName.value,
        LName: LName.value,
        Email: Email.value,
        Password: Password.value,
        RoleID: parseInt(RoleID.value, 10)
    };

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

// CREATE NEW ENGINEER
// METHOD: POST
export async function newEngineer(id, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate)
{
    try {
        const engineerData = {
            Review: Review.value,
            NotifyCustomer: NotifyCustomer.checked ? 1 : 0,
            Disposition: Disposition.value,
            RevisionNumber: RevisionNumber.textContent,
            RevisionDate: RevisionDate.value
        };
        const response = await fetch(`http://localhost:5500/engineer/${id}`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(engineerData)
        });

        if (response.ok) {
           alert("Engineer form created successfully!");
           window.location.href = `details.html?id=${id}`;
        } else {
           const errorData = await response.text();
           alert(`Failed to create engineer form: ${errorData}`);
        }
     } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
     }
}


// UPDATE ENGINEER
// METHOD: PUT
export async function updateEngineer(id, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate)
{
    try {
        const engineerData = {
            Review: Review.value,
            NotifyCustomer: NotifyCustomer.checked ? 1 : 0,
            Disposition: Disposition.value,
            RevisionNumber: RevisionNumber.textContent,
            RevisionDate: RevisionDate.value
        };
        const response = await fetch(`http://localhost:5500/engineer/${id}`, {
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(engineerData)
        });

        if (response.ok) {
           alert("Engineer form updated successfully!");
           window.location.href = `details.html?id=${id}`;
        } else {
           const errorData = await response.text();
           alert(`Failed to update engineer form: ${errorData}`);
        }
     } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
     }
}