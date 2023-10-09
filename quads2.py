from flask import Flask, render_template, request, jsonify, send_from_directory
from PIL import Image
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'

@app.route('/uploadEnhanced', methods=['POST'])
def upload_images_enhanced():
    uploaded_files = request.files.getlist('file')
    processed_files = []

    for file in uploaded_files:
        if file.filename == '':
            return jsonify({'error': 'No selected file for one of the files'}), 400

        filename = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filename)
        split_image(filename)
        processed_files.append(filename)

    return jsonify({'success': True, 'filenames': processed_files})

@app.route('/')
def choice():
    return render_template('choice.html')

@app.route('/classic')
def classic():
    return render_template('classic.html')

@app.route('/enhanced')
def enhanced():
    return render_template('enhanced.html')

@app.route('/image/<filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

def split_image(filepath):
    with Image.open(filepath) as img:
        width, height = img.size
        quadrant_size = (width // 2, height // 2)
        
        # Top-left quadrant
        tl = img.crop((0, 0, quadrant_size[0], quadrant_size[1]))
        tl.save(os.path.join(UPLOAD_FOLDER, 'tl_' + os.path.basename(filepath)))
        
        # Top-right quadrant
        tr = img.crop((quadrant_size[0], 0, width, quadrant_size[1]))
        tr.save(os.path.join(UPLOAD_FOLDER, 'tr_' + os.path.basename(filepath)))

        # Bottom-left quadrant
        bl = img.crop((0, quadrant_size[1], quadrant_size[0], height))
        bl.save(os.path.join(UPLOAD_FOLDER, 'bl_' + os.path.basename(filepath)))

        # Bottom-right quadrant
        br = img.crop((quadrant_size[0], quadrant_size[1], width, height))
        br.save(os.path.join(UPLOAD_FOLDER, 'br_' + os.path.basename(filepath)))

if __name__ == '__main__':
    app.run(debug=True)
