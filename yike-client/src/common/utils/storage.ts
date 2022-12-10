// localStorage封装
/**
 * 获取数据
 * @param key
 * @param isObj 值是否是对象
 * @returns
 */
export function getItem(
  key: string,
  isObj = false,
): string | Common.Params | Object {
  const value = localStorage.getItem(key)
  return value && !isObj ? value : JSON.parse(value!)
}

/**
 * 设置数据
 * @param key
 * @param value
 */
export function setItem(
  key: string,
  value: string | Common.Params | unknown[] | Object,
) {
  localStorage.setItem(
    key,
    value instanceof Object ? JSON.stringify(value) : value,
  )
}

/**
 * 删除数据
 * @param key
 */
export function removeItem(key: string) {
  localStorage.removeItem(key)
}
