const formLogin = document.getElementById('formLogin'); //ID DEL FORMULARIO DE LOGIN
console.log("EL SCRIPT DEL FORMULARIO DE LOGIN HA SIDO CARGADO EXITOSAMENTE");

if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();

        const datosLogin = {
            correo: document.getElementById('login_usuario').value,
            contraseña: document.getElementById('login_pass').value
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
                console.log("LOGIN EXITOSO:", resultado);
                //GUARDAR LOS DATOS EN EL LOCALSTORAGE 
                localStorage.setItem('usuario_id_biokuam', resultado.usuario_id);
                localStorage.setItem('usuario_nombres_biokuam', resultado.nombres);
                alert(`¡BIENVENIDO DE NUEVO ${resultado.nombres}!`);
                window.location.href = '/home';
            } else {
                alert (`ERROR EN LOGIN: ${resultado.detail}`);
            }
        } catch (error) {
            console.error("ERROR EN LA CONEXIÓN AL SERVIDOR:", error);
            alert('ERROR EN LA CONEXIÓN AL SERVIDOR. REVISA LA CONSOLA PARA MÁS DETALLES.');
        }
    }); 
}