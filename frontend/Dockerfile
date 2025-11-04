# syntax=docker/dockerfile:1.4

# stage : base stage contains all the basics
FROM node:24 AS development

ENV CI=true
ENV PORT=3000

WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm ci
COPY . /code

CMD [ "npm", "start" ]


# stage : build the app for production  
FROM development AS builder

RUN npm run build

# stage : add extra tools to the container like Git, for software devs 
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
CMD [ "npm", "start" ]


# stage : reverse proxy, to route requests access to the publib (aka non-local host access)
FROM nginx:1.13-alpine

COPY --from=builder /code/build /usr/share/nginx/html