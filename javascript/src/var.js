import Events from "./events";

export default class Var {
  constructor(group, name, /*optional*/ value) {
    this._group = group;
    this._name = name;
    this._value = value;
    this._events = new Events();
  }

  get() {
    return this._value;
  }

  set(value, /*optional*/ event) {
    if (this._value === value) {
      // Do nothing; the value hasn't changed
      return;
    }
    var oldValue = this._value;
    this._value = value;
    // Alert JavaScript listeners that the value has changed
    var evt = {};
    if (event && typeof(event) === "object") {
      for (var k in event) {
        if (event.hasOwnProperty(k))
          evt[k] = event[k];
      }
    }
    evt.oldValue = oldValue;
    evt.value = value;
    this._events.trigger("change", evt, this);

    // TODO: Make this extensible, to let arbitrary back-ends know that
    // something has changed
    if (global.Shiny) {
      Shiny.onInputChange(
        ".clientValue-" +
          (this._group.name !== null ? this._group.name + "-" : "") +
          this._name,
        value
      );
    }
  }

  on(eventType, listener) {
    return this._events.on(eventType, listener);
  }

  removeChangeListenerfunction(eventType, listener) {
    return this._events.off(eventType, listener);
  }
}
