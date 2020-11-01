exports.readableSize = function(size) {
	if (size > 2500000) {
		return parseInt(size / (1024 * 1024)) + 'M';
	}
	else {
		return parseInt(size / 1024) + 'k';
	}
}

exports.notify = function(msg) {
	if (window.Notification) {
		var options = {
			icon : document.querySelector('head link[rel^=shortcut]').href,
		};

		if (Notification.permission === "granted") {
			var notification = new Notification(msg, options);
		}
		else if (Notification.permission !== "denied") {
			Notification.requestPermission(function (permission) {
				if (permission === "granted") {
					var notification = new Notification(msg, options);
				}
			});
		}
	}
}
