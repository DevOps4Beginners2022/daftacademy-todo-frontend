FROM node:16.14.2 as build

ENV APP_ROOT /home/app
ENV PORT 80

WORKDIR $APP_ROOT

ENV PATH $APP_ROOT/node_modules/.bin:$PATH

COPY package.json package-lock.json $APP_ROOT/
RUN npm install --silent

COPY . $APP_ROOT

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /home/app/build /usr/share/nginx/html
COPY  default.conf.template /etc/nginx/templates/

EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]
