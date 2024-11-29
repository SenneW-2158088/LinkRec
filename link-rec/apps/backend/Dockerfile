FROM node:20-alpine as development

WORKDIR /app

COPY ./package.json ./

RUN mkdir -p node_modules && chown -R node:node /app

USER node

RUN yarn install && yarn cache clean

EXPOSE 3030

CMD ["yarn", "dev"]

#########################################

FROM node:20-alpine AS builder

# Set up our working directory
WORKDIR /app

# Copy package.json first for better caching
COPY package.json tsconfig.json ./

RUN mkdir -p node_modules

RUN yarn install

# Copy all source files
COPY ./src ./src

RUN yarn build

#########################################

FROM node:20-alpine as production

WORKDIR /app

COPY --chown=node:node ./package.json ./

RUN mkdir -p node_modules && chown -R node:node /app

USER node

RUN yarn install && yarn cache clean

COPY --from=builder /app/dist ./dist

EXPOSE 3030

CMD ["yarn", "start"]
