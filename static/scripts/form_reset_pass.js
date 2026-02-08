console.log ("SCRIPT PARA RESTABLECER CONTRASEÑA. CARGADO EXITOSAMENTE"); 
document.addEventListener('DOMContentLoaded'), () => {
    //OBTENER LOS DATOS DEL LOCALSTORAGE
    const nombres = localStorage.getItem('nombres');
    const correo = localStorage.getItem('correo');

    if (!correo) {
        alert('NO SE ENCONTRÓ ESTE CORREO ELECTRÓNICO REGISTRADO.');
        window.location.href = 'inicio.html';
        return; 
    }
    if (correo) {
        window.location.href = "restablecer_pass.html"
    }
    // RELLENAR EL FORMULARIO CON LOS DATOS OBTENIDOS
    document.getElementById('display-nombre').innerText = nombres;
    document.getElementById('display-correo').innerText = correo;
    //MANEJO DEL FORMULARIO DE RESTABLECIMIENTO DE CONTRASEÑA
    document.getElementById('formRestablecer').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pass1 = document.getElementById('new_pass').value;
        const pass2 = document.getElementById('confirm_new_pass').value;
        //VALIDACIONES DE SEGURIDAD PARA LA CONTRASEÑA  
        if (pass1 !== pass2) {
            alert('LAS CONTRASEÑAS NO COINCIDEN. POR FAVOR, INTÉNTALO DE NUEVO.');
            return;
        }
        if (pass1.length < 6) {
            alert('LA CONTRASEÑA DEBE TENER AL MENOS 6 CARACTERES.');
            return;
        }
        //ENVIO DE DATOS A FASTAPI
        try {
            const response = await fetch('/restablecer-pass', {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    correo: correo, 
                    new_pass: pass1
                })
            });
            if (response.ok) {
                alert('CONTRASEÑA RESTABLECIDA CON ÉXITO. POR FAVOR, INICIA SESIÓN CON TU NUEVA CONTRASEÑA.');
                localStorage.removeItem('nombres');
                localStorage.removeItem('correo');
                window.location.href = 'inicio.html';
            } else {
                alert('OCURRIÓ UN ERROR AL RESTABLECER LA CONTRASEÑA. POR FAVOR, INTÉNTALO DE NUEVO.');
            }
        } catch (error) {
            console.error('ERROR DE CONEXIÓN: ', error);  
            alert('NO SE PUDO CONECTAR AL SERVIDOR. POR FAVOR, INTÉNTALO DE NUEVO MÁS TARDE.');
        }

    }); 
};