# webrtc-tsx

# Problems

1 路由跳转时因使用 lazy load 导致报错:

原因：在加载路由时未提供过渡动画，直接跳转会导致白屏且报错，相当于访问了 `undefined` ，得不到结果，则报错。

代码：

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

解决方法：在路由外层用 `React.Suspense` 包裹，即 `lazy` 和 `Suspense` 要搭配使用。

2 login 路径不在 RouteGuard 范围内，如何实现路由守卫:

解决方法：

1. 在 Login 和 Register 页面都用 `logState` 判断是否登录，有则重定向到 `'/'` 路径

---

# TODOs

## vite dynamic import

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
