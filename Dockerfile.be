FROM node:20

WORKDIR /app

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./yarn.lock ./

RUN corepack enable
RUN yarn install

WORKDIR /app/packages/server

COPY ./packages/server .

RUN yarn install --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "start"]
