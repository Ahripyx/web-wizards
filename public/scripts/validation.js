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
    
 

