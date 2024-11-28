FROM node:18-alpine AS base
WORKDIR /app

# Copy package management files
COPY package.json yarn.lock* ./

# The --production=false flag ensures dev dependencies are installed
RUN yarn install

CMD ["yarn", "dev"]
