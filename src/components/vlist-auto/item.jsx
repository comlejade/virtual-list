import { useEffect, useRef } from "react"

export default function Item(props) {
  // eslint-disable-next-line react/prop-types
  const { index, measure, children } = props
  const element = useRef(null)

  const measureItem = (index) => {
    const item = element.current
    if (item.clientHeight) {
      measure(index, item.clientHeight)
    }
  }

  useEffect(() => {
    measureItem(index)
  }, [])

  return (
    <div data-index={index} className="list-item" ref={element}>
      {children}
    </div>
  )
}