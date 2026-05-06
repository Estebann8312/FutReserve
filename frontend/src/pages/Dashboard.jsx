import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

// ── Helpers ────────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, accent = false, sub }) => (
  <div className="card" style={{
    borderLeft: `4px solid ${accent ? 'var(--primary-color)' : 'var(--border-color)'}`,
    display: 'flex', flexDirection: 'column', gap: '0.25rem'
  }}>
    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</p>
    <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: accent ? 'var(--primary-color)' : 'white' }}>
      {value}
    </p>
    {sub && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{sub}</p>}
  </div>
);

const ReservaRow = ({ reserva, canchas }) => {
  const cancha = canchas?.find(c => c.id === reserva.canchaId);
  const nombreCancha = cancha
    ? `${cancha.nombre}${cancha.numeroCancha ? ' – ' + cancha.numeroCancha : ''}`
    : reserva.canchaId;

  const estadoColor = {
    CONFIRMADA: 'var(--primary-color)',
    PENDIENTE: '#f0a500',
    CANCELADA: 'var(--danger-color)',
  }[reserva.estado] || 'var(--text-muted)';

  return (
    <tr>
      <td style={{ fontWeight: '600' }}>{nombreCancha}</td>
      <td>{reserva.fecha}</td>
      <td>{reserva.horaInicio} – {reserva.horaFin}</td>
      <td>
        <span style={{
          padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600',
          backgroundColor: `${estadoColor}18`, color: estadoColor
        }}>{reserva.estado}</span>
      </td>
      <td>${reserva.total?.toLocaleString('es-CO')}</td>
    </tr>
  );
};

// ── Dashboard Admin ─────────────────────────────────────────────────────────────

const DashboardAdmin = ({ user, stats }) => (
  <>
    <div style={{ marginBottom: '2rem' }}>
      <h1 style={{ margin: 0 }}>👋 Hola, <span style={{ color: 'var(--primary-color)' }}>{user.nombre}</span></h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Panel de Administración — Vista global del sistema</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
      <StatCard icon="🏟️" label="Canchas registradas"  value={stats.totalCanchas ?? '–'} accent />
      <StatCard icon="📋" label="Reservas totales"     value={stats.totalReservas ?? '–'} accent />
      <StatCard icon="👥" label="Usuarios (clientes)"  value={stats.totalClientes ?? '–'} />
      <StatCard icon="🔑" label="Dueños de cancha"     value={stats.totalOwners ?? '–'} />
      <StatCard icon="👤" label="Total usuarios"       value={stats.totalUsuarios ?? '–'} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Canchas */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Canchas</h3>
          <Link to="/canchas" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', textDecoration: 'none' }}>Gestionar →</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: 'var(--text-muted)', paddingBottom: '0.5rem', fontWeight: '500' }}>Nombre</th>
              <th style={{ textAlign: 'left', color: 'var(--text-muted)', paddingBottom: '0.5rem', fontWeight: '500' }}>Duración</th>
              <th style={{ textAlign: 'left', color: 'var(--text-muted)', paddingBottom: '0.5rem', fontWeight: '500' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {(stats.canchas || []).map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{c.nombre} {c.numeroCancha && `– ${c.numeroCancha}`}</td>
                <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>{c.duracion || 1}h</td>
                <td style={{ padding: '0.5rem 0' }}>
                  <span style={{ color: c.disponible ? 'var(--primary-color)' : 'var(--danger-color)', fontSize: '0.8rem' }}>
                    {c.disponible ? '● Activa' : '● Inactiva'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Últimas reservas */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Últimas Reservas</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{(stats.reservas || []).length} total</span>
        </div>
        {(stats.reservas || []).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Sin reservas aún</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: 'var(--text-muted)', paddingBottom: '0.5rem', fontWeight: '500' }}>Cancha</th>
                <th style={{ textAlign: 'left', color: 'var(--text-muted)', paddingBottom: '0.5rem', fontWeight: '500' }}>Fecha</th>
                <th style={{ textAlign: 'left', color: 'var(--text-muted)', paddingBottom: '0.5rem', fontWeight: '500' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {[...(stats.reservas || [])].reverse().slice(0, 8).map(r => {
                const cancha = (stats.canchas || []).find(c => c.id === r.canchaId);
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem 0' }}>{cancha?.nombre || '–'}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>{r.fecha}</td>
                    <td style={{ padding: '0.5rem 0' }}>
                      <span style={{ color: r.estado === 'CONFIRMADA' ? 'var(--primary-color)' : '#f0a500', fontSize: '0.78rem' }}>
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </>
);

// ── Dashboard Owner ─────────────────────────────────────────────────────────────

const DashboardOwner = ({ user, stats }) => {
  const ingresos = (stats.reservas || []).reduce((sum, r) => sum + (r.total || 0), 0);
  const confirmadas = (stats.reservas || []).filter(r => r.estado === 'CONFIRMADA').length;

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>🏟️ Hola, <span style={{ color: 'var(--primary-color)' }}>{user.nombre}</span></h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Panel de Dueño — Resumen de tus canchas y reservas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard icon="🏟️" label="Mis canchas"         value={stats.totalCanchas ?? '–'} accent />
        <StatCard icon="📋" label="Reservas recibidas"  value={stats.totalReservas ?? '–'} accent />
        <StatCard icon="✅" label="Confirmadas"          value={confirmadas} sub="reservas activas" />
        <StatCard icon="💰" label="Ingresos estimados"   value={`$${ingresos.toLocaleString('es-CO')}`} sub="total acumulado" />
      </div>

      {/* Mis canchas */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Mis Canchas</h3>
          <Link to="/canchas" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', textDecoration: 'none' }}>Administrar →</Link>
        </div>
        {(stats.canchas || []).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aún no tienes canchas asignadas</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {(stats.canchas || []).map(c => (
              <div key={c.id} style={{
                padding: '1rem', borderRadius: '10px',
                border: `1px solid ${c.disponible ? 'rgba(0,255,135,0.2)' : 'var(--border-color)'}`,
                background: c.disponible ? 'rgba(0,255,135,0.04)' : 'transparent'
              }}>
                <p style={{ margin: '0 0 0.25rem', fontWeight: '700' }}>{c.nombre}</p>
                {c.numeroCancha && <p style={{ margin: '0 0 0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.numeroCancha}</p>}
                <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {c.ubicacion} · ⏱ {c.duracion || 1}h · 💰 ${c.precioHora?.toLocaleString('es-CO')}/h</p>
                <span style={{ fontSize: '0.78rem', color: c.disponible ? 'var(--primary-color)' : 'var(--danger-color)' }}>
                  {c.disponible ? '● Disponible' : '● No disponible'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservas recibidas */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Reservas Recibidas</h3>
        {(stats.reservas || []).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aún no hay reservas en tus canchas</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cancha</th><th>Fecha</th><th>Horario</th><th>Estado</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {[...(stats.reservas || [])].reverse().map(r => (
                  <ReservaRow key={r.id} reserva={r} canchas={stats.canchas} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

// ── Dashboard User ──────────────────────────────────────────────────────────────

const DashboardUser = ({ user, stats }) => {
  const proximas = (stats.reservas || []).filter(r =>
    r.estado === 'CONFIRMADA' && new Date(`${r.fecha}T${r.horaInicio}`) >= new Date()
  );
  const pasadas = (stats.reservas || []).filter(r =>
    r.estado !== 'CANCELADA' && new Date(`${r.fecha}T${r.horaInicio}`) < new Date()
  );

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>⚽ Hola, <span style={{ color: 'var(--primary-color)' }}>{user.nombre}</span></h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Aquí tienes el resumen de tus reservas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard icon="📋" label="Total reservas"    value={stats.totalReservas ?? '–'} accent />
        <StatCard icon="⏳" label="Próximas reservas" value={proximas.length} accent sub="pendientes de jugar" />
        <StatCard icon="✅" label="Partidos jugados"  value={pasadas.length} sub="reservas completadas" />
        <StatCard icon="🏟️" label="Canchas disponibles" value={stats.totalCanchas ?? '–'} sub="en el sistema" />
      </div>

      {/* Próxima reserva destacada */}
      {proximas.length > 0 && (() => {
        const next = proximas[0];
        return (
          <div className="card" style={{
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--primary-color)',
            background: 'linear-gradient(135deg, rgba(0,255,135,0.06) 0%, transparent 60%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>📅 PRÓXIMA RESERVA</p>
                <h2 style={{ margin: '0 0 0.25rem', color: 'var(--primary-color)' }}>{next.fecha}</h2>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>🕐 {next.horaInicio} – {next.horaFin}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total a pagar</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  ${next.total?.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Historial */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Mis Reservas</h3>
          <Link to="/reservar" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            + Nueva Reserva
          </Link>
        </div>
        {(stats.reservas || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏟️</div>
            <p style={{ marginBottom: '1rem' }}>Aún no tienes reservas</p>
            <Link to="/reservar" className="btn btn-primary">Reservar ahora</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Cancha</th><th>Fecha</th><th>Horario</th><th>Estado</th><th>Total</th></tr>
              </thead>
              <tbody>
                {[...(stats.reservas || [])].reverse().map(r => (
                  <ReservaRow key={r.id} reserva={r} canchas={[]} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

// ── Main Dashboard ──────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/usuarios/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '5rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
      <p>Cargando tu panel...</p>
    </div>
  );

  return (
    <div className="container">
      {user?.role === 'ADMIN' && <DashboardAdmin user={user} stats={stats} />}
      {user?.role === 'OWNER' && <DashboardOwner user={user} stats={stats} />}
      {user?.role === 'USER'  && <DashboardUser  user={user} stats={stats} />}
      {!user?.role && <DashboardUser user={user} stats={stats} />}
    </div>
  );
};

export default Dashboard;
