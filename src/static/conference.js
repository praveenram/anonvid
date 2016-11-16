function Conference() {
	var hashPassword = function (password) {
		return password;
	};

	return {
		create: function (name, password) {
			$.ajax("/create", {
				method: 'POST',
				data: {
					name: name,
					password: hashPassword(password)
				},
				success: function (data, status) {
					var confId = JSON.parse(data).confId;
					$(".panel.creation-complete .panel-body code").html(confId);
					$(".panel.create-panel").addClass("hidden");
					$(".panel.creation-complete").removeClass("hidden");
				},
				error: function (responseText, status) {
					$("form.create-conference .form-group.error-creating p.help-block").removeClass('hidden');
				}
			});
		},
		join: function (confNum, password) {
			$.ajax('/join', {
				method: 'POST',
				data: {
					confId: confNum,
					password: hashPassword(password)
				},
				success: function (data, status) {
					conf = JSON.parse(data);
					$("form.join-conference .form-group.error").addClass('hidden');
					$(".panel.join-conference").addClass("hidden");
					$(".panel.joining-conference").removeClass("hidden");
					setTimeout(function () {
						window.location = "/conference?c_no=" + conf["conf_id"];
					}, 2000);
				},
				error: function (responseText, data) {
					$("form.join-conference .form-group.error").removeClass('hidden');
				}
			})
		}
	};
};

var validateInputAndShowErrorMessages = function (name, password, passwordConfirmation) {
	var isValid = true;

	if(name === '') {
		isValid = false;
		$('#conferenceName').closest('.form-group').find('p.help-block.error').removeClass('hidden');
		$('#conferenceName').closest('.form-group').addClass('has-error');
	} else {
		isValid = isValid && true;
		$('#conferenceName').closest('.form-group').find('p.help-block.error').addClass('hidden');
		$('#conferenceName').closest('.form-group').removeClass('has-error');
	}

	if(password === '' || passwordConfirmation === '') {
		isValid = false;
		$('#conferencePassword').closest('.form-group').find('p.help-block.error.empty').removeClass('hidden');
		$('#confirmConferencePassword').closest('.form-group').find('p.help-block.error.empty').removeClass('hidden');
		$('#conferencePassword').closest('.form-group').addClass('has-error');
		$('#confirmConferencePassword').closest('.form-group').addClass('has-error');
		return isValid;
	} else {
		isValid = isValid && true;
		$('#conferencePassword').closest('.form-group').find('p.help-block.error.empty').addClass('hidden');
		$('#confirmConferencePassword').closest('.form-group').find('p.help-block.error.empty').addClass('hidden');
		$('#conferencePassword').closest('.form-group').removeClass('has-error');
		$('#confirmConferencePassword').closest('.form-group').removeClass('has-error');
	}

	if(password !== passwordConfirmation) {
		isValid = false;
		$('#conferencePassword').closest('.form-group').find('p.help-block.error.match').removeClass('hidden');
		$('#confirmConferencePassword').closest('.form-group').find('p.help-block.error.match').removeClass('hidden');
		$('#conferencePassword').closest('.form-group').addClass('has-error');
		$('#confirmConferencePassword').closest('.form-group').addClass('has-error');
	} else {
		isValid = isValid && true;
		$('#conferencePassword').closest('.form-group').find('p.help-block.error.match').addClass('hidden');
		$('#confirmConferencePassword').closest('.form-group').find('p.help-block.error.match').addClass('hidden');
		$('#conferencePassword').closest('.form-group').removeClass('has-error');
		$('#confirmConferencePassword').closest('.form-group').removeClass('has-error');
	}

	return isValid;
};

var validateJoinInputAndShowErrorMessages = function (confId, password) {
	var isValid = true;

	if(confId === '') {
		isValid = false;
		$('#conferenceNum').closest('.form-group').find('p.help-block.error').removeClass('hidden');
		$('#conferenceNum').closest('.form-group').addClass('has-error');
	} else {
		isValid = isValid && true;
		$('#conferenceNum').closest('.form-group').find('p.help-block.error').addClass('hidden');
		$('#conferenceNum').closest('.form-group').removeClass('has-error');
	}

	if(password === '') {
		isValid = false;
		$('#conferencePassword').closest('.form-group').find('p.help-block.error').removeClass('hidden');
		$('#conferencePassword').closest('.form-group').addClass('has-error');
	} else {
		isValid = isValid && true;
		$('#conferencePassword').closest('.form-group').find('p.help-block.error').addClass('hidden');
		$('#conferencePassword').closest('.form-group').removeClass('has-error');
	}

	return isValid;
};

$(document).ready(function () {
	var conference = Conference();

	$('form.create-conference').on('submit', function (event, args) {
		event.preventDefault();

		var name = $('#conferenceName').val().trim();
		var password = $('#conferencePassword').val().trim();
		var passwordConfirmation = $('#confirmConferencePassword').val().trim();

		if(validateInputAndShowErrorMessages(name, password, passwordConfirmation)) {
			//call create ajax call
			conference.create(name, password);
		}
	});

	$('form.join-conference').on('submit', function (event, args) {
		event.preventDefault();

		var confId = $('#conferenceNum').val().trim();
		var password = $('#conferencePassword').val().trim();

		if(validateJoinInputAndShowErrorMessages(confId, password)) {
			//call join ajax call
			conference.join(confId, password);
		}
	});
});
