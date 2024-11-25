import { fetchData } from "./crud.js";

export const Quality = {
    data: {},
    controls: {},

    async init(endpoint, fieldset) {
        const result = await fetchData(endpoint);
        this.data = result[0];
        this.controls = populateControls(fieldset);
    },

    populateForm(supplierList, productList) {
        this.controls.SalesOrder.value = this.data.SalesOrder;
        this.controls.ProcessApplicable_0.checked = this.data.WorkInProgress === 1;
        this.controls.ProcessApplicable_1.checked = this.data.SRInspection === 1;
        this.controls.QuantityReceived.value = this.data.QuantityReceived;
        this.controls.QuantityDefective.value = this.data.QuantityDefective;
        this.controls.IsNonConforming_0.checked = this.data.IsNonConforming === 1;
        this.controls.IsNonConforming_1.checked = this.data.IsNonConforming === 0;
        this.controls.Details.value = this.data.Details;
        this.controls.QLTDate.value = this.data.LastModified;
        this.controls.QLTStatus.value = this.data.QualityStatus === "Open" ? "Open" : "Closed";

        populateSelect("SupplierID", supplierList, "SupplierName", "id", this.data.SupplierID);
        populateSelect(
            "ProductID",
            productList.filter((p) => p.SupplierID === this.data.SupplierID),
            "ProductName",
            "id",
            this.data.ProductID
        );
    },
};

function populateControls(fs)
{
    if (fs) {
        const controls = {};
        Array.from(fs.elements).forEach((element) => {
            if (element && element.id) {
                controls[element.id] = element;
            }
        });
        return controls;
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