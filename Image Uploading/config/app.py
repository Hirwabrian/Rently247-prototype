#!/usr/bin/env python
"""Flask app to upload images to Cloudinary."""


from flask import Flask, request, jsonify
import cloudinary.uploader
from cloudinary_config import cloudinary
from flask_cors import CORS



app = Flask(__name__)

# Enable CORS
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file_to_upload = request.files['file']
    
    try:
        # Upload file to Cloudinary
        upload_result = cloudinary.uploader.upload(
            file_to_upload,
            folder="retail_images"  # Optional: Specify folder
        )
        return jsonify({"url": upload_result['secure_url']}), 200
    except Exception as e:
        
        print(f"Error uploading file: {e}")
        return jsonify({"error": "Upload failed"}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=3000)
