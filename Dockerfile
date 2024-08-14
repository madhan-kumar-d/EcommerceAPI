# Stage 1
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only the build artifacts from the previous stage
COPY --from=build /app/build ./build

COPY --from=build /app/package*.json ./
COPY /prisma ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "run", "generate"] 
CMD ["npm", "run", "deploy"] 
CMD ["npm", "start"] 
