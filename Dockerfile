# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG BUN_VERSION=1.2.2

################################################################################
# Use bun image for base image for all stages.
FROM oven/bun:${BUN_VERSION} AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.bun to speed up subsequent builds.
# Leverage bind mounts to package.json and bun.lockb to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun \
    bun install --production

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun \
    bun install

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN bun run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production bun environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER bun

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 3333

# Run the application.
ENTRYPOINT ["bun", "start"]
