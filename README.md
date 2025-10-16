# Aplicación de Meditación Diaria

Una aplicación móvil desarrollada en React Native con TypeScript y Expo para sesiones de meditación guiada.

## 🚀 Inicio Rápido

### Usando el Script de Inicialización

```bash
# Ejecutar el script de inicialización automático
./scripts/init.sh

# O usar npm
npm run init
```

### Inicio Manual

```bash
# Instalar dependencias (si no se hizo automáticamente)
npm install

# Iniciar el servidor de desarrollo
npm start
```

## Características

- 🧘‍♀️ Sesiones de meditación por categorías
- 📊 Seguimiento de progreso y estadísticas
- 🎯 Sistema de rachas diarias
- 💾 Almacenamiento local del progreso
- 🎨 Interfaz moderna y fácil de usar

## Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **TypeScript** - Tipado estático para JavaScript
- **Expo** - Plataforma para desarrollo y despliegue
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Almacenamiento local de datos

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.tsx      # Componente de botón
│   └── MeditationCard.tsx # Tarjeta de sesión de meditación
├── screens/            # Pantallas de la aplicación
│   ├── HomeScreen.tsx  # Pantalla principal
│   ├── MeditationScreen.tsx # Pantalla de meditación
│   └── ProfileScreen.tsx   # Pantalla de perfil
├── services/           # Servicios y lógica de negocio
│   └── StorageService.ts   # Manejo del almacenamiento local
├── types/             # Definiciones de tipos TypeScript
│   └── index.ts       # Tipos de la aplicación
├── navigation/        # Configuración de navegación
│   └── AppNavigator.tsx # Navegador principal
├── constants/         # Constantes y datos estáticos
│   └── index.ts       # Categorías y sesiones de meditación
└── utils/             # Utilidades auxiliares
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

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web
- `npm run init` - Script de inicialización automático
- `./scripts/init.sh` - Script de inicialización en Linux/Mac
- `scripts\init.bat` - Script de inicialización en Windows

## Características de la Aplicación

### Pantalla Principal
- Saludo personalizado según la hora del día
- Estadísticas rápidas del progreso del usuario
- Categorías de meditación disponibles
- Lista de sesiones de meditación disponibles

### Pantalla de Meditación
- Reproductor de meditación con controles de play/pause
- Barra de progreso visual
- Información de la sesión actual
- Marcado automático de sesión completada

### Pantalla de Perfil
- Estadísticas detalladas del progreso
- Seguimiento de rachas diarias
- Categorías favoritas
- Sistema de logros
- Opción de reiniciar progreso

## Personalización

### Agregar Nuevas Sesiones
Edita el archivo `src/constants/index.ts` y agrega nuevas sesiones al array `MEDITATION_SESSIONS`.

### Modificar Categorías
Las categorías se definen en el mismo archivo en el array `MEDITATION_CATEGORIES`.

### Estilos y Tema
Los estilos están definidos en cada componente usando StyleSheet de React Native. Puedes modificar los colores, fuentes y espaciado según tus preferencias.

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

## Próximas Mejoras

- [ ] Integración con servicios de audio reales
- [ ] Notificaciones push para recordatorios
- [ ] Modo offline completo
- [ ] Sincronización en la nube
- [ ] Temas oscuro/claro
- [ ] Meditaciones personalizadas

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
