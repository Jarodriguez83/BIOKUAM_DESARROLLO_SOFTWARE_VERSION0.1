console.log("EL SCRIPT DEL PERFIL DEL USUARIO HA SIDO CARGADO EXITOSAMENTE");
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = localStorage.getItem('usuario_id_biokuam');
    //SI NO HAY NADIE LOGUEADO SE SACA  
    if (!usuarioId){
        window.location.href = '/';
        return;  
    }
    try{
        const respuesta = await fetch(`http://127.0.0.1:8000/perfil/usuario/${usuarioId}`);
        const datos = await respuesta.json();
        console.log("DATOS RECIBIDOS DEL SERVIDOR:", datos);
        if (respuesta.ok){
            //RELLENAS PERFIL.HTML CON LOS DATOS
            document.getElementById('userFullname').textContent = `${datos.nombres} ${datos.apellidos}`;
            document.getElementById('userCorreo').textContent = datos.correo;
            document.getElementById('userTel').textContent = datos.telefono;
            document.getElementById('userVereda').textContent = datos.vereda;
            document.getElementById('userFinca').textContent  = datos.nombre_finca;
            document.getElementById('userNumDoc').textContent = datos.tipo_identificacion;
            document.getElementById('userFolio').textContent = datos.numero_identificacion;
            //CARGAR LA FOTO DE SUPABASE  
            const imgPerfil = document.getElementById('userFoto');
            if (imgPerfil && datos.foto_perfil) {
                imgPerfil.src = datos.foto_perfil;
            }
        }
    } catch (error){
        console.error("ERROR AL CARGAR EL PERFIL:", error);
    }

});