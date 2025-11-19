# 1. Limpiar todo
rm -rf node_modules package-lock.json .expo android ios
rm -rf node_modules/.cache

# 2. Reinstalar con versiones correctas de SDK 54
npm install --legacy-peer-deps

# 3. Iniciar (usa --lan si --tunnel da problemas de red)
npx expo start --tunnel --clear