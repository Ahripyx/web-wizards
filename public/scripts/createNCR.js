const defectLookup = {
    'Magic Wand': ['Bending', 'Power Fluctuation', 'Tip Crack'],
    'Safety Helmet': ['Strap Break', 'Cracked Shell', 'Improper Fit'],
    'Giant Bubble Blower': ['Leaking Solution', 'Handle Break', 'Poor Bubble Formation'],
    'Industrial Vacuum': ['Weak Suction', 'Power Failure', 'Clogged Filter'],
    'Bicycle': ['Flat Tire', 'Chain Slippage', 'Frame Rust'],
    'Laser Level': ['Misalignment', 'Weak Laser', 'Battery Compartment Issue'],
    'Glow-in-the-Dark Frisbee': ['Lack of Glow', 'Warpage', 'Edge Cracking'],
    'Electric Forklift': ['Battery Malfunction', 'Brake Failure', 'Hydraulic Leak'],
    'Chocolate Fountain': ['Flow Blockage', 'Heating Element Failure', 'Motor Burnout'],
    'Toy Robot': ['Loose Joints', 'Sensor Malfunction', 'Battery Drain'],
    'Electric Tow Tractor': ['Motor Overheating', 'Battery Failure', 'Steering Issue'],
    'Hydraulic Jack': ['Oil Leak', 'Cylinder Deformation', 'Release Valve Failure'],
    'Portable Rainbow Maker': ['Color Fading', 'Mechanism Jam', 'Power Failure'],
    'Air Compressor': ['Pressure Drop', 'Motor Overload', 'Air Leak'],
    'Holographic Projector': ['Image Distortion', 'Connectivity Issue', 'Overheating']
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
    document.getElementById("normView").style.display = viewId === 'normView' ? 'block' : 'none';
    document.getElementById('engiView').style.display = viewId === 'engiView' ? 'block' : 'none';
}
