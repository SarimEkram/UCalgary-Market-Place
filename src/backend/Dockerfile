# syntax=docker/dockerfile:1.4

# stage : base stage contains all the basics
FROM node:24 AS development

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /code

# default to port 80 for node, and 9229 and 9230 (tests) for debug
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 9229 9230

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm ci


# copy in our source code last, as it changes the most
COPY . /code

# start server 
CMD [ "node", "src/index.js" ]

# stage : add more dev tools like ike git to the container  
FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /