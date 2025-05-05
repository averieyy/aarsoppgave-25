# Speedrun game

FROM node:23.9-slim
COPY . /speedrun
COPY docker.env /speedrun/.env
WORKDIR /speedrun

RUN yarn install

# Running the project
EXPOSE 3000
CMD [ "sh", "-c", "yarn build && ORIGIN=http://localhost:3000 node build/index.js" ]