FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install dependencies (ignoring dev)
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Setup Nginx
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Setup Supervisor
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create log directory and Set permissions
RUN mkdir -p /var/log/supervisor && \
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/log/supervisor

# Expose port 80
EXPOSE 80

# Start Supervisor (which starts Nginx and PHP-FPM)
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
