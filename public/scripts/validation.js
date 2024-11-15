/// Field Validations

//Random Number Generator
//function getRandomInt(max) {
//    return Math.floor(Math.random() * max);
//}

//Required variables
const currentDate = new Date();
//var randomNumber = getRandomInt(999999999)

//On page load events
//document.getElementById("QADate").value = currentDate
//document.getElementById("SalesNumber").text.value = randomNumber

//Submit button event handler
addEventListener("submit", (e) =>{

    //GetElements
    const quantityRec = parseInt(document.getElementById("QuantityReceived").value);
    const quantityDef = parseInt(document.getElementById("QuantityDefective").value);
    const qaDate = document.getElementById("QADate").value;

     //Call Functions
     QuantityRecValidation(quantityRec);
     QuantityDefValidation(quantityDef, quantityRec);
     QADateValidation(qaDate, currentDate);

    //Functions

    //Quantity Received
    function QuantityRecValidation(quantityRec){
        if (quantityRec < 0) {
            alert("Quantity Received has to be greater than 0");
        }
    };

        //Quantity Defective
    function QuantityDefValidation(quantityDef, quantityRec){
        if (quantityDef < quantityRec) {
            alert("Quantity Defective cannot be greater than Quantity Recieved");
        }
    };

        //Quality Date
    function QADateValidation(qaDate, currentDate){
        if (qaDate < currentDate) {
            alert("Date cannot be in the past");
        }
    };


   
});


