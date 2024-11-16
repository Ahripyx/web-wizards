//Written by: Damion Murcell
//Purpose: Generate a PDF report of an NCR Form using an external source called jsPDF

document.getElementById('btnGenPDF').addEventListener('click', function() {
    console.log('Button clicked!');  // This confirms the button click is detected

    // Create a new jsPDF instance
    const doc = new jsPDF();  // Use jsPDF directly in version 1.x

    // Add example text to the PDF
    doc.text(20, 30, 'Hello, this is a PDF generated with jsPDF!');
    doc.text(20, 40, 'This is an example of how you can add text to your PDF.');
    doc.text(20, 50, 'You can add more content here such as tables, images, etc.');

    // Save the generated PDF file with a name
    doc.save('blank.pdf'); // This triggers the download

    console.log('PDF should be downloaded now.');
});