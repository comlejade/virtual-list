import { useRef, useState, useMemo } from "react";

import './base.css'

export default function VListBase(props) {
  // eslint-disable-next-line react/prop-types
  const {list = []} = props;

  const viewport = useRef(null);
  const listArea = useRef(null);
  const phantom = useRef(null);

  // 每项列表的高度
  const itemSize = 100;
  // 列表总高度
  const phantomHeight = list.length * itemSize;
  // 渲染数量
  const viewCount = 10;
  // 开始index
  const [startIndex, setStartIndex] = useState(0)
  // 结束index
  const endIndex = useMemo(() => {
    return startIndex + viewCount
  }, [startIndex, viewCount]);
  // 偏移量
  const [startOffset, setStartOffset] = useState(0)

  // 获取startIndex
  const getStartIndex = (scrollTop) => {
    return Math.floor(scrollTop / itemSize);
  }

  // 获取scrollOffset
  const getStartOffset = (startIndex) => {
    return startIndex * itemSize;
  }

  // 是否在显示范围之间
  const isBetweenViewRanges = (index) => {
    return index >= startIndex && index <= endIndex;
  }

  /**
   * 获取滚动距离 scrollTop
   * 根据 scrpllTop 和 itemSize 计算出 startIndex 和 endIndex
   * 根据 scrollTop 和 itemSize 计算出 startOffset
   * 显示 startIndex 和 endIndex 之间的元素
   * 设置 listArea 的偏移量为 startOffset
   */
  const onScroll = () => {
    const scrollTop = viewport.current.scrollTop;
    const startIndex = getStartIndex(scrollTop);
    setStartIndex(startIndex)

    const startOffset = getStartOffset(startIndex);
    setStartOffset(startOffset)
  }

  return (
    // 可视区域的容器
    <div className="viewport" ref={viewport} onScroll={onScroll}>
      {/* 容器内的占位。高度为真是列表区域的高度，用于形成滚动条 */}
      <div className="list-phantom" ref={phantom} style={{height: `${phantomHeight}px`}}></div>
      {/* 列表项的渲染区域 */}
      <div className="list-area" ref={listArea} style={{transform: `translate3d(0, ${startOffset}px, 0)`}}>
        {
          list.map((item, index) => (
            isBetweenViewRanges(index) && (
              <div className="list-item" key={item.id} style={{height: itemSize + "px", lineHeight: itemSize + "px"}}>
                {item.id}
              </div>
            )
          ))
        }
      </div>
    </div>
  )
}