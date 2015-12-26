class Store {
  constructor(name) {
    this.name = name;
    this.events = {};
  }

  subscribe(eventName, eventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    console.log("Subscribing event", eventName, "to", this.name);
    this.events[eventName].push(eventHandler);
  }

  publish(eventName, eventDataObj) {
      var eventHandlers = this.events[eventName];
      if (!eventHandlers) {
        new Error("There is no event like", eventName, "subscribed before!");
      }
      eventHandlers.forEach((eHandler) => {
        console.log("Publishing event", eventName, "to", this.name, "with data", eventDataObj);
        eHandler.apply(null, [eventDataObj]);
      });
  }
}

var instance = null;

class Subscriber {
  constructor() {
    if (instance === null) {
      this.stores = {};
      instance = this;
    }
    return instance;
  }

  getStore(storeName) {
    console.log(this.stores);
    return this.stores[storeName];
  }

  createStore(storeName) {
    console.log("creating store", storeName);
    this.stores[storeName] = new Store(storeName);
    return this;
  }
}

export default Subscriber
