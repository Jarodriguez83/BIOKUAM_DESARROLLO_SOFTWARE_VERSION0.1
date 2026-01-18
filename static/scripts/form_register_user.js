
console.log("EL SCRIPT DE REGISTRO DE USUARIO ESTÁ FUNCIONANDO CORRECTAMENTE.");

//DETECTA CUANDO LA PÁGINA INTENTA RECARGARSE
window.onbeforeunload = function() {
    console.warn("¡LA PÁGINA ESTA INTENTANDO RECARGARSE!");
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
            tipo_identificacion: document.getElementById('reg_tipo_doc').value,
            numero_identificacion: document.getElementById('reg_num_doc').value,
            vereda: document.getElementById('reg_vereda').value,
            nombre_finca: document.getElementById('reg_finca').value || "SIN NOMBRE",  
            folio_finca: document.getElementById('reg_folio').value || "SIN FOLIO",
            referencia_prototipo: document.getElementById('reg_prototipo').value,
            crear_contrasena: document.getElementById('reg_crear_pass').value,
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
                //GUARDAR EL ID Y OTROS DATOS EN LOCALSTORAGE
                localStorage.setItem('usuario_id_biokuam', resultado.usuario_id);
                localStorage.setItem('usuario_nombre_biokuam', datosUsuario.nombres);
                localStorage.setItem('usuario_apellido_biokuam', datosUsuario.apellidos)
                const nombreUsuario = document.getElementById('reg_nombres').value;
                const apellidoUsuario = document.getElementById('reg_apellidos').value;  
                alert(`¡EL REGISTRO SE REALIZO DE FORMA CORRECTA, BIENVENIDO A BIOKUAM ${nombreUsuario} ${apellidoUsuario}!`);
                window.location.href = '/'; //REDIRIGIR A LA PÁGINA PRINCIPAL
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


