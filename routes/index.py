from flask import render_template
from . import routes

@app.route('/')
def index():
    if in_session():
        return render_template("index.html", username=getUsername())
    flash("You have to log in")
    return render_template("login.html")
