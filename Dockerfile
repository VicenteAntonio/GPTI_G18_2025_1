# Dockerfile for Railway deployment
# Python-only, no Node.js dependencies

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY scripts/ ./scripts/
COPY .env* ./

# Install Python dependencies
RUN pip install --no-cache-dir -r scripts/requirements.txt

# Create logs directory
RUN mkdir -p logs

# Expose port (if needed in future)
# EXPOSE 8080

# Start services
CMD ["bash", "scripts/start_railway_services.sh"]

