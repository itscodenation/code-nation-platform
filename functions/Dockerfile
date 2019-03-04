FROM node:6

COPY functions/package.json functions/yarn.lock /app/functions/
WORKDIR /app
RUN yarn --cwd functions install --frozen-lockfile
COPY . /app
