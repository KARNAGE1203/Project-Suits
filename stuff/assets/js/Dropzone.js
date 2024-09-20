
//Dropzone filenames holder
let FileNamesHolder = []

let UploadChecker = 0

//Dropzone file data holder
const FileDataHolder = {}

function DropZone(DivIdName, color, icons, streamOptions, accept, numberOfFiles) {
    const _element = document.getElementById(DivIdName)
    let _dropZonePreview = ''
    const byte = 600 * 600

    const _init = () => {
        _setDropZone()
    }

    const _setDropZone = () => {
        FileDataHolder[DivIdName] = 
        _element.innerHTML = `
            <input type="file" class="${DivIdName}_input" name="${DivIdName}_input[]" id="${DivIdName}_input" data-divname="${DivIdName}" ${numberOfFiles && numberOfFiles == 1 ? '' : 'multiple="multiple"'} accept="${accept && accept != undefined ? accept : '*'}">
            <label class="${DivIdName}_label" id="${DivIdName}_label" data-divname="${DivIdName}" for="${DivIdName}_input">
                <div class="${DivIdName}_inner p-3" id="${DivIdName}_inner" data-divname="${DivIdName}">
                    ${_setInitialTitle()}
                </div>
            </label>
        `
        _setStyles()

        _dropZonePreview = document.getElementById(DivIdName+'_inner')

        _onDropEvent(DivIdName+'_label')
        _onFileInputChange(DivIdName+'_input')
    }

    const _setInitialTitle = () => {
        return (`
            <span class="${DivIdName}_title">
                Click to upload files here.
            </span> <br>
            <span class="${DivIdName}_subtitle">
                Or, drag and drop pdf here.
            </span>
        `)
    }

    const _setStyles = () => {
        //Style input element
        document.getElementById(DivIdName+'_input').style.width = "0.1px"
        document.getElementById(DivIdName+'_input').style.height = "0.1px"
        document.getElementById(DivIdName+'_input').style.opacity = "0"
        document.getElementById(DivIdName+'_input').style.overflow = "hidden"
        document.getElementById(DivIdName+'_input').style.position = "absolute"
        document.getElementById(DivIdName+'_input').style.zIndex = "-1"

        //Style label element
        document.getElementById(DivIdName+'_label').style.width = "100%"
        document.getElementById(DivIdName+'_label').style.border = "2px dashed " + color
        document.getElementById(DivIdName+'_label').style.textAlign = "center"
        document.getElementById(DivIdName+'_label').style.color = color
        document.getElementById(DivIdName+'_label').style.fontSize = "14px"
        document.getElementById(DivIdName+'_label').style.cursor = "pointer"
        document.getElementById(DivIdName+'_label').style.display = "inline-block"
        document.getElementById(DivIdName+'_label').style.padding = "5%"

        //Style inner div element
        document.getElementById(DivIdName+'_inner').style.width = "100%"
    }

    const _onDropEvent = (element) => {
        if (accept == 'image/*' || accept == 'image/png' || accept == 'image/jpg' || accept == 'image/gif' || accept == 'image/jpeg' || accept == 'image/webp') { } else {
            const _dropZone = document.getElementById(element)
            _dropZone.ondrop = function(e) {
                e.preventDefault();
                if (FileDataHolder[e.target.dataset.divname]) {
                    FileDataHolder[e.target.dataset.divname] = e.dataTransfer.files
                    _sendFileServer(e.target.dataset.divname, 0, streamOptions.requestType)
                }
                _displayFiles(e, e.dataTransfer.files, 'ondrop')
                UploadChecker += e.dataTransfer.files.length
            }

            _dropZone.ondragover = function () {
                _dropZone.style.borderColor = "#000"
                _dropZone.style.color = "#000"
                return false
            }
        
            _dropZone.ondragleave = function () {
                _dropZone.style.border = "2px dashed " + color
                _dropZone.style.color = color
                return false
            }
        
            _dropZone.ondragenter = function () {
                _dropZone.style.border = "2px dashed " + color
                _dropZone.style.color = color
                return false
            }
        }
    }

    const _onFileInputChange = (element) => {
        const _dropZoneInput = document.getElementById(element)
        _dropZoneInput.onchange = function(e) {
            e.preventDefault()
            if (FileDataHolder[e.target.dataset.divname]) {
                FileDataHolder[e.target.dataset.divname] = e.target.files
                _sendFileServer(e.target.dataset.divname, 0, streamOptions.requestType)
            }
            _displayFiles(e, e.target.files, 'onselect')
            UploadChecker += e.target.files.length
        }
    }

    const _displayFiles = (event, files, eventType) => {
        if (files) {
            _dropZonePreview.innerHTML = `<div class="row ${DivIdName}_inner_display_div" id="${DivIdName}_inner_display_div"> </div>`
            let iconsHtml = ''
            for (i = 0; i < files.length; i++) {
                let imageIdName = DivIdName+'_image_'+i
                let imageProgressName = DivIdName+'_progress_'+i
                let ext = files[i].type.split('/')

                if (ext[1] == "png" || ext[1] == "jpg" || ext[1] == "jpeg" || ext[1] == "heic" || ext[1] == "webp") {
                    iconsHtml += (`
                        <div class="col-md-${numberOfFiles && numberOfFiles == 1 ? '12' : '3'} mb-2"> 
                            <img id="${imageIdName}" class="" style="width=auto; height:80px"/> 
                            <span class="text-dark d-block mb-1" style="cursor:text;"> ${files[i].name} </span>
                            <div class="progress br-30">
                                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" id="${imageProgressName}" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                            </div>
                        </div>
                    `)
                    _readAndDisplay(event, imageIdName, i, files, eventType)

                } else if (ext[1] == "pdf" || ext[1] == "pdf-x") {
                    iconsHtml += (`
                        <div class="col-md-${numberOfFiles && numberOfFiles == 1 ? '12' : '3'} mb-2"> 
                            ${icons.pdf} 
                            <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ${files[i].name} </span> 
                            <div class="progress br-30">
                                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" id="${imageProgressName}" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                            </div>
                        </div>
                    `)

                } else if (ext[1] == "pptx" || ext[1] == "ppt" || ext[1] == "txt" || ext[1] == "docs" || ext[1] == "doc" || ext[1] == "docx" || ext[1] == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    iconsHtml += (`
                        <div class="col-md-${numberOfFiles && numberOfFiles == 1 ? '12' : '3'} mb-2"> 
                            ${icons.doc} 
                            <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ${files[i].name} </span> 
                            <div class="progress br-30">
                                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" id="${imageProgressName}" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                            </div>
                        </div>
                    `)

                } else if (ext[1] == "csv" || ext[1] == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    iconsHtml += (`
                        <div class="col-md-${numberOfFiles && numberOfFiles == 1 ? '12' : '3'} mb-2"> 
                            ${icons.spreadsheet} 
                            <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ${files[i].name} </span> 
                            <div class="progress br-30">
                                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" id="${imageProgressName}" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                            </div>
                        </div>
                    `)

                } else {
                    iconsHtml += (`
                        <div class="col-md-${numberOfFiles && numberOfFiles == 1 ? '12' : '3'} mb-2"> 
                            ${icons.other}
                            <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ${files[i].name} </span> 
                            <div class="progress br-30">
                                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" id="${imageProgressName}" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                            </div>
                        </div>
                    `)
                }
            }
            document.getElementById(DivIdName+'_inner_display_div').innerHTML = iconsHtml
        } else {
            _dropZonePreview.innerHTML = '<div></div>'
        }
    }

    const _readAndDisplay = (event, imageIdName, index, mainFiles, eventType) => {
        let reader = new FileReader()
        reader.onload = function () {
            let output = document.getElementById(imageIdName)
            output.src = reader.result
        }

        if (eventType == "onselect") {
            reader.readAsDataURL(event.target.files[index])
        } else {
            reader.readAsDataURL(mainFiles[index])
        }
    }

    const _sendFileServer = (divname, index, requestType) => {
        const fileName = _generateFileName(FileDataHolder[divname][index].name)
        _readToSend(index, fileName, 0, byte, requestType, divname)
    }

    const _readToSend = (index, fileName, start, unit, requestType, divname) => {
        const file = FileDataHolder[divname][index]
        let reader = new FileReader()
        let slice =  file.slice(start, start + unit)
        reader.readAsDataURL(slice)
        reader.onload = function () {
            let result = reader.result
            if (requestType == 'socket') {
                _socketRequest({
                    divname: divname,
                    index: index,
                    name: fileName,
                    type: file.type,
                    size: file.size,
                    start: start,
                    unit: unit,
                    data: result.toString()
                })
            } else {

            }
        }
    }

    const _socketRequest = (fileData) => {
        streamOptions.socketObject.emit(streamOptions.socketEvent, fileData, (response) => {
            const percentage = Math.floor((Number(response.start) / Number(response.size)) * 100)

            const progressIdName = response.divname+'_progress_'+response.index
            const progressBar = document.getElementById(progressIdName)

            if (response.status == 'more') {
                progressBar.setAttribute("style", "width: "+percentage+"%")
                progressBar.setAttribute("aria-valuenow", percentage)
                progressBar.innerHTML = percentage+"%"

                _readToSend(response.index, response.name, response.start, response.unit, 'socket', response.divname)
            } else {
                // console.log(response.name, ' has finished uploading!, at => start:', response.start, ' unit:', response.unit, ' size:', fileData.size)
                progressBar.setAttribute("style", "width: 100%")
                progressBar.setAttribute("aria-valuenow", 100)
                progressBar.innerHTML = "100%"
                progressBar.classList = 'progress-bar bg-primary'

                FileNamesHolder.push(response.name+'*^*^'+response.divname)

                let index = (Number(response.index) + 1)
                if (FileDataHolder[response.divname].length > index) {
                    _sendFileServer(response.divname, index, 'socket')
                } else {
                    delete FileDataHolder[response.divname]
                }
            }
        })
    }

    const _httpRequest = () => {

    }

    const _generateFileName = (fileName) => {
        let ext = fileName.split(/\.(?=[^\.]+$)/)
        fileName = fileName.toString().split('.'+ext[ext.length - 1]).join("")
        fileName = fileName.toString().split(',').join("_")
        ext = ext[ext.length - 1].toLowerCase()
        return fileName.toString().split(' ').join("_") + '_' + _shuffle('aqwertyuioasdfghjklzxcvbnm123456789').substr(10, 10)+'.'+ext
    }

    const _shuffle = (value) => {
        let a = value.toString().split(""), n = a.length
        for (let i = n - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let tmp = a[i]
            a[i] = a[j]
            a[j] = tmp
        }
        return a.join("")
    }

    _init()
}

function FilterFileNames(FileNamesHolder) {
    let fileNames = []
    if (Array.isArray(FileNamesHolder) && FileNamesHolder.length > 0) {
        for (let i = 0; i < FileNamesHolder.length; i++) {
            const fileName = FileNamesHolder[i];
            fileNames.push(fileName.split('*^*^')[0])
        }
    }
    return fileNames
}