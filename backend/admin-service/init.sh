./wait-for-it.sh mongo:27017 --timeout=60 --strict

# npm run prisma generate
npx prisma db push --skip-generate

npm run start