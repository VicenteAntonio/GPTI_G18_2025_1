# 📱 Android vs iOS: Comparación de Builds

Guía rápida comparando cómo crear tu app para Android (APK) vs iPhone (IPA).

## 🤖 Android (APK)

### Archivo de Salida
**APK** (Android Package Kit) o **AAB** (Android App Bundle)

### Comando Rápido
```bash
# APK (instalación directa)
npx eas build --platform android --profile preview

# AAB (para Google Play Store)
npx eas build --platform android --profile production
```

### Requisitos
- ✅ **Gratis** - No necesitas pagar
- ✅ Cuenta de Google Play Developer (solo si publicas en Play Store: $25 una vez)

### Instalación
```bash
# Después del build, descarga el APK
# Transfiere a tu Android y lo instalas directamente
```

### Publicación
- **Google Play Store**: $25 USD (pago único)
- **Proceso de revisión**: ~24-48 horas
- **Distribución directa**: Puedes distribuir el APK sin la tienda

---

## 🍎 iOS (IPA)

### Archivo de Salida
**IPA** (iOS App Store Package)

### Comando Rápido
```bash
# Para testing (TestFlight)
npx eas build --platform ios --profile preview

# Para App Store
npx eas build --platform ios --profile production
```

### Requisitos
- ⚠️ **$99 USD/año** - Cuenta de Apple Developer (OBLIGATORIO)
- No puedes instalar apps en iPhone sin esta cuenta

### Instalación
```bash
# No puedes instalar directamente un IPA en iPhone
# Debes usar TestFlight o publicar en App Store
```

### Publicación
- **App Store**: $99 USD/año (incluido en cuenta Developer)
- **Proceso de revisión**: ~24-72 horas
- **Distribución directa**: No permitida (solo TestFlight)

---

## 📊 Comparación Lado a Lado

| Característica | Android (APK) | iOS (IPA) |
|----------------|---------------|-----------|
| **Costo cuenta developer** | Gratis (Play: $25 único) | $99/año |
| **Instalación directa** | ✅ Sí | ❌ No |
| **Requiere Mac** | ❌ No | ❌ No (con EAS) |
| **Tiempo de build** | ~10-15 min | ~15-20 min |
| **Testing fácil** | ✅ Muy fácil | ⚠️ Requiere TestFlight |
| **Distribución sin tienda** | ✅ Sí | ❌ No |
| **Revisión de la tienda** | ~1-2 días | ~1-3 días |
| **Actualizaciones** | Rápidas | Requieren revisión |

---

## 🚀 Builds Combinados

Puedes hacer builds para **ambas plataformas simultáneamente**:

```bash
# Preview (testing)
npx eas build --platform all --profile preview

# Production (tiendas)
npx eas build --platform all --profile production
```

---

## 💡 Recomendaciones

### Para Desarrollo/Testing
1. **Android primero** - Más fácil de probar
2. **iOS después** - Cuando estés seguro de la app

### Para Producción
1. **Empieza con Android** - Más barato y rápido
2. **Agrega iOS** - Cuando tengas usuarios y presupuesto

### Si tienes presupuesto
- Publica en **ambas tiendas** para máxima audiencia
- iOS tiene usuarios con mayor poder adquisitivo
- Android tiene más cuota de mercado global

---

## 📝 Scripts Disponibles

### Android
```bash
# Build de preview
npx eas build --platform android --profile preview

# Build para Play Store
npx eas build --platform android --profile production
```

### iOS
```bash
# Usar script helper
./scripts/build_ios.sh

# O manualmente
npx eas build --platform ios --profile preview
npx eas build --platform ios --profile production
```

---

## 🎯 Flujo Recomendado

### Fase 1: Desarrollo
```bash
# Solo Android para probar rápido
npx expo start
# Prueba en Expo Go (Android)
```

### Fase 2: Testing Interno
```bash
# Build de preview para Android
npx eas build --platform android --profile preview
# Instala y prueba en dispositivos reales
```

### Fase 3: Beta Testing
```bash
# Build de preview para iOS
npx eas build --platform ios --profile preview
# Submit a TestFlight
npx eas submit --platform ios
# Invita beta testers
```

### Fase 4: Producción
```bash
# Build para ambas plataformas
npx eas build --platform all --profile production

# Submit a ambas tiendas
npx eas submit --platform android
npx eas submit --platform ios
```

---

## 💰 Costos Totales

### Solo Android
- **Desarrollo**: Gratis
- **Testing**: Gratis
- **Play Store**: $25 (pago único)
- **Total primer año**: $25

### Solo iOS
- **Desarrollo**: Gratis
- **Testing**: $99/año (cuenta Apple)
- **App Store**: Incluido
- **Total primer año**: $99

### Ambas Plataformas
- **Total primer año**: $124 ($25 + $99)
- **Años siguientes**: $99/año (solo Apple)

---

## 🔗 Enlaces Útiles

### Android
- [Google Play Console](https://play.google.com/console)
- [Guía de EAS Build Android](https://docs.expo.dev/build/setup/)

### iOS
- [Apple Developer Portal](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [TestFlight](https://developer.apple.com/testflight/)

### General
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Submit](https://docs.expo.dev/submit/introduction/)

---

## ✅ Checklist Completo

### Para Android
- [ ] Proyecto configurado
- [ ] `eas.json` creado
- [ ] Build APK generado
- [ ] APK probado en dispositivo
- [ ] (Opcional) Cuenta Google Play creada
- [ ] (Opcional) Publicado en Play Store

### Para iOS
- [ ] Cuenta Apple Developer activa ($99/año)
- [ ] Login en Expo
- [ ] Credenciales configuradas
- [ ] Build IPA generado
- [ ] Probado en TestFlight
- [ ] (Opcional) Publicado en App Store

---

**¡Ahora tienes toda la información para publicar en ambas plataformas!** 🚀📱

