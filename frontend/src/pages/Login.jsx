import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(nombre, email, password);
    }

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger-color)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 'bold' }}
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
