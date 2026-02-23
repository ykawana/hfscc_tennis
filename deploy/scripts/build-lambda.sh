#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/back-end"
OUTPUT_DIR="${PROJECT_ROOT}/deploy/artifacts"

echo "=== Building Lambda function ==="

mkdir -p "${OUTPUT_DIR}"

cd "${BACKEND_DIR}"

echo "Running go build..."
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o "${OUTPUT_DIR}/bootstrap" ./cmd/...

echo "Creating deployment package..."
cd "${OUTPUT_DIR}"
zip -j handler.zip bootstrap
rm -f bootstrap

echo "=== Build complete: ${OUTPUT_DIR}/handler.zip ==="
