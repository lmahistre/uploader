export function post(uri, body) {
	const params = {
		credentials : 'include',
		cache : 'no-store',
	};

	if (body) {
		params.method = 'POST';
		params.body = JSON.stringify(body);
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
}

export function get(uri, params) {
	const queryElts = [];
	for (let k in params) {
		queryElts.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
	}
	const newUri = queryElts.length ? uri + '?' + queryElts.join('&') : uri;
	return post(newUri);
}
