const nums = '1234567890'
const alphas_small = 'qwertyuiopasdfghjklzxcvbnm'
const alphas_capital = 'QWERTYUIOPASDFGHJKLZXCVBNM'

const randomInt = (largest) => {
    return Math.floor(Math.random() * largest)
}

const generateUID = (len, num = false, alpha_small = false, alpha_capital = false) => {
    var uid = ''
    var available = ''
    if (num) available += nums
    if (alpha_small) available += alphas_small
    if (alpha_capital) available += alphas_capital
    for (var i = 0; i < len; i++) {
        uid += available[randomInt(available.length)]
    }
    return uid
}

const rowcolToIndex = (row, col, numOfRows) => {
    return row * numOfRows + col
}

const indexToRowcol = (index, numOfRows) => {
    return {
        row: Math.floor(index / numOfRows),
        col: index % numOfRows
    }
}

const randInt = (maxLimit) => {
    return Math.floor(Math.random() * maxLimit)
}

const shuffle = (list) => {
    var newList = list
    var i
    var j
    var tmp
    for (i = 0; i < list.length; i++) {
        j = randInt(list.length)
        tmp = newList[i]
        newList[i] = newList[j]
        newList[j] = tmp
    }
    return newList
}

module.exports = {
    randomInt,
    generateUID,
    rowcolToIndex,
    indexToRowcol,
    randInt,
    shuffle
}