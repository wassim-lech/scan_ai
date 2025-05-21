"""
Test script for verifying the Binary6.keras model can be loaded and used
"""
import os
import tensorflow as tf
import numpy as np
from PIL import Image
import sys

def main():
    # Define model path (same as in app.py)
    MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../Binary6.keras'))
    
    print(f"Testing model loading for: {MODEL_PATH}")
    print(f"File exists: {os.path.exists(MODEL_PATH)}")
    
    if os.path.exists(MODEL_PATH):
        print(f"File size: {os.path.getsize(MODEL_PATH) / (1024*1024):.2f} MB")
    
    try:
        # Load the model
        print("Loading model...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
        
        # Show model information
        print("\nModel summary:")
        model.summary()
        
        print(f"\nModel input shape: {model.input_shape}")
        print(f"Model output shape: {model.output_shape}")
        
        # Create a test tensor with correct input shape
        test_shape = model.input_shape[1:]  # Remove batch dimension
        print(f"\nCreating test tensor with shape: {test_shape}")
        test_input = np.random.random((1,) + test_shape)
        
        # Run inference
        print("Running inference on random input...")
        prediction = model.predict(test_input)
        print(f"Prediction shape: {prediction.shape}")
        print(f"Prediction values: {prediction}")
        
        print("\nModel test completed successfully!")
        return 0
        
    except Exception as e:
        print(f"ERROR: Model loading or testing failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
