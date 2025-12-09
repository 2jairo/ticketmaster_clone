#!/bin/sh

stripe listen \
  --forward-to http://admin-service:3001/webhook \
  --skip-verify \
  --api-key "$STRIPE_SK" \
  2>&1 | tee /shared/stripe-listen.log | while read line
do
  echo "$line" | grep -oE "whsec_[A-Za-z0-9]+" | while read secret
  do
    echo "Detected new webhook secret: $secret"
    echo "STRIPE_WHSEC=$secret" > /shared/.env.stripe
  done
done
