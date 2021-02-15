import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function PageHome() {

    const [lists, setLists] = useState([])

    const [deleteDialog, setDeleteDialog] = useState({ show: false })


    const handleClose = (evt) => {
        console.log('hand')
        if (evt) {
            deleteList(deleteDialog.target._id).then(() => {
                loadLists()
            })
        } else {
            setDeleteDialog({ show: false })
        }
    }

    const deleteList = (_id) => {
        return axios.delete(`http://localhost:4500/list/${_id}`)
            .then(() => {
                setDeleteDialog({ show: false })
            })
    }

    const loadLists = () => {
        axios.get(`http://localhost:4500/list/`)
            .then(res => {
                setLists(res.data)
            })
    }

    useEffect(() => {
        loadLists()
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col text-center' >
                    <span className='display-4 mb-5 mt-5 d-block'>Gerenciador de tarefas</span>
                </div>
            </div>
            <div className='row'>
                {lists.map(list => {
                    return (<div className='col-4' key={list.key}>
                        <div className='card'>

                            <div className="card-body">
                                <h5 className="card-title">{list.description}</h5>
                                <Button variant="outlined" color="primary"
                                    startIcon={<DeleteIcon />}
                                    size='small'
                                    onClick={() => {
                                        setDeleteDialog({ show: true, target: list })
                                    }}
                                >
                                    Delete
                                </Button>

                                <Link to={`/list/key/${list.key}`}  >
                                    <Button variant='contained'
                                        color='primary'
                                        size='small'
                                        className='ml-2'
                                        startIcon={<Edit />}>Editar</Button>
                                </Link>
                            </div>
                        </div>
                    </div>)
                })}
            </div>
            <div className='row mt-5'>
                <div className='col text-center' >
                    <Link to="/list/key/"  >
                        <Button variant='contained' color='primary' size='large'>Criar lista</Button>
                    </Link>
                </div>
            </div>

            <Dialog open={deleteDialog.show} onClose={() => { handleClose(false) }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Confirmação</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir <strong>{deleteDialog.target?.description}</strong> ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleClose(false) }} color="primary">Não</Button>
                    <Button onClick={() => { handleClose(true) }} color="primary" variant='contained'>Sim, excluir</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default PageHome