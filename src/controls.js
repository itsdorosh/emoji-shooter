/**
 * @class Controls
 * @description this class provide API for interaction with several controls for example mouse or gamepad
 * you can simply subscribe
 */
class Controls {
	rootObject;

	constructor() {
		this.eventStorage = {};
		this.init();
	}

	/**
	 * @method setRootObjectForSubscriptions
	 * @description this method allows you set container, from witch we should be notified about user interactions
	 * @param rootObject - an HTMLElement for subscriptions
	 */
	setRootObjectForSubscriptions(rootObject = document.body) {
		this.rootObject = rootObject;
	}

	/**
	 * @method init
	 */
	init() {
		AVAILABLE_DOM_EVENTS.forEach((eventName) => {
			this.rootObject.addEventListener(eventName, (event) => {
				this.dispatch(eventName, event);
			});
		});
	}

	/**
	 * @method on
	 * @description this method should assign some callback to eventName and prevent secondary assignment
	 * @param eventName
	 * @param callback
	 */
	on(eventName, callback) {
		if (!eventName in this.eventStorage) {
			this.eventStorage[eventName] = callback;
		} else {
			throw 'callback for this eventName already exists';
		}
	}

	/**
	 * @method dispatch
	 * @description this method should provide way for trigger some callback by eventName
	 * @param eventName
	 * @param DOMEvent
	 */
	dispatch(eventName, DOMEvent) {
		if (eventName in this.eventStorage) {
			this.eventStorage[eventName](DOMEvent);
		} else {
			throw(`there is no callback for ${eventName} event name`);
		}
	}

	/**
	 * @method unsubscribe
	 * @description this method allows you remove subscription assigned to the eventName
	 * @param eventName
	 */
	unsubscribe(eventName) {
		if (eventName in this.eventStorage) {
			delete this.eventStorage[eventName];
		}
	}
}
