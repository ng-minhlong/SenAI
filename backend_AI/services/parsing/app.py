from flask import Blueprint, request, jsonify
from docling.document_converter import DocumentConverter


parsing_bp = Blueprint('parsing', __name__)

@parsing_bp.route('/parsing', methods=['POST'])


def parsing():

    if 'source' not in request.json:
        return jsonify({'error': 'Missing source to parse'}, {"source": source}), 400
    source = request.json['source']
    try:
        converter = DocumentConverter()
        result = converter.convert(source)
        parsed_document = result.document.export_to_markdown()
        response = {
            'result': parsed_document,
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

