//Written by: Damion Murcell
//Purpose: Generate a PDF report of an NCR Form using an external source called jsPDF

document.getElementById('btnGenPDF').addEventListener('click', function() {
    const pdf = new jsPDF(); 

    //Title
    pdf.text(20, 30, "NCR Report: XXXXXX");

    //Quality Assurance Data
    pdf.text(20, 40, 'Quality Assurance');

    //Engineering Data
    pdf.text(20, 50, 'Engineering Data');

    //Pdf Name
    doc.save('Report-XXXXXX');
});