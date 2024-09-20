const fs = require('fs');
const md5 = require('md5');

const FileDataHolder = {}

module.exports = (socket) => {
    socket.on('ps_general_file_upload', async (fileData, cb) => {
        let newBeginning = (fileData.start + fileData.unit)

        if (newBeginning <= fileData.size) {
            let ext = fileData.name.split(/\.(?=[^\.]+$)/)
            let TextFileName = fileData.name.toString().split('.'+ext[ext.length - 1]).join("")

            if (FileDataHolder.hasOwnProperty(fileData.name)) {
                const tempWriteStream = fs.createWriteStream(__dirname+'/../../stuff/uploads/'+TextFileName+'.txt', { flags: 'a' })
                tempWriteStream.write(fileData.data.split("base64,")[1])
                tempWriteStream.end()

            } else {
                if (!fs.existsSync(__dirname+'/../../stuff/uploads/')) {
                    fs.mkdirSync(__dirname+'/../../stuff/uploads/')
                } 

                const tempWriteStream = fs.createWriteStream(__dirname+'/../../stuff/uploads/'+TextFileName+'.txt', { flags: 'a' })
                tempWriteStream.write(fileData.data.split("base64,")[1])
                tempWriteStream.end()
            }
        }

        if (newBeginning < fileData.size) {
            cb({
                status: 'more',
                divname: fileData.divname,
                index: fileData.index,
                start: newBeginning,
                unit: fileData.unit,
                name: fileData.name,
                size: fileData.size
            })
        } else if (newBeginning > fileData.size) {
            let remainingByte = (fileData.size - fileData.start)
            cb({
                status: 'more',
                divname: fileData.divname,
                index: fileData.index,
                start: fileData.start,
                unit: remainingByte,
                name: fileData.name,
                size: fileData.size
            })
        } else {
            delete FileDataHolder[fileData.name]
            console.log('Finished: ', fileData.name, ' => start:', fileData.start, ' unit:', fileData.unit, ' size:', fileData.size)

            cb({
                status: 'finish',
                divname: fileData.divname,
                index: fileData.index,
                start: fileData.start,
                unit: fileData.unit,
                name: fileData.name,
                size: fileData.size
            })
        }
    })
}