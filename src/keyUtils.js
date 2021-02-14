const KeyUtils = {
    generateKey: (sufix) => {
        return `${sufix||'item'}-${Math.round(Math.random() * 200000)}`
    }
}

export default KeyUtils