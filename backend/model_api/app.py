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
# Use absolute path for more reliable model loading
MODEL_PATH = r'C:\Users\user\scan_ai\Binary6.keras'  # Use raw string with direct absolute path
print(f"Trying to load model from: {MODEL_PATH}")
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
        print(f"Absolute MODEL_PATH resolves to: {os.path.abspath(MODEL_PATH)}")
        print(f"Binary6.keras exists in root directory: {os.path.exists('../../Binary6.keras')}")
        model = None
    else:
        print(f"Model file found, size: {os.path.getsize(MODEL_PATH) / (1024*1024):.2f} MB")
        # Configure memory growth to avoid memory allocation errors
        physical_devices = tf.config.list_physical_devices('GPU')
        if len(physical_devices) > 0:
            try:
                for device in physical_devices:
                    tf.config.experimental.set_memory_growth(device, True)
                print(f"GPU memory growth set to True for {len(physical_devices)} devices")
            except Exception as gpu_err:
                print(f"Error configuring GPU: {str(gpu_err)}")
        
        # Explicitly specify the module to load for better compatibility
        # Use compile=False to avoid recompilation issues
        model = tf.keras.models.load_model(
            MODEL_PATH,
            compile=False,  # Don't recompile the model
            custom_objects=None,  # No custom layers or metrics
        )
        
        # Compile the model with appropriate settings
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        print("Model loaded successfully!")
        # Print model summary and architecture info
        model.summary()
        print(f"Model input shape: {model.input_shape}")
        print(f"Model output shape: {model.output_shape}")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    print(f"Detailed traceback:", tf.errors.StackTrace())
    model = None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess image for model prediction"""
    try:
        print(f"Preprocessing image: {image_path}")
        
        # Load image as grayscale (since the model expects 1 channel)
        img = Image.open(image_path).convert('L')  # 'L' mode is for grayscale
        print(f"Original image size: {img.size}")
        
        # Resize to match model's expected input size
        img = img.resize((224, 224))
        print(f"Resized image to: {img.size}")
        
        # Convert to numpy array and normalize
        img_array = np.array(img) / 255.0
        print(f"Array shape after normalization: {img_array.shape}")
        
        # Add channel dimension to match model's input shape (None, 224, 224, 1)
        img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension
        img_array = np.expand_dims(img_array, axis=0)   # Add batch dimension
        
        # Apply additional contrast enhancement for better feature extraction
        # This helps the model detect subtle pneumonia features
        if np.max(img_array) > 0.01:  # Check if image is not completely black
            # Normalize to the 0.1-0.9 range for better contrast
            min_val = np.min(img_array)
            max_val = np.max(img_array)
            if max_val > min_val:
                img_array = 0.1 + 0.8 * (img_array - min_val) / (max_val - min_val)
        
        print(f"Final preprocessed image shape: {img_array.shape}")
        print(f"Value range: min={np.min(img_array)}, max={np.max(img_array)}")
        return img_array
        
    except Exception as e:
        print(f"Error in preprocessing image: {str(e)}")
        raise

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint for model predictions"""
    print("Received prediction request")
    
    # Check if model is loaded
    if model is None:
        print("ERROR: Model not loaded")
        return jsonify({'error': 'Model not loaded'}), 500

    # Check if file is in request
    if 'file' not in request.files:
        print("ERROR: No file part in request")
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    print(f"Received file: {file.filename}, mime type: {file.mimetype}")
      # Check if filename is empty
    if file.filename == '':
        print("ERROR: Empty filename")
        return jsonify({'error': 'No file selected'}), 400
        
    if file and allowed_file(file.filename):
        # Create unique filename
        filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        try:
            print(f"Processing file at path: {file_path}")
            # Preprocess the image
            processed_image = preprocess_image(file_path)
            print(f"Image preprocessed successfully, shape: {processed_image.shape}")
              # Make prediction
            print("Running model prediction...")
            prediction = model.predict(processed_image)
            print(f"Prediction result raw: {prediction}")
              # Process results (adjust based on your model output)
            probability = float(prediction[0][0])
            print(f"Extracted probability: {probability}")
            
            # IMPORTANT: Invert the logic - our model is trained to output low values for PNEUMONIA
            # and high values for NORMAL
            result = "PNEUMONIA" if probability < 0.5 else "NORMAL"
            confidence = 1 - probability if result == "PNEUMONIA" else probability
            
            # Debug info to help diagnose classification issues
            print(f"Final result: {result} with confidence {confidence:.4f}")
            print(f"Original probability from model: {probability}")
            
            # Force some test results for debugging
            # Uncomment the next line to force testing a PNEUMONIA result
            # result, confidence = "PNEUMONIA", 0.85
            
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
    
    # Additional diagnostic information
    model_info = {}
    if model is not None:
        try:
            model_info = {
                'input_shape': str(model.input_shape),
                'output_shape': str(model.output_shape),
                'layers_count': len(model.layers)
            }
        except Exception as e:
            model_info = {'error': str(e)}
    
    file_exists = os.path.exists(MODEL_PATH)
    file_size = os.path.getsize(MODEL_PATH) if file_exists else 0
    
    return jsonify({
        'status': 'online',
        'model': model_status,
        'model_info': model_info,
        'model_path': MODEL_PATH,
        'model_file_exists': file_exists,
        'model_file_size_mb': round(file_size / (1024*1024), 2) if file_size > 0 else 0,
        'working_directory': os.getcwd(),
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
