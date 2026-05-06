import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(nombre, email, password, role);
    }

    setLoading(false);
    if (!result.success) {
      setError(typeof result.error === 'string' ? result.error : 'Error al procesar la solicitud');
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setNombre('');
    setRole('USER');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,135,0.08) 0%, transparent 60%), var(--bg-color)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 1.5rem' }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚽</div>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '2rem', margin: 0 }}>FutReserve</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta gratis'}
          </p>
        </div>

        <div className="card" style={{ border: '1px solid rgba(0,255,135,0.15)', boxShadow: '0 0 40px rgba(0,255,135,0.05)' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1, padding: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: '600',
                backgroundColor: isLogin ? 'var(--primary-color)' : 'transparent',
                color: isLogin ? '#000' : 'var(--text-muted)',
                transition: 'all 0.3s ease'
              }}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1, padding: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: '600',
                backgroundColor: !isLogin ? 'var(--primary-color)' : 'transparent',
                color: !isLogin ? '#000' : 'var(--text-muted)',
                transition: 'all 0.3s ease'
              }}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: 'rgba(255, 71, 87, 0.1)', 
              color: 'var(--danger-color)', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem', 
              border: '1px solid rgba(255,71,87,0.3)',
              fontSize: '0.9rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder={isLogin ? '••••••••' : 'Mínimo 6 caracteres'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">¿Cómo quieres usar FutReserve?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                      padding: '1rem', borderRadius: '10px', cursor: 'pointer',
                      border: `2px solid ${role === 'USER' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      backgroundColor: role === 'USER' ? 'rgba(0,255,135,0.07)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input type="radio" name="role" value="USER" checked={role === 'USER'} onChange={() => setRole('USER')} style={{ display: 'none' }} />
                    <span style={{ fontSize: '1.8rem' }}>🏃</span>
                    <span style={{ fontWeight: '600', color: role === 'USER' ? 'var(--primary-color)' : 'var(--text-color)', fontSize: '0.9rem' }}>
                      Quiero reservar
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Cliente / Jugador
                    </span>
                  </label>
                  <label
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                      padding: '1rem', borderRadius: '10px', cursor: 'pointer',
                      border: `2px solid ${role === 'OWNER' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      backgroundColor: role === 'OWNER' ? 'rgba(0,255,135,0.07)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input type="radio" name="role" value="OWNER" checked={role === 'OWNER'} onChange={() => setRole('OWNER')} style={{ display: 'none' }} />
                    <span style={{ fontSize: '1.8rem' }}>🏟️</span>
                    <span style={{ fontWeight: '600', color: role === 'OWNER' ? 'var(--primary-color)' : 'var(--text-color)', fontSize: '0.9rem' }}>
                      Tengo una cancha
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Dueño / Propietario
                    </span>
                  </label>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? '⏳ Procesando...' : isLogin ? 'Ingresar →' : 'Crear cuenta →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            onClick={switchMode}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
          >
            {isLogin ? 'Regístrate gratis' : 'Inicia Sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
