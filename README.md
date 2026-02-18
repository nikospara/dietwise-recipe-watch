# RecipeWatch

An application for users among the general public who are interested in making healthier and more sustainable choices with regard to their cooking habits. A component of [DietWise](https://dietwise.eu/).

## Backend endpoint configuration

`authServerHost` and `apiServerHost` are environment-specific and are resolved in this order:

1. Runtime `config.json` (served from `${BASE_URL}config.json`)
2. Build-time env vars `VITE_AUTH_SERVER_HOST` and `VITE_API_SERVER_HOST`
3. Local fallback defaults (`localhost`)

This allows:
- one artifact with per-environment runtime overrides (`public/config.json` or mounted replacement),
- plus optional build-time overrides for CI/dev.

## Docker deploy (web testing)

This repository includes a production-style static web container:
- Build stage: Node + Vite
- Runtime stage: Nginx serving `dist/`

### Build image

```bash
docker build -t recipe-watch-web:local .
```

The env variable `VITE_BASE_PATH` controls the context path, so building like:

```bash
docker build --build-arg VITE_BASE_PATH=/recipewatch/ -t recipe-watch:test .
```

Makes the app available at `http://localhost:5173/recipewatch`.

To set backend hosts at build time:

```bash
VITE_AUTH_SERVER_HOST=https://auth.example.com/realms/dietwise \
VITE_API_SERVER_HOST=https://api.example.com/api/v1 \
docker build -t recipe-watch-web:local .
```

### Run container

```bash
docker run -d --name recipe-watch-web -p 8080:80 recipe-watch-web:local
```

App URL:
- `http://localhost:8080/`

Health endpoint:
- `http://localhost:8080/healthz`

Mobile preview URL:
- `http://localhost:8080/mobile-preview`
