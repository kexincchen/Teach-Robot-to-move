import openai
import os
import config
import time
from exts import mongo,limiter
from blueprints.auth import bp as auth_bp
from blueprints.processing import bp as processing_bp
from blueprints.admin import bp as admin_bp
from blueprints.api import bp as api_bp
from flask import Flask, request, jsonify, render_template, session, g, send_from_directory
from bson import ObjectId
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
app.config.from_object(config)
mongo.init_app(app)
limiter.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(processing_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(api_bp)
openai.api_key = os.getenv("OPENAI_API_KEY")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'sa_key.json'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/scripts/<path:filename>')
def serve_js(filename):
    return send_from_directory('static/scripts', filename, mimetype='application/javascript')


@app.before_request
def before_request():
    user_id = session.get("user_id")
    if user_id:
        user = mongo.db.User.find_one({"_id": ObjectId(user_id)})
        print(user['username'])
        setattr(g, "user", user)
    else:
        setattr(g, "user", None)


@app.context_processor
def user_context_processor():
    return {"user": g.user}


if __name__ == '__main__':
    app.run(debug=True)


