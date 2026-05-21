#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./docker-build.sh                        # uses .env (local)
#   ./docker-build.sh production             # uses .env.production
#   ./docker-build.sh .env.myenv             # uses custom env file
#   ./docker-build.sh -e KEY=VAL             # inline env override
#
# On VPS (after uploading the image):
#   docker load < ttl-website.tar.gz
#   docker run -d --restart unless-stopped -p 3000:3000 --name ttl-web ttl-website

ENV_FILE=".env"
TAG="ttl-website:latest"
OUTPUT="ttl-website.tar.gz"
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -e)
      EXTRA_ARGS+=("--build-arg" "$2")
      shift 2
      ;;
    -t)
      TAG="$2"
      shift 2
      ;;
    -o)
      OUTPUT="$2"
      shift 2
      ;;
    *)
      ENV_FILE="$1"
      shift
      ;;
  esac
done

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  echo ""
  echo "Available env files:"
  ls -1 .env* 2>/dev/null || echo "(none)"
  exit 1
fi

echo "==> Using env file: $ENV_FILE"
echo "==> Building image: $TAG"

BUILD_ARGS=()
while IFS='=' read -r key value; do
  if [[ -n "$key" && "$key" != "#"* ]]; then
    BUILD_ARGS+=("--build-arg" "$key=$value")
  fi
done < "$ENV_FILE"

docker build \
  "${BUILD_ARGS[@]}" \
  "${EXTRA_ARGS[@]}" \
  -t "$TAG" \
  .

echo ""
echo "==> Saving image to $OUTPUT ..."
docker save "$TAG" | gzip > "$OUTPUT"

echo ""
echo "==> Done!"
echo "    Image:  $TAG"
echo "    Saved:  $OUTPUT"
echo "    Size:   $(du -h "$OUTPUT" | cut -f1)"
echo ""
echo "==> Upload to VPS and run:"
echo "    scp $OUTPUT user@vps:/tmp/"
echo "    ssh user@vps 'docker load < /tmp/$OUTPUT && docker run -d --restart unless-stopped -p 3000:3000 --name ttl-web $TAG'"
