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

# TODOs

## Vite dynamic import

> https://vitejs.dev/guide/features.html#glob-import

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

import 关键字导致 vite 警告，可能会引起生产环境错误：

```ts
// yike-client\src\core\RouteGuard\index.tsx

const modules = import.meta.glob('../../pages/**/*.tsx')
console.log(modules[`../../pages/auth/Main/index.tsx`])

export const lazyLoad = (moduleName: string) => {
  const Module = lazy(
    () => import(`../../pages/${moduleName}`),
    modules[`./../pages/${moduleName}/index.tsx`] as unknown as () => Promise<{
      default: React.FC
    }>
  )

  return <Module />
}
```

---

## 2 实现 grid 布局下多个 videoContainer 对应的比例布局

说明：

(finished) 需要实现动态计算每个子容器内部的宽高 clientHeight/offsetHeight, 将计算结果异步赋值给 videoElement.height

(finished) 根据屏幕大小按比例缩放视频

(unfinished) 根据进入房间人数动态修改 grid rows/cols

---
