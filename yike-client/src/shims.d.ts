// import type { AttributifyAttributes } from '@unocss/preset-attributify'

// declare module 'react' {
//   interface HTMLAttributes<T> extends AttributifyAttributes {}
// }

// 这样设置不会导致 TypeScript 的类型推断出现延迟，但需要手动添加内容
import * as React from 'react'
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: string]: any
    w?: string
    h?: string
    flex?: boolean
    relative?: boolean
    text?: string
    grid?: boolean | string
    before?: string
    after?: string
    shadow?: boolean
    absolute?: boolean
    screen?: string
  }
}
