console.log("EL SCRIPT DEL FORMULARIO HA SIDO CARGADO EXITOSAMENTE");
// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://tgdolalsmimxcxkuiehl.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_3iG9laPzWQ8CGRbQTxrU4Q_g29s6mkn'; 

document.getElementById('formRegistro').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const fotoInput = document.getElementById('reg_foto');
    const fotoFile = fotoInput ? fotoInput.files[0] : null;

    // URL POR DEFECTO
    let fotoPublicUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 

    try {
        // --- PASO 1: SUBIR A SUPABASE (Si hay foto) ---
        if (fotoFile) {
            const extension = fotoFile.name.split('.').pop();
            const nombreArchivo = `${Date.now()}.${extension}`;
            
            // La ruta DEBE ser: /storage/v1/object/[NOMBRE_DEL_BUCKET]/[NOMBRE_ARCHIVO]
            const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/PERFIL_IMG/${nombreArchivo}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'apikey': SUPABASE_KEY,
                    'Content-Type': fotoFile.type
                },
                body: fotoFile
            });

            if (uploadRes.ok) {
                // URL Pública corregida para el bucket PERFIL_IMG
                fotoPublicUrl = `${SUPABASE_URL}/storage/v1/object/public/PERFIL_IMG/${nombreArchivo}`;
                console.log("IMAGEN EN SUPABASE:", fotoPublicUrl);
            } else {
                const errorSupabase = await uploadRes.json();
                console.error("HAY UN FALLO EN SUPABASE:", errorSupabase);
            }
        }

        // --- PASO 2: ENVIAR A FASTAPI ---
        // IMPORTANTE: Estos nombres deben ser IGUALES a los de tu clase en Python (models.py)
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
            
            // AGREGAMOS EL CAMPO QUE FALTA (Debe ser igual al de tu modelo Python)
            crear_contrasena: document.getElementById('reg_crear_pass').value, 
            
            contrasena: document.getElementById('reg_pass').value,
            foto_perfil: fotoPublicUrl 
        };
        console.log("JSON final enviado:", JSON.stringify(datosUsuario));
        const repuesta = await fetch('http://127.0.0.1:8000/registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        });  

        const resultado = await repuesta.json();

        if (repuesta.ok) {
            alert(`¡BIENVENIDO ${datosUsuario.nombres}, GRACIAS POR HACER PARTE DE BIOKUAM!`);
            localStorage.setItem('usuario_id_biokuam', resultado.usuario_id);
            window.location.href = '/'; 
        } else {
            // Esto imprimirá en consola el error exacto (ej: "Falta el campo X")
            console.error("DETALLE ERROR FASTAPI:", resultado.detail);
            alert('ERROR EN EL REGISTRO. REVIRSAR LA CONSOLA PARA MÁS DETALLES.');
        }

    } catch (error) {
        console.error('ERROR CRÍTICO:', error);
    }
});