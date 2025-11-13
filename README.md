## ENDPOINTS AGREGADOS
    - GET /court - se agrega para obtener un listado de todas las canchas y que un usuario no tenga que tener conocimiento de todas las canchas disponibles. Se utiliza court en vez de courts para mantener el formato presentado previamente en el backend.
## ENDPOINT(S) MODIFICADO(S)
    - GET /booking - Por defecto ahora traera las reservas del dia, no devolvera error.

## Librerías Externas

### **react-router-dom** 
Librería esencial para el manejo de rutas y navegación en la aplicación.

**¿Por qué se utiliza?**
- Permite definir múltiples páginas con URLs únicas (`/login`, `/courts`, `/booking`)
- Navegación sin recargas de página (SPA - Single Page Application)
- Protección de rutas según autenticación y permisos de usuario
- Gestión del historial del navegador

