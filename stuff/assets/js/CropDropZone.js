
//Dropzone filenames holder
let FileNamesHolder = []

let UploadChecker = 0

//Dropzone file data holder
const FileDataHolder = {}

function CropDropZone(DivIdName, color, streamOptions) {
    const _element = document.getElementById(DivIdName)
    let _dropZonePreview = ''
    const byte = 600 * 600

    const _init = () => {
        _setDropZone()
    }

    const _setDropZone = () => {
        FileDataHolder[DivIdName] = 
        _element.innerHTML = `
            <input type="file" class="${DivIdName}_input" name="${DivIdName}_input[]" id="${DivIdName}_input" data-divname="${DivIdName}" accept="image/*">
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
                Or, drag and drop image here.
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
        // const _dropZone = document.getElementById(element)
        // _dropZone.ondrop = function(e) {
        //     e.preventDefault();
        //     _displayFiles(e, e.dataTransfer.files, 'ondrop')
        //     UploadChecker += e.dataTransfer.files.length
        // }

        // _dropZone.ondragover = function () {
        //     _dropZone.style.borderColor = "#000"
        //     _dropZone.style.color = "#000"
        //     return false
        // }
    
        // _dropZone.ondragleave = function () {
        //     _dropZone.style.border = "2px dashed " + color
        //     _dropZone.style.color = color
        //     return false
        // }
    
        // _dropZone.ondragenter = function () {
        //     _dropZone.style.border = "2px dashed " + color
        //     _dropZone.style.color = color
        //     return false
        // }
    }

    const _onFileInputChange = (element) => {
        const _dropZoneInput = document.getElementById(element)
        _dropZoneInput.onchange = function(e) {
            e.preventDefault()
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
                let cropUploadBtnName = DivIdName+'_crop_and_upload_btn_'+i
                let ext = files[i].type.split('/')

                if (ext[1] == "png" || ext[1] == "jpg" || ext[1] == "jpeg" || ext[1] == "heic" || ext[1] == "webp" || ext[1] == "gif") {
                    iconsHtml = (`
                        <div class="col-md-12 mb-2"> 
                            <img id="${imageIdName}" class="" style="max-width: 100%; height:200px;"/> 
                            <span class="text-dark d-block mb-1" style="cursor:text;"> ${files[i].name} </span>
                            <div class="progress br-30">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" id="${imageProgressName}" style="width: 0%; background-color: ${color};" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                            </div>
                            <button type="button" class="btn" id="${cropUploadBtnName}" style="background-color: ${color};" data-index="${i}"> Crop & Upload </button>
                        </div>
                    `)
                    document.getElementById(DivIdName+'_inner_display_div').innerHTML = iconsHtml
                    _readAndDisplay(event, imageIdName, i, files, eventType)
                    const cropperMethod = new Cropper(document.getElementById(imageIdName), {
                        aspectRatio: 1,
                        viewMode: 3,
                        dragMode: 'move'
                    });
                    console.log('cropperMethod: ', cropperMethod)
                    _cropAndUploadEvent(cropUploadBtnName, cropperMethod, DivIdName)
                }
            }
            
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

    const _cropAndUploadEvent = (btnIdName, cropperMethod, DivIdName) => {
        const _cropAndUploadBtn = document.getElementById(btnIdName)
        _cropAndUploadBtn.onclick = (e) => {
            e.preventDefault()
            let canvas = cropperMethod.getCroppedCanvas({
                width: 200,
                height: 200,
            });
            canvas.toBlob(function(blob) {
                if (FileDataHolder[DivIdName]) {
                    FileDataHolder[DivIdName] = []
                    FileDataHolder[DivIdName] = blob
                }
                _sendFileServer(DivIdName, 0, 'socket')
            });
        }
    }

    const _sendFileServer = (divname, index, requestType) => {
        const fileName = _generateFileName('cropped image ')
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
                progressBar.classList = 'progress-bar ovasyte-bg-primary'

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