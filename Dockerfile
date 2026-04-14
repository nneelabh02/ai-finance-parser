# Start with a lightweight Python/Linux foundation
FROM python:3.11-slim

# Install the underlying OS dependencies for OCR and PDF processing
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Set our working directory inside the container
WORKDIR /app

# Copy the requirements and install the Python wrappers
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of our application code
COPY . .

# Expose the port Render expects
EXPOSE 10000

# Boot the FastAPI server
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "10000"]