/**
 * Created by sinires on 08.08.16.
 */
"use strict";

class DS {
    static __getId() {
        return (`${Math.random().toString().replace("0.", "")}${Date.now()}`)
    }

    constructor() {
        this.storage = new Map(),
        this.listeners = new Map(),
        this.serviceField = new Set([`on`]);
    }

    getProxy(key, object){
        let self = this;
        return new Proxy(object, {
                    get(target, field) {
                        return target[field];
                    },

                    set(target, field, value) {
                        if(self.serviceField.has(field))
                            throw new Error(`Field ${field} is blocked for DB object`);

                        let oldValue = target[field];
                        target[field] = value;
                        self.fire(key, {
                            type: oldValue ? "change" : "add",
                            property: field,
                            oldValue: oldValue,
                            value: value,
                            object: Object.assign({}, target)
                        });
                        return true
                    },

                    deleteProperty(target, field) {
                        if (field in target && self.serviceField.has(field)) {
                            return false;
                        }
                        self.fire(key, {type: "delete", property: field});
                        return delete target[field];
                    },
                    ownKeys(target) {
                        let props = Object.keys(target)
                                        .filter(function (prop) {
                                            return !(self.serviceField.has(prop));
                                        });
                        return props;
                    }
                }
        );
    }

    add(key, object) {
        if (this.storage.has(key)) {
            throw new Error(`key ${key} is already in use`);
        }

        let self = this;
        object.on = function (...arg) {
            self.on(key, ...arg);
        };
        
        const proxy = this.getProxy(key, object)
        this.listeners.set(key, new Map())
        this.storage.set(key, proxy);

        return proxy;
    }

    remove(key) {
        return (this.storage.delete(key) && this.listeners.delete(key))
    }

    get(key) {
        if(this.storage.has(key))
            return this.storage.get(key);
        else{
            console.warn(`Element ${key} is not exist`);
            return false
        }
    }

    fireListeners(event, listeners) {
            listeners.forEach((listener)=> {
                setTimeout(function () {
                    listener(event)
                }, 0)
            })
        }

    fire(key, event) {
        let listeners = this.listeners.get(key);
        let property = event.property;
        if(listeners.has(property))
            this.fireListeners(event, listeners.get(property));
        if(listeners.has("*"))
            this.fireListeners(event, listeners.get("*"));
    }

    on(key, callback, property = "*") {
        if (!key || !callback) {
            throw new Error("Key or callback is empty or not exist");
        }

        const listeners = this.listeners.get(key)

        if(!listeners.has(property))
            listeners.set(property, new Map())

        listeners
            .get(property)
            .set(DS.__getId(), callback);
    }
}

const storage = new DS();

