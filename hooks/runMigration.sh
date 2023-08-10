#!/bin/bash
STAGE=$1
URL=$2
MIGRATION_KEY=$3


ALLOWED_STAGES=('prod' 'dev')

if [[ ! " ${ALLOWED_STAGES[@]} " =~ " ${STAGE} " ]]; then
  echo "NOT RUNNING MIGRATIONS FOR STAGE \"${STAGE}\""

  exit 0
fi

echo "RUNNING MIGRATIONS FOR STAGE \"${STAGE}\""

curl -f -X POST "${URL}/deploy/migrations" -H "x-deploy-migrations-key: ${MIGRATION_KEY}"
