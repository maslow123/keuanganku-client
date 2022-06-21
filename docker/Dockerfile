FROM node:lts as dependencies
WORKDIR /keuanganku
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /keuanganku
COPY . .
COPY --from=dependencies /keuanganku/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /keuanganku
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /keuanganku/next.config.js ./
COPY --from=builder /keuanganku/public ./public
COPY --from=builder /keuanganku/.next ./.next
COPY --from=builder /keuanganku/node_modules ./node_modules
COPY --from=builder /keuanganku/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]