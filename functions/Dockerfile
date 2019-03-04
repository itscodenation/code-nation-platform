FROM node:6

COPY package.json yarn.lock /app/functions/
WORKDIR /app
RUN yarn --cwd functions install --frozen-lockfile
COPY . /app/functions
