const call = function(uri, post) {
  const params = {
    credentials : 'include',
    cache : 'no-store',
  };

  if (post) {
    params.method = 'POST';
    params.body = JSON.stringify(post);
    params.headers = new Headers({  
      'Content-type': "application/json; charset=UTF-8",
    });
  }

  return fetch(uri, params).then(function(response) {
    return response.text();
  })
  .then(function(responseText) {
    return new Promise(function(resolve, reject) {
      try {
        const responseData = JSON.parse(responseText);
        resolve(responseData);
      }
      catch (error) {
        reject(error);
      }
    });
  })
  .catch(function(error) {
    return new Promise(function(resolve, reject) {
      reject(error);
    });
  })
}

exports.post = call;

exports.get = function(uri, params) {
  const queryElts = [];
  for (let k in params) {
    queryElts.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
  }
  const newUri = queryElts.length ? uri + '?' + queryElts.join('&') : uri;
  return call(newUri);
}
