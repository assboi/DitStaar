from flask import render_template
from . import routes

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        time.sleep(1.5)  # vis en loading gif
        username = request.form.get("username")
        password = request.form.get("password")
        if Users.valid_login(username, password):
            session['username'] = username
            return render_template("index.html", username=username)
        else:
            flash("You have to log in")
            return render_template("login.html")
    return render_template("login.html")
