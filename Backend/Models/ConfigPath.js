
const path = require('path')

const ConfigPath = (envName, dirNumber) => {
    return path.join(__dirname, `./../../../../../${getDirectories(dirNumber)}config/${envName}`)
}

function getDirectories(number) {
    let result = ''
    for (let i = 0; i < number; i++) {
        result += '../'
    }
    return result
}

module.exports = {
    ConfigPath: ConfigPath
}