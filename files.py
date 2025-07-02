from flask import Flask, send_from_directory, abort
import os
from pathlib import Path

app = Flask(__name__)

# Get the user's home directory and build path to Downloads/f
HOME_DIR = str(Path.home())
FOLDER = os.path.join(HOME_DIR, 'Downloads', 'f')

@app.route('/files/<path:filename>')
def serve_file(filename):
    full_path = os.path.join(FOLDER, filename)

    # Prevent directory traversal attacks
    if os.path.commonpath([full_path, FOLDER]) != FOLDER:
        abort(403)

    if not os.path.isfile(full_path):
        abort(404)

    return send_from_directory(FOLDER, filename)

if __name__ == '__main__':
    app.run(port=6666)
