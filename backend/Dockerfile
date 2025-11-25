# Use an official lightweight Python image.
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . /app/

# --- NEW: EXPOSE PORT AND RUN COMMAND ---
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

