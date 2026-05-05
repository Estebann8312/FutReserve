import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ canchas: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/canchas');
        setStats({ canchas: response.data.length });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container">
      <h1 style={{ color: 'var(--primary-color)' }}>Bienvenido, {user.nombre}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Panel de control de FutReserve.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Canchas Registradas</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--primary-color)' }}>
            {stats.canchas}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
