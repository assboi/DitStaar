from flask import render_template, url_for, session, abort, redirect, flash
from flask import Flask, g
from flask import request, Response, jsonify
# from flask_login import LoginManager, UserMixin, login_required, \
#                         login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
import time
import json
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# Login
# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.login_view = "login"
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)


class Tur(db.Model):
    __tablename__ = "adventure"

    aid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    distance = db.Column(db.Integer, nullable=False)
    # route = # need to store and object of the route

    def __init__(self, name, distance):
        self.name = name
        self.distance = distance
        
class UserAdmin(db.Model):
    __tablename__ = 'user'
    username = db.Column(db.String(50), primary_key=True)
    password = db.Column(db.String(200))

    def __init__(self, username, password):
        self.username = username
        self.set_password(password)

    def set_password(self, password):
         self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

def add_user(username, password):
    user = UserAdmin(username, password)
    db.session.add(user)
    db.session.commit()


def add_testUser():
    username = "ditstaar"
    password = "ditstaar"
    if not_inDatabase(username):
        u = UserAdmin(username, password)
        db.session.add(u)
        db.session.commit()

def getUsername():
    return session["username"]


def in_session():
    if 'username' in session:
        return True
    return False


def valid_login(username, password):
    user = UserAdmin.query.filter_by(username=username).first()
    if user:
        return user.check_password(password)
    return False


def not_inDatabase(username):
    query = UserAdmin.query.filter_by(username=username)
    for each in query:
        if username == each.username:
            return False
    return True

@app.route('/')
def index():
    if in_session():
        return render_template("index.html", username=getUsername())
    flash("You have to log in")
    return render_template("login.html")

@app.route('/adventure', methods=['POST', 'GET'])
def storeAdventure():
    if request.method == 'POST':
        name = request.form.get("name")
        distance = request.form.get("distance")
        newTrip = Tur(name=name, distance=distance)
        db.session.add(newTrip)
        db.session.commit()
        # flash(u'Saved to database', 'alert-success')
        return json.dumps({"status": "success", "name": name, "distance": distance})
    if request.method == 'GET':
        # get stuff out of the database
        response = []
        tripData = Tur.query.all()
        for trip in tripData:
            response.append({
                "name": trip.name,
                "distance": trip.distance
            })
        return json.dumps(response)


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        time.sleep(1.5) # vis en loading gif
        username = request.form.get("username")
        password = request.form.get("password")
        if valid_login(username, password):
            session['username'] = username
            return render_template("index.html", username=username)
        else:
            flash("You have to log in")
            return render_template("login.html")
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop('username', None)
    return render_template("login.html")

def getTrips():
    data = []
    query = Tur.query.all()
    for trip in query:
        data.append({
            "name": trip.name,
            "distance": trip.distance
        })
    return data


@app.route('/map')
def map():
    trips = getTrips()
    if in_session():
        return render_template('map.html', username=getUsername(), trips=trips)
    flash("You have to log in")
    return render_template("index.html")

# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed</p>')

# User = User(1)
# @login_manager.user_loader
# def load_user(userid):
#     return User(userid)


if __name__ == '__main__':
    #db.create_all()
    #add_testUser()
    app.run(debug=True, host="0.0.0.0", port=4000)
