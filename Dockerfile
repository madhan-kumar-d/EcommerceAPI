# Stage 1
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only the build artifacts from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
