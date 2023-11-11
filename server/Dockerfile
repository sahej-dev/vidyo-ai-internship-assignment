# Pull base image
FROM python:3.10.4-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install  ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

# Copy requirements and install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Cleanup
RUN apt-get remove --purge -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
