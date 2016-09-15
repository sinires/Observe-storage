# Observe-storage
The object storage with asynchronous observing the stored object changes.

## Install
```HTML
<script type="text/javascript" src="/src/ObserveStorage.js"></script>
```
## Usage

#### Adding object to the storage
```Javascript
    let wrapper = ObserveStorage.add(key, object); //return Proxy
//or
    let wrapper = ObserveStorage.add(object); //return Proxy
```
    
#### Extract object from the storage
```Javascript
let wrapper = ObserveStorage.get(key); //return Proxy
```

#### Removing object from the storage
```Javascript
ObserveStorage.remove(key); //return boolean
```

#### Subscribing to the object changes
##### Subscribing to all the fields
```Javascript
  const subId = wrapper.on(callback); //return subscribe id
```
##### Subscribing to a specific field
```Javascript
  const subId = wrapper.on(callback, field); //return subscribe id
```

#### Unsubscribing from the object changes
```Javascript
  wrapper.un(subId); //return Proxy
```

## License
  This work is licensed under a Creative Commons Attribution 3.0 Unported License.
