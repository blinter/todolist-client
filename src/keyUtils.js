import { v4 as uuidv4 } from 'uuid';
const KeyUtils = {
    generateKey: (sufix) => {
        return uuidv4()
    }
}

export default KeyUtils