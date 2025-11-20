import React, { useState } from "react";


import SuccessPopup from "../../components/SuccessMessage.jsx";
import { bookingService } from "../../services/bookingService";
import "./BookingForm.css";

const BookingForm = () => {
  const today = new Date();
  const initialDate = today.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    hour: "",
    minutes: "",
    duration: "",
    courtId: "",
    participants: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.day) newErrors.day = "Obligatorio";
    if (!formData.month) newErrors.month = "Obligatorio";
    if (!formData.year) newErrors.year = "Obligatorio";

    if (!formData.hour || formData.hour === "") newErrors.hour = "Elegí un horario";
    if (!formData.minutes || formData.minutes === "") newErrors.minutes = "Elegí minutos";

    if (!formData.duration) newErrors.duration = "Requerido";
    if (!formData.courtId) newErrors.courtId = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildDateTime = () => {
    return `${formData.year}-${String(formData.month).padStart(2, "0")}-${String(
      formData.day
    ).padStart(2, "0")}T${String(formData.hour).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const bookingDatetime = buildDateTime();
      const participants = formData.participants
        ? formData.participants.split(",").map((x) => x.trim())
        : [];

      await bookingService.createBooking(
        formData.courtId,
        bookingDatetime,
        Number(formData.duration),
        participants
      );

      setSuccess(true);
      setFormData({
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        hour: "",
        minutes: "",
        duration: "",
        courtId: "",
        participants: "",
      });
    } catch (err) {
      alert("Error al crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            {errors.day || errors.month || errors.year ? (
              <span className="error-message">Fecha incompleta</span>
            ) : null}
          </div>

          <div className="time-grid">
            <div className="form-group">
              <label>Hora</label>
              <select
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                className={`form-input time-input ${errors.hour ? "input-error" : ""}`}
              >
                <option value="">Selecciona una hora</option>
                {Array.from({ length: 15 }, (_, i) => {
                  const hour = i + 8;
                  return (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>
                      {hour.toString().padStart(2, '0')}
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
                className={`form-input time-input ${errors.minutes ? "input-error" : ""}`}
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

          {/* CANCHA */}
          <div className="form-group">
            <label>ID de Cancha</label>
            <input
              type="number"
              name="courtId"
              value={formData.courtId}
              onChange={handleChange}
              className={`form-input ${errors.courtId ? "input-error" : ""}`}
              placeholder="Ej: 1"
            />
            {errors.courtId && (
              <span className="error-message">{errors.courtId}</span>
            )}
          </div>

          {/* PARTICIPANTES */}
          <div className="form-group">
            <label>Participantes (IDs separados por coma)</label>
            <input
              type="text"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: 12, 18, 33"
            />
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creando...
              </>
            ) : (
              "Crear Reserva"
            )}
          </button>
        </form>
      </main>

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
