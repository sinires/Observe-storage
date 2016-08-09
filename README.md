# Observe-storage
Хранилище объектов с функционалом асинхронного обзора изменений хранимого объекта.

## Install
```HTML
<script type="text/javascript" src="/src/ObserveStorage.js"></script>
```
## Usage

#### Добавление объекта в хранилище
```Javascript
    let wrapper = ObserveStorage.add(key, object); //return Proxy
//or
    let wrapper = ObserveStorage.add(object); //return Proxy
```
    
#### Получение объекта из хранилища
```Javascript
let wrapper = ObserveStorage.get(key); //return Proxy
```

#### Удаление объекта из хранилища
```Javascript
ObserveStorage.remove(key); //return boolean
```

#### Подписка на изменение объекта
##### Подписка на все поля
```Javascript
  const subId = wrapper.on(callback); //return subscribe id
```
##### Подписка на определенное поле 
```Javascript
  const subId = wrapper.on(callback, field); //return subscribe id
```

#### Отписка от изменения объекта
```Javascript
  wrapper.un(subId); //return Proxy
```

## License
  This work is licensed under a Creative Commons Attribution 3.0 Unported License.
