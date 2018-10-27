from flask import Flask, render_template, Response, request, url_for, session, abort, redirect, flash
from flask_login import LoginManager, UserMixin, login_required, \
                        login_user, logout_user
import time

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

app.config["SECRET_KEY"] = "mysecret"

class User(UserMixin):
    def __init__(self, id):
        self.id = id
        self.name = "user" + str(id)
        self.password = "secret"

    def __repr__(self):
        return "%d%s%s" % (self.id, self.name, self.password)

user = User(1)


@app.route('/')
@login_required
def index():
    return render_template("index.html")


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        time.sleep(1) # vis en loading gif
        username = request.form.get("username")
        password = request.form.get("password")
        if password == "secret":
            id = username.split("user")[1]
            user = User(id)
            login_user(user)
            return render_template("index.html")
        else:
            flash("Wrong username or password")
            return render_template("login.html")
    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return render_template("login.html")


@app.route('/map')
@login_required
def map():
    return render_template('map.html')

# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed</p>')

@app.route('/secret')
@login_required
def secret():
    return "you are logged in"


@login_manager.user_loader
def load_user(userid):
    return User(userid)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=4000)
