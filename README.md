# webRTC-tsx

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
  // 注意要先写 `unocss` 的配置
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

解决方法：在 webRTCHandler.ts 文件中 的 handlePeerConnection 函数中提前判断 WebRTCHandler.localStream 是否存在，不存在则调用 WebRTCHandler.getLocalStream 获取本地媒体流，并在 useLoadStream.ts 中判断是否存在 WebRTCHandler.localStream 以防止收发双方的媒体流不统一的问题。

# TODOs

## 为了方便将邮件验证码改为 123456，上线前要改回去

## 画原型图和流程图

## (unfinished) 实现用 middleware 拦截 socket server 报错

## (unfinished) 根据进入房间人数动态修改 grid rows/cols

## (unfinished) 上线后请求路径错误，请求的不是接口地址，而是前端地址

## (unfinished) 不刷新页面的情况下重复进入房间导致媒体流发送异常的问题

## (unfinished) 发起方进入房间时先建立 peer 连接，再执行获取本地摄像头，导致本地和发送的媒体流不一致。 改写为 async/await 后仍会出现不一致的情况
