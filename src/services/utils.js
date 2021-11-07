export function readableSize(size) {
	if (size > 2500000) {
		return parseInt(size / (1024 * 1024)) + 'M';
	}
	else {
		return parseInt(size / 1024) + 'k';
	}
}

export function notify(msg) {
	if (window.Notification) {
		const options = {
			icon : document.querySelector('head link[rel^=shortcut]').href,
		};

		if (Notification.permission === 'granted') {
			new Notification(msg, options);
		}
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				if (permission === 'granted') {
					new Notification(msg, options);
				}
			});
		}
	}
}
