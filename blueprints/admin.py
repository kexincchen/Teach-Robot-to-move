import openai
import time
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session, flash
from pymongo.errors import DuplicateKeyError

from exts import mongo
from bson import json_util
from Decorators import login_required
bp = Blueprint("admin", __name__, url_prefix="/admin")

@bp.route('/initiate_web', methods=['POST'])
def initiate_web():
    print('Initiating the website database')
    data = request.json
    for command in data['commands']:
        existing_command = mongo.db.Command.find_one({"name": command})
        if existing_command:
            # If a command with same name exists in db, then skip it
            print('Command already exists: ', command)
            continue
        else:
            # If a command with same name does not exist in db, insert a new one
            result = mongo.db.Command.insert_one({'name': command, 'JDCommand': 'undefined'})
            # return f"Command added with id: {result.inserted_id}"
    return jsonify({'status': 200})


@bp.route('/update_commands', methods=['POST'])
def update_commands():
    print('Update the commands database')
    data = request.json
    try:
        for command in data['commands']:
            print('Command: %s' % command)
            mongo.db.Command.update_one({'name': command['name']}, {'$set': command}, upsert=True)
        return jsonify({"message": "Data updated/inserted successfully"})
    except DuplicateKeyError as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/all_commands', methods=['POST'])
def all_commands():
    # TODO: 可以往find()里面加{},{"name": 1, "JD":2}来只输出这两列
    commands = mongo.db.Command.find()
    return json_util.dumps(commands)

@bp.route('/add_command', methods=['POST'])
def add_command():
    data = request.json
    existing_command = mongo.db.Command.find_one({"name": data["name"]})
    if existing_command:
        # If a command with same name exists in db, update it with new data
        mongo.db.Command.update_one({"_id": existing_command["_id"]}, {"$set": data})
        return f"Command updated with id: {existing_command['_id']}"
    else:
        # If a command with same name does not exist in db, insert a new one
        result = mongo.db.Command.insert_one(data)
        return f"Command added with id: {result.inserted_id}"


@bp.route('/delete_command', methods=['POST'])
def delete_command():
    delete_data = request.json
    result = mongo.db.Command.delete_one({"name": delete_data["name"]})
    if result.deleted_count == 1:
        return "success"
    else:
        return "Item not found"


@bp.route('/admin_page', methods=['GET'])
@login_required
def admin_page():
    return render_template('admin/admin.html')
