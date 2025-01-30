from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from fontTools.ttLib import TTFont

app = Flask(__name__)
CORS(app)

@app.before_request
def log_request():
    print(f"Incoming request: {request.method} {request.path}")

@app.route('/api/hello')
def hello():
    return jsonify({"message": "Backend Flask di Vercel bekerja!"})
# Tentukan direktori font berdasarkan sistem operasi
if os.name == 'nt':  # Windows
    FONT_DIR = os.path.join(os.environ.get("WINDIR", ""), "Fonts")
elif os.name == 'posix':  # macOS atau Linux
    FONT_DIR = "/Library/Fonts" if os.uname().sysname == 'Darwin' else "/usr/share/fonts"


def get_font_metadata(font_path):
    try:
        font = TTFont(font_path)
        name = font['name']
        font_family = name.getName(1, 3, 1, 1033)
        font_subfamily = name.getName(2, 3, 1, 1033)
        full_name = name.getName(4, 3, 1, 1033)
        version = name.getName(5, 3, 1, 1033)
        postscript_name = name.getName(6, 3, 1, 1033)
        license_info = name.getName(13, 3, 1, 1033)

        return {
            "font_family": font_family.toStr() if font_family else "Unknown",
            "font_subfamily": font_subfamily.toStr() if font_subfamily else "Unknown",
            "full_name": full_name.toStr() if full_name else "Unknown",
            "version": version.toStr() if version else "Unknown",
            "postscript_name": postscript_name.toStr() if postscript_name else "Unknown",
            "license": license_info.toStr() if license_info else "Unknown license",
        }
    except Exception as e:
        print(f"Failed to read font metadata: {e}")
        return None


def get_installed_fonts():
    fonts = []
    if os.path.exists(FONT_DIR):
        for root, dirs, files in os.walk(FONT_DIR):
            for font_file in files:
                if font_file.endswith(('.ttf', '.otf')):
                    font_path = os.path.join(root, font_file)
                    metadata = get_font_metadata(font_path)
                    if metadata:
                        fonts.append(metadata)
    return fonts


@app.route('/api/fonts', methods=['GET'])
def list_fonts():
    fonts = get_installed_fonts()
    return jsonify(fonts)


@app.route('/api/delete', methods=['POST'])
def delete_font():
    font_file = request.json.get('file')
    if not font_file:
        return jsonify(message="Font file is required"), 400

    font_path = os.path.join(FONT_DIR, font_file)
    if os.path.isfile(font_path):
        try:
            os.remove(font_path)
            return jsonify(message="Font deleted successfully!")
        except Exception as e:
            return jsonify(message=f"Error deleting font: {str(e)}"), 500
    return jsonify(message="Font not found"), 404


@app.route('/api/upload', methods=['POST'])
def upload_fonts():
    if 'file' not in request.files:
        return jsonify(message="No file uploaded"), 400
    
    files = request.files.getlist('file')
    uploaded_fonts = []
    total_fonts_installed = 0
    
    for file in files:
        font_path = os.path.join(FONT_DIR, file.filename)
        temp_path = os.path.join("/tmp", file.filename)
        try:
            file.save(temp_path)
            total_fonts_installed += 1
            uploaded_fonts.append(get_font_metadata(temp_path))
        except Exception as e:
            return jsonify(message=f"Error installing font: {str(e)}"), 500

    return jsonify(message=f"{total_fonts_installed} fonts installed successfully!")


# Handler untuk Vercel
def vercel_app(environ, start_response):
    return app(environ, start_response)

if __name__ == '__main__':
    app.run(debug=True)
