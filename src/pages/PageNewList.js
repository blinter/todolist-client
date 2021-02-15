import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react";
import KeyUtils from '../keyUtils';


function PageNewList() {

    const [newList, setNewList] = useState({
        root: true, description: '',
        itens: [],
        key: KeyUtils.generateKey('list')
    })

    const save = (evt) => {

        axios.post('http://localhost:4500/list', newList)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h1>Criar uma nova lista</h1>
                </div>
                <div className='col-12'>
                    <form className='card rounded p-3'>
                        <div className='form-group'>
                            <label htmlFor='description'>Descrição</label>
                            <input id='description' type='text' className='form-control'
                                placeholder='O nome da sua lista'
                                onChange={(evt) => {
                                    let newState = Object.assign({}, newList, { description: evt.target.value })
                                    setNewList(newState)
                                }} />
                        </div>
                        <button className='btn btn-primary'
                            onClick={(evt) => {
                                evt.preventDefault()
                                save()
                            }}>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PageNewList