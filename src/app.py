"""
Anonvid Server Script
"""

import jsonpickle

from flask import Flask
from flask import render_template
from flask import request

from database import Database

app = Flask(__name__)
db = Database()


@app.route("/", methods=['GET'])
@app.route("/join", methods=['GET'])
def index():
	return render_template("index.html")


@app.route("/create", methods=['GET'])
def create():
	return render_template("create.html")

@app.route("/create", methods=['POST'])
def create_post():
	name = request.form['name']
	password = request.form['password']
	confId = db.create_conference(name, password)
	if confId == -1:
		return '', 500
	else:
		return jsonpickle.encode({ 'confId': confId }), 200


@app.route("/conference", methods=['GET', 'POST'])
def conference():
	c_no = request.args.get('c_no')
	c_p = request.args.get('c_p')
	return render_template("conference.html", num = c_no)


if __name__ == "__main__":
	app.run(debug = True, port = 8000, host = "0.0.0.0")
