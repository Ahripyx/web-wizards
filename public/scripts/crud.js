import * as notif from './notification.js';

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
            headers: {
                "Content-Type": "application/json"
            },
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
            headers: {
                "Content-Type": "application/json"
            },
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
            headers: {
                "Content-Type": "application/json"
            },
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

// CREATE NEW FORMUSER
// METHOD: POST
export async function newFormUser(NCRForm_id, User_id) {
    try {
        const dataToInsert = {
            NCRForm_id: NCRForm_id,
            User_id: User_id
        };

        const response = await fetch('http://localhost:5500/formusers', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToInsert)
        });

        if (response.ok) {
            alert("FormUser added successfully");
        } else {
            const errorData = await response.text();
            alert(`Failed to add FormUser: ${errorData}`);
        }
    } catch (error) {
        console.error('Failed to add FormUser:', error);
        alert(`Failed to add FormUser. ${NCRForm_id} ${User_id} `);
    }
}

// UPDATE / INSERT QUALITY
export async function crudQuality(method, SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, ProductID, id = '') {
    try {

        const quality = {
            SalesOrder: parseInt(SalesOrder.value, 10),
            SRInspection: SRInspection.checked ? 1 : 0,
            WorkInProgress: WorkInProgress.checked ? 1 : 0,
            ItemDescription: ItemDescription.options[ItemDescription.selectedIndex].text,
            QuantityReceived: parseInt(QuantityReceived.value, 10),
            QuantityDefective: parseInt(QuantityDefective.value, 10),
            IsNonConforming: IsNonConforming.checked ? 1 : 0,
            Details: Details.value,
            ProductID: parseInt(ProductID.value, 10),

        };

        if (method === 'POST') {
            const user = JSON.parse(localStorage.getItem('user'));
            quality.User_id = user.id;
        }

        return await throwData(`http://localhost:5500/quality/${id}`, quality, method);
    } catch (error) {
        console.error('Failed to add quality:', error.message);
        alert("Failed to add quality.");
    }

}

// UPDATE / INSERT ENGINEER
export async function crudEngineer(method, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, id) {
    try {
        const engineer = {
            Review: Review.value,
            NotifyCustomer: NotifyCustomer.checked ? 1 : 0,
            Disposition: Disposition.value,
            RevisionNumber: RevisionNumber.textContent,
            RevisionDate: RevisionDate.value
        };
        console.log(engineer);
        await throwData(`http://localhost:5500/engineer/${id}`, engineer, method);
    } catch (error) {
        console.error('Failed to add engineer:', error.message);
        alert("Failed to add engineer.");
    }

}

export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export async function throwData(url, data, method) {
    try {
        console.log(data);
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseText = await response.text();
        console.log(responseText);
        if (!response.ok) {
            throw new Error(`Failed to ${method} data into ${url}`);
        }
        return JSON.parse(responseText);
    } catch (error) {
        console.error(error.message);
        //alert(`Encountered an unexpected error.` + error);
        return null;
    }
}