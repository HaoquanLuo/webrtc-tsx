# webRTC-tsx

# gains

## 1 事件委托监听子元素的事件

原理：子元素的事件可以被父元素监听到。

场景：用于解决拖拽丢失的问题。设计拖拽栏的时候先给父元素设置 `onMouseDown` 方法，并用一个变量 `isDragging` 标记是否在进行拖拽状态，执行 `onMouseDown` 方法就设置 `isDragging` 为 `true`。 在 `isDragging` 为 `true` 时渲染子元素，子元素的样式需要设置为 `fixed top-0 bottom-0 left-0 right-0`，并把 `onMouseMove` 、 `onMouseUp` 赋给子元素，这样子元素能占满全屏，并能够正常执行鼠标拖拽事件。

---

## 2 正则表达式判断用户输入是否为空

语句：const whiteSpaceReg = /^(\s\*)$/gm // 'g' for global, 'm' for multiline.

原理：利用贪婪匹配模式(\*)配合空字符表达式(\s)来判断用户输入的字符串是否为空。

---

# Problems

## 1 路由跳转时因使用 lazy load 导致报错:

原因：

在加载路由时未提供过渡动画，直接跳转会导致白屏且报错，相当于访问了 `undefined` ，得不到结果，则报错。

报错：

```ts
react-dom.development.js:19055

Uncaught Error: A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.
    at throwException (react-dom.development.js:19055:35)
    at handleError (react-dom.development.js:26311:7)
    at renderRootSync (react-dom.development.js:26437:7)
    at recoverFromConcurrentError (react-dom.development.js:25850:20)
    at performSyncWorkOnRoot (react-dom.development.js:26096:20)
    at flushSyncCallbacks (react-dom.development.js:12042:22)
    at react-dom.development.js:25651:13
```

解决方法：

在路由外层用 `React.Suspense` 包裹，即 `lazy` 和 `Suspense` 要搭配使用。

---

## 2 login 路径不在 RouteGuard 范围内，如何实现路由守卫:

解决方法：（笨方法）在 Login 和 Register 页面都用 `logState` 判断是否登录，有则重定向到 `'/'` 路径

---

## 3 Unocss valueless attributify 如何支持 tsx：

解决方法：

(1) 在 `vite.config.ts` 引入 `@unocss/preset-attributify` 和 `@unocss/transformer-attributify-jsx` 两个包，并在 `plugins` 加入如下配置：

```ts
plugins: [
  // 注意要先写 `Unocss()` 的配置
  Unocss({
    presets: [presetAttributify()],
    transformers: [transformerAttributifyJsx()],
  }),
  react(),
]
```

(2) 在 src 文件夹下新增 `shims.d.ts` 写入以下内容：

```ts
import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module 'react' {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
```

---

## 4 error TS2503: Cannot find namespace 'xxx'

原因：

编写 `namespace` 时只是将其声明而未将其导出，导致 TS 识别不到其内容引发报错

解决方法：

将 `declare` 改为 `export`

```ts
export namespace XXX {}
```

---

## 5 进入房间并设置了媒体流后未渲染 `VideoBox` 组件，而是一直渲染 `Loading`

原因：

没有在 `VideoBox` 的 `useEffect` 的 `dependencies` 中设置 `srcObject`

解决方法：

在 `useEffect` 的依赖项中添加 `srcObject`

---

## 6 Vite `import` 关键字导致 vite 警告，可能会引起生产环境错误：

```ts
const modules = import.meta.glob('./dir/*.js')
The above will be transformed into the following:

js
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```

解决方法：

> https://vitejs.dev/guide/features.html#glob-import

```ts
// yike-client\src\core\RouteGuard\index.tsx
const modules = import.meta.glob<{ default: React.FC }>('../pages/**/*.tsx')

export const lazyLoad = (moduleName: string) => {
  const component = modules[`../pages/${moduleName}.tsx`]
  const Module = lazy(component)

  return <Module />
}
```

---

## 7 SimplePeer 创建连接时，房主（应答方）无法显示对方媒体流

原因：在发起方（成员）发起 peer 连接（加入房间）时，发起方（成员）的本地媒体流是 null，故创建 SimplePeer 实例时传入 option 中的 stream 是 null，导致应答方（房主）接收不到正确的媒体流因而无法显示。

解决方法：在 webRTCHandler.ts 文件中 的 handlePeerConnection 函数中提前判断 WebRTCHandler.localStream 是否存在，不存在则调用 WebRTCHandler.getLocalStream 获取本地媒体流

---

## 8 在 useLoadStream.ts 中执行 WebRTCHandler.initLocalStream 出现收发双方的媒体流不统一的问题

原因：async 函数遇到 await 关键字后会暂停执行当前函数，并让出当前函数的控制权（即暂停当前函数执行，返回到调用栈的上一层函数），且将 await 关键字后的剩余的未执行完的函数排到任务队列的队尾，js 引擎会一直执行剩余的任务，直到队列中的其他异步任务都执行完了，再执行被暂停执行的 await 关键字后的剩余的未执行完函数

解决方法：在 initLocalStream 方法中再加一层判断，在异步函数 getUserMedia 获取到用户的摄像头数据后，再判断一遍此时的 WebRTCHandler.localStream 是否存在，若存在则退出执行该函数，否则继续进行初始化本地媒体流的过程。

---

## 9 在一个异步函数中执行了两个不同的 store.dispatch ，前者为初始化，后者为更新数据，后者拿不到前者的执行结果

原因：第一个 dispatch 函数执行完之后，当前的状态已经发生了更新，但是后者此时依赖的变量仍是更新前的状态（即所依赖的变量的值在其获取到的那一刻已经定好了，不要被响应式数据的概念弄混了）。

解决方法：遵循函数的单一职责原则，将原函数拆解为两个子函数，第一个用于同步进行初始化，第二个用于更新数据，这样执行的时候就能保证第二个函数拿到的值一定是更新后的值。

---
