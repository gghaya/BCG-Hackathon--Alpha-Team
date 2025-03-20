# Use official Python image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code
COPY app .

# Expose Flask port
EXPOSE 5000

# Run the Flask app
CMD ["python", "/app/app.py"]
