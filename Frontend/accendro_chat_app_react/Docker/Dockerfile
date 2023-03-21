# Base image
FROM node:14-alpine

RUN apk update && apk add python3 make g++

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
# COPY package-lock.json /app
COPY package*.json /app
COPY .babelrc /app
COPY preprocess-css.js /app
COPY webpack.config.js /app

# Install dependencies
RUN apk add --no-cache python3
RUN npm install -g npm@9.5.0
RUN npm install --force

# Copy the remaining app files
RUN mkdir /app/src
COPY ./src /app/src

RUN mkdir ./public
COPY ./public /app/public

EXPOSE 3000

# RUN npm install -g websocket
# RUN npm start
# Set the start command
CMD npm up -g && npm start