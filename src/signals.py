"""
"""
import names

class Signals(object):
	def __init__(self):
		self.conferences = dict()

	def register_conference(self, conf_id, user = None):
		conf = self.conferences.get(conf_id)

		if user is None:
			user = names.get_full_name()

		if conf is None:
			conf = {}
			self.conferences[conf_id] = conf
			conf[user] = {}
		else:
			if user is None:
				while conf.get(user) is not None:
					user = names.get_full_name()
			conf[user] = {}
		return user
