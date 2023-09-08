import openai
import time
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session, flash
from exts import mongo

bp = Blueprint("command_management", __name__, url_prefix="/command_management")

@bp.route('/update_commands', methods=['POST'])
def update_commands():
    print('Updating commands')
    data = request.json
    for command in data['commands']:
        print(command)
        existing_command = mongo.db.Command.find_one({"name": command})
        if existing_command:
            # If a command with same name exists in db, then skip it
            print('Command already exists: ', command)
            continue
        else:
            # If a command with same name does not exist in db, insert a new one
            result = mongo.db.Command.insert_one({"name": command})
            # return f"Command added with id: {result.inserted_id}"
    return jsonify({'status': 200})

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
        return "Item deleted successfully"
    else:
        return "Item not found"
    
    