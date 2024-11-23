import { newProduct, crudQuality, crudEngineer, fetchData } from './crud.js';

const ENDPOINTS = {
    roles: 'http://localhost:5500/roles/',
    suppliers: 'http://localhost:5500/suppliers/',
    products: 'http://localhost:5500/products/',
    formUsers: (id) => `http://localhost:5500/formusers/${id}`,
    ncrs: (id) => `http://localhost:5500/ncrs/${id}`,
    engineer: (id) => `http://localhost:5500/engineer/${id}`,
};

let QUALITY_FIELDSET = document.getElementById('fs_quality');
let ENGINEER_FIELDSET = document.getElementById('fs_engineer');
let PURCHASING_FIELDSET = undefined;

let QUALITY_CONTROLS = {};
let ENGINEER_CONTROLS = {};
let PURCHASING_CONTROLS = {};

let data = {
    id: new URLSearchParams(window.location.search).get('id'),
    role: [], 
    supplier: [], 
    product: [], 
    quality: {},
    engineer: {},
    purchasing: {},
    user: JSON.parse(localStorage.getItem('user')),
};

let nav = {
    quality: document.getElementById('btnNavQuality'),
    engineer: document.getElementById('btnNavEngineer'),
    purchasing: document.getElementById('btnNavPurchasing'),
};

// Fetch data from endpoints and populate the data
async function fetchAndPopulate(endpoint, targetArray) {
    try {
        const result = await fetchData(endpoint);
        data[targetArray] = result;
    } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
    }
}

// Populate the select elements with the data
function populateSelect(elementID, dataArray, text, value, selectedID = null) {
    const select = document.getElementById(elementID);
    select.innerHTML = '';
    select.appendChild(new Option(`Select ${elementID.replace('ID', '')}`, '', true, true)).disabled = true;

    // Sort by alphabetical order
    dataArray.sort((a, b) => a[text].localeCompare(b[text]));

    // Populate the select with data
    dataArray.forEach(item => {
        const option = new Option(item[text], item[value]);
        if (item[value] === selectedID) option.selected = true;
        select.appendChild(option);
    });

    if (elementID === 'ProductID') {
        select.appendChild(new Option('New Product', 'new'));
    }
}

// Form initialization
async function initForm()
{
    await Promise.all([
        fetchAndPopulate(ENDPOINTS.roles, 'role'),
        fetchAndPopulate(ENDPOINTS.suppliers, 'supplier'),
        fetchAndPopulate(ENDPOINTS.products, 'product'),
    ]);

    // Populate QUALITY_CONTROLS by looping through the elements in the QUALITY_FIELDSET
    if (QUALITY_FIELDSET) {
        Array.from(QUALITY_FIELDSET.elements).forEach(element => {
            if (element && element.id) {
                QUALITY_CONTROLS[element.id] = element;
            }
        });
    }

    // Populate ENGINEER_CONTROLS by looping through the elements in the QUALITY_FIELDSET
    if (ENGINEER_FIELDSET) {
        Array.from(ENGINEER_FIELDSET.elements).forEach(element => {
            if (element && element.id) {
                ENGINEER_CONTROLS[element.id] = element;
            }
        });
    }

    if (data.id) await loadFormData(data.id);
    else resetForm();
}

// Populate the form with data
async function loadFormData(id) {
        

    try {
        const formUsers = await fetchData(ENDPOINTS.formUsers(id));
        const ncrs = await fetchData(ENDPOINTS.ncrs(id));
        data.quality = ncrs[0];

        populateFormUsers(formUsers);
        populateQuality();

        if (data.quality.QualityStatus === 'Closed') {
            let engResponse = await fetch(ENDPOINTS.engineer(id));
            if (!engResponse.ok)
                 console.log('Engineer form not found, making a new one.');
                else
                    data.engineer = await engResponse.json();
        }
        if (Object.keys(data.engineer).length === 0) // thank you mikemaccana on StackOverflow for this one
            data.engineer = null;

        if (data.engineer)
            populateEngineer();

        toggleForms();
    } catch (error) {
        console.error('Failed to load form data:', error);
    }
}

function populateFormUsers(users) {
    users.forEach(user => {
        if (user.Title === 'Quality') QUALITY_CONTROLS.QLTName.value = `${user.FName} ${user.LName}`;
        if (user.Title === 'Engineer') ENGINEER_CONTROLS.ENGName.value = `${user.FName} ${user.LName}`;
    });
}

function populateQuality() {
    let q = data.quality;
    QUALITY_CONTROLS.SalesOrder.value = q.SalesOrder;
    QUALITY_CONTROLS.ProcessApplicable_0.checked = q.WorkInProgress === 1;
    QUALITY_CONTROLS.ProcessApplicable_1.checked = q.SRInspection === 1;
    QUALITY_CONTROLS.QuantityReceived.value = q.QuantityReceived;
    QUALITY_CONTROLS.QuantityDefective.value = q.QuantityDefective;
    QUALITY_CONTROLS.IsNonConforming_0.checked = q.IsNonConforming === 1;
    QUALITY_CONTROLS.IsNonConforming_1.checked = q.IsNonConforming === 0;
    QUALITY_CONTROLS.Details.value = q.Details;
    QUALITY_CONTROLS.QLTDate.value = q.LastModified;
    QUALITY_CONTROLS.QLTStatus.value = q.QualityStatus === 'Open' ? 'Open' : 'Closed';
    populateSelect('SupplierID', data.supplier, 'SupplierName', 'id', q.SupplierID);
    populateSelect('ProductID', data.product.filter(p => p.SupplierID === q.SupplierID), 'ProductName', 'id', q.ProductID);
    const selectedProduct = data.product.find(p => p.id === parseInt(q.ProductID));
    document.getElementById('ProductNumber').textContent = `Number: ${selectedProduct?.Number || 'N/A'}`;
}

function populateEngineer() {
    let e = data.engineer;
    ENGINEER_CONTROLS.Review_0.checked = e.Review === "Use As Is";
    ENGINEER_CONTROLS.Review_1.checked = e.Review === "Repair";
    ENGINEER_CONTROLS.Review_2.checked = e.Review === "Rework";
    ENGINEER_CONTROLS.Review_3.checked = e.Review === "Scrap";
    ENGINEER_CONTROLS.NotifyCustomer_0.checked = e.NotifyCustomer === 1;
    ENGINEER_CONTROLS.NotifyCustomer_1.checked = e.NotifyCustomer === 0;
    ENGINEER_CONTROLS.Disposition.value = e.Disposition;
    if (e.RevisionNumber)
        ENGINEER_CONTROLS.RevisionNumber.value = e.RevisionNumber;
    if (e.RevisionDate)
        ENGINEER_CONTROLS.RevisionDate.value = e.RevisionDate;
    ENGINEER_CONTROLS.ENGDate.value = e.LastModified;
    ENGINEER_CONTROLS.ENGStatus.value = e.EngineerStatus === 'Open' ? 'Open' : 'Closed';
}

function toggleForms(){
    let Title;
    if (data.user) 
        Title = 
    data.user.RoleID === 1 ? 'admin' : 
    data.user.RoleID === 2 ? 'quality' : 
    data.user.RoleID === 3 ? 'engineer' :
    data.user.RoleID === 4 ? 'purchasing' : undefined;

    disableForm(Title, QUALITY_FIELDSET, [QUALITY_CONTROLS.QLTSubmit, nav.quality]);
    disableForm(Title, ENGINEER_FIELDSET, [ENGINEER_CONTROLS.ENGSubmit, nav.engineer]);
    disableForm(Title, PURCHASING_FIELDSET, [PURCHASING_CONTROLS.PURSubmit, nav.purchasing]);

    if (Title === 'quality')
        nav.purchasing.hidden = true;
    if (Title === 'engineer') 
    {
        nav.quality.hidden = false;
        nav.purchasing.hidden = true;
    }
}

function disableForm(title, fieldset, controls) {
    if (!fieldset || title === 'admin') return;
    const name = fieldset.id.split('_')[1].toLowerCase();
    fieldset.disabled = title !== name;
    controls.forEach(control => control.hidden = title !== name);
}

function resetForm() {
    QUALITY_CONTROLS.QLTDate.value = formatDate(new Date());
    populateSelect('SupplierID', data.supplier, 'SupplierName', 'id');
    if (data.user) QUALITY_CONTROLS.QLTName.value = `${data.user.FName} ${data.user.LName}`;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function setupEventListeners() {
    document.getElementById('NEWProduct').addEventListener('click', handleNewProduct);

    QUALITY_CONTROLS.ProductID.addEventListener('change', handleProductChange);
    QUALITY_CONTROLS.SupplierID.addEventListener('change', handleSupplierChange);
    QUALITY_CONTROLS.QLTSubmit.addEventListener('click', () => handleSubmit(QUALITY_CONTROLS));
    
    if (ENGINEER_CONTROLS.RevisionNumber)
        handleRevision();
    if (ENGINEER_CONTROLS.ENGSubmit)
        ENGINEER_CONTROLS.ENGSubmit.addEventListener('click', () => handleSubmit(ENGINEER_CONTROLS));
    if (PURCHASING_CONTROLS.PURSubmit)
        PURCHASING_CONTROLS.PURSubmit.addEventListener('click', () => handleSubmit(PURCHASING_CONTROLS));
}

async function handleProductChange(event) {
    const productID = event.target.value;
    if (productID === 'new') {
        document.getElementById('ProductNumber').textContent = `Number: N/A`;
        showNewProductModal();
        return;
    }
    const selectedProduct = data.product.find(p => p.id === parseInt(productID));
    document.getElementById('ProductNumber').textContent = `Number: ${selectedProduct?.Number || 'N/A'}`;
}

async function handleSupplierChange(event) {
    const supplierID = parseInt(event.target.value);
    populateProductsForSupplier(supplierID);
}

function populateProductsForSupplier(supplierID) {
    const products = data.product.filter(p => p.SupplierID === supplierID);
    populateSelect('ProductID', products, 'ProductName', 'id');
}

async function handleSubmit(CONTROLS) {
    const form = CONTROLS;
    const qltMethod = data.id ? 'PUT' : 'POST';
    const engMethod = data.engineer ? 'PUT' : 'POST';

    try {
        if (CONTROLS === QUALITY_CONTROLS) await crudQuality(qltMethod, form, data.id);
        else if (CONTROLS === ENGINEER_CONTROLS) await crudEngineer(engMethod, form, data.id);
    } catch (error) {
        console.error('Failed to submit form:', error);
    }
}

async function handleNewProduct() {
    try {
        await newProduct(QUALITY_CONTROLS.SupplierID, document.getElementById('NEWName'), document.getElementById('NEWNumber'));
        populateProductsForSupplier(parseInt(QUALITY_CONTROLS.SupplierID.value));
    } catch (error) {
        console.error('Failed to create new product:', error);
    }
} 

async function handleRevision() {
    document.getElementById('DrawingUpdateRequired_0').addEventListener("click", function() {
        if (this.checked) {
            NewRevNum.style.display = 'block';
            NewRevDate.style.display = 'block';
            let revisionNumber = null;
            if (data.engineer)
                revisionNumber = incrementRevisionNumber(data.engineer.RevisionNumber);
            else
                revisionNumber = incrementRevisionNumber(revisionNumber);
            NewRevisionNumber.value = revisionNumber;
        }
    });
    document.getElementById('DrawingUpdateRequired_1').addEventListener("click", function() {
        if (this.checked) {
            NewRevNum.style.display = 'none';
            NewRevDate.style.display = 'none';
            NewRevisionNumber.value = '';
        }
    });
}

function incrementRevisionNumber(revisionNumber) {

    if (revisionNumber === null) {
        return incrementRevisionNumber(Math.floor(Math.random() * (999 - 100 + 1) + 100).toString() + '-@');
    }
    const parts = revisionNumber.split('-');
    const number = parts[0];
    let letter = parts[1].charCodeAt(0);
    letter = String.fromCharCode(letter + 1);
    return `${number}-${letter}`;
}

function showNewProductModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'block';
    document.getElementById('close').onclick = () => modal.style.display = 'none';
}

//initForm();
initForm().then(() => {
    setupEventListeners();
});

/*
export async function fillForm(selectedID = null) {
    try {
        role = await fetchData('http://localhost:5500/roles/');
        supplier = await fetchData('http://localhost:5500/suppliers/');
        product = await fetchData('http://localhost:5500/products/');

        for (let control of qualityFs.elements) {
            qualityCtrl[control.id] = control;
        }
        qualityCtrl['SalesOrder'].value = '1245';
        console.log(qualityCtrl['SalesOrder'].value);

        // Get the Product select element and add an event to make the product number visible when a product is selected

        document.getElementById("ProductID").addEventListener("change", async function() {
            try {

                if (this.value === 'new') {
                    document.getElementById('ProductNumber').textContent = `Number: `;
                    newProductModal();
                    return;
                }
                const productID = this.value;
                const ProductData = await fetchData(`http://localhost:5500/products/${productID}`);

                document.getElementById('ProductNumber').textContent = `Number: ${ProductData.Number}`;

            } catch (error) {
                document.getElementById('ProductNumber').textContent = `Number: ${ProductData.Number}`;
                console.error('Failed to fetch products:', error);
            }
        });

        // Get the Supplier select element and add an event to get products attributed to the selected supplier
        document.getElementById("SupplierID").addEventListener("change", function() {
            supplierSelect(document.getElementById("SupplierID"));
        });

        // If we have an ID (as in we are editing a form), get the form data and fill the form
        if (selectedID) {
            try {
                NCR_id = selectedID;
                formusers = await fetchData(`http://localhost:5500/formusers/${selectedID}`);

                var qualityArray = await fetchData(`http://localhost:5500/ncrs/${selectedID}`);
                quality = qualityArray[0];
                engineer = await fetchData(`http://localhost:5500/engineer/${selectedID}`);

                console.log(formusers);
                console.log(quality);
                console.log(engineer);
            } catch (error) {
                console.log('Failed to fetch NCR:', error);
            }

            try {
                formusers.forEach(formuser => {
                    if (formuser.Title = 'Quality') document.getElementById('QAName').value = formuser.FName + ' ' + formuser.LName;
                    if (formuser.Title = 'Engineer') document.getElementById('ENGName').value = formuser.FName + ' ' + formuser.LName;
                });

                fillQuality();
                fillEngineer(user, quality, selectedID);

                if (user.RoleID === 1) toggleForms('admin');
                else if (user.RoleID === 2) toggleForms('quality');
                else if (user.RoleID === 3) toggleForms('engineer');
            } catch (error) {
                console.error('Failed to fill form:', error);
            }
        } else {
            document.getElementById('QADate').value = formatDate(new Date());
            await getSuppliers();

            const user = JSON.parse(localStorage.getItem('user'));
            if (user !== null) {
                document.getElementById('QAName').value = user.FName + ' ' + user.LName;
            }
        }


    } catch (error) {
        console.error('Failed to fetch NCR:', error);
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// REFRESHES PRODUCT LIST WHEN SUPPLIER IS SELECTED
async function supplierSelect(supplierElement) {
    // Get the Supplier select element and add an event to get products attributed to the selected supplier

    const supplierID = supplierElement.value;
    const ProductElement = document.getElementById("ProductID");
    ProductElement.disabled = true;
    ProductElement.innerHTML = '';

    // If a supplier is selected, get products attributed to that supplier
    if (supplierID) {
        try {

            document.getElementById('ProductNumber').textContent = `Number: `;
            const ProductResponse = await fetch(`http://localhost:5500/product&suppliers`);
            if (!ProductResponse.ok) {
                throw new Error('Failed to fetch products');
            }

            // Get the products and add them to the Product select element
            const ProductData = await ProductResponse.json();
            const selectOption = document.createElement('option');

            selectOption.text = 'Select a Product';
            selectOption.selected = true;
            selectOption.disabled = true;
            selectOption.value = null;
            ProductElement.appendChild(selectOption);

            ProductData.forEach(product => {
                if (product.SupplierID === Number(supplierID)) {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.text = product.ProductName;
                    ProductElement.appendChild(option);
                }

            });
            if (ProductElement.options.length > 1) {
                ProductElement.disabled = false;
                const newProduct = document.createElement('option');
                newProduct.value = 'new';
                newProduct.text = 'New Product';
                ProductElement.appendChild(newProduct);
            } else {
                ProductElement.innerHTML = '';
                const option = document.createElement('option');
                option.text = 'No products available';
                option.selected = true;
                option.value = null;
                ProductElement.appendChild(option);
            }

        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    }
}

// CREATE NEW PRODUCT MODAL
async function newProductModal() {
    // Get the modal
    const productModal = document.getElementById('product-modal');
    productModal.style.display = "block";

    // Get the <span> element that closes the modal
    const close = document.getElementById('close');
    close.onclick = function() {
        productModal.style.display = "none";
    }

    // Create a new product
    const btnNewProduct = document.getElementById('btnNewProduct');
    btnNewProduct.onclick = function() {
        try {
            newProduct(
                document.getElementById('SupplierID'),
                document.getElementById('newProductName'),
                document.getElementById('newProductNumber')
            );
            supplierSelect(document.getElementById('SupplierID'));

        } catch (error) {
            alert("Failed to create new product.");
            console.error('Failed to create new product:', error);
        }

    }

}
export async function fillQuality() {

    await getSuppliers(quality.SupplierID);
    await getProducts(quality.ProductID);

    document.getElementById('SalesOrder').value = quality.SalesOrder;
    document.getElementById('ProcessApplicable_0').checked = quality.WorkInProgress === 1;
    document.getElementById('ProcessApplicable_1').checked = quality.SRInspection === 1;
    document.getElementById('QuantityReceived').value = quality.QuantityReceived;
    document.getElementById('QuantityDefective').value = quality.QuantityDefective;
    if (quality.IsNonConforming === 1) document.getElementById('IsNonConforming_0').checked = true;
     else document.getElementById('IsNonConforming_1').checked = true;
    document.getElementById('Details').value = quality.Details;
    if (NCR_id) {
        document.getElementById('QADate').value = quality.LastModified;
        const qaDisabled = quality.QualityStatus === 'Closed';
        document.getElementById('QualityStatus').hidden = qaDisabled;
        document.getElementById('btnSubmit_Quality').hidden = qaDisabled;
        document.getElementById('fs_quality').disabled = qaDisabled;
    } else {
        console.log(new Date());
        document.getElementById('QADate').value = new Date();
    }
}


// FETCHES ENGINEER DATA
export async function fillEngineer(user, QualityData, selectedID = null) {
    if (QualityData.QualityStatus === 'Open') return;
    if (user.RoleID === 3) document.getElementById('ENGName').value = user.FName + ' ' + user.LName;
    const EngineerResponse = await fetch(`http://localhost:5500/engineer/${selectedID}`);
    if (!EngineerResponse.ok) {
        document.getElementById('EngineerNewOrEdit').value = 'Create';
        document.getElementById('ENGDate').value = formatDate(new Date());
        //throw new Error('Failed to fetch engineer data');
    }

    const UpdateTrue = document.getElementById('DrawingUpdateRequired_0');
    const UpdateFalse = document.getElementById('DrawingUpdateRequired_1');
    const RevisionNumber = document.getElementById('RevisionNumber');
    const NewRevisionNumber = document.getElementById('NewRevisionNumber');
    const RevisionDate = document.getElementById('RevisionDate');

    const EngineerData = await EngineerResponse.json();
    document.querySelector(`input[name="Review"][value="${EngineerData.Review}"]`).checked = true;
    document.getElementById('NotifyCustomer_0').checked = EngineerData.NotifyCustomer === 1;
    document.getElementById('NotifyCustomer_1').checked = EngineerData.NotifyCustomer === 0;
    document.getElementById('Disposition').value = EngineerData.Disposition;
    RevisionNumber.textContent = EngineerData.RevisionNumber;
    document.getElementById('fs_engineer').disabled = EngineerData.QualityStatus === 'Closed';
    document.getElementById('ENGDate').value = EngineerData.LastModified;
    //RevisionDate.value = new Date().toISOString().split('T')[0];

    const NewRevNum = document.getElementById('NewRevNum');
    const NewRevDate = document.getElementById('NewRevDate');
    if (EngineerData.EngineerStatus === 'Closed')
    {
        document.getElementById('btnSubmit_Engineer').hidden = true;
        document.getElementById('fs_engineer').disabled = true;
    }
    

}

export async function updateForm(id, formType) {
    if (formType === 'quality') {
        await crudQuality(
            "PUT",
            document.getElementById("SalesOrder"),
            document.getElementById("ProcessApplicable_1"),
            document.getElementById("ProcessApplicable_0"),
            document.getElementById("ProductID"),
            document.getElementById("QuantityReceived"),
            document.getElementById("QuantityDefective"),
            document.getElementById("IsNonConforming_0"),
            document.getElementById("Details"),
            document.getElementById("ProductID"),
            id
        );
    }
}

export async function insertForm(id) {

    try {

        const Review = document.querySelector('input[name="Review"]:checked');
        const NotifyCustomer = document.getElementById('NotifyCustomer_0');
        const Disposition = document.getElementById('Disposition');
        var RevisionNumber = document.getElementById('RevisionNumber');
        if (NewRevisionNumber.hidden === false) {
            RevisionNumber = NewRevisionNumber;
        }

        const RevisionDate = document.getElementById('RevisionDate');

        if (document.getElementById('EngineerNewOrEdit').value === 'Create') {
            crudEngineer("POST", Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, id);
        } else {
            crudEngineer("PUT", Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, id);
        }
    } catch (error) {
        console.error('Failed to create engineer form:', error);
    }
}



function toggleForms(formType) {


    const navQuality = document.getElementById('btnNavQuality');
    const navEngineer = document.getElementById('btnNavEngineer');
    const navPurchasing = document.getElementById('btnNavPurchasing');

    if (formType === 'admin') {

        navQuality.hidden = false;
        navEngineer.hidden = false;
        navPurchasing.hidden = false;
    }
    if (formType === 'quality') {
        //btnPurchasing.style.display = 'none';

        qualityForm.disabled = false;
        engineerForm.disabled = true;

        engineerForm.style.display = 'none';
        //purchasingForm.style.display = 'none';

        navEngineer.hidden = true;
        navPurchasing.hidden = true;
    } else if (formType === 'engineer') {

        qualityForm.disabled = true;
        engineerForm.disabled = false;

        //purchasingForm.style.display = 'none';

        navPurchasing.hidden = true;
    }
}

function populateSelect(id, data, text, value, selectedID = null) {
    const select = document.getElementById(id);
    select.innerHTML = '';

    const selectOption = document.createElement('option');
    selectOption.text = `Select a ${id.replace('ID', '')}`;
    selectOption.value = '';
    selectOption.disabled = true
    selectOption.selected = true;
    select.appendChild(selectOption);

    data.forEach(thing => {
        const option = document.createElement('option');
        option.text = thing[text];
        option.value = thing[value];
        if (thing[value] === selectedID) {
            option.selected = true;
        }
        select.appendChild(option)
    });
}*/