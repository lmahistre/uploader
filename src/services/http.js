const call = function(uri, post) {
	const params = {
		credentials : 'include',
		cache : 'no-store',
	};

	if (post) {
		params.method = 'POST';
		params.body = JSON.stringify(post);
		params.headers = new Headers({  
			'Content-type': 'application/json; charset=UTF-8',
		});
	}

	return fetch(uri, params).then(function(response) {
		return response.json();
	}).then(function(json) {
		if (json.error) {
			return Promise.reject(json.error);
		}
		else {
			return Promise.resolve(json);
		}
	});
};

exports.post = call;

exports.get = function(uri, params) {
	const queryElts = [];
	for (let k in params) {
		queryElts.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
	}
	const newUri = queryElts.length ? uri + '?' + queryElts.join('&') : uri;
	return call(newUri);
};
