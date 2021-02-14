import { useEffect, useState } from "react";
import { useParams } from "react-router";

import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.css';
import _ from 'underscore';
import './App.css';
import ListItemComponent from './ListItemComponent'
import Emitter from './Emitter';

function PaginaLista() {

    let { key } = useParams()

    const [rootItem, setRootItem] = useState({sa:'estou em outro escopo :)'})

    useEffect(() => {

        Emitter.on('REMOVE_ITEM', removeItem)
        Emitter.on('ADD_NEW_ITEM', addNewitem)
        Emitter.on('ITEM_DESCRIPTION_CHANGE', itemDescriptionChange)

        fetch(`http://localhost:4500/list/${key}`)
            .then(results => results.json())
            .then(data => {
                setRootItem(data)
            });

    }, [])

    const itemDescriptionChange = (item) => {
        console.log('itemDescriptionChange', item)
        let newRootItem = _.clone(rootItem)
        let findedItem = find_item(newRootItem, item.key)
        findedItem.description = item.description
        setRootItem(newRootItem)
    }

    const removeItem = (item) => {
        findAndRemove(rootItem, item)
    }

    const addNewitem = (evt) => {
        let newRootItem = _.clone(rootItem)

        let parent = null;
        if (newRootItem.key === evt.parent.key) {
            parent = newRootItem
        } else {
            parent = find_item(newRootItem, evt.parent.key)
        }
        parent.itens = parent.itens || []
        parent.itens.unshift(evt.newItem)
        setRootItem(newRootItem)
    }

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
            <div key={rootItem.key} className='p-3 mt-2'>
                <h4>{rootItem.description}</h4>
                <div className='bg-white rounded border border-white p-2'>
                    <ListItemComponent
                        number={1}
                        parent={rootItem}
                        item={rootItem}
                        onDescriptionChange={(item) => { }}
                    />
                </div>
            </div>

            <div >
                <button onClick={(evt) => {
                    console.log(rootItem)
                    $.post('http://localhost:4500/list', rootItem)
                }}>SYNC</button>
            </div>
        </div>
    )
}

export default PaginaLista