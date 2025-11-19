# Aplicación de Meditación Diaria

Una aplicación móvil desarrollada en React Native con TypeScript y Expo para sesiones de meditación guiada.

## 🚀 Inicio Rápido

⚠️ **IMPORTANTE**: Si la app se queda cargando infinitamente, consulta [`INSTRUCCIONES_EJECUCION.md`](./docs/INSTRUCCIONES_EJECUCION.md)

💡 **PARA DESARROLLO**: Ver [QUICK_SETUP.md](./QUICK_SETUP.md) para atajos y herramientas útiles

🔐 **ACCESO ADMIN**: Ver [ADMIN_QUICK_GUIDE.md](./ADMIN_QUICK_GUIDE.md) para credenciales y DevTools

### Pasos para Ejecutar

```bash
# 1. Limpiar instalación anterior (si existe)
rm -rf node_modules package-lock.json

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor con caché limpio
npm start
```

### Usando el Script de Inicialización

```bash
# Ejecutar el script de inicialización automático
./scripts/init.sh

# O usar npm
npm run init
```

## Características

### Funcionalidades Principales
- 🔐 Sistema de autenticación (login/registro)
- 👤 Sistema de roles (usuarios y administradores)
- 🛠️ Panel de administración (DevTools) para gestión de BD
- 🧘‍♀️ 3 categorías de meditación: Sueño, Relajación, Autoconciencia
- 🎵 Audios generados con IA (ElevenLabs)
- ▶️ Reproductor con auto-inicio y pause/resume
- 📊 Seguimiento de progreso y estadísticas sincronizadas
- 🎯 Sistema de rachas basado en fechas (reseteo automático después de 2+ días)
- 🦋 Sistema de puntos (betterflies) con fórmula: `floor(minutos) × 2 + floor(racha / 3) + 1`
- 💾 Base de datos local con AsyncStorage
- 🎨 Interfaz moderna con animaciones y diseño intuitivo
- 📈 Categoría favorita con desglose visual por tipo

### Base de Datos
- 👤 **Usuarios**: username, email, password, rachas, progreso, betterflies, estadísticas
- 📚 **Lecciones**: tipo, nombre, ID, tiempo, audio
- 🔐 **Sesiones**: autenticación y persistencia de login

Ver documentación completa en [`BASE_DE_DATOS.md`](./docs/BASE_DE_DATOS.md)

## Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **TypeScript** - Tipado estático para JavaScript
- **Expo** - Plataforma para desarrollo y despliegue
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Almacenamiento local de datos

## Estructura del Proyecto

```
GPTI_G18_2025_1/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.tsx       # Componente de botón
│   │   └── MeditationCard.tsx # Tarjeta de sesión de meditación
│   ├── screens/             # Pantallas de la aplicación
│   │   ├── SplashScreen.tsx     # Animación de inicio
│   │   ├── LoginScreen.tsx      # Pantalla de login
│   │   ├── RegisterScreen.tsx   # Pantalla de registro
│   │   ├── HomeScreen.tsx       # Pantalla principal
│   │   ├── MeditationScreen.tsx # Pantalla de meditación
│   │   └── ProfileScreen.tsx    # Pantalla de perfil
│   ├── services/            # Servicios y lógica de negocio
│   │   ├── AuthService.ts       # Autenticación y sesiones
│   │   ├── DatabaseService.ts   # Gestión de datos (usuarios y lecciones)
│   │   └── StorageService.ts    # Legacy storage
│   ├── types/              # Definiciones de tipos TypeScript
│   │   └── index.ts        # User, Lesson, AuthSession, etc.
│   ├── navigation/         # Configuración de navegación
│   │   └── AppNavigator.tsx # Navegador con tabs y stack
│   └── constants/          # Constantes y datos estáticos
│       └── index.ts        # Categorías (3) y sesiones (3)
├── docs/                   # Documentación del proyecto
│   ├── BASE_DE_DATOS.md         # Esquema y lógica de BD
│   └── INSTRUCCIONES_EJECUCION.md # Guía de instalación
├── scripts/                # Scripts de automatización
│   ├── init.sh             # Inicialización (Linux/Mac)
│   ├── clean_start.sh      # Limpieza completa e inicio
│   ├── generate_audio.py   # Generador de pistas de audio
│   ├── meditation_scripts.py # Textos de meditación
│   ├── requirements.txt    # Dependencias Python
│   └── README_AUDIO.md     # Documentación de audio
├── assets/                 # Recursos multimedia
│   ├── splash.png          # Logo de la aplicación
│   ├── Betterflie.png      # Icono de betterflies
│   └── audio/              # Pistas de audio generadas por IA
│       ├── sleep-test.mp3
│       ├── relaxation-morning.mp3
│       └── selfawareness-mindful.mp3
├── App.tsx                 # Punto de entrada principal
├── package.json            # Dependencias y scripts
├── changelog.md            # Registro de cambios
└── README.md               # Este archivo
```

## 📱 Uso con Expo Go

1. **Instala la aplicación Expo Go** en tu dispositivo móvil desde:
   - App Store (iOS)
   - Google Play Store (Android)

2. **Ejecuta el script de inicialización:**
   ```bash
   ./scripts/init.sh
   ```
   O manualmente:
   ```bash
   npm start
   ```

3. **Conecta tu dispositivo:**
   - Asegúrate de estar en la misma red WiFi que tu computadora
   - Escanea el código QR que aparece en la terminal
   - La aplicación se abrirá automáticamente en tu dispositivo

## 🎮 Plataformas Soportadas

- **iOS**: iPhone y iPad (usando Expo Go o simulador)
- **Android**: Teléfonos y tablets (usando Expo Go o emulador)
- **Web**: Navegador web moderno

## 🛠️ Scripts Disponibles

### Scripts de Desarrollo
- `npm start` - Inicia el servidor de desarrollo
- `npm run start:lan` - Inicia con LAN (recomendado para móvil)
- `npm run start:tunnel` - Inicia con tunnel (si LAN no funciona)
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web
- `./scripts/clean_start.sh` - Limpieza completa e inicio desde cero

### Scripts de Audio (ElevenLabs)
- `npm run generate-audio` - Genera las pistas de audio con IA
- `npm run test-audio` - Prueba que los archivos de audio existen
- `npm run regenerate-audio` - Regenera todos los audios (bash script completo)

### Scripts de Administración
- `npm run admin-info` - Muestra credenciales del usuario administrador

Ver más comandos y opciones en [`INSTRUCCIONES_EJECUCION.md`](./docs/INSTRUCCIONES_EJECUCION.md)

## Características de la Aplicación

### Splash Screen
- Animación de fade-in secuencial
- Logo de la aplicación
- Transición suave a login o app principal

### Pantallas de Autenticación
- **Login**: Email y contraseña con validación
- **Registro**: Crear cuenta con username, email y contraseña
- Persistencia de sesión con AsyncStorage
- Verificación automática de racha al iniciar sesión

### Pantalla Principal (Home)
- Saludo personalizado según la hora del día
- Estadísticas en tiempo real (sesiones, minutos, racha)
- 3 categorías de meditación con colores diferenciados
- 3 sesiones disponibles (una por categoría)
- Pull-to-refresh para actualizar datos

### Pantalla de Meditación
- Auto-inicio de sesión al abrir
- Reproductor con controles de play/pause (cambia de color)
- Timer visual en dos líneas (tiempo actual / duración total)
- Confirmación antes de salir sin completar
- Resumen al finalizar con betterflies ganadas y racha

### Pantalla de Perfil
- Información del usuario (username, email)
- Display de betterflies con icono personalizado
- Estadísticas detalladas (sesiones, minutos, rachas)
- **Tipo de sesión favorito** con desglose visual
- Breakdown por categoría (Sueño, Relajación, Autoconciencia)
- Botón de cerrar sesión con confirmación
- Sistema de logros (comentado, pendiente de implementación)

## Personalización

### Agregar Nuevas Sesiones
Edita el archivo `src/constants/index.ts` y agrega nuevas sesiones al array `MEDITATION_SESSIONS`.

### Modificar Categorías
Las categorías se definen en el mismo archivo en el array `MEDITATION_CATEGORIES`.

### Estilos y Tema
Los estilos están definidos en cada componente usando StyleSheet de React Native. Puedes modificar los colores, fuentes y espaciado según tus preferencias.

## 🎵 Generación de Pistas de Audio

Las pistas de audio se generan usando **ElevenLabs AI** para crear meditaciones guiadas de alta calidad.

### Pistas Disponibles

1. **Sueño Rápido** (`sleep-test.mp3`) - ~12 segundos - Sesión de prueba
2. **Relajación Matutina** (`relaxation-morning.mp3`) - ~1.6 minutos
3. **Consciencia Plena** (`selfawareness-mindful.mp3`) - ~1.9 minutos

### Regenerar los Audios

Si necesitas regenerar las pistas de audio:

```bash
# 1. Asegúrate de tener Python 3.7+ instalado
python3 --version

# 2. Instala las dependencias
pip3 install -r scripts/requirements.txt

# 3. Configura la API key de ElevenLabs en .env
echo "ELEVENLABS_API_KEY=tu_api_key_aqui" > .env

# 4. Genera los audios
python3 scripts/generate_audio.py
```

Los archivos se generarán en `assets/audio/`.

### Personalizar los Textos de Meditación

Para modificar los textos de las meditaciones guiadas:

1. Edita `scripts/meditation_scripts.py`
2. Modifica el contenido en el diccionario `MEDITATION_TEXTS`
3. Ejecuta `python3 scripts/generate_audio.py` para regenerar

📖 **Documentación completa**: [`AUDIO_GENERATION.md`](./docs/AUDIO_GENERATION.md)

## Desarrollo

### Scripts Disponibles
- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web

### Convenciones de Código
- Usa TypeScript para tipado estático
- Sigue la estructura de carpetas establecida
- Usa componentes funcionales con hooks
- Implementa manejo de errores apropiado

## 📚 Documentación

- **[BASE_DE_DATOS.md](./docs/BASE_DE_DATOS.md)** - Documentación de la base de datos
- **[DATABASE_MANAGEMENT.md](./docs/DATABASE_MANAGEMENT.md)** - Gestión y limpieza de base de datos
- **[ADMIN_SYSTEM.md](./docs/ADMIN_SYSTEM.md)** - Sistema de roles y administración
- **[INSTRUCCIONES_EJECUCION.md](./docs/INSTRUCCIONES_EJECUCION.md)** - Troubleshooting y ejecución
- **[AUDIO_GENERATION.md](./docs/AUDIO_GENERATION.md)** - Generación de pistas de audio con IA

## Próximas Mejoras

- [ ] Onboarding de usuarios 
- [ ] Control de volumen
- [ ] Notificaciones push para recordatorios
- [ ] Temas oscuro/claro
- [ ] Exportar/importar datos
- [ ] Ranking de usuarios
- [ ] Acceso directo a chatbots de Telegram 
- [ ] Optimización de rendimiento general de la aplicación

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request