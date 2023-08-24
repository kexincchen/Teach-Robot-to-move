import openai
import os
# import config
from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo

import auth


app = Flask(__name__)
app.register_blueprint(auth.bp)
app.add_url_rule("/", endpoint="index")
# app.config.from_object(config)
# mongo = PyMongo(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

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

@app.route('/')
def index():
    return render_template('base.html')


@app.route('/speech-to-text', methods=['POST'])
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

    file.save("uploaded_audio.mp3")
    audiofile = open("uploaded_audio.mp3", "rb")
    transcript = openai.Audio.translate("whisper-1", audiofile)
    print(transcript['text'])
    return jsonify({'textOutput': transcript['text']})


# @app.route('/command', methods=['POST'])
# def command():
#     command_name = request.form['Command']
#     robot_command = mongo.db.Command.find_one({'name': command_name})
#     print(robot_command['command'])
#     if robot_command is None:
#         return jsonify({'robot_command': 'report_not_exist'})
#     else:
#         return jsonify({'robot_command': robot_command['command']})


@app.route('/generate', methods=['POST'])
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


if __name__ == '__main__':
    app.run(debug=True)


