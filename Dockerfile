FROM node:20-alpine

RUN npm install -g pnpm
RUN apk add --update dumb-init bash
RUN apk add --no-cache gcompat

WORKDIR /app
COPY ./ ./

RUN pnpm install --production --frozen-lockfile > /dev/null

RUN pnpm build

EXPOSE 80

ENV ATCOURSE_PORT=80

CMD ["pnpm", "prod"]

LABEL org.opencontainers.image.source=https://github.com/burningtree/atcourse
LABEL org.opencontainers.image.description="atcourse instance"
LABEL org.opencontainers.image.licenses=MIT