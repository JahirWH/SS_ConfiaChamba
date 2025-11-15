# Dockerfile for Django project
FROM python:3.11-slim

# Prevents Python from writing .pyc files and sets output unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy project
COPY . /code/ 

# Create directory for media files
RUN mkdir -p /code/media

# Expose port
EXPOSE 8000

# Default command
CMD ["sh", "-c", "python manage.py collectstatic --noinput && gunicorn confia_chamba.wsgi:application --bind 0.0.0.0:8000 --workers 3"]

