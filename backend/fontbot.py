from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from fontTools.ttLib import TTFont

app = Flask(__name__)
CORS(app)


# Determine font directory based on the operating system
if os.name == 'nt':  # Windows
    FONT_DIR = os.path.join(os.environ.get("WINDIR", ""), "Fonts")
elif os.name == 'posix':  # macOS or Linux
    FONT_DIR = "/Library/Fonts" if os.uname().sysname == 'Darwin' else "/usr/share/fonts"

def get_font_metadata(font_path):
    try:
        font = TTFont(font_path)
        name = font['name']
        font_family = name.getName(1, 3, 1, 1033).toStr()
        font_subfamily = name.getName(2, 3, 1, 1033).toStr()
        full_name = name.getName(4, 3, 1, 1033).toStr()
        version = name.getName(5, 3, 1, 1033).toStr()
        postscript_name = name.getName(6, 3, 1, 1033).toStr()
        license_info = name.getName(13, 3, 1, 1033)

        return {
            "font_family": font_family,
            "font_subfamily": font_subfamily,
            "full_name": full_name,
            "version": version,
            "postscript_name": postscript_name,
            "license": license_info.toStr() if license_info else "Unknown license",
        }
    except Exception as e:
        print(f"Failed to read font metadata: {e}")
        return None

def get_installed_fonts():
    fonts = []
    for root, dirs, files in os.walk(FONT_DIR):
        for font_file in files:
            if font_file.endswith('.ttf') or font_file.endswith('.otf'):
                font_path = os.path.join(root, font_file)
                metadata = get_font_metadata(font_path)
                if metadata:
                    fonts.append(metadata)
    return fonts

@app.route('/fonts', methods=['GET'])
def list_fonts():
    fonts = get_installed_fonts()
    return jsonify(fonts)

@app.route('/delete', methods=['POST'])
def delete_font():
    font_file = request.json.get('file')
    font_path = os.path.join(FONT_DIR, font_file)
    if os.path.isfile(font_path):
        os.remove(font_path)
        return jsonify(message="Font deleted successfully!")
    return jsonify(message="Font not found"), 404

@app.route('/upload', methods=['POST'])
def upload_fonts():
    files = request.files.getlist('file')
    total_fonts_installed = 0
    
    for file in files:
        font_path = os.path.join(FONT_DIR, file.filename)
        file.save(font_path)
        total_fonts_installed += 1

    return jsonify(message=f"{total_fonts_installed} fonts installed successfully!")

if __name__ == '__main__':
    app.run(debug=True)
