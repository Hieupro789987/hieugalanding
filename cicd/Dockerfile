#  -------- package json preprocessor --------
# To prevent cache invalidation from changes in fields other than dependencies
FROM endeveit/docker-jq AS DEPS

COPY package.json package-lock.json /tmp/

RUN jq '{ dependencies, devDependencies }' < /tmp/package.json > /tmp/deps.json
RUN jq '{ name, lockfileVersion, requires, dependencies }' < /tmp/package-lock.json > /tmp/deps-lock.json



#  -------- base image with production package only --------
FROM node:14-alpine AS BASE_IMAGE

WORKDIR /usr/src/app

COPY --from=DEPS /tmp/deps.json ./package.json
COPY --from=DEPS /tmp/deps-lock.json ./package-lock.json

RUN npm ci --production --silent 



#  -------- build image with all package --------
FROM BASE_IMAGE as BUILD_IMAGE

WORKDIR /usr/src/app

# install dev package only
RUN npm ci -D --silent 

COPY . .

ARG FIREBASE_VIEW
RUN FIREBASE_VIEW=$FIREBASE_VIEW npm run build



#  -------- production image --------
FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/app/public ./public
COPY --from=BUILD_IMAGE /usr/src/app/next.config.js ./next.config.js
COPY --from=BUILD_IMAGE /usr/src/app/.next ./.next


EXPOSE 5555

CMD [ "npm", "start"]