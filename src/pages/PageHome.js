import { Button } from '@material-ui/core';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function PageHome() {

    const [lists, setLists] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:4500/list/`)
            .then(res => {
                setLists(res.data)
            });
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col text-center' >
                    HOME
            </div>
            </div>
            <div className='row'>
                {lists.map(list => {
                    return (<div className='col-4'>
                        <div className='card'>

                            <div class="card-body">
                                <h5 class="card-title">{list.description}</h5>
                                <p class="card-text">{list.details}</p>
                                <Link to={`/list/key/${list.key}`}  >
                                    <Button variant='outlined' color='secondary' size='small'>Editar</Button>
                                </Link>
                            </div>
                        </div>
                    </div>)
                })}
            </div>
            <div className='row'>
                <div className='col text-center' >
                    <Link to="/list/new"  >
                        <Button variant='contained' color='primary' size='large'>Criar lista</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PageHome