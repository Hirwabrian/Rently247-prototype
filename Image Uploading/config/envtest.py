#!/usr/bin/env python3
"""env testing."""

from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Test environment variables
print("Cloudinary Cloud Name:", os.getenv("CLOUDINARY_CLOUD_NAME"))
print("Cloudinary API Key:", os.getenv("CLOUDINARY_API_KEY"))
print("Cloudinary API Secret:", os.getenv("CLOUDINARY_API_SECRET"))
