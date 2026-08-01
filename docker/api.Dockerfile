FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY turbo.json ./

COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/utils/package*.json ./packages/utils/
COPY packages/config/package*.json ./packages/config/
COPY database/package*.json ./database/

RUN npm install

COPY . .

RUN npx turbo run build --filter=@tools-website/api

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/database ./database

EXPOSE 5000
CMD ["npm", "run", "start", "--workspace=@tools-website/api"]
