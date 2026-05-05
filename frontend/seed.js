import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

async function seed() {
  try {
    console.log('Iniciando carga de datos de prueba...');
    let token;

    // Usuario 1 (Admin)
    try {
      const res = await api.post('/auth/register', { nombre: 'Administrador', email: 'admin@futreserve.com', password: 'password123' });
      token = res.data.token;
      console.log('✅ Usuario admin registrado: admin@futreserve.com / password123');
    } catch (e) {
      const res = await api.post('/auth/login', { email: 'admin@futreserve.com', password: 'password123' });
      token = res.data.token;
      console.log('✅ Usuario admin ya existía, inicio de sesión correcto.');
    }

    // Usuario 2 (Cliente)
    try {
      await api.post('/auth/register', { nombre: 'Esteban', email: 'esteban@futreserve.com', password: 'password123' });
      console.log('✅ Usuario cliente registrado: esteban@futreserve.com / password123');
    } catch (e) {
      console.log('✅ Usuario cliente ya existía.');
    }

    // Limpiar canchas actuales no lo haremos para no borrar datos del usuario si ya metio,
    // solo insertaremos si no existen las que vamos a insertar. (simplificado: insertamos directamente)

    const canchas = [
      { nombre: 'La titular', descripcion: 'Excelente cancha de grama sintética', precioHora: 50000, capacidad: 10, ubicacion: 'Norte' },
      { nombre: 'Cancha marte', descripcion: 'Cancha histórica y representativa', precioHora: 60000, capacidad: 14, ubicacion: 'Centro' },
      { nombre: 'Mi seleccion', descripcion: 'Grama de alta calidad', precioHora: 55000, capacidad: 10, ubicacion: 'Sur' },
      { nombre: 'Canchas la Salud', descripcion: 'Espacio familiar', precioHora: 45000, capacidad: 12, ubicacion: 'Oriente' },
      { nombre: 'La calavera', descripcion: 'Torneos nocturnos', precioHora: 40000, capacidad: 10, ubicacion: 'Occidente' },
      { nombre: 'Gigiomania', descripcion: 'Cancha totalmente techada', precioHora: 65000, capacidad: 10, ubicacion: 'Norte' },
      { nombre: 'Polvora', descripcion: 'Cancha popular', precioHora: 35000, capacidad: 10, ubicacion: 'Sur' },
      { nombre: 'Estadio UIS', descripcion: 'Cancha tamaño profesional', precioHora: 100000, capacidad: 22, ubicacion: 'UIS' }
    ];

    // Check existing
    const existing = await api.get('/canchas', { headers: { Authorization: `Bearer ${token}` } });
    const existingNames = existing.data.map(c => c.nombre);

    for (const cancha of canchas) {
      if (!existingNames.includes(cancha.nombre)) {
        try {
          await api.post('/canchas', cancha, { headers: { Authorization: `Bearer ${token}` } });
          console.log(`🏟️ Creada: ${cancha.nombre}`);
        } catch (e) {
          console.error(`❌ Error al crear: ${cancha.nombre}`, e.response?.data);
        }
      } else {
        console.log(`⚠️ Ya existe: ${cancha.nombre}`);
      }
    }
    console.log('✅ Carga de datos finalizada!');
  } catch (error) {
    console.error('Error durante la carga:', error);
  }
}

seed();
