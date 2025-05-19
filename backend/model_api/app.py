"""
Pneumonia Detection API - Flask server for serving the Keras model
"""
import os
import json
import uuid
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
MODEL_PATH = '../../peumoniaModel.keras'  # Path from model_api to the root directory model
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
DEBUG = True  # Enable debug logging

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Function to clean up old files (older than 24 hours)
def cleanup_old_files():
    """Remove files older than 24 hours from upload and results folders"""
    print("Cleaning up old files...")
    current_time = datetime.now().timestamp()
    one_day_seconds = 24 * 60 * 60
    
    # Clean uploads folder
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isfile(file_path):
            # Check if file is older than 24 hours
            file_time = os.path.getmtime(file_path)
            if current_time - file_time > one_day_seconds:
                os.remove(file_path)
                print(f"Removed old upload: {filename}")
    
    # Clean results folder
    for filename in os.listdir(RESULTS_FOLDER):
        file_path = os.path.join(RESULTS_FOLDER, filename)
        if os.path.isfile(file_path):
            # Check if file is older than 24 hours
            file_time = os.path.getmtime(file_path)
            if current_time - file_time > one_day_seconds:
                os.remove(file_path)
                print(f"Removed old result: {filename}")

# Run cleanup on startup
cleanup_old_files()

# Load the model
print("Loading Keras model from:", MODEL_PATH)
try:
    # Check if model file exists
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model file not found at {MODEL_PATH}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"Checking parent directory: {os.path.exists('../..')}")
        model = None
    else:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
        # Print model summary
        model.summary()
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess image for model prediction"""
    # Load image and resize to expected dimensions
    img = Image.open(image_path).convert('RGB')
    img = img.resize((224, 224))  # Adjust based on your model's expected input size
    
    # Convert to numpy array and normalize
    img_array = np.array(img) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint for model predictions"""
    # Check if model is loaded
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    # Check if filename is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if file and allowed_file(file.filename):
        # Create unique filename
        filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        try:
            # Preprocess the image
            processed_image = preprocess_image(file_path)
            
            # Make prediction
            prediction = model.predict(processed_image)
            
            # Process results (adjust based on your model output)
            probability = float(prediction[0][0])
            result = "PNEUMONIA" if probability > 0.5 else "NORMAL"
            confidence = probability if result == "PNEUMONIA" else 1 - probability
            
            # Save results
            result_id = str(uuid.uuid4())
            result_file = os.path.join(RESULTS_FOLDER, f"{result_id}.json")
            
            result_data = {
                'id': result_id,
                'filename': filename,
                'prediction': result,
                'confidence': round(float(confidence) * 100, 2),
                'timestamp': datetime.now().isoformat()
            }
            
            with open(result_file, 'w') as f:
                json.dump(result_data, f)
            
            return jsonify(result_data), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not loaded"
    return jsonify({
        'status': 'online',
        'model': model_status,
        'timestamp': datetime.now().isoformat(),
        'uploads_count': len(os.listdir(UPLOAD_FOLDER)),
        'results_count': len(os.listdir(RESULTS_FOLDER))
    })
    
@app.route('/api/cleanup', methods=['POST'])
def trigger_cleanup():
    """Endpoint to trigger cleanup of old files"""
    try:
        cleanup_old_files()
        return jsonify({
            'status': 'success',
            'message': 'Cleanup completed',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Cleanup failed: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
