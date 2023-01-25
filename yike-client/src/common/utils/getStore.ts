import { store } from '@/redux/store'

/**
 * @description 获取 store 的状态
 * @returns
 */
export const getStore = () => store.getState()
