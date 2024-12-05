function emailToEngineer() {
    var params = {
        SaleOrder: document.getElementById("SalesOrder").value,
        Supplier: document.getElementById("SupplierID").value,
        Product: document.getElementById("ProductID").value,
        ProcessApplicable: document.querySelector('input[name="processes"]:checked').value,
        QuantityRecieved: document.getElementById("QuantityReceived").value,
        QuantityDefective: document.getElementById("QuantityDefective").value,
        NonConforming: document.querySelector('input[name="nonconforming"]:checked').value,
        Details: document.getElementById("Details").value,
        QLTDate: document.getElementById("QLTDate").value,
        QLTName: document.getElementById("QLTName").value,
    }
    const serviceID = "service_Circe"
    const templateID = "template_QLTtoENG"
   
    emailjs.send(serviceID, templateID, params)
}

function emailToPurchasing() {
    let updateDrawing = ""

    var update = document.querySelector('input[name="DrawingUpdateRequired"]:checked').value
    if (update == 1) {
        updateDrawing = "Yes"
    }
    else {
        updateDrawing = "No"
    }

    var params = {
        Review: document.querySelector('input[name="Review"]:checked').value,
        Notify: document.querySelector('input[name="NotifyCustomer"]:checked').value,
        Disposition: document.getElementById("Disposition").value,
        UpdateDrawing: updateDrawing,
        RevNumber: document.getElementById("RevisionNumber").value,
        ENGName: document.getElementById("ENGName").value,
        ENGDate: document.getElementById("ENGDate").value,
    }
    const serviceID = "service_Circe"
    const templateID = "template_ENGtoPUR"
    
    emailjs.send(serviceID, templateID, params)
    console.log(params)
}