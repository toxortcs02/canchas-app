import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import { bookingService } from "../../services/bookingService";
import { courtService } from "../../services/courtService";
import "./BookingForm.css";

const BookingForm = () => {
  const today = new Date();

  const [courts, setCourts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    court_id: "",
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    hour: today.getHours(),
    minutes: "00",
    duration_blocks: "",
    participants: "",
  });

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await courtService.getAllCourts();
        setCourts(data);
      } catch (err) {
        console.error("Error cargando canchas", err);
      }
    };
    fetchCourts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e = {};

    if (!form.court_id) e.court_id = "Elegí una cancha";
    if (!form.duration_blocks || form.duration_blocks < 1)
      e.duration_blocks = "Duración inválida";

    if (!form.participants) e.participants = "Ingresá al menos un participante";

    // Validar fecha no pasada
    const selectedDate = new Date(
      form.year,
      form.month - 1,
      form.day,
      form.hour,
      form.minutes
    );

    if (selectedDate < new Date()) e.date = "No podés elegir un horario pasado";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const bookingDatetime = `${form.year}-${String(form.month).padStart(
      2,
      "0"
    )}-${String(form.day).padStart(2, "0")} ${String(form.hour).padStart(
      2,
      "0"
    )}:${form.minutes}:00`;

    try {
      await bookingService.createBooking(
        form.court_id,
        bookingDatetime,
        Number(form.duration_blocks),
        form.participants.split(",").map((p) => p.trim())
      );

      alert("Reserva creada con éxito");
    } catch (err) {
      console.error(err);
      alert("Error creando reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-page">


      <main className="main-content">
        <div className="booking-card">

          <h2>Crear Reserva</h2>

          {/* Cancha */}
          <label>Cancha:</label>
          <select name="court_id" value={form.court_id} onChange={handleChange}>
            <option value="">Seleccionar</option>
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.court_id && <span className="error">{errors.court_id}</span>}

          <h3>Fecha</h3>

          <div className="date-grid">
            <div>
              <label>Día</label>
              <input
                type="number"
                name="day"
                min="1"
                max="31"
                value={form.day}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Mes</label>
              <input
                type="number"
                name="month"
                min="1"
                max="12"
                value={form.month}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Año</label>
              <input
                type="number"
                name="year"
                min={today.getFullYear()}
                value={form.year}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3>Hora</h3>

          <div className="time-grid">
            <div>
              <label>Hora</label>
              <input
                type="number"
                name="hour"
                min="0"
                max="23"
                value={form.hour}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Minutos</label>
              <select
                name="minutes"
                value={form.minutes}
                onChange={handleChange}
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>

          {errors.date && <span className="error">{errors.date}</span>}

          <label>Duración (bloques de 30 min):</label>
          <input
            type="number"
            name="duration_blocks"
            min="1"
            value={form.duration_blocks}
            onChange={handleChange}
          />
          {errors.duration_blocks && (
            <span className="error">{errors.duration_blocks}</span>
          )}

          <label>Participantes (IDs separados por coma):</label>
          <input
            type="text"
            name="participants"
            value={form.participants}
            onChange={handleChange}
          />
          {errors.participants && (
            <span className="error">{errors.participants}</span>
          )}

          <button
            className="confirm-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Creando..." : "Crear Reserva"}
          </button>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
};

export default BookingForm;
