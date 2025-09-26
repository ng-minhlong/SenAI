from flask import Flask
from flask_cors import CORS
from services.stt.app import stt_bp
from services.pdf_ocr.app import pdf_ocr_bp
from services.parsing.app import parsing_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(stt_bp)
app.register_blueprint(pdf_ocr_bp)
app.register_blueprint(parsing_bp)

if __name__ == '__main__':
    app.run(debug=True, threaded=True, port=5000)
    # app.run(host='0.0.0.0', port=5000, debug=True)
