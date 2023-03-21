FROM node:14-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG FIREBASE_VIEW
RUN FIREBASE_VIEW=$FIREBASE_VIEW npm run build

RUN npm prune --production

WORKDIR /usr/src/app

FROM node:14-alpine


WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/public ./public
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/app/.next ./.next
COPY --from=BUILD_IMAGE /usr/src/app/next.config.js ./next.config.js

EXPOSE 5555

CMD [ "npm", "start"]