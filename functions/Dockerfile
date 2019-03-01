FROM node:6

COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn install --frozen-lockfile
COPY . /app/
