# Docker Setup for Formatho

This project includes Docker configuration for easy deployment and local development.

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:8080`

### Using Docker directly

```bash
# Build the image
docker build -t formatho .

# Run the container
docker run -d -p 8080:80 --name formatho formatho

# View logs
docker logs -f formatho

# Stop the container
docker stop formatho
docker rm formatho
```

## Dockerfile Structure

The Dockerfile uses a **multi-stage build**:

1. **Builder stage**: Uses Node.js 20 Alpine to build the Vue.js application
   - Installs dependencies
   - Runs build scripts (sitemap generation, TypeScript check, Vite build, 404.html copy)
   - Outputs static files to `/app/dist`

2. **Production stage**: Uses Nginx Alpine to serve static files
   - Copies built files from builder stage
   - Configures Nginx for SPA routing
   - Serves on port 80

## Nginx Configuration

The `nginx.conf` file includes:

- **SPA routing**: All routes serve `index.html` (for Vue Router)
- **Gzip compression**: Reduces file sizes for faster loading
- **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Static asset caching**: 1 year cache for images, CSS, JS files
- **404 handling**: Supports GitHub Pages 404.html pattern

## Environment Variables

Currently, no environment variables are required. The app runs entirely client-side.

## Port Configuration

- **Default**: Port 80 inside container
- **Docker Compose**: Maps to `8080` on host (change in `docker-compose.yml` if needed)
- **Custom port**: `docker run -p 3000:80 formatho` (maps host port 3000 to container port 80)

## Production Deployment

For production deployment:

1. Build the image: `docker build -t formatho:latest .`
2. Tag for registry: `docker tag formatho:latest your-registry/formatho:latest`
3. Push to registry: `docker push your-registry/formatho:latest`
4. Deploy to your hosting platform (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)

## Troubleshooting

### Container won't start

- Check logs: `docker logs formatho`
- Verify port isn't in use: `lsof -i :8080`
- Check nginx config: `docker exec formatho nginx -t`

### Build fails

- Ensure Node.js dependencies are up to date
- Check that all required files are present (package.json, etc.)
- Verify build scripts work locally: `npm run build`

### Routes return 404

- Verify nginx.conf is copied correctly
- Check that `try_files $uri $uri/ /index.html;` is in nginx config
- Ensure 404.html exists in dist folder

## File Structure

```
.
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration for SPA
└── .dockerignore          # Files to exclude from Docker build
```
