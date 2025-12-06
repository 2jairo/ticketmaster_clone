./wait-for-it.sh mongo:27017 --timeout=60 --strict

npx prisma db push --skip-generate

ls

npm run startall