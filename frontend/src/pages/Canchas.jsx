import { useState, useEffect } from 'react';
import api from '../api/axios';

const Canchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCancha, setCurrentCancha] = useState({
    nombre: '', descripcion: '', precioHora: '', capacidad: '', ubicacion: '', disponible: true
  });

  const fetchCanchas = async () => {
    try {
      const res = await api.get('/canchas');
      setCanchas(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanchas();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCancha(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCancha.id) {
        await api.put(`/canchas/${currentCancha.id}`, currentCancha);
      } else {
        await api.post('/canchas', currentCancha);
      }
      setIsModalOpen(false);
      fetchCanchas();
      setCurrentCancha({ nombre: '', descripcion: '', precioHora: '', capacidad: '', ubicacion: '', disponible: true });
    } catch (error) {
      console.error(error);
      alert('Error al guardar la cancha');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cancha?')) {
      try {
        await api.delete(`/canchas/${id}`);
        fetchCanchas();
      } catch (error) {
        console.error(error);
        alert('Error al eliminar');
      }
    }
  };

  const openEditModal = (cancha) => {
    setCurrentCancha(cancha);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentCancha({ nombre: '', descripcion: '', precioHora: '', capacidad: '', ubicacion: '', disponible: true });
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>Gestión de Canchas</h1>
        <button className="btn btn-primary" onClick={openAddModal}>+ Nueva Cancha</button>
      </div>

      <div className="card table-container">
        {loading ? (
          <p>Cargando canchas...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Precio / Hora</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canchas.map(cancha => (
                <tr key={cancha.id}>
                  <td style={{ fontWeight: '600' }}>{cancha.nombre}</td>
                  <td>{cancha.ubicacion}</td>
                  <td>${cancha.precioHora}</td>
                  <td>{cancha.capacidad}</td>
                  <td>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: cancha.disponible ? 'rgba(0, 255, 135, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                      color: cancha.disponible ? 'var(--primary-color)' : 'var(--danger-color)'
                    }}>
                      {cancha.disponible ? 'Disponible' : 'No Disponible'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => openEditModal(cancha)}
                      style={{ background: 'none', border: 'none', color: '#4da6ff', cursor: 'pointer', marginRight: '1rem' }}>
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(cancha.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {canchas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay canchas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--primary-color)' }}>{currentCancha.id ? 'Editar Cancha' : 'Nueva Cancha'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="nombre" value={currentCancha.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input type="text" className="form-control" name="descripcion" value={currentCancha.descripcion} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Precio ($/Hora)</label>
                  <input type="number" className="form-control" name="precioHora" value={currentCancha.precioHora} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Capacidad</label>
                  <input type="number" className="form-control" name="capacidad" value={currentCancha.capacidad} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ubicación</label>
                <input type="text" className="form-control" name="ubicacion" value={currentCancha.ubicacion} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="disponible" checked={currentCancha.disponible} onChange={handleChange} />
                <label style={{ color: 'var(--text-muted)' }}>Disponible para reserva</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-danger" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canchas;
