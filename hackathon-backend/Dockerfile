# Use an official Python runtime as a base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the application files to the container
COPY requirements.txt /app
# RUN pip install --upgrade pip && pip install -r requirements.txt
RUN pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
RUN pip install --upgrade pip && \
    pip install --default-timeout=300 --retries=10 --no-cache-dir -r requirements.txt
COPY . /app

# Install dependencies

# Expose the port that Flask runs on
EXPOSE 5000

# Run the Flask application
CMD ["python", "app.py"]