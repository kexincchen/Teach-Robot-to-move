from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session, flash
from exts import mongo
from .forms import LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.security import check_password_hash

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        # need to merge other branches
        return render_template("auth/login.html")
    else:
        form = LoginForm(request.form)
        if form.validate():
            username = form.username.data
            password = form.password.data

            # search the User database to make sure there is an admin account
            # If there is no account exist in database, register one
            if len(list(mongo.db.User.find())) == 0:
                print("Register an admin account " + username)
                mongo.db.User.insert_one({'username': username, "password": generate_password_hash(password)})
                # default api for admin account
                # need algorithm to generate api key
                mongo.db.API.insert_one({'username': username, "api": generate_password_hash("api_for_admin")})

            user = mongo.db.User.find_one({'username': username})
            if not user:
                print(username + " is not exist in database")
                return redirect(url_for("auth.login"))

            if check_password_hash(user["password"], password):
                print("password correct")
                session['user_id'] = str(user["_id"])
                return redirect("/")
            else:
                print("Invalid password")
                flash("Invalid password")
                return redirect(url_for("auth.login"))
        else:
            print("form is invalid")
            return redirect(url_for("auth.login"))


@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect('/')
