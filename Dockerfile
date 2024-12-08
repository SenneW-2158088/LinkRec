FROM node:20-alpine as development

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3030

CMD ["yarn", "backend-dev"]

#########################################

FROM node:20-alpine AS builder

# Set up our working directory
WORKDIR /app

COPY . .

RUN yarn install

RUN yarn backend-build

#########################################

FROM node:20-alpine as production

WORKDIR /app

COPY . .

RUN yarn install && yarn cache clean

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3030

CMD ["yarn", "backend-start"]
