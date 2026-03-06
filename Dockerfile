# ╔══════════════════════════════════════════════════════════╗
# ║  Multi-Stage Dockerfile — Enterprise Portfolio          ║
# ║  Nginx-based, Optimized, Secure, Production-Ready       ║
# ╚══════════════════════════════════════════════════════════╝

# ── Stage 1: Build & Optimize Assets ──
FROM node:20-alpine AS builder

WORKDIR /build

# Install build tools for asset optimization
RUN apk add --no-cache gzip brotli

# Copy source files
COPY . .

# Pre-compress all static assets for maximum performance
RUN find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" -o -name "*.json" \) \
    -exec gzip -9 -k {} \; \
    -exec brotli -q 11 -k {} \;


# ── Stage 2: Production Nginx Server ──
FROM nginx:1.27-alpine AS production

LABEL maintainer="Hrithik Vasanthram <hrithikvasanthram@gmail.com>"
LABEL description="Enterprise Portfolio — Containerized with Nginx"
LABEL version="2.0"

# Install runtime deps
RUN apk add --no-cache curl tzdata && \
    rm -rf /var/cache/apk/*

# Remove default nginx config & static files
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Copy built assets from builder stage
COPY --from=builder /build/index.html /usr/share/nginx/html/
COPY --from=builder /build/assets /usr/share/nginx/html/assets/

# Copy pre-compressed files
COPY --from=builder /build/index.html.gz /usr/share/nginx/html/
COPY --from=builder /build/index.html.br /usr/share/nginx/html/
COPY --from=builder /build/assets/css/style.css.gz /usr/share/nginx/html/assets/css/
COPY --from=builder /build/assets/css/style.css.br /usr/share/nginx/html/assets/css/
COPY --from=builder /build/assets/js/script.js.gz /usr/share/nginx/html/assets/js/
COPY --from=builder /build/assets/js/script.js.br /usr/share/nginx/html/assets/js/

# Set correct permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Expose port
EXPOSE 80

# Run as non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
