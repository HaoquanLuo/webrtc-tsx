/**
 * @description 根据传入的元素动态获取内部宽高
 */
export const calcDynamicSize = (element: HTMLElement) => {
  console.log('calculating dynamic height')
  let { clientWidth, clientHeight } = element

  return { clientWidth, clientHeight }
}
