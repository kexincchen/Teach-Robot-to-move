from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from exts import mongo
from .forms import LoginForm
from werkzeug.security import check_password_hash

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        # need to merge other branches
        return render_template("auth.login.html")
    else:
        form = LoginForm(request.form)
        if form.validate():
            username = form.username.data
            password = form.password.data
            user = mongo.db.User.find_one({'username':username})
            if not user:
                print(username + " is not exist in database")
                return redirect(url_for("auth.login"))

            # TODO: use Hash check to improve password validation
            if password == user["password"]:
                session['user_id'] = user["_id"]
                return redirect("/")
            else:
                print("wrong password")
                return redirect(url_for("auth.login"))
        else:
            return redirect(url_for("auth.login"))


@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect('/')