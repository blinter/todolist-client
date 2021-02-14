import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import _ from 'underscore';
import './App.css';
import ListItemComponent from './ListItemComponent'
import Emitter from './Emitter';
import KeyUtils from './keyUtils'

function App() {


  const [rootItem, setRootItem] = useState({
    root: true,
    key: KeyUtils.generateKey('item'),
    description: `Lista Exemplo`,
    itens: [{
      description: 'Item description', details: 'Item detais', key: KeyUtils.generateKey('item'),
      itens: [
        {
          description: 'Nested Item description', details: 'Nested Item detais', key: KeyUtils.generateKey('item'),

        }
      ]
    }]
  })

  useEffect(() => {
    Emitter.on('REMOVE_ITEM', removeItem)
    // Emitter.on('ADD_ITEM', addItem)
    Emitter.on('ADD_NEW_ITEM', addNewitem)
    console.log('mounted')
    return null
  }, [])

  const removeItem = (item) => {
    console.log('removeItem')
    findAndRemove(rootItem, item)
  }

  const addNewitem = (evt) => {
    console.log('addNewitem')

    let newRootItem = _.clone(rootItem)

    let parent = find_item(newRootItem, evt.parent.key)

    parent.itens = parent.itens || []
    parent.itens.push(evt.newItem)

    setRootItem(newRootItem)

  }

  // const addItem = (args) => {
  //   console.log('addItem')

  //   let newRootItem = _.clone(rootItem)

  //   let parent = find_item(newRootItem, args.item.key)

  //   let newSubItem = args.newItem || { description: 'Item description', details: 'Item detais' }
  //   newSubItem.key = KeyUtils.generateKey('item')

  //   parent.itens = parent.itens || []
  //   parent.itens.push(newSubItem)

  //   setRootItem(newRootItem)
  // }


  const find_item = (tree, key) => {
    if (tree.key === key) return tree

    for (const i of tree.itens) {
      if (key === i.key) {
        return i
      }
      if (key != i.key && (i.itens && i.itens.length > 0)) {
        return find_item(i, key)
      }

    }

    return null
  }

  const findAndRemove = (tree, toFind) => {

    for (const i of tree.itens) {
      if (toFind.key === i.key) {
        tree.itens = tree.itens.filter(j => j.key != toFind.key)

        let newRootItem = _.clone(rootItem)
        setRootItem(newRootItem)
        break
      }
      if (toFind.key != i.key && (i.itens && i.itens.length > 0)) {
        findAndRemove(i, toFind)
      }

    }
  }

  return (
    <div className="mb-5">
      <header>
        <h1>TODOList APP</h1>
      </header>
      <div >
        <div key={rootItem.key} className='p-3 mt-2'>
          <h4>{rootItem.description}</h4>
          <div className='bg-white rounded border border-white p-2'>

            <ListItemComponent number={1} parent={rootItem} item={rootItem}
              onDescriptionChange={(item) => { }}
            // onRemoveItem={(item) => {
            //   findItem(rootItem, item);
            // }}
            // onAddItem={(parentItem, newItem) => {

            //   console.log(`Item que disparou o evento ->`)
            //   console.log(parentItem)
            //   console.log(newItem)

            //   parentItem.itens = parentItem.itens || []

            //   console.log(`Item novo ->`)
            //   let newSubItem = newItem || { description: 'Item description', details: 'Item detais' }
            //   newSubItem.key = generateItemKey()
            //   console.log(newSubItem)
            //   parentItem.itens.push(newSubItem)

            //   let newRootItem = _.clone(rootItem)
            //   setRootItem(newRootItem)

            // }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
