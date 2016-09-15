/**
 * Created by sinires on 08.08.16.
 */
"use strict";

class OS {
    /**
     * Generation id
     * @returns {string}
     * @private
     */
    static __getId() {
        return (`${Math.random().toString().replace("0.", "")}${Date.now()}`)
    }

    constructor() {
        this.storage      = new Map();
        this.listeners    = new Map();
        this.serviceField = new Set([`on`, 'un']);
    }

    /**
     * Generate wrappers for object
     * @param key
     * @param object
     * @returns {Proxy}
     */
    getProxy(key, object){
        let self = this;
        return new Proxy(object, {
                    get(target, field) {
                        return target[field];
                    },

                    set(target, field, value) {
                        if(self.serviceField.has(field))
                            throw new Error(`Field ${field} is blocked for DB object`);

                        const oldValue = target[field];
                        target[field] = value;
                        self.fire(key, {
                            type:       oldValue ? "change" : "add",
                            property:   field,
                            oldValue:   oldValue,
                            value:      value,
                            object:     self.get(key)
                        });
                        return true
                    },

                    deleteProperty(target, field) {
                        if (!field in target || self.serviceField.has(field)) {
                            return false;
                        }

                        const oldValue = target[field];

                        delete target[field];

                        self.fire(key, {
                            type:       "delete",
                            property:   field,
                            oldValue:   oldValue,
                            value:      undefined,
                            object:     self.get(key)
                        });

                        return true;
                    },
                    ownKeys(target) {
                        return Object.keys(target)
                                        .filter(function (prop) {
                                            return !(self.serviceField.has(prop));
                                        });
                    }
                }
        );
    }

    /**
     * Adding an object to the storage
     * @param key
     * @param object
     * @returns {Proxy}
     */
    add(...arg) {
        let key, object;

        if(arg.length == 1){
            [object] = arg;
             key = OS.__getId();
        }
        else
            [key, object] = arg;

        if (this.storage.has(key)) {
            throw new Error(`key ${key} is already in use`);
        }

        object.on = (...arg)=> this.on(key, ...arg);
        object.un = (...arg)=> this.un(key, ...arg);
        
        const proxy = this.getProxy(key, object);
        this.listeners.set(key, new Map());
        this.storage.set(key, proxy);

        return proxy;
    }

    /**
     * Deleting an object from the storage
     * @param key
     * @returns {boolean}
     */
    remove(key) {
        return (this.storage.delete(key) && this.listeners.delete(key))
    }

    /**
     * Getting an object from the repository
     * @param key
     * @returns {Proxy || undefined}
     */
    get(key) {
        if(this.storage.has(key))
            return this.storage.get(key);
        else{
            console.warn(`Element ${key} is not exist`);
            return undefined;
        }
    }

    /**
     * Call object listeners
     * @param event
     * @param listeners
     */
    fireListeners(event, listeners) {
            listeners.forEach((listener)=> {
                setTimeout(()=> listener(event), 0);
            })
        }

    /**
     * Processing object events
     * @param key
     * @param event
     */
    fire(key, event) {
        let listeners = this.listeners.get(key)
            ,property = event.property;

        listeners.has(property) && this.fireListeners(event, listeners.get(property));
        listeners.has("*")      && this.fireListeners(event, listeners.get("*"));
    }


    on(key, callback, property = "*") {
        if (!key || !callback) {
            throw new Error("Key or callback is empty or not exist");
        }
        const listeners      = this.listeners.get(key),
            subscriptionId = OS.__getId();
        !listeners.has(property) && listeners.set(property, new Map());
        listeners
            .get(property)
            .set(subscriptionId, callback);
        return subscriptionId;
    }

    un(key, subscriptionId) {
        if (!key) {
            throw new Error("Key is empty or not exist");
        }
        const listeners = this.listeners.get(key);
        if (listeners)
            for (let listener of listeners.values()) {
                if (listener.delete(subscriptionId))
                    return true;
            }
        return false;
    }

}

window.ObserveStorage = new OS();


