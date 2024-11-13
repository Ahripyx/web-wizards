// fetch supplier data to fill any Supplier Select dropdowns
export async function getSuppliers(selectedID = null) {
    
    try {
        const SupplierResponse = await fetch('http://localhost:5500/suppliers/');
        if (!SupplierResponse.ok) {
            throw new Error('Failed to fetch suppliers');
        }
        const SupplierData = await SupplierResponse.json();
        const SupplierElement = document.getElementById("SupplierID");
        SupplierData.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.text = supplier.SupplierName;
           
                if (supplier.id === selectedID) {
                
                    option.selected = true;
                }
            
            
            SupplierElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch suppliers:', error);
    }
}

// fetch role data to fill any Role Select dropdowns
export async function getRoles(selectedID = null) {
    try {
        const RoleResponse = await fetch('http://localhost:5500/roles/');
        if (!RoleResponse.ok) {
            throw new Error('Failed to fetch roles');
        }
        const RoleData = await RoleResponse.json();
        const RoleElement = document.getElementById("RoleID");
        RoleData.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.text = role.Title;
            if (role.id === selectedID) {
                option.selected = true;
            }
            RoleElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }
}

// fetch product data to fill any Product Select dropdowns
export async function getProducts(selectedID = null) {
    try {
        const ProductResponse = await fetch('http://localhost:5500/products/');
        if (!ProductResponse.ok) {
            throw new Error('Failed to fetch products');
        }
        const ProductData = await ProductResponse.json();
        const ProductElement = document.getElementById("ProductID");
        ProductData.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.text = product.ProductName;
            if (product.id === selectedID) {
                option.selected = true;
            }
            ProductElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

export async function fillForm(selectedID = null) {
    try
    {
        document.getElementById("SupplierID").addEventListener("change", async function() {
            const supplierID = this.value;
            const ProductElement = document.getElementById("ProductID");
            ProductElement.disabled = true;
            ProductElement.innerHTML = ''; // Clear existing options
        
            if (supplierID) {
                try {
                    
                    const ProductResponse = await fetch(`http://localhost:5500/product&suppliers`);
                    if (!ProductResponse.ok) {
                        throw new Error('Failed to fetch products');
                    }
                    const ProductData = await ProductResponse.json();
                    ProductData.forEach(product => {
                        if (product.SupplierID === Number(supplierID)) {
                            const option = document.createElement('option');
                        option.value = product.id;
                        option.text = product.ProductName;
                        ProductElement.appendChild(option);
                        }
                        
                    });
                    if (ProductElement.options.length > 0) {
                        ProductElement.disabled = false;
                    }
                    else 
                    {
                        
                        const option = document.createElement('option');
                        option.text = 'No products found';
                        ProductElement.appendChild(option);
                    }
                    
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                }
            }
        });

        if (selectedID)
        {
            const QualityResponse = await fetch(`http://localhost:5500/ncrs/${selectedID}`);
            if (!QualityResponse.ok) {
                throw new Error('Failed to fetch quality');
            }
            const QualityDataArray = await QualityResponse.json();
            const QualityData = QualityDataArray[0];
            await getSuppliers(QualityData.SupplierID);
            await getProducts(QualityData.ProductID);

            document.getElementById('SRInspection').checked = QualityData.SRInspection === 1;
                 document.getElementById('WorkInProgress').checked = QualityData.WorkInProgress === 1;
                 document.getElementById('QuantityReceived').value = QualityData.QuantityReceived;
                 document.getElementById('QuantityDefective').value = QualityData.QuantityDefective;
                 document.getElementById('IsNonConforming').checked = QualityData.IsNonConforming === 1;
                 document.getElementById('Details').value = QualityData.Details;

                 if (QualityData.QualityStatus === 'Open') {
                    document.getElementById('QualityStatus').value = 'Open';
                    document.getElementById('btnEngineer').style.display = 'none';
                      document.getElementById('EngineerView').style.display = 'none';
                      document.getElementById('QualityView').style.display = 'block';
                    
                      document.querySelectorAll('#EngineerView input, #EngineerView select, #EngineerView textarea').forEach(element => {
                       element.disabled = true;
                    });
  
                  } else {
                    document.querySelectorAll('#QualityView input, #QualityView select, #QualityView textarea').forEach(element => {
                       element.disabled = true;
                    });
                    document.querySelectorAll('#QualityView input, #QualityView select, #QualityView textarea').forEach(element => {
                        element.disabled = true;
                     });
   
                    fillEngineer(selectedID);
                   }
                } 
            
            
        else
        {
            await getSuppliers();
        }
       

    } catch (error) {
        console.error('Failed to fetch NCR:', error);
    }
}

export async function fillEngineer(selectedID = null) {
    const EngineerResponse = await fetch(`http://localhost:5500/engineer/${selectedID}`);
    if (!EngineerResponse.ok) {
        document.getElementById('EngineerNewOrEdit').value = 'Create';
        //throw new Error('Failed to fetch engineer data');
    }
    const UpdateTrue = document.getElementById('UpdateTrue');
    const UpdateFalse = document.getElementById('UpdateFalse');
    const CurrentRevisionNumber = document.getElementById('CurrentRevisionNumber');
    const NewRevisionNumber = document.getElementById('NewRevisionNumber');
    const RevisionDate = document.getElementById('RevisionDate');

    UpdateTrue.addEventListener("click", function() {
        if (this.checked) {
           NewRevisionNumber.disabled = false;
           RevisionDate.disabled = false;
        } 
     });
     UpdateFalse.addEventListener("click", function() {
        if (this.checked) {
            NewRevisionNumber.value = null;
            RevisionDate.value = null;
           NewRevisionNumber.disabled = true;
           RevisionDate.disabled = true;
        } 
     });

    const EngineerData = await EngineerResponse.json();
     document.querySelector(`input[name="Review"][value="${EngineerData.Review}"]`).checked = true;
     document.getElementById('NotifyTrue').checked = EngineerData.NotifyCustomer === 1;
     document.getElementById('NotifyFalse').checked = EngineerData.NotifyCustomer === 0;
     document.getElementById('Disposition').value = EngineerData.Disposition;
     UpdateTrue.checked = EngineerData.DrawingUpdateRequired === 1;
     UpdateFalse.checked = EngineerData.DrawingUpdateRequired === 0;
     CurrentRevisionNumber.textContent = EngineerData.CurrentRevisionNumber;
     NewRevisionNumber.value = EngineerData.NewRevisionNumber;
     RevisionDate.value = EngineerData.RevisionDate;

     
    }

export async function insertForm(id) {
    const product = document.getElementById("ProductID");

   const QualityStatus = document.getElementById('QualityStatus').value;

   if (QualityStatus === 'Open') {
      const dataToUpdate = { 
         SRInspection: document.getElementById("SRInspection").checked,
         WorkInProgress: document.getElementById("WorkInProgress").checked,
         ItemDescription: product.options[product.selectedIndex].text,
         QuantityReceived: parseInt(document.getElementById("QuantityReceived").value, 10),
         QuantityDefective: parseInt(document.getElementById("QuantityDefective").value, 10),
         IsNonConforming: document.getElementById("IsNonConforming").checked,  
         Details: document.getElementById("Details").value,
         ProductID: parseInt(product.value, 10),
      };

      dataToUpdate.WorkInProgress = dataToUpdate.WorkInProgress ? 1 : 0;
      dataToUpdate.SRInspection = dataToUpdate.SRInspection ? 1 : 0;
      dataToUpdate.IsNonConforming = dataToUpdate.IsNonConforming ? 1 : 0;

      try {
         const response = await fetch(`http://localhost:5500/quality/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToUpdate)
         });

         if (response.ok) {
            alert("Quality data updated successfully!");
            window.location.href = `details.html?id=${id}`;
         } else {
            const errorData = await response.text();
            alert(`Failed to update quality data: ${errorData}`);
         }
      } catch (error) {
         console.error("Error:", error);
         alert("An unexpected error occurred.");
      }
   } else {
      const engineerData = {
         Review: document.querySelector('input[name="Review"]:checked').value,
         NotifyCustomer: document.getElementById('NotifyTrue').checked ? 1 : 0,
         Disposition: document.getElementById('Disposition').value,
         DrawingUpdateRequired: document.getElementById('UpdateTrue').checked ? 1 : 0,
         NewRevisionNumber: document.getElementById('NewRevisionNumber').value,
         RevisionDate: document.getElementById('RevisionDate').value,
      };

      if (document.getElementById('EngineerNewOrEdit').value === 'Create') {
         try {
            const response = await fetch(`http://localhost:5500/engineer/${id}`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(engineerData)
            });

            if (response.ok) {
               alert("Engineer form created successfully!");
               window.location.href = `details.html?id=${id}`;
            } else {
               const errorData = await response.text();
               alert(`Failed to create engineer form: ${errorData}`);
            }
         } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred.");
         }
      } else {
         try {
            const response = await fetch(`http://localhost:5500/engineer/${id}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(engineerData)
            });

            if (response.ok) {
               alert("Engineer form updated successfully!");
               window.location.href = `details.html?id=${id}`;
            } else {
               const errorData = await response.text();
               alert(`Failed to update engineer form: ${errorData}`);
            }
         } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred.");
         }
      }
   }
}