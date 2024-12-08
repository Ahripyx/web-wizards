   //Quantity Received Create/Edit
function QuantityRecValidation() {
        const quantityRecValue = parseInt(document.getElementById("QuantityReceived").value);
        const quantityRec = document.getElementById("QuantityReceived");
        const invalidMessage = document.getElementById("received-invalid");
    if (quantityRecValue < 1) {
        quantityRec.setCustomValidity("Quantity Received cannot be less than 1");
        invalidMessage.innerHTML = quantityRec.validationMessage;
        invalidMessage.style.display = 'block';
    } 
    else {
        quantityRec.setCustomValidity(""); 
        invalidMessage.innerHTML = ""; 
    }
};     

    //Quantity Defective Create/Edit
function QuantityDefValidation(){
            const quantityDefNumber = parseInt(document.getElementById("QuantityDefective").value);
            const quantityRec = parseInt(document.getElementById("QuantityReceived").value);
            const quantityDef = document.getElementById("QuantityDefective")
            const invalidMessage = document.getElementById("defective-invalid")
        if (quantityDefNumber > quantityRec) {     
            quantityDef.setCustomValidity("Quantity Defective cannot be greater then Quantity Recieved")
            invalidMessage.innerHTML = quantityDef.validationMessage
            invalidMessage.style.display = 'block';
        }
        else 
        {
            quantityDef.setCustomValidity("");
            invalidMessage.innerHTML = "";
        }
   };

   //Supplier Create/Edit
function SupplierValidation() {
    const supplierInput = document.getElementById("SupplierID")
    const invalidMessage = document.getElementById("supplier-feedback")

    if (supplierInput.selectedIndex === 0){
        supplierInput.setCustomValidity("Please select a Supplier")
        invalidMessage.innerHTML = supplierInput.validationMessage
        invalidMessage.style.display = 'block';
    }
    else
    {
        supplierInput.setCustomValidity("")
        invalidMessage.innerHTML = ""
    }
};

// Defect Description
function DefectDescriptionValidation() {
    const defectDescription = document.getElementById("DefectDescription");
    const invalidMessage = document.getElementById("description-invalid");

    if (defectDescription.value.trim() === "") {
        defectDescription.setCustomValidity("Defect Description cannot be empty");
        invalidMessage.innerHTML = defectDescription.validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        defectDescription.setCustomValidity("");
        invalidMessage.innerHTML = "";
    }
};

    //Product Create/Edit
function ProductValidation() {
    const productInput = document.getElementById("ProductID")
    const invalidMessage = document.getElementById("product-feedback")

    if (productInput.selectedIndex === 0 || productInput.selectedIndex === productInput.options.length - 1){
        productInput.setCustomValidity("Please select a Product")
        invalidMessage.innerHTML = productInput.validationMessage
        invalidMessage.style.display = 'block';
    }
    else
    {
        productInput.setCustomValidity("")
        invalidMessage.innerHTML = ""
    }
};

    //List Date Filter 
    function DateFilterValidation() {
        const minDate = document.getElementById("dateBox1").value;
        const maxDate = document.getElementById("dateBox2").value;
    
        let [minYear, minMonth, minDay] = minDate.split('-');
        let [maxYear, maxMonth, maxDay] = maxDate.split('-');
    
        if (!minDate && !maxDate) {
            // Shows all records
            date1 = '0001-01-01';
            date2 = '9999-12-12';
        } else if (minDate && !maxDate) {
            // Shows all records starting from minimum date
            date1 = minDate;
            date2 = '9999-12-12';
        } else if (!minDate && maxDate) {
            // Shows all records up until maximum date
            date1 = '0001-01-01';
            date2 = maxDate;
        } else if (!minYear || !minMonth || !minDay || !maxYear || !maxMonth || !maxDay) {
            // If any part of the date is missing, show no records
            date1 = '9999-12-12';
            date2 = '9999-12-12';
            alert("Invalid Date - Please fill in the full date");
        } else if (new Date(minDate) > new Date(maxDate)) {
            // If minDate is greater than maxDate, show no records
            date1 = '9999-12-12';
            date2 = '9999-12-12';
            alert("Minimum date cannot be in the future of Maximum Date");
        } else {
            // Valid dates
            date1 = minDate;
            date2 = maxDate;
        }
    };
    

//Purchasing
function DecisionValidation() {
    const decisionInputs = document.getElementsByName("Decision");
    const invalidMessage = document.getElementById("decision-feedback");
    let isValid = false;

    decisionInputs.forEach(input => {
        if (input.checked) {
            isValid = true;
        }
    });

    if (!isValid) {
        decisionInputs[0].setCustomValidity("Please select a Decision");
        invalidMessage.innerHTML = decisionInputs[0].validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        decisionInputs[0].setCustomValidity(""); 
        invalidMessage.innerHTML = "";
    }
};

function CARRaisedValidation() {
    const carRaisedInputs = document.getElementsByName("CarRaised");
    const invalidMessage = document.getElementById("car-raised-feedback");
    let isValid = false;

    carRaisedInputs.forEach(input => {
        if (input.checked) {
            isValid = true;
        }
    });

    if (!isValid) {
        carRaisedInputs[0].setCustomValidity("Please indicate if a CAR was raised");
        invalidMessage.innerHTML = carRaisedInputs[0].validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        carRaisedInputs[0].setCustomValidity(""); 
        invalidMessage.innerHTML = "";
    }
};

function FollowUpRequiredValidation() {
    const followUpInputs = document.getElementsByName("FollowUp");
    const invalidMessage = document.getElementById("followup-feedback");
    let isValid = false;

    followUpInputs.forEach(input => {
        if (input.checked) {
            isValid = true;
        }
    });

    if (!isValid) {
        followUpInputs[0].setCustomValidity("Please indicate if follow-up is required");
        invalidMessage.innerHTML = followUpInputs[0].validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        followUpInputs[0].setCustomValidity("");
        invalidMessage.innerHTML = "";
    }
};

function CARNumberValidation() {
    const followUpRequiredYes = document.getElementById("FollowUp_0").checked;
    const carNumberField = document.getElementById("CARNumber");
    const invalidMessage = document.getElementById("car-number-feedback");

    if (followUpRequiredYes && !carNumberField.value.trim()) {
        carNumberField.setCustomValidity("Please provide a CAR Number");
        invalidMessage.innerHTML = carNumberField.validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        carNumberField.setCustomValidity("");
        invalidMessage.innerHTML = "";
    }
};

function FollowUpTypeValidation() {
    const followUpRequiredYes = document.getElementById("FollowUp_0").checked;
    const followUpTypeField = document.getElementById("FollowUpType");
    const invalidMessage = document.getElementById("followup-type-feedback");

    if (followUpRequiredYes && !followUpTypeField.value.trim()) {
        followUpTypeField.setCustomValidity("Please provide a Follow-Up Type");
        invalidMessage.innerHTML = followUpTypeField.validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        followUpTypeField.setCustomValidity("");
        invalidMessage.innerHTML = "";
    }
};

function FollowUpDateValidation() {
    const followUpRequiredYes = document.getElementById("FollowUp_0").checked;
    const followUpDateField = document.getElementById("FollowUpDate");
    const invalidMessage = document.getElementById("followup-date-feedback");

    if (followUpRequiredYes && !followUpDateField.value) {
        followUpDateField.setCustomValidity("Please provide a Follow-Up Date");
        invalidMessage.innerHTML = followUpDateField.validationMessage;
        invalidMessage.style.display = 'block';
    } else {
        followUpDateField.setCustomValidity("");
        invalidMessage.innerHTML = "";
    }
};


