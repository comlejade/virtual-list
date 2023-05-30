import { useEffect, useRef } from "react"

export default function ObserverItem(props) {
  // eslint-disable-next-line react/prop-types
  const { index, measure, children } = props
  const element = useRef(null)

  // 初次渲染完成
  const measureItem = (index) => {
    const item = element.current
    if (item.clientHeight) {
      measure(index, item.clientHeight)
    }
  }

  // 监听高度变化
  const observe = () => {
    const resizeObserver = new ResizeObserver(() => {
      // 获取当前列表项的高度
      const el = element.current
      if (el && el.offsetHeight) {
        // 出发更新
        measure(index, el.offsetHeight)
      }
    })

    resizeObserver.observe(element.current)

    return () => resizeObserver.disconnect()
  }

  useEffect(() => {
    measureItem(index)

    return observe();
  }, [])

  return (
    <div data-index={index} className="list-item" ref={element}>
      {children}
    </div>
  )
}