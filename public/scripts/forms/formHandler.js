import {
    newProduct,
    crudQuality,
    crudEngineer,
    crudPurchasing,
    fetchData,
} from "./crud.js";

const ENDPOINTS = {
    roles: "http://localhost:5500/roles/",
    suppliers: "http://localhost:5500/suppliers/",
    products: "http://localhost:5500/products/",
    formUsers: (id) => `http://localhost:5500/formusers/${id}`,
    ncrs: (id) => `http://localhost:5500/ncrs/${id}`,
    engineer: (id) => `http://localhost:5500/engineer/${id}`,
    purchasing: (id) => `http://localhost:5500/purchasing/${id}`,
};

let QUALITY_FIELDSET = document.getElementById("fs_quality");
let ENGINEER_FIELDSET = document.getElementById("fs_engineer");
let PURCHASING_FIELDSET = document.getElementById("fs_purchasing");

let QUALITY_CONTROLS = {};
let ENGINEER_CONTROLS = {};
let PURCHASING_CONTROLS = {};

let data = {
    id: new URLSearchParams(window.location.search).get("id"),
    role: [],
    supplier: [],
    product: [],
    quality: {},
    engineer: {},
    purchasing: {},
    user: JSON.parse(localStorage.getItem("user")),
};

let nav = {
    quality: document.getElementById("btnNavQuality"),
    engineer: document.getElementById("btnNavEngineer"),
    purchasing: document.getElementById("btnNavPurchasing"),
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
    select.innerHTML = "";
    select.appendChild(
        new Option(`Select ${elementID.replace("ID", "")}`, "", true, true)
    ).disabled = true;

    // Sort by alphabetical order
    dataArray.sort((a, b) => a[text].localeCompare(b[text]));

    // Populate the select with data
    dataArray.forEach((item) => {
        const option = new Option(item[text], item[value]);
        if (item[value] === selectedID) option.selected = true;
        select.appendChild(option);
    });

    if (elementID === "ProductID") {
        select.appendChild(new Option("New Product", "new"));
    }
}

// Form initialization
async function initForm() {
    await Promise.all([
        fetchAndPopulate(ENDPOINTS.roles, "role"),
        fetchAndPopulate(ENDPOINTS.suppliers, "supplier"),
        fetchAndPopulate(ENDPOINTS.products, "product"),
    ]);

    populateControls(QUALITY_FIELDSET, QUALITY_CONTROLS);
    populateControls(ENGINEER_FIELDSET, ENGINEER_CONTROLS);
    populateControls(PURCHASING_FIELDSET, PURCHASING_CONTROLS);

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

        if (data.quality.QualityStatus === "Closed") {
            let engResponse = await fetch(ENDPOINTS.engineer(id));
            if (!engResponse.ok)
            {
                console.log("Engineer form not found, making a new one.");
                ENGINEER_CONTROLS.ENGName.value = `${data.user.FName} ${data.user.LName}`;
            }
            else data.engineer = await engResponse.json();
        }
        if (Object.keys(data.engineer).length === 0) {
            // thank you mikemaccana on StackOverflow for this one
            data.engineer = null;
        }

        if (data.engineer) {
            populateEngineer();

            if (data.engineer.EngineerStatus === "Closed") {
                let purResponse = await fetch(ENDPOINTS.purchasing(id));
                if (!purResponse.ok)
                {
                    console.log("Purchasing form not found, making a new one.");
                    PURCHASING_CONTROLS.PURName.value = `${data.user.FName} ${data.user.LName}`;
                }
                else data.purchasing = await purResponse.json();
            }
            if (Object.keys(data.purchasing).length === 0) {
                // thank you mikemaccana on StackOverflow for this one
                data.purchasing = null;
            }
            if (data.purchasing) {
                populatePurchasing();
                console.log(data.purchasing);
            }
        }

        toggleForms();
    } catch (error) {
        console.error("Failed to load form data:", error);
    }
}

function populateFormUsers(users) {
    users.forEach((user) => {
        if (user.Title === "Inspector")
            QUALITY_CONTROLS.QLTName.value = `${user.FName} ${user.LName}`;
        if (user.Title === "Engineer")
            ENGINEER_CONTROLS.ENGName.value = `${user.FName} ${user.LName}`;
        if (user.Title === "Purchasing")
            PURCHASING_CONTROLS.PURName.value = `${user.FName} ${user.LName}`;
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
    populateSelect(
        "SupplierID",
        data.supplier,
        "SupplierName",
        "id",
        q.SupplierID
    );
    populateSelect(
        "ProductID",
        data.product.filter((p) => p.SupplierID === q.SupplierID),
        "ProductName",
        "id",
        q.ProductID
    );
    const selectedProduct = data.product.find(
        (p) => p.id === parseInt(q.ProductID)
    );
    document.getElementById("ProductNumber").textContent = `Number: ${
        selectedProduct?.Number || "N/A"
    }`;
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
    if (e.UpdateDrawing)
        ENGINEER_CONTROLS.UpdateDrawing_0.checked = e.UpdateDrawing === 1;
    if (e.RevisionNumber)
        ENGINEER_CONTROLS.RevisionNumber.value = e.RevisionNumber;
    if (e.RevisionDate) ENGINEER_CONTROLS.RevisionDate.value = e.RevisionDate;
    ENGINEER_CONTROLS.ENGDate.value = e.LastModified;
}

function populatePurchasing() {
    let e = data.purchasing;
    PURCHASING_CONTROLS.Decision_0.checked =
        e.PreliminaryDecision === "Return To Supplier";
    PURCHASING_CONTROLS.Decision_1.checked =
        e.PreliminaryDecision === "Rework In House";
    PURCHASING_CONTROLS.Decision_2.checked = 
        e.PreliminaryDecision === "Scrap";
    PURCHASING_CONTROLS.Decision_3.checked =
        e.PreliminaryDecision === "Defer For HBC Engineering Review";
    if (e.CARRaised)
        if (e.CARRaised) {
            PURCHASING_CONTROLS.CarRaised_0.checked = e.CARRaised === 1;
            PURCHASING_CONTROLS.CarRaised_1.checked = e.CARRaised === 0;
        }    
    PURCHASING_CONTROLS.CARNumber.value = e.CARNumber;
    PURCHASING_CONTROLS.FollowUp_0.checked = e.FollowUpRequired === 1;
    PURCHASING_CONTROLS.FollowUp_1.checked = e.FollowUpRequired === 0;
    PURCHASING_CONTROLS.FollowUpType.value = e.FollowUpType;
    PURCHASING_CONTROLS.FollowUpDate.value = e.FollowUpDate;
    PURCHASING_CONTROLS.PURDate.value = e.LastModified;
}

function toggleForms() {
    let Title;
    if (data.user)
        Title =
            data.user.RoleID === 1
                ? "admin"
                : data.user.RoleID === 2
                ? "quality"
                : data.user.RoleID === 3
                ? "engineer"
                : data.user.RoleID === 4
                ? "purchasing"
                : undefined;

    disableForm(Title, QUALITY_FIELDSET, [
        QUALITY_CONTROLS.QLTClose, QUALITY_CONTROLS.QLTOpen,
        nav.quality,
    ]);
    disableForm(Title, ENGINEER_FIELDSET, [
        ENGINEER_CONTROLS.ENGClose, ENGINEER_CONTROLS.ENGOpen,
        nav.engineer,
    ]);
    disableForm(Title, PURCHASING_FIELDSET, [
        PURCHASING_CONTROLS.PURClose, PURCHASING_CONTROLS.PUROpen,
        nav.purchasing,
    ]);
    
    nav.quality.style.display = "block";

    if (Title === "quality")
    {
        document.getElementById("ncrform_quality").style.display = "block";
    }
    
    if (Title === "engineer") {
        nav.engineer.style.display = "block";
        document.getElementById("ncrform_engineer").style.display = "block";
    }
    if (Title === "purchasing")
    {
        nav.engineer.style.display = "block";
        nav.purchasing.style.display = "block";
        document.getElementById("ncrform_purchasing").style.display = "block";
    }
    if (Title === "admin")
    {
        nav.engineer.style.display = "block";
        nav.purchasing.style.display = "block";
    }
}

function disableForm(title, fieldset, controls) {
    try
    {
        if (!fieldset || title === "admin") return;
        const name = fieldset.id.split("_")[1].toLowerCase();
        fieldset.disabled = title !== name;
        controls.forEach((control) => (control.hidden = title !== name));
    } catch (error)
    {
        console.log("error: " + error);
    }
    
}

function resetForm() {
    QUALITY_CONTROLS.QLTDate.value = formatDate(new Date());
    populateSelect("SupplierID", data.supplier, "SupplierName", "id");
    if (data.user)
        QUALITY_CONTROLS.QLTName.value = `${data.user.FName} ${data.user.LName}`;
}

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function setupEventListeners() {
    const qltForm = document.getElementById("ncrform_quality");
    const engForm = document.getElementById("ncrform_engineer");
    const purForm = document.getElementById("ncrform_purchasing");

    document
        .getElementById("NEWProduct")
        .addEventListener("click", handleNewProduct);

    $("#SupplierID").on("select2:select", function (e) {
        populateProductsForSupplier(parseInt(e.params.data.id));
    });
    QUALITY_CONTROLS.ProductID.addEventListener("change", handleProductChange);

    // Submit event listener for quality form

    qltForm.addEventListener("submit", async (event) => {
        const submitButton = event.submitter;
        const buttonID = submitButton ? submitButton.id : null;
        console.log(`Button clicked: ${buttonID}`);
        if (!qltForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            qltForm.classList.add("was-validated"); // add validation class?
            return; // Exit if  form invalid
        }
        if (qltForm.checkValidity()) {
            if (buttonID.includes("Open"))
                handleSubmit(QUALITY_CONTROLS, "Open");
            else if (buttonID.includes("Close"))
                handleSubmit(QUALITY_CONTROLS, "Closed");
        }
    });

    // If engineer form exists, add event listener
    if (engForm) {
        if (ENGINEER_CONTROLS.RevisionNumber) handleRevision();
        engForm.addEventListener("submit", async (event) => {
            const submitButton = event.submitter;
            const buttonID = submitButton ? submitButton.id : null;
            if (!engForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                engForm.classList.add("was-validated"); // add validation class?
                return; // Exit if  form invalid
            }
            if (engForm.checkValidity()) {
                if (buttonID.includes("Open"))
                    handleSubmit(ENGINEER_CONTROLS, "Open");
                else if (buttonID.includes("Close"))
                    handleSubmit(ENGINEER_CONTROLS, "Closed");
            }
        });
    }

    // If purchasing form exists, add event listener
    if (purForm) {

        PURCHASING_CONTROLS.CarRaised_0.addEventListener('change', handleCAR);
        PURCHASING_CONTROLS.CarRaised_1.addEventListener('change', handleCAR);
        PURCHASING_CONTROLS.FollowUp_0.addEventListener('change', handleFollowUp);
        PURCHASING_CONTROLS.FollowUp_1.addEventListener('change', handleFollowUp);

        purForm.addEventListener("submit", async (event) => {
            const submitButton = event.submitter;
            const buttonID = submitButton ? submitButton.id : null;
            if (!purForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                purForm.classList.add("was-validated"); // add validation class?
                return; // Exit if  form invalid
            }
            if (purForm.checkValidity()) {
                if (buttonID.includes("Open"))
                    handleSubmit(PURCHASING_CONTROLS, "Open");
                else if (buttonID.includes("Close"))
                    handleSubmit(PURCHASING_CONTROLS, "Closed");
            }
        });
    }
}

async function handleProductChange(event) {
    const productID = event.target.value;
    if (productID === "new") {
        document.getElementById("ProductNumber").textContent = `Number: N/A`;
        showNewProductModal();
        return;
    }
    const selectedProduct = data.product.find(
        (p) => p.id === parseInt(productID)
    );
    document.getElementById("ProductNumber").textContent = `Number: ${
        selectedProduct?.Number || "N/A"
    }`;
}

function populateProductsForSupplier(supplierID) {
    const products = data.product.filter((p) => p.SupplierID === supplierID);
    populateSelect("ProductID", products, "ProductName", "id");
}

async function handleSubmit(CONTROLS, status) {
    const form = CONTROLS;
    const qltMethod = data.id ? "PUT" : "POST";
    const engMethod = data.engineer ? "PUT" : "POST";
    const purMethod = data.purchasing ? "PUT" : "POST";

    try {
        if (CONTROLS === QUALITY_CONTROLS)
            await crudQuality(qltMethod, form, status, data.id);
        else if (CONTROLS === ENGINEER_CONTROLS)
            await crudEngineer(engMethod, form, status, data.id);
        else if (CONTROLS === PURCHASING_CONTROLS)
            await crudPurchasing(purMethod, form, status, data.id);
    } catch (error) {
        console.error("Failed to submit form:", error);
    }
}

async function handleNewProduct() {
    try {
        await newProduct(
            QUALITY_CONTROLS.SupplierID,
            document.getElementById("NEWName"),
            document.getElementById("NEWNumber")
        );
        populateProductsForSupplier(
            parseInt(QUALITY_CONTROLS.SupplierID.value)
        );
    } catch (error) {
        console.error("Failed to create new product:", error);
    }
}

async function handleRevision() {
    document
        .getElementById("DrawingUpdateRequired_0")
        .addEventListener("click", function () {
            if (this.checked) {
                NewRevNum.style.display = "block";
                NewRevDate.style.display = "block";
                let revisionNumber = null;
                if (data.engineer)
                    revisionNumber = incrementRevisionNumber(
                        data.engineer.RevisionNumber
                    );
                else revisionNumber = incrementRevisionNumber(revisionNumber);
                NewRevisionNumber.value = revisionNumber;
            }
        });
    document
        .getElementById("DrawingUpdateRequired_1")
        .addEventListener("click", function () {
            if (this.checked) {
                NewRevNum.style.display = "none";
                NewRevDate.style.display = "none";
                NewRevisionNumber.value = "";
            }
        });
}

function incrementRevisionNumber(revisionNumber) {
    if (revisionNumber === null) {
        return incrementRevisionNumber(
            Math.floor(Math.random() * (999 - 100 + 1) + 100).toString() + "-@"
        );
    }
    const parts = revisionNumber.split("-");
    const number = parts[0];
    let letter = parts[1].charCodeAt(0);
    letter = String.fromCharCode(letter + 1);
    return `${number}-${letter}`;
}

function showNewProductModal() {
    const options = {
        backdrop: "",
    };
    $("#newProductModal").modal(options);
}

function populateControls(fs, controls) {
    if (fs) {
        Array.from(fs.elements).forEach((element) => {
            if (element && element.id) {
                controls[element.id] = element;
            }
        });
    }
}

async function handleFollowUp() {
    const followUp0 = document.getElementById("FollowUp_0");
    const followUp1 = document.getElementById("FollowUp_1");
        if (followUp0.checked) {
            FollowUpTypeContainer.style.display = "block";
            FollowUpDateContainer.style.display = "block";
        } else if (followUp1.checked) {
            FollowUpTypeContainer.style.display = "none";
            FollowUpDateContainer.style.display = "none";
        }
}

async function handleCAR() {
    const carRasied0 = document.getElementById("CarRaised_0")
    const carRasied1 = document.getElementById("CarRaised_1")
        if(carRasied0.checked) {
            CARNumberContainer.style.display = "block"
        }
        else if (carRasied1.checked) {
            CARNumberContainer.style.display = "none"
        }
}

//initForm();
initForm().then(() => {
    setupEventListeners();
});
