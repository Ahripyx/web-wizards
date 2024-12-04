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
});