import { List } from "@material-ui/core"
import { useState } from "react"

function ListItemComponent({ item, onItemChange }) {

    return (<li className='list-group-item'>
        <h5>{item.description}</h5>
        <p>{item.details}</p>
        <button onClick={() => { onItemChange(item) }}>+</button>
        <ul className='list-group' >
            {item.itens?.map((i) => {
                return <ListItemComponent onItemChange={onItemChange} item={i} />
            })}
        </ul>
    </li>)
}


export default ListItemComponent