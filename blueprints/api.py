import openai
import time
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from exts import mongo, limiter
from google.cloud import speech
import os
from dotenv import load_dotenv
from .processing import generate_output, call_whisper, call_google
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint("api", __name__, url_prefix='/api')

@bp.route('/audio-to-command', methods=['POST'])
@limiter.limit("5 per minute")
def audio_to_command():
    username = request.form["username"]
    api_key = request.form["api"]
    if not check_password_hash(api_key, mongo.db.API.find_one({'username': username})["api"]):
        return jsonify({"error": "Invalid api key"}), 500

    filename = "uploaded_audio.mp3"
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
    command_name = generate_output(transcript)
    output = mongo.db.Command.find_one({"name": command_name})["JDCommand"]
    return jsonify({"output": output}), 200


