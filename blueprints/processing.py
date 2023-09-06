import openai
import time
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from exts import mongo

bp = Blueprint("processing",__name__, url_prefix='/processing')


def generate_output(input_text):
    # Use GPT-3.5 to generate the improved output
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.8,
        max_tokens=2000,
        messages=[
            {"role": "system", "content": f"Hello, world!"},
            {"role": "user", "content": input_text}
        ]
    )
    print(response.choices[0].message["content"])
    return response.choices[0].message["content"]


@bp.route('/speech-to-text', methods=['POST'])
def stt():
    print('[backend] speech-to-text')
    if 'file' not in request.files:
        print('[backend] audio not in request.files')
        print(request.files['file'])
        return jsonify({'error': 'No file inside the request'})
    file = request.files['file']
    if file.filename == '':
        print('[backend] No selected file')
        return jsonify({'error': 'No selected file'})

    start_time = time.time()
    file.save("uploaded_audio.mp3")
    audiofile = open("uploaded_audio.mp3", "rb")
    transcript = openai.Audio.translate("whisper-1", audiofile)
    print(transcript['text'])
    end_time = time.time()
    stt_time = round(end_time-start_time, 2)
    print("time is " + str(stt_time))
    return jsonify({'textOutput': transcript['text'], 'time': stt_time})


@bp.route('/command', methods=['POST'])
def command():
    # Get the input text from front end via json
    input_text = request.json['input_text']
    # Use ChatGPT to process the text and return a command name
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.8,
        max_tokens=2000,
        # TODO: modify the role of chatgpt to process the text
        messages=[
            {"role": "system", "content": f"Hello, world!"},
            {"role": "user", "content": input_text}
        ]
    )
    command_name = response.choices[0].message["content"]
    # Search the command name in the mongoDB database
    robot_command = mongo.db.Command.find_one({'name': command_name})
    print(robot_command['command'])
    if robot_command is None:
        return jsonify({'robot_command': 'report_not_exist'})
    else:
        return jsonify({'robot_command': robot_command['command']})


@bp.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        input_text = data['input_text']

        if not input_text:
            return jsonify({"error": "Please provide input text, style, and platform."}), 400

        output_text = generate_output(input_text)
        return jsonify({"output_text": output_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500