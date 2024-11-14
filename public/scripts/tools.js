async function fetchData() {
    // fetch supplier data for tools.html "Supplier" dropdown
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
            SupplierElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch suppliers:', error);
    }

    // fetch role data for tools.html "Role" dropdown
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
            RoleElement.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }
}





