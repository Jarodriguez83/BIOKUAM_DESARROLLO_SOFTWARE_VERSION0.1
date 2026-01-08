function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            
            // Ocultar todos los contenidos
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].className = tabcontent[i].className.replace(" active", "");
            }

            // Quitar clase active de todos los botones
            tablinks = document.getElementsByClassName("tab-btn");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            // Mostrar la pestaña actual y añadir clase active al botón
            document.getElementById(tabName).className += " active";
            evt.currentTarget.className += " active";
        }

        // Función para cambiar de pestaña mediante enlaces de texto
        function triggerTab(index) {
            const buttons = document.querySelectorAll('.tab-btn');
            buttons[index].click();
        }