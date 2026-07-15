FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY turbo.json ./

COPY apps/web/package*.json ./apps/web/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/utils/package*.json ./packages/utils/
COPY packages/config/package*.json ./packages/config/

RUN npm install

COPY . .

RUN npx turbo run build --filter=@tools-website/web

FROM node:18-alpine AS runner
WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/web/.next ./apps/web/.next
COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public
COPY --from=builder /usr/src/app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /usr/src/app/packages ./packages

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=@tools-website/web"]
