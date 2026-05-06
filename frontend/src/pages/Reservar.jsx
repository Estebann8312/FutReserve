import { useState, useEffect } from 'react';
import api from '../api/axios';

// Generate time slots from 06:00 to 22:00
const HORA_INICIO = 6;
const HORA_FIN = 22;

const generarHoras = () => {
  const horas = [];
  for (let h = HORA_INICIO; h < HORA_FIN; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
  }
  return horas;
};

const TODAS_LAS_HORAS = generarHoras();

const Reservar = () => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [reservasDia, setReservasDia] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(null);

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const res = await api.get('/canchas');
        setCanchas(res.data.filter(c => c.disponible));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCanchas();
  }, []);

  useEffect(() => {
    if (selectedCancha && fecha) {
      const fetchReservas = async () => {
        setLoadingReservas(true);
        try {
          const res = await api.get(`/reservas/cancha/${selectedCancha.id}?fecha=${fecha}`);
          setReservasDia(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingReservas(false);
        }
      };
      fetchReservas();
    }
  }, [selectedCancha, fecha]);

  const handleReservar = async (horaInicio) => {
    const duracion = selectedCancha.duracion || 1;
    const horaInicioNum = parseInt(horaInicio.split(':')[0]);
    const horaFinNum = horaInicioNum + duracion;
    const horaFin = `${String(horaFinNum).padStart(2, '0')}:00`;
    const total = (selectedCancha.precioHora * duracion).toLocaleString('es-CO');

    setConfirmando(true);
    try {
      await api.post('/reservas', {
        canchaId: selectedCancha.id,
        fecha,
        horaInicio,
        horaFin
      });
      setReservaExitosa({ horaInicio, horaFin, total });
      const res = await api.get(`/reservas/cancha/${selectedCancha.id}?fecha=${fecha}`);
      setReservasDia(res.data);
    } catch (error) {
      alert(error.response?.data || 'Error al confirmar la reserva');
    } finally {
      setConfirmando(false);
    }
  };

  // A slot is blocked if ANY hour within its duration range is occupied
  const getSlots = () => {
    const duracion = selectedCancha?.duracion || 1;
    const horasOcupadas = new Set(reservasDia.map(r => r.horaInicio));

    return TODAS_LAS_HORAS.filter(hora => {
      const h = parseInt(hora.split(':')[0]);
      return h + duracion <= HORA_FIN; // don't show slots that go past closing
    }).map(hora => {
      const h = parseInt(hora.split(':')[0]);
      // Block the slot if any hour within its duration is occupied
      let ocupada = false;
      for (let i = 0; i < duracion; i++) {
        if (horasOcupadas.has(`${String(h + i).padStart(2, '0')}:00`)) {
          ocupada = true;
          break;
        }
      }
      const horaFin = `${String(h + duracion).padStart(2, '0')}:00`;
      return { hora, horaFin, ocupada };
    });
  };

  const cerrarModal = () => {
    setSelectedCancha(null);
    setReservaExitosa(null);
    setReservasDia([]);
  };

  return (
    <div className="container" style={{ paddingTop: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Reservar Cancha</h1>
        <p style={{ color: 'var(--text-muted)' }}>Selecciona una cancha disponible para hacer tu reserva</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando canchas disponibles...</p>
        </div>
      ) : canchas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏟️</div>
          <p>No hay canchas disponibles por el momento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {canchas.map(cancha => (
            <div
              key={cancha.id}
              className="card cancha-card"
              onClick={() => { setSelectedCancha(cancha); setReservaExitosa(null); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                  {cancha.nombre}
                </h3>
                <span style={{
                  background: 'rgba(0,255,135,0.1)', color: 'var(--primary-color)',
                  padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap'
                }}>
                  {cancha.duracion || 1}h mín.
                </span>
              </div>
              {cancha.numeroCancha && (
                <p style={{ margin: '0 0 0.5rem 0', color: 'white', fontWeight: '600' }}>{cancha.numeroCancha}</p>
              )}
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>📍 {cancha.ubicacion}</p>
              {cancha.descripcion && (
                <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cancha.descripcion}</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                  ${cancha.precioHora?.toLocaleString('es-CO')}
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.8rem' }}>/hora</span>
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>👥 {cancha.capacidad} pers.</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Ver Horarios
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCancha && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
          <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
            {reservaExitosa ? (
              // Success screen
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>¡Reserva Confirmada!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tu reserva ha sido registrada exitosamente.</p>
                <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                  <p><strong>📍 Cancha:</strong> {selectedCancha.nombre} {selectedCancha.numeroCancha}</p>
                  <p style={{ marginTop: '0.5rem' }}><strong>📅 Fecha:</strong> {fecha}</p>
                  <p style={{ marginTop: '0.5rem' }}><strong>🕐 Horario:</strong> {reservaExitosa.horaInicio} – {reservaExitosa.horaFin}</p>
                  <p style={{ marginTop: '0.5rem' }}><strong>💰 Total:</strong> ${reservaExitosa.total}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={cerrarModal}>Cerrar</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setReservaExitosa(null)}>Otra Reserva</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>
                      {selectedCancha.nombre} {selectedCancha.numeroCancha && `– ${selectedCancha.numeroCancha}`}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                      📍 {selectedCancha.ubicacion} · ⏱ {selectedCancha.duracion || 1}h por reserva · 💰 ${(selectedCancha.precioHora * (selectedCancha.duracion || 1)).toLocaleString('es-CO')} total
                    </p>
                  </div>
                  <button onClick={cerrarModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>

                <div className="form-group">
                  <label className="form-label">📅 Selecciona la Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Horarios Disponibles</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Cada reserva tiene una duración de <strong style={{ color: 'white' }}>{selectedCancha.duracion || 1} hora(s)</strong>.
                    Los horarios en gris ya están ocupados.
                  </p>

                  {loadingReservas ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Consultando disponibilidad...</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                      {getSlots().map(({ hora, horaFin, ocupada }) => (
                        <button
                          key={hora}
                          onClick={() => !ocupada && !confirmando && handleReservar(hora)}
                          disabled={ocupada || confirmando}
                          style={{
                            padding: '0.75rem 0.5rem',
                            border: ocupada ? '1px solid var(--border-color)' : '1px solid var(--primary-color)',
                            borderRadius: '10px',
                            backgroundColor: ocupada ? 'rgba(255,255,255,0.03)' : 'rgba(0,255,135,0.08)',
                            color: ocupada ? 'var(--text-muted)' : 'var(--primary-color)',
                            cursor: ocupada || confirmando ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                            opacity: ocupada ? 0.5 : 1
                          }}
                          onMouseEnter={e => { if (!ocupada) e.currentTarget.style.backgroundColor = 'rgba(0,255,135,0.18)'; }}
                          onMouseLeave={e => { if (!ocupada) e.currentTarget.style.backgroundColor = 'rgba(0,255,135,0.08)'; }}
                        >
                          <div>{hora}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '400', marginTop: '0.2rem', color: ocupada ? 'var(--text-muted)' : 'rgba(0,255,135,0.7)' }}>
                            {ocupada ? '🔒 Ocupado' : `→ ${horaFin}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {confirmando && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                    ⏳ Confirmando tu reserva...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservar;
