import { Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Component } from 'react';
import _ from 'underscore';
import ListItemComponent from '../components/ListItemComponent';
import Emitter from '../Emitter';
import KeyUtils from '../keyUtils'


/**
 * All changes in childrens updates the local rootItem object with events.
 */
class PageList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rootItem: {
                description: 'Nome da sua lista',
                key: KeyUtils.generateKey()
            },
            showDeleteConfirmationSnack: false
        }
        this.listenerTokens = []
    }

    componentDidMount() {

        //Register this componente as listener for most important events in children componentes.
        //The tokens are for cancel listener when component will be destroyed.
        this.listenerTokens.push(Emitter.addListener('REMOVE_ITEM', this.removeItem.bind(this)))
        this.listenerTokens.push(Emitter.addListener('ADD_NEW_ITEM', this.addNewitem.bind(this)))
        this.listenerTokens.push(Emitter.addListener('ITEM_DESCRIPTION_CHANGE', this.itemDescriptionChange.bind(this)))

        if (this.props.match.params.key) {
            axios.get(`http://localhost:4500/list/key/${this.props.match.params.key}`)
                .then(res => {
                    this.setState({ rootItem: res.data })
                });
        }
    }

    componentWillUnmount() {
        //Remove all listenners for this component.
        for (const token of this.listenerTokens) {
            token.remove()
        }
    }

    //Update itens descriptions.
    itemDescriptionChange(item) {
        let newRootItem = _.clone(this.state.rootItem)
        let findedItem = this.find_item(newRootItem, item.key)
        findedItem.description = item.description
        this.setState({ 'rootItem': newRootItem })
    }

    //Received when user clicks on 'Delete item' in any node of hierarchy.
    removeItem(item) {
        this.findAndRemove(this.state.rootItem, item)
    }

    //Received when user clicks on 'Add new item' in any node of hirearchy.
    addNewitem(evt) {
        let newRootItem = _.clone(this.state.rootItem)

        let parent = null;
        if (newRootItem.key === evt.parent.key) {
            parent = newRootItem
        } else {
            parent = this.findItem(newRootItem, evt.parent.key)
        }
        parent.itens = parent.itens || []
        parent.itens.unshift(evt.newItem)
        this.setState({ rootItem: newRootItem })
    }

    //Recursive function that searches itens in the three.
    findItem(tree, key) {
        if (tree.key === key) return tree

        for (const i of tree.itens) {
            if (key === i.key) {
                return i
            }
            if (key != i.key && (i.itens && i.itens.length > 0)) {
                return this.findItem(i, key)
            }
        }
        return null
    }

    //Removes a item from three.
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
        return <div className='container-fluid'>
            <div className='row'>
                <div className='col'>
                    <div key={this.state.rootItem.key} >
                        <h4 className='font-weight-bold'>{this.state.rootItem.description}</h4>
                        <div className='bg-white rounded border border-white p-2'>
                            <ListItemComponent
                                number={1}
                                item={this.state.rootItem}
                                onDescriptionChange={(item) => { }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3 text-right'>
                <div className='col'>
                    <div className='bg-white rounded border border-white p-2'>
                        <Button variant='outlined' color='primary' onClick={() => {
                            this.props.history.goBack()
                        }}>Voltar</Button>
                        <Button variant='contained' color='primary' className='ml-1'
                            onClick={(evt) => {
                                this.setState({ showDeleteConfirmationSnack: true })
                                axios.put('http://localhost:4500/list', this.state.rootItem)
                                    .then((res) => {
                                        this.setState({ rootItem: res.data })
                                    })
                            }}>Salvar</Button>
                    </div>
                </div>
            </div>

            <Snackbar open={this.state.showDeleteConfirmationSnack}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={() => { this.setState({ showDeleteConfirmationSnack: false }) }}>
                <Alert severity="success">
                    Lista salva com sucesso!
                </Alert>
            </Snackbar>
        </div>
    }
}

export default PageList