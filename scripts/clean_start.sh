# 1. Limpiar todo
rm -rf node_modules package-lock.json .expo android ios

# 2. Reinstalar con versiones correctas de SDK 54
npm install --legacy-peer-deps

# 3. Iniciar
npx expo start --tunnel --clear