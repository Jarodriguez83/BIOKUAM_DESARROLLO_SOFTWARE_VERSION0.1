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
            document.getElementById('userBKM').textContent = datos.referencia_prototipo;
            //CARGAR LA FOTO DE SUPABASE  
            const imgPerfil = document.getElementById('userFoto');
            if (imgPerfil && datos.foto_perfil) {
                imgPerfil.src = datos.foto_perfil;
            }
            const mensajeRefBarcos = {
                "BKM-REF-001": "Prototipo BKM-001 asignado: Sistema de monitoreo de humedad y temperatura para cultivos en invernadero.",
                "BKM-REF-002": "Prototipo BKM-002 asignado: Sistema de riego automatizado basado en sensores de humedad del suelo.",
                "BKM-REF-003": "Prototipo BKM-003 asignado: Plataforma de análisis de datos agrícolas con IA para optimización de cultivos.",
            };  
            const elementoDescripcion = document.getElementById('descriptionBKM');
            if (elementoDescripcion) {
                const mensajeparaBarcos = mensajeRefBarcos[datos.referencia_prototipo] || "Prototipo asignado sin descripción específica0.";
                elementoDescripcion.textContent = mensajeparaBarcos;
            }
        }
    } catch (error){
        console.error("ERROR AL CARGAR EL PERFIL:", error);
    }

});