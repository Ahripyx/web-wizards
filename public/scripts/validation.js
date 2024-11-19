//function SubmitValidation() {
  //  QuantityRecValidation();
    //QuantityDefValidation();
    //SupplierValidation();
    //ProductValidation();

    //const quantityRec = document.getElementById("QuantityReceived");
    //const quantityDef = document.getElementById("QuantityDefective");
    //const supplierInput = document.getElementById("SupplierID");

    //if (!quantityRec.checkValidity() || !quantityDef.checkValidity() || !supplierInput.checkValidity() || !productInput.checkValidity()) {
    //    return false; 
    //}
    //return true; 
//};

   //Quantity Received Create/Edit
function QuantityRecValidation() {
        const quantityRec = document.getElementById("QuantityReceived");
        const invalidMessage = document.getElementById("received-invalid");
    if (quantityRec.value < 1) {
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
            const quantityDefNumber = document.getElementById("QuantityDefective").value;
            const quantityRec = document.getElementById("QuantityReceived").value;
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

    //Date Filter 
function DateFilterValidation() {
    const minDate = document.getElementById("dateBox1").value;
    const maxDate = document.getElementById("dateBox2").value;

    let [year, month, day] = minDate.split('-')
    
    if(year == null || month == null || day == null) {
        alert("Invalid Date")
    }

    if (new Date(minDate) > new Date(maxDate)) {
        console.log("Test")
        alert("Minimum date cannot be in the future of Maximum Date")
    } 
}
