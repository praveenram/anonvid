"""
Anonvid Server Script
"""

import jsonpickle
import hashlib
import binascii
import os

from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from flask import redirect

from database import Database
from signals import Signals

productionMode = False
if(os.environ.get('DEPLOY_ENV') == 'production'):
	productionMode = True

app = Flask(__name__)

if(productionMode):
	dbUri = os.environ['MONGODB_URI']
	db = Database(mongo_host=dbUri)
else:
	db = Database()

signals = Signals()

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
	conf = db.get_conference(c_no)

	if conf is None or request.cookies.get('conf_id') != generate_cookie(conf):
		return redirect('/')

	username_cookie = request.cookies.get('username')

	if username_cookie is not None and username_cookie != '':
		user = signals.register_conference(conf['conf_id'], username_cookie)
	else:
		user = signals.register_conference(conf['conf_id'])

	if productionMode:
		signalmaster_url = os.environ['SIGNALMASTER_URL']
	else:
		signalmaster_url = "http://localhost:8888/"

	resp = make_response(render_template("conference.html", name = conf['name'], conf_id = conf['conf_id'], user = user, signalmaster_url = signalmaster_url))
	resp.set_cookie('username', user)
	return resp

@app.route("/leave_conference", methods=['POST'])
def leave_conference():
	c_no = request.form['c_no']
	conf = db.get_conference(c_no)

	if conf is None or request.cookies.get('conf_id') != generate_cookie(conf):
		resp = redirect('/')
	else:
		username_cookie = request.cookies.get('username')
		if username_cookie is not None and username_cookie != '' and conf is not None:
			signals.leave_conference(conf['conf_id'], username_cookie)
		resp = make_response(render_template("index.html"))

	resp.set_cookie('username', '', expires=0)
	resp.set_cookie('conf_id', '', expires=0)
	return resp

if __name__ == "__main__":
	if(productionMode):
		port = int(os.environ['PORT'])
		debug = False
	else:
		port = 8000
		debug = True
	app.run(debug = debug, port = port, host = "0.0.0.0")
