class Controls {
	rootObject;

	constructor() {
		this.eventStorage = {};
		this.init();
	}

	/**
	 * @method setRootObjectForSubscriptions
	 * this method allows you set container,
	 * from witch we should be notified about user interactions
	 * @param rootObject - an HTMLElement for subscriptions
	 */
	setRootObjectForSubscriptions(rootObject = document.body) {
		this.rootObject = rootObject;
	}

	init() {
		for (let gameEvent in GAME_EVENT_MAP) {
			GAME_EVENT_MAP[gameEvent].forEach((mappedDOMEvent) => {
				this.rootObject.addEventListener(mappedDOMEvent, (DOMEvent) => {
					this.dispatch(gameEvent, DOMEvent);
				});
			});
		}
	}

	on(eventName, callback) {
		if (!eventName in this.eventStorage) {
			this.eventStorage[eventName] = callback;
		} else {
			throw 'callback for this eventName already exists';
		}
	}

	dispatch(eventName, DOMEvent) {
		if (eventName in this.eventStorage) {
			this.eventStorage[eventName](DOMEvent);
		}
	}

	unsubscribe(eventName) {
		if (eventName in this.eventStorage) {
			delete this.eventStorage[eventName];
		}
	}
}
