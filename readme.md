# Canchas App - Sistema de Reservas de Canchas Deportivas

## 📋 Descripción del Proyecto

Canchas App es una aplicación web completa para la gestión y reserva de canchas deportivas. Desarrollada con una arquitectura moderna full-stack, permite a los usuarios reservar canchas en horarios específicos, gestionar participantes y administrar el sistema de manera eficiente.

### 🎯 Características Principales

- **Reserva de Canchas**: Sistema intuitivo para reservar canchas con validaciones en tiempo real
- **Gestión de Usuarios**: Registro, autenticación y perfiles de usuario
- **Vista de Calendario**: Interfaz visual para ver disponibilidad y reservas
- **Administración**: Panel de control para administradores
- **Participantes**: Gestión de participantes en cada reserva
- **Validaciones Avanzadas**: Control de conflictos de horario, capacidad y reglas de negocio



## 📊 Características Técnicas Destacadas

### Frontend
- **Componentes Reutilizables**: Header, Footer, NavBar, Modales
- **Gestión de Estado**: localStorage para persistencia de sesión
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **UX Optimizada**: Feedback visual, loading states, mensajes de error

### Backend
- **API RESTful**: Endpoints bien definidos con OpenAPI
- **Validaciones Robuste**: Lado servidor con mensajes específicos
- **Transacciones ACID**: Integridad de datos garantizada
- **Middleware Pattern**: Separación clara de responsabilidades

### Arquitectura
- **Separación de Capas**: Controllers, Models, Middleware
- **Inyección de Dependencias**: Constructor injection en controllers
- **Error Handling**: Try-catch comprehensivo con logging
- **Código Limpio**: Nombres descriptivos, comentarios, estructura modular

## 🏗️ Arquitectura y Tecnologías

### Frontend
- **React 18** con Vite para desarrollo rápido
- **React Router** para navegación SPA
- **CSS Modules** para estilos modulares
- **Axios** para comunicación con API
- **JWT** para autenticación del lado cliente

### Backend
- **Slim Framework 4** (PHP) para API RESTful
- **MySQL** con PDO para persistencia de datos
- **JWT** para autenticación segura
- **Composer** para gestión de dependencias

### Infraestructura
- **Docker** y **Docker Compose** para contenedorización
- **Nginx** como servidor web
- **OpenAPI 3.0** para documentación de API

## 🚀 Funcionalidades del Frontend

### 1. Página Principal (HomePage)
**Ubicación**: `frontend/src/pages/bookings/HomePage.jsx`

**Funcionalidades**:
- **Vista de Calendario Interactiva**: Muestra una cuadrícula con canchas (columnas) y horarios (filas) de 30 minutos
- **Navegación por Fechas**: Botones para día anterior, siguiente y volver al día actual
- **Visualización de Reservas**: Celdas coloreadas muestran reservas existentes con información del creador y participantes
- **Interacción con Reservas**: Click en reservas propias permite editar participantes
- **Indicadores Visuales**:
  - Verde: Disponible
  - Rojo: Ocupado
  - Azul: Reserva propia

**Lógica de Renderizado**:
```javascript
const renderCell = (timeSlot, court) => {
  const booking = getBookingForCell(timeSlot, court.id);
  const isOccupied = isCellOccupied(timeSlot, court.id);

  if (booking) {
    return (
      <div className="booking-cell occupied" onClick={() => handleBookingClick(booking, court)}>
        {booking.participants.length + 1} jugadores
      </div>
    );
  }
  // ... lógica para celdas disponibles
};
```

### 2. Sistema de Autenticación
**Archivos**: `frontend/src/pages/auth/LoginPage.jsx`, `frontend/src/pages/register/RegisterPage.jsx`

**Funcionalidades**:
- **Registro de Usuarios**: Formulario con validación de email, contraseña y datos personales
- **Inicio de Sesión**: Autenticación con JWT, almacenamiento en localStorage
- **Protección de Rutas**: Componente `ProtectedRoute` para rutas que requieren autenticación
- **Cambio de Contraseña**: Funcionalidad para usuarios autenticados

**Componente ProtectedRoute**:
```javascript
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/login" />;

  return children;
};
```

### 3. Gestión de Reservas
**Archivos**: `frontend/src/pages/bookings/BookingForm.jsx`

**Funcionalidades**:
- **Creación de Reservas**: Formulario con selección de cancha, fecha, hora y duración
- **Selección de Participantes**: Búsqueda y selección de usuarios para la reserva
- **Validaciones del Lado Cliente**:
  - Horarios válidos (8:00-22:00, en bloques de 30 min)
  - Duración máxima (3 horas / 6 bloques)
  - Número de jugadores (2 o 4 total)
- **Edición de Reservas**: Modificación de reservas existentes (solo creador)

**Lógica de Participantes**:
```javascript
const handleParticipantToggle = (user) => {
  setSelectedParticipants(prev => {
    const isSelected = prev.some(p => p.id === user.id);
    if (isSelected) {
      return prev.filter(p => p.id !== user.id);
    } else if (prev.length < 3) { // máximo 3 participantes + creador = 4
      return [...prev, user];
    }
    return prev;
  });
};
```

### 4. Gestión de Usuarios (Administrador)
**Archivo**: `frontend/src/pages/users/UsersPage.jsx`

**Funcionalidades**:
- **Lista de Usuarios**: Vista paginada con búsqueda por nombre/email
- **Edición de Perfiles**: Modificación de datos de usuario (admin)
- **Eliminación de Usuarios**: Borrado seguro con confirmación
- **Control de Acceso**: Solo accesible para administradores

### 5. Gestión de Canchas
**Archivo**: `frontend/src/pages/courts/CourtPage.jsx`

**Funcionalidades**:
- **Lista de Canchas**: Visualización de todas las canchas disponibles
- **Vista de Reservas por Cancha**: Historial de reservas para cada cancha
- **Interfaz Pública**: Accesible sin autenticación

## 🔧 API Backend - Endpoints y Lógica

### Autenticación y Usuarios

#### POST /api/user (Registro)
**Controlador**: `UserController::register()`

**Validaciones**:
- Email único en la base de datos
- Hashing de contraseña con `password_hash()`
- Campos requeridos: email, password, first_name, last_name

**Respuesta Exitosa**:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Juan",
    "last_name": "Pérez"
  }
}
```

#### POST /api/login (Inicio de Sesión)
**Controlador**: `UserController::login()`

**Lógica**:
- Verificación de credenciales
- Generación de JWT con payload: user_id, is_admin, exp
- Retorno de token para autenticación futura

#### GET /api/users (Búsqueda de Usuarios)
**Controlador**: `UserController::searchUsers()`

**Funcionalidad**: Búsqueda por nombre o email con LIKE queries

### Gestión de Canchas

#### POST /api/court (Crear Cancha - Admin)
**Controlador**: `CourtController::createCourt()`

**Middleware**: Autenticación + Admin requerido

**Validaciones**:
- Solo administradores pueden crear canchas
- Campos requeridos: name, description

#### GET /api/court (Listar Canchas)
**Funcionalidad**: Retorna todas las canchas disponibles

#### GET /api/court/{id}/bookings (Reservas por Cancha)
**Lógica**: Une tablas booking y booking_participants para mostrar historial

### Sistema de Reservas

#### POST /api/booking (Crear Reserva)
**Controlador**: `BookingController::create()`

**Validaciones Complejas**:

1. **Campos Requeridos**:
   - court_id (integer > 0)
   - booking_datetime (formato válido)
   - duration_blocks (1-6)
   - participants (array de IDs)

2. **Reglas de Negocio**:
   - **Horarios**: 8:00-22:00, bloques de 30 minutos
   - **Jugadores**: Total 2 o 4 (creador + participantes)
   - **Duración Máxima**: 6 bloques (3 horas)

3. **Validaciones de Conflicto**:
   ```php
   // Verificar disponibilidad de cancha
   if (!$booking->isCourtAvailable($courtId, $bookingDatetime, $durationBlocks)) {
       return error 409 "La cancha no está disponible";
   }

   // Verificar conflictos del creador
   if ($booking->hasUserConflict($creatorId, $bookingDatetime, $durationBlocks)) {
       return error 409 "Ya tienes una reserva que se solapa";
   }

   // Verificar conflictos de participantes
   foreach ($participants as $participantId) {
       if ($booking->hasUserConflict($participantId, $bookingDatetime, $durationBlocks)) {
           return error 409 "Conflicto de horario";
       }
   }
   ```

4. **Transacción de Base de Datos**:
   ```php
   $this->db->beginTransaction();
   try {
       // Crear reserva
       $booking->create();
       // Agregar creador como participante
       $participant->create();
       // Agregar otros participantes
       foreach ($participants as $participantId) {
           $participant->create();
       }
       $this->db->commit();
   } catch (Exception $e) {
       $this->db->rollBack();
   }
   ```

#### GET /api/booking (Listar Reservas del Día)
**Controlador**: `BookingController::list()`

**Funcionalidad**:
- Parámetro opcional `date` (formato YYYY-MM-DD)
- Retorna reservas del día con participantes incluidos
- **Público**: No requiere autenticación

**Lógica de Consulta**:
```php
$bookings = $booking->getByDate($date);
foreach ($bookings as &$bookingItem) {
    $bookingItem['participants'] = $participant->getByBookingId($bookingItem['id']);
}
```

#### DELETE /api/booking/{id} (Eliminar Reserva)
**Controlador**: `BookingController::delete()`

**Autorización**:
- Solo creador de la reserva o administrador
- Eliminación en cascada: participantes primero, luego reserva

#### PUT /api/booking_participants/{id} (Actualizar Participantes)
**Controlador**: `BookingParticipantsController::updateParticipants()`

**Funcionalidad**:
- Modificación de la lista de participantes
- Validaciones de conflicto de horario
- Solo creador puede modificar

## 🛡️ Seguridad y Middleware

### Autenticación JWT
**Archivo**: `app/Middleware/AuthMiddleware.php`

**Funcionalidad**:
- Verificación de token Bearer en header Authorization
- Decodificación y validación de JWT
- Inyección de user_id e is_admin en request attributes

### Middleware de Administrador
**Archivo**: `app/Middleware/IsAdminMiddleware.php`

**Lógica**:
```php
public function __invoke(Request $request, RequestHandler $handler): Response {
    $isAdmin = $request->getAttribute('is_admin');
    if (!$isAdmin) {
        return $this->jsonResponse($response, ["error" => "Acceso denegado"], 403);
    }
    return $handler->handle($request);
}
```

### Validaciones de Seguridad
- **CORS**: Configurado para permitir orígenes específicos
- **Sanitización**: Validación de inputs en todos los endpoints
- **Transacciones**: Rollback automático en errores
- **Hashing**: Contraseñas hasheadas con PASSWORD_DEFAULT

## 🗄️ Modelo de Datos

### Tablas Principales

#### users
- id (PK)
- email (UNIQUE)
- password_hash
- first_name, last_name
- is_admin (BOOLEAN)
- created_at

#### courts
- id (PK)
- name
- description
- created_at

#### bookings
- id (PK)
- court_id (FK)
- created_by (FK users)
- booking_datetime (DATETIME)
- duration_blocks (INT)
- created_at

#### booking_participants
- id (PK)
- booking_id (FK)
- user_id (FK)
- created_at

## 🚀 Despliegue y Desarrollo

### Requisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo frontend)
- PHP 8.1+ (para desarrollo backend)

### Comandos de Desarrollo

```bash
# Backend
cd backend
docker-compose up -d

# Frontend
cd frontend
npm install
npm run dev
```

### Variables de Entorno
- **JWT_SECRET**: Clave secreta para tokens JWT
- **DB_HOST, DB_NAME, DB_USER, DB_PASS**: Configuración de base de datos


Esta aplicación demuestra un dominio sólido de desarrollo full-stack moderno, con énfasis en seguridad, usabilidad y mantenibilidad del código.