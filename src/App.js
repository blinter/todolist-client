import { Button } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import _ from 'underscore'
import './App.css';
import ListItemComponent from './ListItemComponent';

function App() {

  const [rootItem, setRootItem] = useState({ itens: [] })

  useEffect(() => {
    setRootItem({
      key: generateItemKey(),
      description: `Lista Exemplo`,
      itens: [{
        description: 'Item description', details: 'Item detais', key: generateItemKey(),
        itens: [
          {
            description: 'Nested Item description', details: 'Nested Item detais', key: generateItemKey(),

          }
        ]
      }]
    })
  }, [])

  const generateItemKey = () => {
    return `item-${new Date().getTime()}`
  }

  const onItemChange = (item) => {
    console.log(item)

    item.itens = item.itens || []

    item.itens.push({ description: 'Item description', details: 'Item detais', key: generateItemKey() })

    let newRootItem = _.clone(rootItem)
    setRootItem(newRootItem)

    let all_itens = []
    converter_arvore_para_lista(rootItem, all_itens)

    console.log(all_itens)
  }

  const converter_arvore_para_lista = function (item, acc = []) {
    acc.push(item)

    if (item.itens)
      for (const r of item.itens)
        converter_arvore_para_lista(r, acc);
  }

  return (
    <div className="App">
      <header>
        <h1>TODOList APP</h1>
        {/* <Button color="primary" variant='contained'
          onClick={() => {
            
          }}
        >Criar lista</Button> */}
      </header>
      <div >
        <div key={rootItem.key} className='card border p-3 mt-2 rounded'>
          <h4>{rootItem.description}</h4>
          <ul className='list-group'>
            {rootItem.itens?.map((item) => {
              return (<li key={item.key} className='list-group-item'>
                {/* <h5>{item.description}</h5>
                <p>{item.details}</p>
                <button onClick={() => {
                  onItemChange(item)
                }}>+</button> */}

                <ListItemComponent item={item} onItemChange={(item) => {
                  console.log(item)

                  item.itens = item.itens || []

                  item.itens.push({ description: 'Item description', details: 'Item detais', key: generateItemKey() })

                  let newRootItem = _.clone(rootItem)
                  setRootItem(newRootItem)

                  let all_itens = []
                  converter_arvore_para_lista(rootItem, all_itens)

                  console.log(all_itens)
                }} />
                {/* <Button variant='outlined' size='small' onClick={() => {
                  let newRootItem = _.clone(rootItem)

                  //If does not have a itens array, set a new one.
                  newRootItem.itens = newRootItem.itens ? newRootItem.itens : []

                  newRootItem.itens.push({
                    description: 'descricao do item',
                    details: 'Detalhes do item',
                    key: `list-item-${new Date().getTime()}`
                  })
                  setRootItem(newRootItem)
                }}>+</Button> */}
              </li>)
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
