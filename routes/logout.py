from flask import render_template
from . import routes

@app.route("/logout")
def logout():
    session.pop('username', None)
    return render_template("login.html")
