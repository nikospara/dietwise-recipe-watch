# RecipeWatch

An application for users among the general public who are interested in making healthier and more sustainable choices with regard to their cooking habits. A component of [DietWise](https://dietwise.eu/).

## Docker deploy (web testing)

This repository includes a production-style static web container:
- Build stage: Node + Vite
- Runtime stage: Nginx serving `dist/`

### Build image

```bash
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

### Optional mobile preview page

By default, `mobile-preview.html` is **not** included in the build artifact.

To include it for testing, build with:

```bash
docker build --build-arg INCLUDE_MOBILE_PREVIEW=true -t recipe-watch-web:mobile-preview .
```

Preview URL (only when enabled):
- `http://localhost:8080/mobile-preview`
