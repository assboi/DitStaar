from flask import render_template
from . import routes

@app.route('/map')
def map():
    trips = getTrips()
    if in_session():
        return render_template('map.html', username=getUsername(), trips=trips)
    flash("You have to log in")
    return render_template("login.html")
