import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import './auto.css'
import Skeleton from "react-loading-skeleton";

export default function VListAuto(props) {
  // eslint-disable-next-line react/prop-types
  const { list = [], children } = props;
  const viewport = useRef(null);
  const listArea = useRef(null);
  const phantom = useRef(null);

  // 列表前后缓存条数
  const buffered = 10;

  // 预估高度
  const defaultItemSize = 100;
  // 纪录列表项的位置信息
  const [positions, setPositions] = useState(
    list.map((item, index) => {
      return {
        index,
        height: defaultItemSize,
        top: index * defaultItemSize,
        bottom: (index + 1) * defaultItemSize
      }
    })
  )

  // window.positions = positions;

  // 列表总高度
  const [phantomHeight, setPhantomHeight] = useState(
    positions.reduce((total, item) => total + item.height, 0)
  )
  
  const viewCount = 10; // 渲染数量
  const [startIndex, setStartIndex] = useState(0)
  // const endIndex = useMemo(() => startIndex + viewCount, [startIndex])
  const endIndex = useMemo(
    () => Math.min(startIndex + viewCount + buffered, list.length),
    [startIndex, list.length]
  );
  // const [startOffset, setStartOffset] = useState(0)
  
  useEffect(() => {
    if (positions.length) {
      const totalHeight = positions.reduce((total, item) => total + item.height, 0)
      setPhantomHeight(totalHeight)
    }
  }, [positions])

  // 测量高度
  const measure = (index, height) => {
    // 如果没有传入 height, 主动进行测量
    if (height === undefined) {
      height = listArea.current.querySelector(`[data-index="${index}"]`).clientHeight || defaultItemSize;
    }

    positions.forEach(item => {
      if (item.index === index) {
        let oldHeight = item.height
        let dHeight = oldHeight - height
        
        // 向下更新
        if (dHeight) {
          item.height = height
          item.bottom = item.bottom - dHeight

          for (let k = index + 1; k < positions.length; k++) {
            positions[k].top = positions[k - 1].bottom
            positions[k].bottom = positions[k].bottom - dHeight
          }
        }
      }
    })

    setPositions(positions)
  }

  // 获取 startIndex 二分查找法
  //二分法查找
  const binarySearch = (positions, value) => {
    let start = 0; //开始
    let end = positions.length - 1; //结束位置
    let temp = null; //记录当前的高度临时值
    //当开始位置小于结束的位置的时候，就一直往下找
    while (start <= end) {
      //找到中间的位置
      let middleIndex = parseInt((start + end) / 2);
      //中间位置bottom位置
      let middleValue = positions[middleIndex].bottom;
      //如果当前的middleValue与value相等，则可进行
      if (middleValue === value) {
        return middleIndex + 1;
      } else if (middleValue < value) {
        //当前要查找的在右边
        start = middleIndex + 1;
      } else if (middleValue > value) {
        //当前要查找的在左边
        //  temp为存储的临时数据 如果不存在middleValue == value的时候 返回这个临时的数据
        if (temp == null || temp > middleIndex) {
          temp = middleIndex; //找到范围
        }
        end = middleIndex - 1;
      }
    }
    return temp;
  };

  const getStartIndex = (scrollTop) => {
    // let item = positions.find(i => i && i.bottom > scrollTop);
    let item = binarySearch(positions, scrollTop)
    console.log('item -> ', item)
    // return item.index
    return Math.max(0, item - buffered)
  }

  // 获取 startOffset
  // const getStartOffset = (startIndex) => {
  //   // return startIndex >= 1 ? positions[startIndex - 1].bottom : 0
  //   return startIndex >= 1? positions[startIndex].top : 0;
  // }

  const onScroll = () => {
    const scrollTop = viewport.current.scrollTop
    const startIndex = getStartIndex(scrollTop)
    setStartIndex(startIndex)

    // const startOffset = getStartOffset(startIndex)
    // setStartOffset(startOffset)
  }

  const isBetweenRanges = useCallback((index) => {
    return index >= startIndex && index <= endIndex;
  }, [startIndex, endIndex])

  return (
    <div className="viewport" ref={viewport} onScroll={onScroll}>
      <div className="list-phantom" ref={phantom} style={{height: `${phantomHeight}px`}}></div>
      <div 
        className="list-area" 
        ref={listArea} 
        // style={{transform: `translate3d(0, ${startOffset}px, 0)`}}
      >
        {
          // list.map((item, index) => (
          //   index >= startIndex &&
          //   index <= endIndex &&
          //   children({index, item, measure})
          // ))
          list.map((item, index) => (
            <div key={item.id} style={{ minHeight: positions[index].height }}>
              {isBetweenRanges(index) ? (
                children({
                  index,
                  item,
                  measure
                })
              ) : (
                <Skeleton height={20} count={5} />
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}