#!/bin/bash

if [ -z "$DOCKERHUB_USER" ]; then
    echo "Error: DOCKERHUB_USER environment variable is not set"
    exit 1
fi

if [ -z "$DOCKERHUB_TOKEN" ]; then
    echo "Error: DOCKERHUB_TOKEN environment variable is not set"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY environment variable is not set"
    exit 1
fi

if [ -z "$DB_HOST" ]; then
    echo "Error: DB_HOST environment variable is not set"
    exit 1
fi

if [ -z "$DB_PORT" ]; then
    echo "Error: DB_PORT environment variable is not set"
    exit 1
fi

if [ -z "$DB_USERNAME" ]; then
    echo "Error: DB_USERNAME environment variable is not set"
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD environment variable is not set"
    exit 1
fi

if [ -z "$DB_NAME" ]; then
    echo "Error: DB_NAME environment variable is not set"
    exit 1
fi

IMAGE_NAME="${DOCKERHUB_USER}/myaienglish-api-nestjs"
CONTAINER_NAME="myaienglish-api"
LOCAL_PORT=3003
DOCKER_PORT=3000

# Login to Docker Hub using the access token
echo "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USER" --password-stdin

# Stop and remove any running container with the same name
if docker ps -a --filter "name=${CONTAINER_NAME}" | grep -q "${CONTAINER_NAME}"; then
    echo "Stopping container ${CONTAINER_NAME}..."
    docker stop ${CONTAINER_NAME}
    echo "Removing container ${CONTAINER_NAME}..."
    docker rm ${CONTAINER_NAME}
fi

# Remove the existing image if it exists
if docker images | grep -q "$(echo $IMAGE_NAME | cut -d':' -f1)"; then
    echo "Removing image ${IMAGE_NAME}..."
    docker rmi ${IMAGE_NAME}
fi

# Pull the new image from Docker Hub
echo "Pulling image ${IMAGE_NAME}:latest..."
docker pull ${IMAGE_NAME}:latest

# Run a new container with the specified configuration
echo "Running new container ${CONTAINER_NAME}..."
docker run -d \
  -p ${LOCAL_PORT}:${DOCKER_PORT} \
  -e OPENAI_API_KEY="${OPENAI_API_KEY}" \
  -e DB_HOST="${DB_HOST}" \
  -e DB_PORT="${DB_PORT}" \
  -e DB_USERNAME="${DB_USERNAME}" \
  -e DB_PASSWORD="${DB_PASSWORD}" \
  -e DB_NAME="${DB_NAME}" \
  -e NODE_ENV="${NODE_ENV}" \
  --name ${CONTAINER_NAME} \
  ${IMAGE_NAME}:latest

echo "Container ${CONTAINER_NAME} started successfully!"
echo "Application is now accessible at port ${LOCAL_PORT}"
