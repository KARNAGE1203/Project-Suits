const fs = require('fs')

class UploadFile {

    constructor(fileNames, namesForRename) {
        this.fileNames = fileNames
        this.namesForRename = namesForRename
        this.filePath = __dirname+'/../../stuff/uploads/'
    }

    _uploadFiles() {
        if (Array.isArray(this.fileNames) && this.fileNames.length > 0) {
            for (let i = 0; i < this.fileNames.length; i++) {
                const fileName = this.fileNames[i]
                let txtFileName = this._getTxtFileExtension(fileName)
                let rename = this._getNewName(fileName, this.namesForRename, i)
                this._readData(txtFileName, rename)
            }
        }
    }

    _getFileNames() {
        let names = []
        if (Array.isArray(this.fileNames) && this.fileNames.length > 0) {
            for (let i = 0; i < this.fileNames.length; i++) {
                const fileName = this.fileNames[i]
                names.push(this._getNewName(fileName, this.namesForRename, i))
            }
        }

        return names
    }

    _getTxtFileExtension(fileName) {
        let ext = fileName.split(/\.(?=[^\.]+$)/)
        fileName = fileName.toString().split('.'+ext[ext.length - 1]).join("")
        return fileName+'.txt'
    }

    _getNewName(fileName, newName, index) {
        let rename = ''

        let ext = fileName.split(/\.(?=[^\.]+$)/)
        ext = ext[ext.length - 1].toLowerCase()

        if (newName === undefined || newName === '' || newName === ' ' || newName === null) {
            rename = fileName
        } else {
            newName = newName.split(',')
            rename = newName[index]
            if (rename == undefined) {
                rename = fileName
            } else {
                rename = rename.toString().split(' ').join("_") + '.' + ext
            }
        }

        return rename
    }

    _readData(txtFileName, fileName) {
        if (fs.existsSync(this.filePath+txtFileName)) {
            const thisClass = this

            const readTxtFileData = fs.createReadStream(this.filePath+txtFileName)
    
            let txtData = ''
    
            readTxtFileData.on('data', (chunk) => {
                txtData += chunk
            })
    
            readTxtFileData.on('error', (err) => {
                console.log('Error reading file: ', err)
            })
    
            readTxtFileData.on('end', async () => {
                thisClass._createFile(txtData, fileName, txtFileName)
            })
        }
    }

    _createFile(fileData, fileName, txtFileName) {
        fs.writeFileSync(this.filePath+fileName, fileData, 'base64')
        console.log(fileName, ' is written.')
        fs.unlinkSync(this.filePath+txtFileName)
    }
}

module.exports = UploadFile