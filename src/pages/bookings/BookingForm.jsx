import React, { useEffect, useState, useRef } from "react";
import SuccessPopup from "../../components/SuccessMessage.jsx";
import FailedPopup from "../../components/FailedMessage.jsx";
import { bookingService } from "../../services/bookingService";
import { courtService } from "../../services/courtService";
import { userService } from "../../services/userService";

import "./BookingForm.css";

const BookingForm = () => {
  const today = new Date();
  const loggedUserId = Number(localStorage.getItem("userId"));

  // Referencias para los selects
  const courtSelectRef = useRef(null);
  const userSelectRef = useRef(null);
  const isSelect2InitializedRef = useRef(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    hour: "",
    minutes: "",
    duration: "",
    courtId: "",
    participants: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // -------------------------------------------
  // 1. CARGAR CANCHAS Y PARTICIPANTES
  // -------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const c = await courtService.getAllCourts();
        const u = await userService.getAllUsers();

        // Filtra al usuario logueado
        const filtered = u.filter(user => user.id !== loggedUserId);
        setCourts(c);
        setUsers(filtered);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    loadData();
  }, []);

  // -------------------------------------------
  // 2. INICIALIZAR SELECT2
  // -------------------------------------------
  useEffect(() => {
    if (!window.$ || !window.$.fn.select2) {
      console.error("jQuery o Select2 no disponibles");
      return;
    }

    if (courts.length === 0 || users.length === 0) {
      return;
    }

    if (isSelect2InitializedRef.current) {
      return; // Ya está inicializado
    }

    const timer = setTimeout(() => {
      // Inicializar cancha
      if (courtSelectRef.current) {
        window.$(courtSelectRef.current).select2({
          width: "100%",
          placeholder: "Selecciona una cancha",
          allowClear: true,
        });

        window.$(courtSelectRef.current).on("change", function () {
          const value = window.$(this).val();
          setFormData((prev) => ({ ...prev, courtId: value || "" }));
        });
      }

      // Inicializar participantes
      if (userSelectRef.current) {
        window.$(userSelectRef.current).select2({
          width: "100%",
          placeholder: "Selecciona participantes",
          allowClear: true,
        });

        window.$(userSelectRef.current).on("change", function () {
          const values = window.$(this).val() || [];
          setFormData((prev) => ({ ...prev, participants: values }));
        });
      }

      isSelect2InitializedRef.current = true;
      console.log("✅ Select2 inicializado");
    }, 100);

    return () => clearTimeout(timer);
  }, [courts, users]);

  // -------------------------------------------
  // VALIDACIÓN
  // -------------------------------------------
 const validate = () => {
  let newErrors = {};

  if (!formData.day) newErrors.day = "Obligatorio";
  if (!formData.month) newErrors.month = "Obligatorio";
  if (!formData.year) newErrors.year = "Obligatorio";

  if (!formData.hour) newErrors.hour = "Elegí un horario";
  if (!formData.minutes) newErrors.minutes = "Elegí minutos";
  if (!formData.duration) newErrors.duration = "Obligatorio";

  if (!formData.courtId) newErrors.courtId = "Elegí una cancha";

  // Participantes obligatorios: solo 1 o 3
  const participantCount = formData.participants.length;
  if (participantCount !== 1 && participantCount !== 3) {
    newErrors.participants =
      "Debes seleccionar exactamente 1 o 3 participantes (sin contarte)";
  }

  // Validación horario
  if (formData.hour) {
    const startHour = parseInt(formData.hour);
    const startMinutes = parseInt(formData.minutes || "0");

    // NO puede comenzar a las 22 ni después
    if (startHour >= 22) {
      newErrors.hour = "La reserva no puede comenzar a las 22:00 o después";
    }

    // Validar finalización
    if (formData.duration) {
      const durationInMinutes = parseInt(formData.duration) * 30;
      const totalMinutes = startHour * 60 + startMinutes + durationInMinutes;

      const endHour = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;

      // NO puede finalizar después de 22:00
      if (endHour > 22 || (endHour === 22 && endMinutes > 0)) {
        newErrors.duration = `La reserva terminaría a las ${endHour}:${String(
          endMinutes
        ).padStart(2, "0")}. Debe finalizar antes de las 22:00`;
      }
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // -------------------------------------------
  // FORMATEAR FECHA PARA EL BACKEND
  // -------------------------------------------
  const buildDateTime = () => {
    return `${formData.year}-${String(formData.month).padStart(
      2,
      "0"
    )}-${String(formData.day).padStart(2, "0")}T${String(formData.hour).padStart(
      2,
      "0"
    )}:${formData.minutes}`;
  };

  // -------------------------------------------
  // SUBMIT
  // -------------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    const bookingDatetime = buildDateTime();

    await bookingService.createBooking(
      Number(formData.courtId),
      bookingDatetime,
      Number(formData.duration),
      formData.participants.map(Number)
    );

    setSuccess(true);

    // reset
    setFormData({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      hour: "",
      minutes: "",
      duration: "",
      courtId: "",
      participants: [],
    });

    if (window.$) {
      window.$(courtSelectRef.current).val(null).trigger("change");
      window.$(userSelectRef.current).val(null).trigger("change");
    }

  } catch (err) {
    console.error("Error creando reserva:", err);

    // Si la sesión venció
    if (err.response && err.response.status === 401) {
      alert("Tu sesión ha vencido. Debes volver a iniciar sesión.");
      window.location.reload();
      return;
    }
      if (err.response && err.response.status  === 409) {
    setErrorMessage(err.response.data.error); 
    return;
      } 

    alert("Error al crear la reserva:", err.response.data.error);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="booking-page">
      <main className="booking-container">
        <div className="booking-header">
          <span className="booking-icon">📅</span>
          <h1>Crear Reserva</h1>
          <p>Completa los datos para registrar una reserva</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {/* FECHA */}
          <div className="form-group">
            <label>Fecha</label>
            <div className="date-grid">
              <input
                type="number"
                name="day"
                placeholder="Día"
                value={formData.day}
                onChange={handleChange}
                className={`form-input ${errors.day ? "input-error" : ""}`}
                min="1"
                max="31"
              />
              <input
                type="number"
                name="month"
                placeholder="Mes"
                value={formData.month}
                onChange={handleChange}
                className={`form-input ${errors.month ? "input-error" : ""}`}
                min="1"
                max="12"
              />
              <input
                type="number"
                name="year"
                placeholder="Año"
                value={formData.year}
                onChange={handleChange}
                className={`form-input ${errors.year ? "input-error" : ""}`}
                min={today.getFullYear()}
              />
            </div>
            {(errors.day || errors.month || errors.year) && (
              <span className="error-message">Fecha incompleta</span>
            )}
          </div>

          {/* HORA */}
          <div className="time-grid">
            <div className="form-group">
              <label>Hora</label>
              <select
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                className={`form-input time-input ${
                  errors.hour ? "input-error" : ""
                }`}
              >
                <option value="">Selecciona una hora</option>
                {Array.from({ length: 15 }, (_, i) => {
                  const hour = i + 8;
                  return (
                    <option
                      key={hour}
                      value={hour.toString().padStart(2, "0")}
                    >
                      {hour.toString().padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
              {errors.hour && (
                <span className="error-message">{errors.hour}</span>
              )}
            </div>

            <div className="form-group">
              <label>Minutos</label>
              <select
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                className={`form-input time-input ${
                  errors.minutes ? "input-error" : ""
                }`}
              >
                <option value="">Selecciona minutos</option>
                <option value="00">00</option>
                <option value="30">30</option>
              </select>
              {errors.minutes && (
                <span className="error-message">{errors.minutes}</span>
              )}
            </div>
          </div>

          {/* DURACIÓN */}
          <div className="form-group">
            <label>Duración (bloques de 30 min)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`form-input ${errors.duration ? "input-error" : ""}`}
              placeholder="Ej: 2 = 1 hora"
              min="1"
            />
            {errors.duration && (
              <span className="error-message">{errors.duration}</span>
            )}
          </div>

          {/* CANCHA (SELECT2 SINGLE) */}
          <div className="form-group">
            <label>Cancha</label>
            <select 
              ref={courtSelectRef}
              className="js-example-basic-single form-input"
            >
              <option value=""></option>
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
            {errors.courtId && (
              <span className="error-message">{errors.courtId}</span>
            )}
          </div>

          {/* PARTICIPANTES (SELECT2 MULTIPLE) */}
          <div className="form-group">
            <label>Participantes</label>
            <select 
              ref={userSelectRef}
              className="js-example-basic-multiple form-input" 
              multiple
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Creando...
              </>
            ) : (
              "Crear Reserva"
            )}
          </button>
        </form>
      </main>
      
            <FailedPopup message={errorMessage} onClose={() => setErrorMessage("")} />


      {errors.participants && (
                <FailedPopup
          message={errors.participants}
          onClose={() => setErrors((prev) => ({ ...prev, participants: null }))}
        />
      )}



      {success && (
        <SuccessPopup
          message="La reserva fue creada con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
    </div>
  );
};

export default BookingForm;