/**
 * @description 生成随机字符串(a-z0-9)
 * @returns 随机字符串
 */
export const generateUID = () => {
  return Math.random().toString(36).slice(2, 10)
}
