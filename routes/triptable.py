from flask import render_template
from . import routes

@app.route('/triptable')
def triptable():
    if in_session():
        trips = get_trips_from_db()
        return render_template("triptable.html", trips=trips)
    return render_template("login.html")
