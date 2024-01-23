# use node 20 alpine image as build image
FROM node:20-alpine as builder

# create work directory in app folder
WORKDIR /app

# install required packages for node image
RUN apk --no-cache add openssh g++ make python3 git

# copy over package.json files
COPY package.json /app/
COPY yarn.lock /app/

# install all depencies
RUN yarn install --immutable && yarn cache clean

# copy over all files to the work directory
ADD . /app

# build the project
RUN yarn build

# start final image
FROM node:20-alpine

WORKDIR /app

# copy over build files from builder step
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/.nuxt /app/.nuxt

# expose the host and port 3000 to the server
ENV HOST 0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]