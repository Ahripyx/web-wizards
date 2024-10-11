// Ideally this would be in a "lookup" file but w/e
const defectLookup = {
    'Item1': ['Crack', 'Scratch', 'Deformation'],
    'Item2': ['Discoloration', 'Improper Assembly', 'Surface Damage'],
    'Item3': ['Misalignment', 'Missing Parts', 'Incorrect Size']
};

// Get the item and the defect select lists!
const itemSelect = document.getElementById('itemDescription');
const defectSelect = document.getElementById('defectDescription');

// Update the options based on the current item 
itemSelect.addEventListener('change', function() {
    const selectedItem = itemSelect.value;

    // Clear previous defect options
    defectSelect.innerHTML = '<option value="">Select a defect</option>';

    // If an item is selected and it has defects in the lookup, populate them
    if (defectLookup[selectedItem]) {
        defectLookup[selectedItem].forEach(function(defect) {
            const option = document.createElement('option');
            option.value = defect;
            option.textContent = defect;
            defectSelect.appendChild(option);
        });
    }
});

function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.style.display = 'none');

    // Show the selected view
    document.getElementById(viewId).style.display = 'block';
}
