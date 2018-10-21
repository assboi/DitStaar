from flask import Flask, render_template, request

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecret"


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        return "success"
    return render_template("login.html")



if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=4000)
