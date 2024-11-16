import { newProduct, crudQuality, crudEngineer, fetchData } from './crud.js';

// fetch supplier data to fill any Supplier Select dropdowns
export async function getSuppliers(selectedID = null) {
        const SupplierData = await fetchData('http://localhost:5500/suppliers/');
        populateSelect('SupplierID', SupplierData, 'SupplierName', 'id', selectedID);
}

// fetch role data to fill any Role Select dropdowns
export async function getRoles(selectedID = null) {
        const RoleData = await fetchData('http://localhost:5500/roles/');
        populateSelect('RoleID', RoleData, 'Title', 'id', selectedID);
}

// fetch product data to fill any Product Select dropdowns
export async function getProducts(selectedID = null) {
        const ProductData = await fetchData('http://localhost:5500/products/');
        if (ProductData !== null)
        {
            populateSelect('ProductID', ProductData, 'ProductName', 'id', selectedID);

            const selectedProduct = ProductData.find(product => product.id === selectedID);
            if (selectedProduct !== null) {
                document.getElementById("ProductNumber").textContent = `Number: ${selectedProduct.Number}`;
            }
        }
}

export async function fillForm(selectedID = null) {
    try
    {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user.RoleID === 1) toggleForms('admin');
        else if (user.RoleID === 2) toggleForms('quality');
        else if (user.RoleID === 3) toggleForms('engineer');

        // Get the Product select element and add an event to make the product number visible when a product is selected
        
        document.getElementById("ProductID").addEventListener("change", async function() {
            try
            {
                
                if (this.value === 'new') 
                    {
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
        if (selectedID)
        {
            
            try {
                const formusers = await fetchData(`http://localhost:5500/formusers/${selectedID}`);
                console.log(formusers);
                formusers.forEach(formuser => {
                    if (formuser.Title = 'Quality') document.getElementById('QAName').value = formuser.FName + ' ' + formuser.LName;
                    if (formuser.Title = 'Engineer') document.getElementById('ENGName').value = formuser.FName + ' ' + formuser.LName;
                });

                fillQuality(selectedID);
                fillEngineer(user, selectedID);
            } catch (error) {
                console.error('Failed to fill form:', error);
            }
        }
        else
        {
            await getSuppliers();

                 const user = JSON.parse(localStorage.getItem('user'));
                 if (user !== null)
                    {
                  document.getElementById('QAName').value = user.FName + ' ' + user.LName;
                }
        }
       

    } catch (error) {
        console.error('Failed to fetch NCR:', error);
    }
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

                selectOption.text = 'Select a product';
                selectOption.selected = true;
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
                }
                else 
                {
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
async function newProductModal()
{
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
    btnNewProduct.onclick = function () {
        try
        {
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
export async function fillQuality(selectedID = null) {
    const QualityArray = await fetchData(`http://localhost:5500/ncrs/${selectedID}`);
    const QualityData = QualityArray[0];
    await getSuppliers(QualityData.SupplierID);
    await getProducts(QualityData.ProductID);

    document.getElementById('ProcessApplicable_0').checked = QualityData.WorkInProgress === 1;
    document.getElementById('ProcessApplicable_1').checked = QualityData.SRInspection === 1;
         
         document.getElementById('QuantityReceived').value = QualityData.QuantityReceived;
         document.getElementById('QuantityDefective').value = QualityData.QuantityDefective;
         if (QualityData.IsNonConforming === 1) {
             document.getElementById('IsNonConforming_0').checked = true;
         } else {
             document.getElementById('IsNonConforming_1').checked = true;
         }
         document.getElementById('Details').value = QualityData.Details;
         if (selectedID)
            document.getElementById('QualityStatus').hidden = QualityData.QualityStatus === 'Closed';
}


// FETCHES ENGINEER DATA
export async function fillEngineer(user, selectedID = null) {
    if (document.getElementById('QualityStatus').hidden === false) return;
    if (user.RoleID === 3) document.getElementById('ENGName').value = user.FName + ' ' + user.LName;
    const EngineerResponse = await fetch(`http://localhost:5500/engineer/${selectedID}`);
    if (!EngineerResponse.ok) {
        document.getElementById('EngineerNewOrEdit').value = 'Create';
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
     //RevisionDate.value = new Date().toISOString().split('T')[0];

const NewRevNum = document.getElementById('NewRevNum');
const NewRevDate = document.getElementById('NewRevDate');
UpdateTrue.addEventListener("click", function() {
    if (this.checked) {
        NewRevNum.style.display = 'block';
        NewRevDate.style.display = 'block';
        NewRevisionNumber.value = incrementRevisionNumber(EngineerData.RevisionNumber);
    } 
});
UpdateFalse.addEventListener("click", function() {
    if (this.checked) {
        NewRevNum.style.display = 'none';
        NewRevDate.style.display = 'none';
        NewRevisionNumber.value = '';
    } 
});

}

export async function updateForm(id, formType) 
{
if (formType === 'quality') { 
    await crudQuality(
        "PUT",
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
    if (NewRevisionNumber.hidden === false) { RevisionNumber = NewRevisionNumber; }

    const RevisionDate = document.getElementById('RevisionDate');

      if (document.getElementById('EngineerNewOrEdit').value === 'Create') {
        crudEngineer("POST", Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, id);
      } else {
        crudEngineer("PUT", Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, id);
      }
   }
   catch (error) {
        console.error('Failed to create engineer form:', error);
    }
}

function incrementRevisionNumber(revisionNumber) {
    if (revisionNumber === null)
    {
        return incrementRevisionNumber(Math.floor(Math.random() * (999 - 100 + 1) + 100).toString() + '-@');
    }
    console.log(revisionNumber);
    const parts = revisionNumber.split('-');
    console.log(parts);
    const number = parts[0];
    let letter = parts[1].charCodeAt(0);
    console.log(letter);
    letter = String.fromCharCode(letter + 1);
    console.log(letter);
    return `${number}-${letter}`;
}

function toggleForms(formType) {
    const qualityForm = document.getElementById('fs_quality');
    const engineerForm = document.getElementById('fs_engineer');

    const btnQuality = document.getElementById('btnSubmit_Quality');
    const btnEngineer = document.getElementById('btnSubmit_Engineer');
    //const btnPurchasing = document.getElementById('btnSubmit_Purchasing');

    const navQuality = document.getElementById('btnNavQuality');
    const navEngineer = document.getElementById('btnNavEngineer');
    const navPurchasing = document.getElementById('btnNavPurchasing');

    if (formType === 'quality') {
        btnEngineer.style.display = 'none';
        //btnPurchasing.style.display = 'none';

        qualityForm.disabled = false;
        engineerForm.disabled = true;

        engineerForm.style.display = 'none';
        //purchasingForm.style.display = 'none';

        navEngineer.hidden = true;
        navPurchasing.hidden = true;
    } else if (formType === 'engineer') {
        btnQuality.style.display = 'none';

        qualityForm.disabled = true;
        engineerForm.disabled = false;

        //purchasingForm.style.display = 'none';

        navPurchasing.hidden = true;
    }
}



function populateSelect(id, data, text, value, selectedID = null)
{
    const select = document.getElementById(id);
    select.innerHTML = '';

    data.forEach(thing => {
        const option = document.createElement('option');
        option.text = thing[text];
        option.value = thing[value];
        if (thing[value] === selectedID) {
            option.selected = true;
        }
        select.appendChild(option)
    });
}

