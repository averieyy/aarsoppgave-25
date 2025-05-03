# Speedrun game

FROM node:23.9-slim
COPY . /speedrun
COPY docker.env .env
WORKDIR /speedrun

RUN yarn install
RUN yarn build

# Running the project
EXPOSE 3000
CMD [ "node", "build/index.js" ]