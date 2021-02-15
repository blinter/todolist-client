import { useState } from 'react'
import Emitter from '../Emitter'
import KeyUtils from '../keyUtils'


const _ = require('underscore')

function ListItemComponent({ number, item }) {

    const [showDropZone, setShowDropZone] = useState(true)

    const onDragEnter = (evt) => {
        evt.preventDefault()
        console.log('onDragEnter')
    }

    const onDragLeave = (evt) => {
        evt.preventDefault()
        evt.stopPropagation()
    }

    const onDragEnd = (evt) => {
        evt.preventDefault()
        console.log('onDragEnd')
    }

    const onDragOver = (evt) => {
        evt.preventDefault()
        evt.stopPropagation()
    }

    const onDragStart = (evt) => {
        //Prevines "burble" the event in parent elements.
        //Necessary because we are using a hierarchical structure.
        evt.stopPropagation()
        console.log('onDragStart -> ', item)
        evt.dataTransfer.setData('item', JSON.stringify(item))

        let img = new Image()
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADV0lEQVR4Xu2bu88OQRSHny+uBVG5JP4BDbVGoRMtDQkV0YhGQlCgQAiNaISKhIZaqdCoafwDEpdKSNxDfl/eTTaT3Z0zuzPn3bzvbvI2387l/J49M3PmzHwrzOdZAS4AZ2bd3wVuAP+8zZEh3o/6vA+cDDp+AJzyhuANoE18xcIdgieAmPi5QPACYBXvDsEDQKp4VwilAfQV7wahJICh4l0glAKQS3xxCCUAxMS/Az4D+4I44BWwFdjVEpgUWSJLALgCXG4RIfH7gXvAoaDMc+A08LIDwlVA7Wd7cgNYC3wFNjZYWIn/ADxrAXAY2NEB4TuwGfibi0BuABL+DVgTGFgXr1ddAPS+DcIfYBPwc6wAZNcj4FjNwFC8BUAbhMfA8Vzi1U5uD1Cb64Gzs0nuLXAd+BIYHfOAqvgW4CKwG9AkeQf4NXYAFvusACxtDSpTwgMsBk0AOlYBC8BsZSYPSESpdV6/H4n1wuKlhoCWYS2V+pkeqweonKK788A64AlwYsCMnBvABkCh8lHgN3ATUNQYzTFaALTF9lqelMjs8+QGIFuuBYaY9g4xAF0bmxfAwT7qDZFgarOy5UBDpSiELgCxXd2t2ZBINdYaCaa0K5c/11KhE0IbgJh4hbd7GyI8q9G5h4Aixtd9ttJNACzitaXVrq7vkxuA7OjaRep9oyeEADzElxgC1YdIhlAH4CW+JIBkT6gAeIovDSAJgoTHxKtBbUU/9R3wDfU0ge4M/v5+NpHl6mZbQ96x3vbqnCDxTUFELiPG3s4lAdBsvn3slhay7+MEYBoC0yS4OrpiK0FTZnfIsCwRCdbtMQdEUyAUfEYvTyjlAeYvX+meNkMtA9niCQu7Ha57R9N1tur9QidELBAWPiUWg7AUSdE6hCotrnOBpyNLi+tA9iFwZHYmkDUtXp8nde6vc4ExH4zoXMB8gSKWFh8S7XXVLRUHJNs7AUhGlqfC5AGLfDyug8rqisybTFdk9szykrcHHMg2+m6JOWCpL0kt/TW5pb8oqXG21Fdlrem1hb4sbYGQGk1ELzqkNtiVEerbVlgvllSx9lNMfPWlrIb0KTcUQlHxHgCGDIfi4r0A9IHgIt4TQAoEN/HeACwQXMXPA0AXBHfx8wJQ9TuKf5//D6SSRRY5/8yDAAAAAElFTkSuQmCC'
        evt.dataTransfer.setDragImage(img, 32, 32)
    }


    return (<div className={`mt-3 mb-3 container border rounded`} draggable={!item.root}
        style={{ paddingLeft: `${number * 10}px` }} key={item.key}
        onDragStart={onDragStart} onDragLeave={onDragLeave} onDragEnter={onDragEnter}
        onDragOver={onDragOver} onDragEnd={onDragEnd} >

        <div className='row no-gutters'>
            <div className='col'>
                <span className='d-block text-muted small'>{item.key}</span>
                <div className='form-group pt-2'>
                    <input className='form-control' value={item.description} onChange={(evt) => {
                        Emitter.emit('ITEM_DESCRIPTION_CHANGE', Object.assign({}, item, { description: evt.target.value }))
                    }} placeholder='Descrição' />
                </div>
            </div>
        </div>

        <div className='row pt-2'>
            <div className='col'>
                <ul className='list-group list-group-horizontal list-unstyled m-0'>
                    <li>
                        <button className='btn btn-sm' onClick={() => {
                            console.log('ListItemComponent.onaddnewitem')
                            Emitter.emit('ADD_NEW_ITEM', {
                                parent: item,
                                newItem: {
                                    key: KeyUtils.generateKey('item'),
                                    description: 'Item description',
                                    details: 'Item detais'
                                }
                            })
                        }}>
                            Adicionar item
                            </button>
                    </li>
                    {!item.root ? <li>
                        <button className='btn btn-sm' onClick={() => {
                            console.log('Remove item')
                            Emitter.emit('REMOVE_ITEM', item)
                        }}>Excluir</button>
                    </li> : null}
                </ul>
            </div>
        </div>

        <div className='row' hidden={!showDropZone}>
            <div className='col'>
                <div className='bg-light mb-1 p-1'
                    onDrop={(evt) => {
                        console.log('onDrop')
                        evt.preventDefault()
                        evt.stopPropagation()
                        let droppedItem = JSON.parse(evt.dataTransfer.getData('item'))

                        let clonedItem = _.clone(droppedItem)
                        clonedItem.key = KeyUtils.generateKey()

                        Emitter.emit('REMOVE_ITEM', droppedItem)
                        Emitter.emit('ADD_NEW_ITEM', { parent: item, newItem: clonedItem })

                    }}>
                    <span className='small'>[Soltar o elemento aqui]</span>
                </div>
            </div>
        </div>

        <div className='row'>
            <div className='col'>
                {(item.itens ?? []).map((i) => {
                    return <ListItemComponent number={number + 1} parent={this} item={i} />
                })}
            </div>
        </div>



    </div>)
}


export default ListItemComponent