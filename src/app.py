"""
Anonvid Server Script
"""

import jsonpickle
import hashlib
import binascii

from flask import Flask
from flask import render_template
from flask import request
from flask import make_response

from database import Database

app = Flask(__name__)
db = Database()

salt = '3e48ad8d29e9b02753c62ea47f365683fd65d861e8dd257b9d0ad91c67b47e12'

def generate_cookie(conf):
	dk = hashlib.pbkdf2_hmac('sha256', conf['conf_id'].encode(), salt.encode(), 100000)
	return str(binascii.hexlify(dk))


@app.route("/", methods=['GET'])
@app.route("/join", methods=['GET'])
def index():
	return render_template("index.html")

@app.route("/join", methods=['POST'])
def join():
	confId = request.form['confId']
	password = request.form['password']
	conf = db.find_conference(confId, password)
	if conf == -1:
		resp = make_response('' , 500)
		resp.set_cookie('conf_id', None)
		return resp
	else:
		resp = make_response(jsonpickle.encode(conf), 200)
		resp.set_cookie('conf_id', generate_cookie(conf))
		return resp


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
