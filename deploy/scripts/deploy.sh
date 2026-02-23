#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATES_DIR="${SCRIPT_DIR}/../templates"
PARAMS_DIR="${SCRIPT_DIR}/../params"

# Default values
ENVIRONMENT="${1:-dev}"
REGION="${2:-ap-northeast-1}"
PROJECT_NAME="hfscc-tennis"

echo "=== Deploying to ${ENVIRONMENT} (${REGION}) ==="

# Validate environment
if [[ "${ENVIRONMENT}" != "dev" && "${ENVIRONMENT}" != "prod" ]]; then
  echo "Error: Environment must be 'dev' or 'prod'"
  exit 1
fi

# Deploy templates in order
TEMPLATES=(
  "100_cfn_datastore_ap-northeast-1_template.yaml"
  "200_cfn_authentication_template.yaml"
  "300_cfn_api_template.yaml"
  "400_cfn_hosting_template.yaml"
)

for TEMPLATE in "${TEMPLATES[@]}"; do
  TEMPLATE_PATH="${TEMPLATES_DIR}/${TEMPLATE}"

  if [[ ! -f "${TEMPLATE_PATH}" ]]; then
    echo "Warning: ${TEMPLATE} not found, skipping..."
    continue
  fi

  # Extract stack name from template filename (e.g., 100_cfn_datastore -> hfscc-tennis-dev-datastore)
  STACK_SUFFIX=$(echo "${TEMPLATE}" | sed -E 's/^[0-9]+_cfn_([a-z]+)_.*/\1/')
  STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-${STACK_SUFFIX}"

  echo ""
  echo "--- Deploying ${STACK_NAME} ---"
  echo "Template: ${TEMPLATE}"

  PARAMS_FILE="${PARAMS_DIR}/${ENVIRONMENT}.json"

  PARAMS_OPTION=""
  if [[ -f "${PARAMS_FILE}" ]]; then
    PARAMS_OPTION="--parameter-overrides $(cat "${PARAMS_FILE}" | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"' | tr '\n' ' ')"
  fi

  aws cloudformation deploy \
    --template-file "${TEMPLATE_PATH}" \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --parameter-overrides \
      Environment="${ENVIRONMENT}" \
      ProjectName="${PROJECT_NAME}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    || { echo "Error deploying ${STACK_NAME}"; exit 1; }

  echo "--- ${STACK_NAME} deployed successfully ---"
done

echo ""
echo "=== All stacks deployed successfully ==="
