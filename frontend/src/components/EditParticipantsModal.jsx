import React, { useEffect, useState, useRef } from "react";
import { userService } from "../services/userService";
import { bookingService } from "../services/bookingService";
import SuccessPopup from "./SuccessMessage.jsx";
import FailedPopup from "./FailedMessage.jsx";
import "../assets/styles/EditParticipantsModal.css";

const EditParticipantsModal = ({ booking, onClose, onSuccess }) => {
  const loggedUserId = Number(localStorage.getItem("userId"));
  const userSelectRef = useRef(null);
  const isSelect2InitializedRef = useRef(false);

  const [users, setUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");



  // Cargar usuarios al montar
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await userService.getAllUsers();
        // Filtrar al usuario logueado
        const filtered = allUsers.filter(user => user.id !== loggedUserId);
        setUsers(filtered);

        // Pre-seleccionar participantes actuales (excluyendo al creador)
        if (booking.participants && Array.isArray(booking.participants) && booking.participants.length > 0) {
          const currentParticipants = booking.participants
            .filter(p => p.user_id !== loggedUserId)
            .map(p => String(p.user_id)); // Convertir a string para Select2
          

          setSelectedParticipants(currentParticipants);
        } 
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setErrorMessage("Error al cargar los usuarios");
      }
    };
    loadUsers();
  }, []);

  // Inicializar Select2 Y aplicar preselección
  useEffect(() => {
    if (!window.$ || !window.$.fn.select2) {
      console.error("jQuery o Select2 no disponibles");
      return;
    }

    // Esperar a que users esté cargado y haya participantes seleccionados
    if (users.length === 0) {
      return;
    }
    
    if (isSelect2InitializedRef.current) {

      return;
    }


    const timer = setTimeout(() => {
      if (userSelectRef.current) {
        // Inicializar Select2
        window.$(userSelectRef.current).select2({
          width: "100%",
          placeholder: "Selecciona participantes (máximo 3)",
          allowClear: true,
          dropdownParent: window.$('.edit-participants-modal'),
        });

        // Aplicar preselección INMEDIATAMENTE después de inicializar
        if (selectedParticipants.length > 0) {
          window.$(userSelectRef.current)
            .val(selectedParticipants)
            .trigger('change.select2');
        }

        // Event listener para cambios
        window.$(userSelectRef.current).on("change", function () {
          let values = window.$(this).val() || [];

          if (values.length > 3) {
            values = values.slice(0, 3);
            window.$(this).val(values).trigger("change.select2");
          }

          setSelectedParticipants(values);
        });

        isSelect2InitializedRef.current = true;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [users, selectedParticipants.length]);

  // Cleanup Select2 al desmontar
  useEffect(() => {
    return () => {
      if (window.$ && userSelectRef.current) {
        window.$(userSelectRef.current).select2("destroy");
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar: exactamente 1 o 3 participantes
    if (selectedParticipants.length !== 1 && selectedParticipants.length !== 3) {
      setErrorMessage("Debes seleccionar exactamente 1 o 3 participantes (sin contarte)");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const participantIds = selectedParticipants.map(Number);
      
      await bookingService.updateParticipants(booking.id, participantIds);

      setSuccessMessage("Participantes actualizados correctamente");
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Error actualizando participantes:", err);

      if (err.response && err.response.status === 401) {
        alert(err.response.data.error || "Error de autorización");
        window.location.reload();
        return;
      }

      setErrorMessage(err.response?.data?.error || "Error al actualizar los participantes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal edit-participants-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">👥</span>
          <h2>Editar Participantes</h2>
          <p>Modifica los participantes de la reserva</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="booking-info">
            <p><strong>Cancha:</strong> {booking.courtName || booking.court_name || "N/A"}</p>
            <p><strong>Fecha:</strong> {new Date(booking.datetime || booking.booking_datetime).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {new Date(booking.datetime || booking.booking_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>

          <div className="form-group">
            <label>Participantes (máximo 3)</label>
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
            <small className="helper-text">
              Selecciona entre 1 y 3 participantes (tú ya estás incluido)
            </small>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : (
                "Confirmar"
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <FailedPopup 
            message={errorMessage} 
            onClose={() => setErrorMessage("")} 
          />
        )}

        {successMessage && (
          <SuccessPopup 
            message={successMessage} 
            onClose={() => setSuccessMessage("")} 
          />
        )}
      </div>
    </div>
  );
};

export default EditParticipantsModal;