function supportAjaxUploadWithProgress() {

	return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();

	function supportFileAPI() {

		var fi = document.createElement('INPUT');
		fi.type = 'file';

		return 'files' in fi;

	};

	function supportAjaxUploadProgressEvents() {

		var xhr = new XMLHttpRequest();

		return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));

	};

	function supportFormData() {

		return !! window.FormData;

	}

}

if (supportAjaxUploadWithProgress()) {

	var uploadBtn = document.getElementById('upload-button-id');

	uploadBtn.removeAttribute('disabled');

	initFullFormAjaxUpload();

	initFileOnlyAjaxUpload();

}

function initFullFormAjaxUpload() {

	var form = document.getElementById('upload--files');

	form.onsubmit = function() {

		var formData = new FormData(form);

		var action = form.getAttribute('action');

		sendXHRequest(formData, action);

		return false;

	}

}

function initFileOnlyAjaxUpload() {

	var uploadBtn = document.getElementById('upload-button-id');

	uploadBtn.onclick = function (evt) {

		var formData = new FormData();

		var action = '/upload';

		var fileInput = document.getElementById('files');
		var file = fileInput.files[0];

		formData.append('datafile', file);

		sendXHRequest(formData, action);

	}

}

function sendXHRequest(formData, uri) {

	var xhr = new XMLHttpRequest();

	xhr.upload.addEventListener('loadstart', onloadstartHandler, false);
	xhr.upload.addEventListener('progress', onprogressHandler, false);
	xhr.upload.addEventListener('load', onloadHandler, false);
	xhr.addEventListener('readystatechange', onreadystatechangeHandler, false);

	xhr.open('POST', uri, true);

	xhr.send(formData);

}

function onloadstartHandler(evt) {

	var div = document.getElementById('status--upload');

	div.innerHTML = 'Upload started.';

}

function onloadHandler(evt) {

	var div = document.getElementById('status--upload');

	div.innerHTML += '<' + 'br>File uploaded. Waiting for response.';

}

function onprogressHandler(evt) {

	var div = document.getElementById('progress');

	var percent = evt.loaded/evt.total*100;

	div.innerHTML = 'Progress: ' + percent + '%';

}

function onreadystatechangeHandler(evt) {

	var status, text, readyState;

	try {

		readyState = evt.target.readyState;
		text = evt.target.responseText;
		status = evt.target.status;

	}

	catch(e) {

		return;

	}

	if (readyState == 4 && status == '200' && evt.target.responseText) {

		var status = document.getElementById('status--upload');

		status.innerHTML += '<br>Success!';

		var result = document.getElementById('result');

		result.innerHTML = '<p>The server saw it as:</p><pre>' + evt.target.responseText + '</pre>';

	}

}
