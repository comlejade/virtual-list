import faker from 'faker';
// import VListBase from './components/vlist-base';

import './App.css'
import VListAuto from './components/vlist-auto';
// import Item from './components/vlist-auto/item';
import ObserverItem from './components/vlist-auto/observer-item';

// let list = [];
// for (let i = 0; i < 1000; i++) {
//   list.push({id: i})
// }
let data = [];
for (let i = 0; i < 1000; i++) {
  const item = {
    id: i,
    value: faker.lorem.paragraphs() // 长文本
  };

  if (i % 10 === 1) {
    item.src = faker.image.image()
  }
  data.push(item)
}

function App() {
  // 开始图片
  const enableImage = true;
  
  return <div className='app'>
      {/* <VListBase list={list} /> */}
      <VListAuto list={data}>
        {
          ({index, item, measure}) => (
            <ObserverItem index={index} key={item.id} measure={measure}>
              <>
                {item.value}
                {enableImage && item.src && (
                  <img src={item.src} onLoad={() => measure(index)} />
                )}
              </>
            </ObserverItem>
          )
        }
      </VListAuto>
    </div>
    
}

export default App
