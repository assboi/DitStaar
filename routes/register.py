from flask import render_template
from . import routes

@app.route("/register")
def register():
    return render_template("register.html")
