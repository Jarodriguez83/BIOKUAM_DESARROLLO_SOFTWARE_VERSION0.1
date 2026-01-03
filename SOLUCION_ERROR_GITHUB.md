# 🔧 Solución al Error de GitHub (403 Permission Denied)

## ❌ Error Actual

```
remote: Permission to Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1.git denied to jhonrodriguez002.
fatal: unable to access 'https://github.com/Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1.git/': The requested URL returned error: 403
```

**Causa**: Estás autenticado como `jhonrodriguez002` pero intentas hacer push a un repositorio de `Jarodriguez83`.

---

## ✅ Solución Recomendada: Personal Access Token (PAT)

GitHub ya no permite usar contraseñas para autenticación HTTPS. Debes usar un **Personal Access Token (PAT)**.

### Paso 1: Crear un Personal Access Token

1. Ve a GitHub: https://github.com/settings/tokens
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre descriptivo: `BIOKUAM_Web_Service`
4. Selecciona los permisos necesarios:
   - ✅ `repo` (acceso completo a repositorios)
5. Click en **"Generate token"**
6. **⚠️ IMPORTANTE**: Copia el token inmediatamente (solo se muestra una vez)
   - Se verá algo como: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Paso 2: Configurar Git para usar el Token

Tienes **3 opciones**:

---

### **Opción A: Usar el Token en la URL del Remote (Recomendado para este caso)**

```powershell
# Cambiar la URL del remote para incluir el token
git remote set-url origin https://Jarodriguez83:TU_TOKEN_AQUI@github.com/Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1.git
```

**Ejemplo**:
```powershell
git remote set-url origin https://Jarodriguez83:ghp_abc123xyz@github.com/Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1.git
```

Luego intenta hacer push:
```powershell
git push
```

---

### **Opción B: Usar Git Credential Manager (Más Seguro)**

1. **Eliminar credenciales guardadas**:
   ```powershell
   # Abrir Credential Manager de Windows
   cmdkey /list
   
   # Eliminar credenciales de GitHub si existen
   cmdkey /delete:git:https://github.com
   ```

2. **Hacer push** - Git te pedirá credenciales:
   ```powershell
   git push
   ```
   
3. Cuando te pida:
   - **Username**: `Jarodriguez83`
   - **Password**: Pega tu **Personal Access Token** (no tu contraseña)

---

### **Opción C: Usar SSH (Más Seguro a Largo Plazo)**

1. **Generar clave SSH** (si no tienes una):
   ```powershell
   ssh-keygen -t ed25519 -C "jarodriguez83@ucatolica.edu.co"
   ```
   - Presiona Enter para usar la ubicación por defecto
   - Opcional: agrega una frase de contraseña

2. **Copiar la clave pública**:
   ```powershell
   cat ~/.ssh/id_ed25519.pub
   ```
   O en Windows:
   ```powershell
   type C:\Users\JHON ALEXANDER\.ssh\id_ed25519.pub
   ```

3. **Agregar la clave a GitHub**:
   - Ve a: https://github.com/settings/keys
   - Click en **"New SSH key"**
   - Pega tu clave pública
   - Click en **"Add SSH key"**

4. **Cambiar el remote a SSH**:
   ```powershell
   git remote set-url origin git@github.com:Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1.git
   ```

5. **Probar la conexión**:
   ```powershell
   ssh -T git@github.com
   ```

6. **Hacer push**:
   ```powershell
   git push
   ```

---

## 🔍 Verificar Configuración Actual

```powershell
# Ver el remote actual
git remote -v

# Ver usuario configurado
git config user.name
git config user.email
```

---

## 📝 Comandos Rápidos para Solucionar

### Si eliges la Opción A (Token en URL):

```powershell
# 1. Cambiar al directorio del proyecto
cd "C:\Users\JHON ALEXANDER\DESARROLLO SOFTWARE\BIOKUAM_WEB_SERVICE_0.1\BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1"

# 2. Cambiar URL del remote (reemplaza TU_TOKEN con tu token real)
git remote set-url origin https://Jarodriguez83:TU_TOKEN@github.com/Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1.git

# 3. Verificar que se cambió correctamente
git remote -v

# 4. Intentar push
git push
```

---

## ⚠️ Notas Importantes

1. **Nunca compartas tu Personal Access Token**
2. **No subas el token a Git** - Si accidentalmente lo pusiste, revócalo inmediatamente y crea uno nuevo
3. **El token tiene permisos completos** - Trátalo como una contraseña
4. **Si usas la Opción A**, el token quedará visible en la configuración de Git (aunque solo localmente)

---

## 🆘 Si Aún Tienes Problemas

1. **Verifica que eres colaborador del repositorio**:
   - Ve a: https://github.com/Jarodriguez83/BIOKUAM_DESARROLLO_SOFTWARE_VERSION0.1/settings/access
   - Asegúrate de que tu cuenta `Jarodriguez83` tenga permisos de escritura

2. **Verifica que el token tiene los permisos correctos**:
   - Debe tener el scope `repo` habilitado

3. **Limpia la caché de credenciales**:
   ```powershell
   git credential-manager-core erase
   ```

4. **Verifica la configuración de Git**:
   ```powershell
   git config --global --list
   ```

---

## ✅ Después de Solucionar

Una vez que puedas hacer push correctamente, puedes agregar los archivos nuevos que creamos:

```powershell
# Ver qué archivos son nuevos
git status

# Agregar todos los archivos nuevos
git add .

# Hacer commit
git commit -m "Agregar estructura base del proyecto con FastAPI y SQLModel"

# Hacer push
git push
```

---

## 📚 Recursos Adicionales

- [GitHub: Creating a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub: Using SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Git Credential Manager](https://github.com/GitCredentialManager/git-credential-manager)

