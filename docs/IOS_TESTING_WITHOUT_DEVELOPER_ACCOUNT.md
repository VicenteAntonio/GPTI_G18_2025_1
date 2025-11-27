# 📱 Testing en iOS SIN Cuenta de Apple Developer

Guía completa para probar tu app en iPhone **sin pagar los $99/año** de Apple Developer.

---

## ⚡ Método 1: Expo Go (Recomendado - 100% Gratis)

### ¿Qué es Expo Go?

Una app gratuita que te permite ejecutar apps React Native en tu iPhone sin necesidad de builds o cuenta de desarrollador.

### Pasos:

#### 1. Descargar Expo Go

- Ve al **App Store** en tu iPhone
- Busca "**Expo Go**"
- Descarga e instala (es gratis)

#### 2. Iniciar servidor de desarrollo

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1

# Iniciar servidor
npx expo start
```

#### 3. Conectar tu iPhone

**Opción A: QR Code** (Más fácil)
1. Se abrirá un QR en la terminal
2. Abre Expo Go en tu iPhone
3. Toca "Scan QR code"
4. Escanea el QR
5. ¡Tu app se cargará!

**Opción B: Link directo**
1. Ambos dispositivos en la misma WiFi
2. En Expo Go, toca "Enter URL manually"
3. Ingresa la URL que aparece en la terminal

**Opción C: Tunnel (Si opción A y B fallan)**
```bash
npx expo start --tunnel
```
Esto crea un túnel público que funciona incluso con diferentes redes.

### ✅ Ventajas de Expo Go:

- ✅ **Completamente gratis**
- ✅ Funciona en **dispositivo real**
- ✅ **Hot reload** (cambios instantáneos)
- ✅ Puedes probar en **múltiples dispositivos**
- ✅ **No requiere Mac**
- ✅ **Sin límite de tiempo**

### ❌ Limitaciones:

- ❌ No es una app independiente (corre dentro de Expo Go)
- ❌ No puedes probar notificaciones push **nativas** (las de Expo sí funcionan)
- ❌ Algunas librerías nativas avanzadas no funcionan
- ❌ No es una "instalación real"

### ¿Para qué sirve?

- ✅ Desarrollo y testing rápido
- ✅ Demostrar la app a clientes/usuarios
- ✅ Testing de UI/UX
- ✅ Validar funcionalidad básica
- ✅ Probar antes de invertir en cuenta Developer

---

## 🍎 Método 2: Apple Developer Free (Requiere Mac)

Apple permite desarrollo **gratuito** con limitaciones.

### Requisitos:

- **Mac** con macOS y Xcode instalado
- **Apple ID gratuito** (no necesitas pagar)
- **iPhone** con cable USB

### ⚠️ Limitaciones Importantes:

- ⏰ **Apps expiran en 7 días** (debes reinstalar semanalmente)
- 📱 Máximo **3 dispositivos** registrados
- 🚫 **No puedes distribuir** a otros
- 🚫 **No puedes usar TestFlight**
- 🚫 **No acceso a funcionalidades avanzadas** (Apple Pay, etc.)

### Pasos:

#### 1. Instalar Xcode en tu Mac

```bash
# Abrir Mac App Store
# Buscar "Xcode"
# Descargar (gratis pero ~15GB)
```

#### 2. Generar proyecto nativo

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1

# Esto genera carpetas ios/ y android/
npx expo prebuild
```

#### 3. Abrir en Xcode

```bash
# En tu Mac
cd ios
open MeditacionDiaria.xcworkspace
```

#### 4. Configurar Signing

En Xcode:
1. Selecciona tu proyecto en el panel izquierdo
2. Ve a "Signing & Capabilities"
3. **Team**: Selecciona tu Apple ID
4. **Bundle Identifier**: Debe ser único (ej: `com.tunombre.app`)
5. Xcode descargará certificados automáticamente

#### 5. Conectar iPhone

1. Conecta tu iPhone con cable USB
2. Desbloquea el iPhone
3. Si aparece "Trust this computer" → **Trust**
4. En Xcode, selecciona tu iPhone en el menú superior

#### 6. Build & Run

1. Presiona **Cmd+R** o el botón ▶️ 
2. Primera vez: "Untrusted Developer" en iPhone
3. En iPhone: Settings → General → VPN & Device Management
4. Confía en tu certificado
5. ¡App instalada!

#### 7. Reinstalar cada 7 días

Después de 7 días:
1. Conecta iPhone a Mac
2. Abre Xcode
3. Build & Run de nuevo (Cmd+R)

---

## 🎮 Método 3: Simulador iOS (Solo Mac)

Para testing sin dispositivo físico.

### Requisitos:
- **Mac** con Xcode

### Pasos:

```bash
# En tu Mac
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1

# Iniciar en simulador
npx expo start --ios
```

Esto:
1. Abrirá el simulador de iOS
2. Instalará tu app automáticamente
3. Ejecutará la app

### ✅ Ventajas:
- Gratis
- No necesita dispositivo físico
- Rápido para desarrollo

### ❌ Limitaciones:
- No es un dispositivo real
- No puedes probar hardware (cámara, GPS, touch, etc.)
- Puede haber diferencias con dispositivos reales

---

## 👥 Método 4: Pedir Prestada una Cuenta

Si conoces a alguien con cuenta de Apple Developer:

### Opción A: Cuenta Prestada

1. Esa persona te presta su cuenta temporalmente
2. Tú haces el build usando su cuenta
3. Instalas en tu dispositivo

**⚠️ No recomendado**: Requiere compartir credenciales.

### Opción B: TestFlight Compartido

1. La persona hace el build con su cuenta
2. Te agrega como **External Tester** en TestFlight
3. Recibes email de invitación
4. Descargas TestFlight desde App Store (gratis)
5. Instalas la app

**✅ Mejor opción**: No compartes credenciales, funciona como app real.

---

## 📊 ¿Cuál Método Elegir?

### Para Desarrollo Rápido → **Expo Go**
- Desarrollo día a día
- Iteración rápida
- Testing básico
- **Tiempo**: Inmediato
- **Costo**: Gratis

### Para Testing Pre-Productivo → **Xcode Free**
- Testing más "real"
- Cuando Expo Go no es suficiente
- Tienes Mac disponible
- **Tiempo**: 30 min setup, 7 días duración
- **Costo**: Gratis

### Para Testing Productivo Real → **Cuenta Developer**
- Testing profesional
- Distribución a testers
- Preparar para producción
- **Tiempo**: Ilimitado
- **Costo**: $99/año

---

## 🚀 Guía Rápida: Empezar en 2 Minutos

### En tu iPhone:

1. Abre **App Store**
2. Busca "**Expo Go**"
3. Descarga e instala

### En tu computadora:

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1
npx expo start
```

### Conectar:

1. Abre Expo Go en iPhone
2. Toca "Scan QR code"
3. Escanea el QR de la terminal
4. ¡Listo! 🎉

---

## 💡 Consejos y Tips

### Para Expo Go:

**Si el QR no funciona:**
```bash
# Usar tunnel (funciona siempre)
npx expo start --tunnel
```

**Ver en múltiples dispositivos:**
```bash
# Varios iPhones pueden escanear el mismo QR
npx expo start
```

**Compartir con otros:**
```bash
# Genera link público
npx expo start --tunnel
# Comparte la URL exp://... con otros
```

### Para Xcode Free:

**Cambiar Bundle ID:**
- Si `com.meditation.app` ya existe
- Usa `com.tunombre.meditation.app`

**Después de 7 días:**
- No necesitas desinstalar
- Solo vuelve a hacer Build & Run

**3 dispositivos máximo:**
- iPhone personal
- iPad
- iPhone de prueba

---

## ❓ Preguntas Frecuentes

### ¿Puedo publicar en App Store sin pagar?
**No.** Necesitas la cuenta de $99/año obligatoriamente.

### ¿Expo Go es seguro?
**Sí.** Es la app oficial de Expo, usada por millones de desarrolladores.

### ¿Los usuarios finales usan Expo Go?
**No.** Expo Go es solo para desarrollo. Para producción, necesitas hacer un build real (requiere cuenta Developer).

### ¿Puedo monetizar con Expo Go?
**No.** Es solo para desarrollo. Apps de producción requieren builds reales.

### ¿Cuánto tiempo puedo usar cada método?
- **Expo Go**: Ilimitado ✅
- **Xcode Free**: 7 días por instalación ⏰
- **Simulador**: Ilimitado ✅

---

## 🎯 Recomendación Final

### Si estás en **Fase de Desarrollo**:
→ Usa **Expo Go** (gratis, inmediato, perfecto para iterar)

### Si estás en **Fase de Testing Pre-Launch**:
→ Considera invertir en la **Cuenta Developer** ($99/año)
→ O usa **Xcode Free** si tienes Mac (reinstalar cada 7 días)

### Si vas a **Lanzar en App Store**:
→ **Necesitas** la cuenta Developer ($99/año), no hay forma de evitarlo

---

## 📱 Script Helper para Expo Go

Guarda esto como `scripts/start_expo.sh`:

```bash
#!/bin/bash

echo "🚀 Iniciando Expo para iPhone"
echo ""
echo "📱 Pasos:"
echo "1. Abre Expo Go en tu iPhone"
echo "2. Toca 'Scan QR code'"
echo "3. Escanea el QR que aparecerá abajo"
echo ""
echo "Si el QR no funciona, se generará un tunnel..."
echo ""

cd "$(dirname "$0")/.." || exit 1

# Intentar modo normal primero
npx expo start --ios
```

Hacer ejecutable:
```bash
chmod +x scripts/start_expo.sh
./scripts/start_expo.sh
```

---

## ✅ Checklist

**Antes de decidir pagar por Cuenta Developer:**

- [ ] Probado extensivamente con Expo Go
- [ ] App funciona correctamente
- [ ] UI/UX validado
- [ ] Testing con usuarios reales hecho
- [ ] Listo para lanzar en App Store
- [ ] Presupuesto de $99/año disponible

**Si todos están ✅, entonces invierte en la cuenta Developer.**

---

## 🔗 Enlaces Útiles

- [Expo Go - App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Documentación Expo Go](https://docs.expo.dev/get-started/expo-go/)
- [Apple Developer Free](https://developer.apple.com/support/compare-memberships/)
- [Xcode - Mac App Store](https://apps.apple.com/app/xcode/id497799835)

---

**¡Ahora puedes probar tu app en iPhone sin gastar dinero!** 📱✨


