// Asegúrate de que este bloque esté dentro de tu archivo JS actual
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    console.log("Escuchador de Login activado correctamente.");

    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Buscamos los elementos específicamente dentro del formulario actual
        const formulario = e.target;
        const inputUsuario = formulario.querySelector('#login_usuario');
        const inputPass = formulario.querySelector('#login_pass');

        // Capturamos los valores
        const correoVal = inputUsuario.value.trim();
        const passVal = inputPass.value.trim();

        // --- VERIFICACIÓN CRÍTICA EN CONSOLA DEL NAVEGADOR ---
        console.log("CAPTURA JS -> Usuario:", correoVal);
        console.log("CAPTURA JS -> Pass:", passVal);

        if (!correoVal || !passVal) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const datosLogin = {
            correo: correoVal,
            contrasena: passVal
        };

        try {
            const respuesta = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosLogin)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // Guardar datos en el LocalStorage
                localStorage.setItem('usuario_id_biokuam', resultado.usuario_id);
                localStorage.setItem('usuario_nombres_biokuam', resultado.nombres);
                
                if (resultado.foto_perfil) {
                    localStorage.setItem('usuario_foto_biokuam', resultado.foto_perfil);
                }

                alert(`¡BIENVENIDO DE NUEVO ${resultado.nombres}!`);
                
                // Redirigir al home o perfil
                window.location.href = '/home'; 
            } else {
                // Esto mostrará el 401 (Clave mal) o 404 (No existe)
                alert(`ERROR: ${resultado.detail}`);
            }
        } catch (error) {
            console.error("Error al conectar con FastAPI:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}