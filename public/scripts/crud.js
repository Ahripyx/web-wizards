import * as notif from './notification.js';

// CREATE NEW PRODUCT
export async function newProduct(SupplierID, ProductName, Number) {
    try {
        const productToInsert = {
            ProductName: ProductName.value,
            Number: parseInt(Number.value, 10),
            SupplierID: parseInt(SupplierID.value, 10)
        };

        const response = await fetch('http://localhost:5500/products/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productToInsert)
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
export async function crudQuality(method, form, id) {
    try {
        const quality = {
            SalesOrder: parseInt(form.SalesOrder.value, 10),
            SRInspection: form.ProcessApplicable_1.checked ? 1 : 0,
            WorkInProgress: form.ProcessApplicable_0.checked ? 1 : 0,
            ItemDescription: form.ProductID.options[form.ProductID.selectedIndex].text,
            QuantityReceived: parseInt(form.QuantityReceived.value, 10),
            QuantityDefective: parseInt(form.QuantityDefective.value, 10),
            IsNonConforming: form.IsNonConforming_0.checked ? 1 : 0,
            Details: form.Details.value,
            ProductID: parseInt(form.ProductID.value, 10),
        };

        if (method === 'POST') {
            const user = JSON.parse(localStorage.getItem('user'));
            quality.User_id = user.id;
        }
        else if (method === 'PUT') {
            quality.QualityStatus = form.QLTStatus.value;
        }

        if (!id) id = '';

        let result = await throwData(`http://localhost:5500/quality/${id}`, quality, method);
        
        if (method === 'POST')
        {
            result.form.type = "Quality";
            result.form.SalesOrder = quality.SalesOrder;
            result.form.ItemDescription = quality.ItemDescription;
            result.form.QuantityReceived = quality.QuantityReceived;
            result.form.QuantityDefective = quality.QuantityDefective;
            notif.newNotification(JSON.stringify(result.form));
        }

        if (id) window.location.href = `details.html?id=${id}`;
        else window.location.href = `details.html?id=${result.form.lastInsertRowid}`;
    } catch (error) {
        console.error(`Failed to ${method} quality:`, error);
    }

}

// UPDATE / INSERT ENGINEER
export async function crudEngineer(method, form, id = '') {
    try {
        let review =
            form.Review_0.checked ? "Use As Is" :
            form.Review_1.checked ? "Repair" :
            form.Review_2.checked ? "Rework" :
            form.Review_3.checked ? "Scrap" : undefined;

            let revisionNumber = form.NewRevisionNumber.value ? form.NewRevisionNumber.value : form.RevisionNumber.value;

        const engineer = {
            Review: review,
            NotifyCustomer: form.NotifyCustomer_0.checked ? 1 : 0,
            Disposition: form.Disposition.value,
            RevisionNumber: revisionNumber,
            RevisionDate: form.RevisionDate.value,
            EngineerStatus: form.ENGStatus.value
        };

        if (!id) id = '';
        
        let result = await throwData(`http://localhost:5500/engineer/${id}`, engineer, method);
        
        if (method === 'POST')
            {
                result.form.type = "Engineer";
                notif.newNotification(JSON.stringify(result.form));
            }

        if (id) window.location.href = `details.html?id=${id}`;
        else window.location.href = `details.html?id=${result.form.lastInsertRowid}`;
    } catch (error) {
        console.error(`Failed to ${method} engineer:`, error.message);
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
        return null;
    }
}

export async function throwData(url, data, method) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to ${method} data into ${url}: ${errorText}`);
        }
        else {
            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (error) {
                result = responseText;
            }
            return await result;
        }
        return await response.json();
    } catch (error) {
       // if (error instanceof SyntaxError) return null;
        //console.error(error);
        //alert(`Encountered an unexpected error.` + error.message);
        //return null;
        throw error;
    }
}