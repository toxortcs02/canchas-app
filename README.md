## ENDPOINTS AGREGADOS
    - GET /court - se agrega para obtener un listado de todas las canchas y que un usuario no tenga que tener conocimiento de todas las canchas disponibles. Se utiliza court en vez de courts para mantener el formato presentado previamente en el backend.
## ENDPOINT(S) MODIFICADO(S)
    - GET /booking - Por defecto ahora traera las reservas del dia, no devolvera error.
    - POST /login - Ahora devuelve tambien el UserId y el nombre completo como string(esto ultimo es para ahorrar llamadas innecesarias al backend para obtener el nombre del usuario)

## Librerías Externas

### **react-router-dom** 
Librería esencial para el manejo de rutas y navegación en la aplicación.}

### **select2**
Libreria externa para listados de multiple seleccion


