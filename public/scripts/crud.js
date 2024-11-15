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

// UPDATE QUALITY
// METHOD: PUT
export async function updateQuality(id, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, ProductID) {
    try {
      console.log(id);
      console.log(SRInspection.checked);
      console.log(WorkInProgress.checked);
      console.log(ItemDescription);
      console.log(QuantityReceived.value);
      console.log(QuantityDefective.value);
      console.log(IsNonConforming.checked);
      console.log(Details.value);
      console.log(ProductID);

        const qualtyData = {
            SRInspection: SRInspection.checked ? 1 : 0,
            WorkInProgress: WorkInProgress.checked ? 1 : 0,
            ItemDescription: ItemDescription,
            QuantityReceived: parseInt(QuantityReceived.value, 10),
            QuantityDefective: parseInt(QuantityDefective.value, 10),
            IsNonConforming: IsNonConforming.checked ? 1 : 0,
            Details: Details.value,
            ProductID: parseInt(ProductID, 10)
        };

        const response = await fetch(`http://localhost:5500/quality/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(qualtyData)
         });

         if (response.ok) {
            alert("Quality data updated successfully!");
            window.location.href = `details.html?id=${id}`;
         } else {
            const errorData = await response.text();
            alert(`Failed to update quality form: ${errorData}`);
         }
    } catch (error) {
        console.error('Error:', error);
        alert("An unexpected error occurred." + error);
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