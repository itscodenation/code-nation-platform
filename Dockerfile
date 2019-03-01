FROM node:10

COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn install --frozen-lockfile
COPY . /app/

