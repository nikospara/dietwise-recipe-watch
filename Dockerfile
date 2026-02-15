FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG INCLUDE_MOBILE_PREVIEW=false
RUN if [ "$INCLUDE_MOBILE_PREVIEW" = "true" ]; then \
      npm run build:mobile-preview; \
    else \
      npm run build; \
    fi

FROM nginx:1.27-alpine AS runtime
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
