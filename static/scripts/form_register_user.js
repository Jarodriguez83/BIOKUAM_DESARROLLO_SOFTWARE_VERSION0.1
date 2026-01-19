// CONFIGURACIÓN DE SUPABASE
// Nota: Usa la URL de la API (vía Project Settings > API), no la del Dashboard.
const SUPABASE_URL = 'https://tgdolalsmimxcxkuiehl.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_3iG9laPzWQ8CGRbQTxrU4Q_g29s6mkn'; 

console.log("EL SCRIPT DE REGISTRO DE USUARIO ESTÁ FUNCIONANDO CORRECTAMENTE.");

window.onbeforeunload = function() {
    console.warn("¡LA PÁGINA ESTA INTENTANDO RECARGARSE!");
};

document.getElementById('formRegistro').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const fotoInput = document.getElementById('reg_foto');
    const fotoFile = fotoInput ? fotoInput.files[0] : null;

    // URL POR DEFECTO SI NO SE SUBE FOTO
    let fotoPublicUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 

    try {
        // 1. SI HAY FOTO, SUBIRLA PRIMERO A SUPABASE
        if (fotoFile) {
            console.log("Subiendo imagen seleccionada a Supabase...");
            const extension = fotoFile.name.split('.').pop();
            const nombreArchivo = `${Date.now()}.${extension}`;
            const rutaArchivo = `fotos_perfil/${nombreArchivo}`;

            const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${rutaArchivo}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'apikey': SUPABASE_KEY,
                    'Content-Type': fotoFile.type
                },
                body: fotoFile
            });

            if (uploadRes.ok) {
                fotoPublicUrl = `${SUPABASE_URL}/storage/v1/object/public/${rutaArchivo}`;
                console.log("Imagen subida con éxito:", fotoPublicUrl);
            } else {
                console.error("Error al subir a Supabase, se usará imagen por defecto.");
            }
        }

        // 2. PREPARAR EL OBJETO PARA EL BACKEND (FASTAPI)
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
            // Asegúrate de que estos IDs coincidan con tu HTML
            contrasena: document.getElementById('reg_pass').value,
            foto_perfil: fotoPublicUrl 
        };  

        // 3. ENVIAR TODO A FASTAPI
        console.log("Enviando datos a FastAPI...");
        const repuesta = await fetch('http://127.0.0.1:8000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        });  

        const resultado = await repuesta.json();

        if (repuesta.ok) {
            // GUARDAR DATOS EN LOCALSTORAGE
            localStorage.setItem('usuario_id_biokuam', resultado.usuario_id);
            localStorage.setItem('usuario_nombre_biokuam', datosUsuario.nombres);
            localStorage.setItem('usuario_apellido_biokuam', datosUsuario.apellidos);

            alert(`¡EL REGISTRO SE REALIZÓ DE FORMA CORRECTA, BIENVENIDO A BIOKUAM ${datosUsuario.nombres} ${datosUsuario.apellidos}!`);
            window.location.href = '/'; 
        } else {
            alert('ERROR EN EL REGISTRO: ' + (resultado.detail || "Error desconocido"));
        }

    } catch (error) {
        console.error('ERROR EN EL PROCESO:', error);
        alert('ERROR: ' + error.message);
    }
});