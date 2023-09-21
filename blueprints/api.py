import openai
import time
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from exts import mongo
from google.cloud import speech
import os
from dotenv import load_dotenv
from .processing import generate_output, call_whisper, call_google

bp = Blueprint("api", __name__, url_prefix='/api')

@bp.route('/audio-to-command', methods=['POST'])
def audio_to_command():
    filename = "uploaded_audio.mp3"
    # print(request.files)
    # print("1")
    # print(request.form)
    # print("2")
    # print(request.json)
    # print("3")
    # print(request.data)
    # print("4")
    if 'file' not in request.files:
        print('[backend] audio not in request.files')
        print(request.files['file'])
        return jsonify({'error': 'No file inside the request'})
    file = request.files['file']
    if file.filename == '':
        print('[backend] No selected file')
        return jsonify({'error': 'No selected file'})
    file.save(filename)
    
    model = request.form["model"]
    if model is None or model == "whisper":
        print("calling whisper")
        transcript = call_whisper(filename)
    elif model == "google":
        print("calling google")
        transcript = call_google(filename)
    else:
        return jsonify({"error": "The model is not supported"}), 500
    
    return jsonify({"output": transcript}), 200