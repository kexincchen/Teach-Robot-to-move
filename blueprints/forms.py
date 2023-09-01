import wtforms
from wtforms.validators import Length


class LoginForm(wtforms.Form):
    username = wtforms.StringField(validators=[Length(max=20, message="Username is invalid")])
    password = wtforms.StringField(validators=[Length(min=6, max=20, message="Password is invalid")])