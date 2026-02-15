# RecipeWatch

An application for users among the general public who are interested in making healthier and more sustainable choices with regard to their cooking habits. A component of [DietWise](https://dietwise.eu/).

## Docker deploy (web testing)

This repository includes a production-style static web container:
- Build stage: Node + Vite
- Runtime stage: Nginx serving `dist/`

### Run with Docker Compose

```bash
docker compose up -d --build
```

App URL:
- `http://localhost:8080/`

Health endpoint:
- `http://localhost:8080/healthz`

### Optional mobile preview page

By default, `mobile-preview.html` is **not** included in the build artifact.

To include it for testing, set this build arg in `docker-compose.yml`:

```yaml
args:
  INCLUDE_MOBILE_PREVIEW: "true"
```

Then rebuild:

```bash
docker compose up -d --build
```

Preview URL (only when enabled):
- `http://localhost:8080/mobile-preview`
