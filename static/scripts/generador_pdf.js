document.getElementById('descargarBtn').addEventListener('click', function() {
    // 1. Acceder a la librería
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 2. Obtener los valores del formulario
    const finca = document.getElementById('nombreFinca').value || "Sin Nombre";
    const responsable = document.getElementById('nombreResponsable').value || "N/A";
    const folio = document.getElementById('folioFinca').value || "---";
    const fecha = document.getElementById('fechaReporte').value || "---";
    const proto = document.getElementById('refPrototipo').value || "---";
    const temp = document.getElementById('tempReportada').value || "0";
    const ph = document.getElementById('phReportado').value || "0";
    const notas = document.getElementById('observaciones').value || "Sin observaciones adicionales.";

    // 3. Diseño del PDF (Dibujando directamente)
    
    // Encabezado
    doc.setFillColor(13, 71, 161); // Azul oscuro
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE TÉCNICO BIOKUAM", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("MONITOREO DE LA CALIDAD DEL AGUA (VALLADOS DE AGUA - SIMIJACA, CUNDINAMARCA)", 105, 30, { align: "center" });

    // Cuerpo del Reporte
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("INFORMACIÓN GENERAL ACERCA DEL DIAGNOSTICO TÉCNICO", 20, 55, { align: "center" });
    doc.line(20, 57, 190, 57); // Línea divisoria

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`- NOMBRE DE LA FINCA: ${finca}`, 20, 65);
    doc.text(`- PROPIETARIO DE LA FINCA: ${responsable}`, 20, 72);
    doc.text(`- N° DE FOLIO DE LA FINCA "${finca}": ${folio}`, 20, 79);
    doc.text(`- FECHA DE LAS MUESTRAS: ${fecha}`, 130, 65);
    doc.text(`- REFERENCIA PROTOTIPO: ${proto}`, 130, 72);

    // Cuadro de Métricas
    doc.setDrawColor(239, 108, 0); // Naranja BioKuaM
    doc.setLineWidth(1);
    doc.rect(20, 90, 170, 30);
    
    doc.setFont("helvetica", "bold");
    doc.text("RESULTADOS DE LOS SENSORES (PH Y TEMPERATURA)", 105, 100, { align: "center" });
    doc.setFontSize(16);
    doc.text(`TEMPERATURA: ${temp} °C`, 60, 112, { align: "center" });
    doc.text(`PH: ${ph}`, 150, 112, { align: "center" });

    // Observaciones
    doc.setFontSize(14);
    doc.text("OBSERVACIONES DEL CULTIVO", 20, 140, { align: "center" });
    doc.line(20, 142, 190, 142);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Ajustar texto largo (notas) para que no se salga de la hoja
    const notasDivididas = doc.splitTextToSize(notas, 170);
    doc.text(notasDivididas, 20, 150);

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("ESTE ES UN DOCUMENTO DE VALIDACIÓN TÉCNICA GENERADO POR EL SISTEMA DE BIOKUAM.", 105, 280, { align: "center" });
    doc.text("GRACIAS POR SER PARTE DE BIOKUAM.", 105, 280, { align: "center" });
    doc.text("CONTACTO: ayudabiokaum@gmail.com", 105, 280, { align: "center" });

    // 4. DESCARGA AUTOMÁTICA
    doc.save(`REPORTE-BIOKUAM-DOCUMENTO-FINCA-${finca}.pdf`);
});