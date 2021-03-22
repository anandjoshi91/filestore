# Step 1 Build the app
FROM node:14-alpine AS build-env


ADD ./ /var/www/server
WORKDIR /var/www/server
RUN yarn install
RUN yarn run build

# Step 2 - Copy deployable artifacts & start express server

FROM node:14-alpine

COPY --from=build-env /var/www/server/dist /var/www/server/dist
COPY --from=build-env /var/www/server/package.json /var/www/server/package.json
COPY --from=build-env /var/www/server/node_modules /var/www/server/node_modules
COPY --from=build-env /var/www/server/uploads /var/www/server/uploads
COPY --from=build-env /var/www/server/tsconfig.json /var/www/server/tsconfig.json
COPY --from=build-env /var/www/server/swagger.json /var/www/server/swagger.json

EXPOSE 3000

# App user
RUN adduser -D appuser

# Grant required folder permissions
RUN chown -R appuser:appuser /var/www/server/uploads

WORKDIR /var/www/server
USER appuser
CMD ["node", "--stack_trace_limit=30", "./dist/server.js"]