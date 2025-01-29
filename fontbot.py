from flask import Flask, request, render_template
import os
import shutil

app = Flask(__name__)

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_fonts():
    if 'file' not in request.files:
        return "No file part"
    
    files = request.files.getlist('file')
    
    windows_fonts_path = os.path.join(os.environ["WINDIR"], "Fonts")
    
    for file in files:
        if file.filename.endswith(".ttf") or file.filename.endswith(".otf"):
            file.save(os.path.join(windows_fonts_path, file.filename))
            print(f"{file.filename} installed successfully!")
    
    return "Fonts installed successfully!"

if __name__ == '__main__':
    app.run(debug=True)
