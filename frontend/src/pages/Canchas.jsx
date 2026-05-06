import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Canchas = () => {
  const { user } = useContext(AuthContext);
  const [canchas, setCanchas] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCancha, setCurrentCancha] = useState({
    nombre: '', numeroCancha: '', descripcion: '', precioHora: '', duracion: 1, capacidad: '', ubicacion: '', disponible: true, ownerId: ''
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

  const fetchOwners = async () => {
    try {
      const res = await api.get('/usuarios/owners');
      setOwners(res.data);
    } catch (error) {
      console.error('Error fetching owners', error);
    }
  };

  useEffect(() => {
    fetchCanchas();
    fetchOwners();
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
      setCurrentCancha({ nombre: '', numeroCancha: '', descripcion: '', precioHora: '', duracion: 1, capacidad: '', ubicacion: '', disponible: true, ownerId: '' });
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
    let defaultNombre = '';
    let defaultUbicacion = '';
    if (canchas && canchas.length > 0) {
      defaultNombre = canchas[0].nombre;
      defaultUbicacion = canchas[0].ubicacion;
    }
      setCurrentCancha({ 
      nombre: defaultNombre, 
      numeroCancha: '', 
      descripcion: '', 
      precioHora: '',
      duracion: 1, 
      capacidad: '', 
      ubicacion: defaultUbicacion, 
      disponible: true, 
      ownerId: '' 
    });
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
                <th>Lugar/Sede</th>
                <th>Número</th>
                <th>Ubicación</th>
                <th>Precio / Hora</th>
                <th>Duración (h)</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canchas.map(cancha => (
                <tr key={cancha.id}>
                  <td style={{ fontWeight: '600' }}>{cancha.nombre}</td>
                  <td>{cancha.numeroCancha || '-'}</td>
                  <td>{cancha.ubicacion}</td>
                  <td>${cancha.precioHora}</td>
                  <td>{cancha.duracion || 1} h</td>
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Lugar/Sede (Nombre)</label>
                  <input type="text" className="form-control" name="nombre" value={currentCancha.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Número o Nombre de Cancha</label>
                  <input type="text" className="form-control" name="numeroCancha" value={currentCancha.numeroCancha} onChange={handleChange} placeholder="Ej: Cancha 1, 6v6 A..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input type="text" className="form-control" name="descripcion" value={currentCancha.descripcion} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Precio ($)</label>
                  <input type="number" className="form-control" name="precioHora" value={currentCancha.precioHora} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Duración (Horas)</label>
                  <input type="number" className="form-control" name="duracion" value={currentCancha.duracion} onChange={handleChange} required min="1" max="10" />
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
              {user?.role !== 'OWNER' && (
                <div className="form-group">
                  <label className="form-label">Dueño de la Cancha</label>
                  <select className="form-control" name="ownerId" value={currentCancha.ownerId || ''} onChange={handleChange}>
                    <option value="">-- Seleccionar Dueño --</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id}>{owner.nombre} ({owner.email})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
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
