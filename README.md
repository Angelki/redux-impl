# redux-impl
理解Redux的原理，一个比较好的方式就是自己实现一个Redux，这样便知道它背后的原理以及对应的API。



这里主要是参考[Learn Redux by Building Redux from Scratch](https://levelup.gitconnected.com/learn-redux-by-building-redux-from-scratch-dcbcbd31b0d0)

这篇文章，并且使用意译，并非完全按照原文翻译，不过不影响对redux原理的理解，跟着文章的思路实现一遍redux就能了解背后的基本思路。



欢迎访问博客原文[通过从零实现redux来学习redux的原理](https://blog.bookcell.org/2019/08/04/learn-redux-by-build-a-redux/)



## 概念



Redux的核心概念:

> Redux is a predictable state container for JavaScript apps.



也就是说Redux是JavaScript应用中作为一个可预测的状态容器的存在。



Redux通常用于保存应用状态，应用状态由两部分输入组成:

1. 从服务端异步请求的数据

2. 用户在UI上的交互



Redux在`store`（仓库）中管理应用状态。状态本身只是一个纯粹的JavaScript对象。仓库另外提供方法来

更新状态和读取状态。



Redux的核心在于基于观察者模式下的发布订阅模式，有点类似在JS中的事件驱动架构。在Redux中，当用

户和UI交互时，会派发（dispatch）一个`action`（也就是发布）。`action`的概念不需要过度考虑，它

仅仅只是一个纯JS对象，包含一个`type`作为唯一键值和一个`payload`负载数据。



使用`action`，状态可以根据接收到的`type`和`payload`进行更新。组件可以订阅状态的变化，并基于

新的状态树更新UI。



一个数据流的简单表示如下:



用户交互发布一个`action` -> `reducer`更新状态 -> 订阅组件基于新状态更新UI



基于这个概念，Redux有3个核心的原则:

1. 单一数据源。整个UI的状态只有一个对象驱动。

2. 状态是只读的。视图和异步回调均不能直接改写状态。状态只有在触发一个纯JS对象的`action`作为

`reducer`的参数来进行修改。

3. 改动是有纯函数执行的。`reducer`函数接收前一个状态（也是纯对象），并基于前一个状态和`action`

创建一个新的状态。你只能返回一个新的对象，永远不要修改当前的状态。



## 实现



Redux是围绕着`store`为核心的。`store`是一个包含状态、更新方法(`dispatch()`)和读取方

法(`subscribe()/getState()`)的JavaScript对象。还有`listeners`（监听器）用于组件订阅状态

变化执行的函数。



`store`形式如下:



```javascript

const store = {

state: {}, // 状态是一个对象

listners: [], // 监听器是一个函数数组

dispatch: () => {}, // dispatch是一个函数

subscribe: () => {}, // subscribe是一个函数

getState: () => {}, // getState是一个函数

};

```



为了使用这个仓库对象来管理状态，我们要够一个`createStore()`函数，代码如下:



```javascript

const createStore = (reducer, initialState) => {

const store = {};

store.state = initialState;

store.listners = [];

store.getState = () => store.state;

store.subscribe = (listner) => {

store.listners.push(listener);

};

store.dispatch = (action) => {

store.state = reducer(store.state, action);

store.listeners.forEach(listener => listener());

};

return store;

};

```



`createStore`函数接收两个参数，一个是`reducer`和一个`initialState`。reducer函数会在后续

详细介绍，现在只要知道这是一个指示状态应该如何更新的函数。



`createStore`函数开始于创建一个`store`对象。然后通过`store.state = initialState`进行初

始化，如果开发者没有提供则值会是`undefined`。`state.listeners`会被初始化为空数组。



`store`中定义的第一个函数是`getState()`。当调用时只是返回状态，

`store.getState = () => store.state`。



我们允许UI订阅(subscribe)状态的变化。订阅实际上是传递一个函数给`subscribe`方法，并且这个

函数作为监听器会被添加到监听器数组中。`typeof listener === 'function'`的结果是`true`。



在每一个状态变化的时候，我们会遍历所有的监听器函数数组，并逐个执行。



```javascript

store.listeners.forEach(listener => listener());

```



接下来，定义了`dispatch`函数。dispatch函数是当用户和UI交互时，组件进行调用的。dispatch接收

一个单一的`action`对象参数。这个`action`应该要完全描述用户接收到的交互。action和当前状态一起，

会被传递到`reducer`函数，并且返回一个新的状态。



在新的状态被`reducer`创建后，监听器数组会被遍历，并且每个函数会执行。通常，`getState`函数

在监听器函数内部会被调用，因为监听的目的是响应状态变化。



注意到数据流向是一个非常线性和同步的过程。监听器函数添加到一个单独的监听器数组中。当用户

和应用交互时，会产生一个用于dispatch的action。这个action会创建一个可预测和独立的状态改变。

接着这个监听器数组被遍历，让每个监听器函数被调用。



这个过程是一个单向的数据流。只有一个途径在应用中创建和响应数据变化。没有什么特别的技巧发生，

只是一步一步针对交互并遵循明确统一模式的路径。



### Reducer函数



reducer是一个接收`state`和`action`的函数，并返回新的状态。形式如下:



```javascript

const reducer = (prevState, action) => {

let nextState = {}; // 一个表示新状态的对象

// ...

// 使用前一个状态和action创建新状态的代码

// ...

return nextState;

};

```



这里的`prevState`, `nextState`和`action`都是JavaScript对象。



让我们详细看一下`action`对象来理解它是如何用于更新状态的。我们知道一个action会包含

一个唯一的字符串`type`来标识由用户触发的交互。



例如，假设你使用Redux来创建一个简单的todo list应用。当用户点击提交按钮来添加项目到列表中时，

将会触发一个带有`ADD_TODO`类型的action。这是一个既对人类可读和理解，并且对Redux关于aciton目的

也是清晰的指示。当添加一个项目时，它将会包含一个`text`的todo内容作为负载(payload)。因此，

添加一个todo到列表中，可以通过以下的action对象来完全表示:



```javascript

const todoAction = {

type: 'ADD_TODO',

text: 'Get milk from the store',

};

```



现在我们可以构建一个reducer来支撑一个todo应用。



```javascript

const getInitialState = () => ({

todoList: []

});



const reducer = (prevState = getInitialState(), action) => {

switch (action.type) {

case 'ADD_TODO':

const nextState = {

todoList: [

...prevState.todoList,

action.text,

],

};

return nextState;

default:

return prevState;

};

};



// console.log(store.getState()) = { todoList: [] };

//

// store.dispatch({

// type: 'ADD_TODO',

// text: 'Get milk from the store',

//});

//

// console.log(store.getState()) => { todoList: ['Get milk from the store'] }

```



注意每次reducer被调用的时候我们都会创建一个新的对象。我们使用前一次的状态，但是创建了一个

完整全新的状态。这是另一个非常重要的原则能够让redux可预测。通过将状态分割成离散的，开发者

可以精确的指导应用中会发生什么。这里只要了解根据状态的变化来重新渲染UI的特定部分即可。



你通常会看到在Redux中使用`switch`语句。这是匹配字符串比较方便的一个方法，在我们的例子中，

action的`type`为例，对应更新状态的代码块。这个使用`if...else`语句来写没有差别，如下:



```javascript

if (action.type === 'ADD_TODO') {

const nextState = {

todoList: [...prevState.todoList, action.text],

}

return nextState;

} else {

return prevState;

}

```



Redux对于reducer中的内容实际上是无感知的。这是一个开发者定义的函数，用来创建一个新的状态。

实际上，用户控制了几乎所有——reducer，被使用的action，通过订阅被执行的监听器函数。Redux就

像一个夹层将这些内容进行联系起来，并提供一个通用的接口来和状态进行交互。



> 如果你之前了解过`combineReducers`函数，这个只是一个用来允许你在`state`对象中创建隔离的

键值。主要为了让代码更整洁。详细的内容可以查看官方的资料。



## 构建一个简单应用



上面已经讲了redux的全部核心内容，接下来可以用前面的实现来构建一个简单的计数器应用。



我们会创建一个HTML文档，并用给一个`<div>`来包含从我们的redux仓库中的count值。并且放置

一个script标签，并获取`id="count"`的DOM节点。

```html

<!DOCTYPE html>

<html>

<head><meta charset="utf-8"><title></title></head>

<body>

<div>

Random Count: <span id="count"></span>

</div>

</body>

<script>

const counterNode = document.getElementById('count');

</script>

</html>

```



在`<script>`的计数器下方，我们要把`createStore`函数贴进来。在这个函数下面，我们会创建reducer。

这个reducer将会查找一个type为`'COUNT'`的action，并将action的负载中的count添加到原先保存在

仓库中的count。



```javascript

const getInitialState = () => {

return {

count: 0,

};

};



const reducer = (state = getInitialState(), action) => {

switch (action.type) {

case 'COUNT':

const nextState = {

count: state.count + action.payload.count,

};

return nextState;

default:

return state;

}

};

```



现在我们拥有一个reducer，我们可以创建仓库。使用这个新创建的仓库，我们可以订阅仓库中的变化。

每一次状态变化，我们可以从状态中读取`count`并写到DOM中。



```javascript

const store = crateStore(reducer);



store.subscribe(() => {

const state = store.getState();

const count = state.count;

counterNode.innerHTML = count;

});

```



现在我们的应用正在监听状态的变化，让我们创建一个简单的事件监听器，来增加count。事件监听器

将会dispatch一个action，用于发送一个1-10的随机数作为count到reducer中去相加。



```javascript

document.addEventListener('click', () => {

store.dispatch({

type: 'COUNT',

payload: {

count: Math.ceil(Math.random() * 10),

},

});

});

```



最终，我们会dispatch一个空的action来初始化状态。由于没有action的类型，将会执行`default`代码

块，并从`getInittialState()`中返回的值来生成一个状态对象。



```javascript

store.dispatch({}); // 设置初始状态

```



将所有的代码放在一起，就有了以下的应用。



```html

<!DOCTYPE html>

<html>

<head>

<meta charset="utf-u">

<title></title>

</head>

<body>

<div>Random Count: <span id="count"></span></div>

<script>

const counterNode = document.getElementById('count');

const createStore = (reducer, initialState) => {

const store = {};

store.state = initialState;

store.listeners = [];

store.getState = () => store.state;

store.subscribe = listener => {

store.listeners.push(listener);

};

store.dispatch = action => {

console.log('> Action', action);

store.state = reducer(store.state, action);

store.listeners.forEach(listener => listener());

};

return store;

};

const getInitialState = () => {

return {

count: 0,

};

};

const reducer = (state = getInitialState(), action) => {

switch (action.type) {

case 'COUNT':

const nextState = {

count: state.count + action.payload.count,

};

return nextState;

default:

return state;

}

};

const store = createStore(reducer);

store.subscribe(() => {

const state = store.getState();

const count = state.count;

counterNode.innerHTML = count;

});

// 一个简单的事件用来dispatch变化

document.addEventListener('click', () => {

console.log('---- Previous state', store.getState());

store.dispatch({

type: 'COUNT',

payload: {

count: Math.ceil(Math.random() * 10),

},

});

console.log('++++ New State', store.getState());

});

store.dispatch({}); // 设置初始化状态

</script>

</body>

</html>

```



最终代码可以从[我的代码仓库](perry2008084/knowledge)下载，建议个人自己手动敲一遍，实践一遍加深理解。



代码运行后，通过每次点击页面，你可以看到页面上的count会增加一个随机数，并且在控制台会

打印状态的变化。



## 总结



通过上述的一个过程，你可以理解Redux的实现，并且将Redux使用在一个应用中。当然，上述的这个

实现还不能用在生产上，因为缺少边界考虑和优化。



如果看了一遍没有理解，也没有关系，重新从发布订阅开始看，结合实践，终会理解。



其他的材料可以参考redux作者Dan Abramov的[视频教程](https://egghead.io/courses/getting-started-with-redux)。关于什么时候和

为什么要使用redux进行状态管理，可以看Dan的这篇[文章](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)，比较redux和React内部的状态管理。