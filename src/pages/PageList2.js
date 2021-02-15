import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Component } from 'react';
import _ from 'underscore';
import ListItemComponent from '../components/ListItemComponent';
import Emitter from '../Emitter';

class PageList2 extends Component {

    constructor(props) {
        super(props)
        this.state = { rootItem: {}, tokens: [] }
        this.listenerTokens = []
    }

    componentDidMount() {

        this.listenerTokens.push(Emitter.addListener('REMOVE_ITEM', this.removeItem.bind(this)))
        this.listenerTokens.push(Emitter.addListener('ADD_NEW_ITEM', this.addNewitem.bind(this)))
        this.listenerTokens.push(Emitter.addListener('ITEM_DESCRIPTION_CHANGE', this.itemDescriptionChange.bind(this)))

        axios.get(`http://localhost:4500/list/key/${this.props.match.params.key}`)
            .then(res => {
                this.setState({ rootItem: res.data })
            });
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        for (const token of this.listenerTokens) {
            token.remove()
        }
    }


    itemDescriptionChange(item) {
        console.log('itemDescriptionChange', item)
        let newRootItem = _.clone(this.state.rootItem)
        let findedItem = this.find_item(newRootItem, item.key)
        findedItem.description = item.description
        this.setState({ 'rootItem': newRootItem })
    }

    removeItem(item) {
        this.findAndRemove(this.state.rootItem, item)
    }

    addNewitem(evt) {
        let newRootItem = _.clone(this.state.rootItem)

        let parent = null;
        if (newRootItem.key === evt.parent.key) {
            parent = newRootItem
        } else {
            parent = this.find_item(newRootItem, evt.parent.key)
        }
        parent.itens = parent.itens || []
        parent.itens.unshift(evt.newItem)
        this.setState({ rootItem: newRootItem })
    }

    find_item(tree, key) {
        if (tree.key === key) return tree

        for (const i of tree.itens) {
            if (key === i.key) {
                return i
            }
            if (key != i.key && (i.itens && i.itens.length > 0)) {
                return this.find_item(i, key)
            }
        }
        return null
    }

    findAndRemove(tree, toFind) {

        for (const i of tree.itens) {
            if (toFind.key === i.key) {
                tree.itens = tree.itens.filter(j => j.key != toFind.key)
                let newRootItem = _.clone(this.state.rootItem)
                this.setState({ 'rootItem': newRootItem })
                break
            }
            if (toFind.key != i.key && (i.itens && i.itens.length > 0)) {
                this.findAndRemove(i, toFind)
            }
        }
    }

    render() {
        return <div className="mb-5">
            <div key={this.state.rootItem.key} className='p-3 mt-2'>
                <h4>{this.state.rootItem.description}</h4>
                <div className='bg-white rounded border border-white p-2'>
                    <ListItemComponent
                        number={1}
                        item={this.state.rootItem}
                        onDescriptionChange={(item) => { }}
                    />
                </div>
            </div>

            <div >
                <button onClick={(evt) => {
                    console.log(this.state.rootItem)
                    axios.put('http://localhost:4500/list', this.state.rootItem)
                }}>SYNC</button>
            </div>
        </div>
    }
}

export default PageList2