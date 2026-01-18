console.log("Script cargado correctamente");

// Esta función detecta cualquier intento de recarga
window.onbeforeunload = function() {
    console.warn("¡La página está intentando recargarse!");
};
document.getElementById('formRegistro').addEventListener('submit', async function(e) {
    e.preventDefault();  //DETENER LA RECARGA DE LA PÁGINA

    const fotoInput = document.getElementById('reg_foto');
    const fotoFile = fotoInput ? fotoInput.files[0] : null;
    const reader = new FileReader(); //CREAR UN LECTOR DE ARCHIVOS

    reader.onloadend = async function() {
        const datosUsuario = {
            nombres: document.getElementById('reg_nombres').value,
            apellidos: document.getElementById('reg_apellidos').value,
            telefono: document.getElementById('reg_telefono').value,
            correo: document.getElementById('reg_correo').value,
            tipo_documento: document.getElementById('reg_tipo_doc').value,
            numero_documento: document.getElementById('reg_num_doc').value,
            vereda: document.getElementById('reg_vereda').value,
            nombre_finca: document.getElementById('reg_finca').value || "SIN NOMBRE",  
            folio_finca: document.getElementById('reg_folio').value || "SIN FOLIO",
            referencia_prototipo: document.getElementById('reg_prototipo').value,
            contrasena: document.getElementById('reg_pass').value,
            foto_perfil: reader.result //CONVERTIR LA FOTO A BASE64
        };  
        try {
            const repuesta = await fetch('http://127.0.0.1:8000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });  
            const resultado = await repuesta.json();
            if (repuesta.ok) {
                //GUARDAR EL ID EN LOCALSTORAGE
                localStorage.setItem('usuario_id_biokuam', resultado.usuario_id);
                alert('REGISTRO EXITOSO');
                window.location.href = 'inicio.html'; //REDIRIGIR A LA PÁGINA PRINCIPAL
            } else {
                alert('ERROR EN EL REGISTRO: ' + JSON.stringify(resultado.detail));
            }
        } catch (error) {
            console.error('ERROR EN LA CONEXIÓN:', error);
            alert('ERROR EN LA CONEXIÓN: ' + error.message);
        }
    };
    if (fotoFile) {
        reader.readAsDataURL(fotoFile); //LEER EL ARCHIVO DE FOTO COMO BASE64
    } else {
        reader.onloadend(); //SI NO HAY FOTO, LLAMAR DIRECTAMENTE A onloadend
    }
});  


