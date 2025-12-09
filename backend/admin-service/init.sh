./wait-for-it.sh mongo:27017 --timeout=60 --strict

# npm run prisma generate
npx prisma db push --skip-generate

# Wait for Stripe webhook secret to be configured
while ! grep -q "^STRIPE_WHSEC=" /app/.env.stripe 2>/dev/null; do
    echo "Waiting for STRIPE_WHSEC to be configured..."
    sleep 1
done

npm run start