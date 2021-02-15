import { v4 as uuidv4 } from 'uuid';
/***
 * Utility class for generate keys for react objects.
 * This help with problems of 'collection of objects must have a unique key'.
 */
const KeyUtils = {
    generateKey: (sufix) => {
        return uuidv4()
    }
}

export default KeyUtils