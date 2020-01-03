exports.notify = function(msg) {
	if (window.Notification) {
		var options = {
			// icon : $('head link[rel^=shortcut]').attr('href'),
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
