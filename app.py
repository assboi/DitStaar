from flask import render_template, url_for, session, abort, redirect, flash
from flask import Flask, g
from flask import request, Response, jsonify

import time, json, math, datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

#import db classes
from database.tur import Tur
from database.user import Users

#import routes
from routes import *

app = Flask(__name__)

# Use blueprint to separate routes into different files
app.register_blueprint(routes)

# Get variables from config file
app.config.from_pyfile('config.cfg')

# Initialize SQLAlchemy
db = SQLAlchemy(app)

#blueprint register


def get_trips_from_db():
    result = []
    trips = Tur.query.order_by(Tur.aid).all() # mulig feil her
    for trip in trips:
        result.append({
        "aid": trip.aid,
        "name": trip.name,
        "distance": trip.distance,
        "date": trip.date
        })
    return result
        

def getUsername():
    return session["username"]

def in_session():
    if 'username' in session:
        return True
    return False


@app.route('/adventure', methods=['POST', 'GET'])
def storeAdventure():
    if request.method == 'POST':
        name = request.form.get("name")
        distance = request.form.get("distance")
        route = request.form.get("route")

        if name == "" or distance == "":
            return json.dumps({"status": "failure"})

        date = datetime.datetime.now()
        strdate = date.strftime('%d%m/%Y %H:%M:%S')
        newTrip = Tur(name=name, distance=distance, date=strdate, route=route)
        db.session.add(newTrip)
        db.session.commit()
        return json.dumps({"status": "success", "name": name, "distance": distance, "route": route})

    if request.method == 'GET':
        response = []
        tripData = Tur.query.all()
        count = 1
        pagelimit = 5

        for trip in tripData:
            response.append({
                "aid": trip.aid,
                "name": trip.name,
                "distance": trip.distance,
                "date": trip.date,
                "route": trip.route,
                "page": math.floor(count / pagelimit) + 1,
                "pagelimit": pagelimit,
                "totalrecords": count
            })
            count += 1

        return json.dumps(response)

# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed</p>')

# test user
# def add_testUser():
#     username = "ditstaar"
#     password = "ditstaar"
#     if User.user_not_in_db(username):
#         u = Users(username, password)
#         db.session.add(u)
#         db.session.commit()

if __name__ == '__main__':
    #db.create_all()
    #add_testUser()
    app.run(debug=True, host="0.0.0.0", port=4000)
