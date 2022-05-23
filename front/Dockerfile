###########
# BUILDER #
###########

# pull official base image
FROM node:16.15-alpine3.14 as builder

# set work directory
WORKDIR /usr/src/app

# install dependencies and avoid `node-gyp rebuild` errors
COPY ./react_app/package.json .
RUN npm install -g npm --silent
RUN npm install --silent

# copy our react project
COPY ./react_app .

#########
# FINAL #
#########

# pull official base image
FROM node:16.15-alpine3.14

# set work directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .