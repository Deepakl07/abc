import torch
import torchvision.transforms as transforms
from PIL import Image
import sys
import json

def load_model():
    model = torch.load('model.pth')
    model.eval()
    return model

def process_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)
    return image

def predict(image_path):
    try:
        model = load_model()
        image = process_image(image_path)
        
        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
            
        # Get class labels from your dataset
        classes = [
            'Tomato_Bacterial_spot',
            'Tomato_Early_blight',
            'Tomato_Late_blight',
            'Tomato_Leaf_Mold',
            'Tomato_Septoria_leaf_spot',
            'Tomato_Spider_mites',
            'Tomato_Target_Spot',
            'Tomato_Yellow_Leaf_Curl_Virus',
            'Tomato_mosaic_virus',
            'Tomato_healthy'
        ]
        
        result = {
            'prediction': classes[predicted.item()],
            'confidence': float(torch.nn.functional.softmax(outputs, dim=1).max().item())
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Image path not provided'}))
        sys.exit(1)
        
    predict(sys.argv[1])