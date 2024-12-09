//Written by: Damion Murcell
//Purpose: JS file is temporary and for testing and showcasing reasons only
document.addEventListener('DOMContentLoaded', function(){
    if (window.location.pathname.endsWith('login.html')){
        //============= Login.html =============
        function populateLogin(email, password){
            document.getElementById("email").value = email;
            document.getElementById("password").value = password
        }
        document.getElementById('btnQA').addEventListener('click', function(){
            populateLogin("quality@crossfire.ca", "quality")
        });
        document.getElementById('btnEng').addEventListener('click', function(){
            populateLogin("engineer@crossfire.ca", "engineer")
        });
        document.getElementById('btnPur').addEventListener('click', function(){
            populateLogin("purchasing@crossfire.ca", "purchasing")
        });
        document.getElementById('btnAdmin').addEventListener('click', function(){
            populateLogin("admin@crossfire.ca", "admin")
        });
    }

    if (window.location.pathname.endsWith('create.html')){
        //============= Create.html =============
        function populateCreate(salesOrder, supplier, product, description, recievedQuantity, defectiveQuantity){
            document.getElementById("SalesOrder").value = salesOrder

            document.getElementById("Details").value = description
            document.getElementById("QuantityReceived").value = recievedQuantity
            document.getElementById("QuantityDefective").value = defectiveQuantity

            const processApplicableRadio = document.querySelector('input[name="ProcessApplicable"][value="0"]');
            if (processApplicableRadio) {
                processApplicableRadio.checked = true;
            }

            const isNonConformingRadio = document.querySelector('input[name="IsNonConforming"][value="1"]');
            if (isNonConformingRadio) {
                isNonConformingRadio.checked = true;
            }

            const supplierDropdown = $("#SupplierID");
            if (supplierDropdown.length > 0) {
                supplierDropdown.val(supplier).trigger('change');
            }

            const productDropdown = $("#ProductID");
            if (productDropdown.length > 0) {
                productDropdown.val(product).trigger('change');
            }
        }
        document.getElementById('btnSeedQA').addEventListener('click', function(){
            populateCreate(300, 15, 1, 'A very nice description', 20, 10)
            console.log('test')
        });
    }
    if (window.location.pathname.endsWith('edit.html')){
        //============= edit.html =============
        //Quality Assurance
        function populateEdit(salesOrder, supplier, product, description, recievedQuantity, defectiveQuantity){
            document.getElementById("SalesOrder").value = salesOrder

            document.getElementById("Details").value = description
            document.getElementById("QuantityReceived").value = recievedQuantity
            document.getElementById("QuantityDefective").value = defectiveQuantity

            const processApplicableRadio = document.querySelector('input[name="ProcessApplicable"][value="0"]');
            if (processApplicableRadio) {
                processApplicableRadio.checked = true;
            }

            const isNonConformingRadio = document.querySelector('input[name="IsNonConforming"][value="1"]');
            if (isNonConformingRadio) {
                isNonConformingRadio.checked = true;
            }

            const supplierDropdown = $("#SupplierID");
            if (supplierDropdown.length > 0) {
                supplierDropdown.val(supplier).trigger('change');
            }

            const productDropdown = $("#ProductID");
            if (productDropdown.length > 0) {
                productDropdown.val(product).trigger('change');
            }
        }
        document.getElementById('btnSeedQA').addEventListener('click', function(){
            populateEdit(300, 15, 1, 'A very nice description', 20, 10)
            console.log('test')
        });

        //Engineering
        function populateEditEng(disposition){
            document.getElementById("Disposition").value = disposition
        }
        document.getElementById('btnSeedEng').addEventListener('click', function(){
             // Set the radio button for "Review by CF Engineering" to "Repair"
            document.querySelector('input[name="Review"][value="Repair"]').checked = true;  // Selecting 'Repair'

            // Set the radio button for "Notify customer of NCR" to "Yes"
            document.querySelector('input[name="NotifyCustomer"][value="Yes"]').checked = true;  // Selecting 'Yes'

            // Set the "Disposition" field with a sample description
            document.getElementById("Disposition").value = "Very nice disposition description."; // Example text

            // Set the radio button for "Does the drawing require updating" to "Yes"
            document.querySelector('input[name="DrawingUpdateRequired"][value="1"]').checked = true;  // Selecting 'Yes'
        });

        //Purchasing
        document.getElementById('btnSeedPUR').addEventListener('click', function(){
            document.getElementById("CarRaised_1").checked = true;
            
            document.getElementById("FollowUp_1").checked = true;

            document.getElementById("Decision_0").checked = true;

            document.getElementById("CARNumber").value = "12345";
        })
        
    }
});