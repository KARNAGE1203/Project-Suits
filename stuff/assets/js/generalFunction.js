//Initialize socket here
const socket = io();

//Initialize melody here
let melody = JSON.parse(window.localStorage.getItem('melody'));

//  Toast Alert 
let Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    heightAuto:true
});

if (melody && melody.melody2.length > 6) { } else {
    window.location.replace("/dashboard");
}


//Capitalize each word in a given string
String.prototype.toUcwords = function() {
    let value = this.toString();
    if (value === "" || value === null || value === undefined) {
        return '';
    } else {
        return value.replace(/\w+/g, function(a){
            return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
        });
    }
}

String.prototype.shuffle = function() {
    let a = this.split(""), n = a.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

Array.prototype.sumArray = function() {
    return this.reduce(function(a,b){
        return a + b;
    }, 0);
}

String.prototype.fullDate = function() {
    let inputDate = this;
    if (inputDate == "" || inputDate == null || inputDate == undefined) {
        return '';
    } else {
        let date = new Date(inputDate);
        return date.toDateString();
    }
}


String.prototype.fullDateTime = function() {
    let inputDate = this;
    if (inputDate === "" || inputDate === null || inputDate === undefined) {
        return '';
    } else {
        let date = new Date(inputDate);
        let hh = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        return date.toDateString()+' '+hh+':'+(min < 10 ? '0'+min : min)+':'+(sec < 10 ? '0'+sec : sec);
    }
}

String.prototype.getValue = () => {
    return 0.062;
}

String.prototype.fullTime = function() {
    let inputDate = this;
    if (inputDate === "" || inputDate === null || inputDate === undefined) {
        return '';
    } else {
        let date = new Date(inputDate);
        return date.toLocaleTimeString();
    }
}


String.prototype.dbDateFormat = function() {
    let inputDate = this;
    if (inputDate === "" || inputDate === null || inputDate === undefined) {
        return '';
    } else {
        let date = new Date(inputDate);
        let dd = date.getDate();
        let mm = date.getMonth()+1; 
        let yyyy = date.getFullYear();
        let hh = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        return yyyy+'-'+mm+'-'+dd+' '+hh+':'+min+':'+sec;
    }
}

Date.prototype.getCurrentWeekRange = function() {
    let curr = new Date 
    let week = []
    
    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i 
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
    }
    return [week[0], week[6]];
} 


//Currency function
function currency(currency, value) {
    if (value == undefined || value == null) {
        value = 0;
    }
    if (currency == "ghs") {
        return 'GHS ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else if (currency == "usd") {
        return 'USD ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else if (currency == "eur") {
        return 'EUR ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else if (currency == "gbp") {
        return 'GBP ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else {
        return '' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}

function currencyToWords(currency) {
    if (currency == "ghs") {
        return 'Ghana Cedis';
    } else if (currency == "usd") {
        return 'US Dollars';
    } else if (currency == "eur") {
        return 'Euros';
    } else if (currency == "gbp") {
        return 'British Pounds';
    } else {
        return '';
    }
}

function currencyToCoins(currency) {
    if (currency == "ghs") {
        return 'Pesewas';
    } else if (currency == "usd") {
        return 'Cents';
    } else if (currency == "eur") {
        return 'Cents';
    } else if (currency == "gbp") {
        return 'Pence';
    } else {
        return '';
    }
}

function printContent(printDivIdName, footerMessage){
    let docHead = document.head.innerHTML;
    let printArea = document.getElementById(printDivIdName).innerHTML;
    let newWindow = window.open('', '', 'height=768, width=1024');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
    `);
    newWindow.document.write(docHead);
    newWindow.document.write(`
        </head>
        <body class="bg-white p-5 m-0">
    `);
    newWindow.document.write(printArea);
    newWindow.document.write(`<p class="text-center text-muted mt-5 mb-5"> ${footerMessage} </p>`);
    newWindow.document.write(`
        <script>
            (()=>{
                setTimeout(()=>{
                    window.print();
                }, 1000);

                window.onafterprint = function closeWindow() {
                    window.close();
                }
            })();
        </script>
    `);
    newWindow.document.write(` </body> `);
    newWindow.focus();
    newWindow.document.close();
    // newWindow.onfocus = ()=>{
    //     newWindow.close(); 
    //     newWindow = '';
    // }
}

//Convert double to currency value
function formatNumber(num) {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function numberToWords(num) {
    let a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    let b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Billion ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Million ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
}


function findPosition(obj) { 
    let currenttop = 0; 
    if (obj.offsetParent) { 
        do { 
            currenttop += (obj.offsetTop - 100); 
        } while ((obj = obj.offsetParent));
        return [currenttop]; 
    } 
} 



//set global variable
let globalFiles, globalFilesSocket = [], globalFilesEventsSocket = [];

//Custom dropzone upload
function customDropzone(dropzoneIdName, dropzoneInputIdName, dropzonePreviewIdName) {
    let dropzone = document.getElementById('' + dropzoneIdName + '');
    let dropzoneInput = document.getElementById('' + dropzoneInputIdName + '');
    let dropzonePreview = document.getElementById('' + dropzonePreviewIdName + '');
    let imageIdName, input;

    // $('.'+dropzoneIdName).attr('for', dropzoneInputIdName);
    dropzonePreview.innerHTML = '<span class="ps_dropzone_title"> Click to upload supporting files/documents such as receipts, invoices etc. here. </span> <br> <span class="ps_dropzone_subtitle text-danger" style="font-size:12px;"> You can select up to 10 files </span>';

    let displayImages = function (event, mainFiles, checker) {
        if (mainFiles) {
            dropzonePreview.innerHTML = '<div class="row dropzone_preview_sub_div"> </div>';
            for (i = 0; i < mainFiles.length; i++) {
                imageIdName = 'dropzoneImage_' + i;
                let ext = mainFiles[i].type.split('/');
                if (ext[1] == "png" || ext[1] == "jpg" || ext[1] == "jpeg") {
                    $('.dropzone_preview_sub_div').append('<div class="col-md-3 mb-2"> <img id="' + imageIdName + '" class="w-100 h-70"/> <span class="text-dark d-block mb-1" style="cursor:text;"> ' + mainFiles[i].name + ' </span> </div');
                    readAndDisplay(event, imageIdName, i, mainFiles, checker);
                } else if (ext[1] == "pdf" || ext[1] == "pdf-x") {
                    $('.dropzone_preview_sub_div').append('<div class="col-md-3 mb-2"> <div class="icon-file-pdf icon-5x text-danger-400 d-block w-100 h-70"></div> <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ' + mainFiles[i].name + ' </span> </div');
                } else if (ext[1] == "docs" || ext[1] == "doc" || ext[1] == "docx" || ext[1] == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    $('.dropzone_preview_sub_div').append('<div class="col-md-3 mb-2"> <div class="icon-file-word icon-5x text-danger-400 d-block w-100 h-70"></div> <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ' + mainFiles[i].name + ' </span> </div');
                } else {
                    $('.dropzone_preview_sub_div').append('<div class="col-md-3 mb-2"> <div class="icon-file-zip icon-5x text-danger-400 d-block w-100 h-70"></div> <span class="text-dark d-block mb-1" style="cursor:text; font-size:12px;"> ' + mainFiles[i].name + ' </span> </div');
                }
                
                // <span class="text-danger d-block drozone_remove_image mt-1" data-remove="'+mainFiles[i].name+'" style="cursor:move;" id="drozone_remove_image"> Remove </span> 
            }
            //Put the files in the global variable to be accessed everywhere 
            globalFiles = mainFiles;
        } else {
            dropzonePreview.innerHTML = '<div>  </div>';
        }
    };

    let readAndDisplay = function (event, imageIdName, loopVariable, mainFiles, checker) {
        let reader = new FileReader();
        reader.onload = function () {
            let output = document.getElementById('' + imageIdName + '');
            output.src = reader.result;
        };
        if (checker == "onselect") {
            reader.readAsDataURL(event.target.files[loopVariable]);
        } else {
            reader.readAsDataURL(mainFiles[loopVariable]);
        }
    };


    let readAsBlobForSocket = function(files) {
        let mainFiles = files;
        for (i = 0; i < mainFiles.length; i++) {
            readBlobAndDisplay(mainFiles[i], mainFiles[i].name, mainFiles[i].type, mainFiles[i].size);
        }
    }

    let readBlobAndDisplay = function (mainFile, name, type, size) {
        let reader = new FileReader();
        let slice = mainFile.slice(0, mainFile.size);
        reader.readAsArrayBuffer(slice);
        reader.onload = function () {
            globalFilesSocket.push({
                name: name, 
                type: type, 
                size: size, 
                data: reader.result 
            });
        };
    };

    // $(document).on('click', 'span.drozone_remove_image', function() {
    //     let image = $(this).data('remove');
    //     console.log('Image name is: '+image);  
    // });

    dropzone.ondrop = function (e) {
        e.preventDefault();
        globalFilesSocket = [];
        //Display selected images
        // console.log(e.dataTransfer.files[0].type);
        // $('.'+dropzoneIdName).attr('for', '');
        displayImages(e, e.dataTransfer.files, 'ondrop');
        readAsBlobForSocket(e.dataTransfer.files);
        globalFilesEventsSocket = [];
        globalFilesEventsSocket.push(e.dataTransfer.files);
        // console.log('Got from ondrop');
    };

    dropzoneInput.onchange = function (e) {
        e.preventDefault();
        globalFilesSocket = [];
        //Display selected images
        // console.log(e.srcElement.files);
        displayImages(e, e.srcElement.files, 'onselect');
        readAsBlobForSocket(e.srcElement.files);
        globalFilesEventsSocket = [];
        globalFilesEventsSocket.push(e.srcElement.files);
        // console.log('Got from onselect');
    };

    dropzone.ondragover = function () {
        this.className = 'ps_dropzone ps_dragover';
        return false;
    };

    dropzone.ondragleave = function () {
        this.className = 'ps_dropzone';
        return false;
    };

    dropzone.ondragenter = function () {
        this.className = 'ps_dropzone';
        return false;
    };
    // console.log('itisrun');
}

//Stream files to server via socket
/**
 * This function streams file data to the server
 * @param {object} file - The actual file data to be streamed
 * @param {string} emitEvent - A socket event name to be used as emit event.
 * @param {string} uploadUnique - A socket event name to be used as emit event.
 */
function streamFilesToServer(file, emitEvent, uploadUnique) {
    let chunkSize = 1024 * 10;
    let chunks = Math.ceil(file.size / chunkSize, chunkSize);
    let chunk = 0;
    while (chunk <= chunks) {
        let offset = chunk * chunkSize;
        const reader = new FileReader();
        reader.onloadend = function(e) {
            if (e.target.readyState == FileReader.DONE) {
                socket.emit(emitEvent, {
                    uploadUnique: uploadUnique,
                    fileName: file.name,
                    fileType: file.type,
                    fileChunk: e.target.result
                });
            }
        }
        let blob = file.slice(offset, offset + chunkSize);
        reader.readAsDataURL(blob);
        chunk++;
    }
}



//Image uploads without dropzone
let globalImageHolder = [];
function convertImageForUpload(file) {
    let reader = new FileReader();
    let slice = file.slice(0, file.size);
    reader.readAsArrayBuffer(slice);
    reader.onload = function() {
        globalImageHolder.push({
            name: file.name, 
            type: file.type, 
            size: file.size, 
            data: reader.result 
        });
    }
}

//Image uploads without buffer
async function readFileToUpload(file) {
    let result = new Promise((resolve, reject)=>{
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            resolve({
                name: file.name, 
                type: file.type, 
                size: file.size, 
                data: reader.result 
            });
        }
    });
    return result;
}


//Global navigation interval
let navigationInterval;

//Pagination
function mainPagination(pageFileName, appname, pageScripts, navparent) {
    let previous_scripts = [];

    $(document).off('click.keyupevents');
    $(document).off('click.changeevents');
    $(document).off('click.printclicks');
    $(document).off('click.pageopener');
    $(document).off('click.tablebtnclicks');
    $(document).off('submit');
    $(document).off('click.otherclicks');
    $(document).off('change.otherchange');
    $(document).off('keyup.otherkeyup');



    //Render ejs page 
    openPage(pageFileName, appname);
    previous_scripts.push(pageFileName+'*forms/');
    previous_scripts.push(pageFileName+'*forms/'+appname);

    //Iterate active links
    $('ul.nav-sidebar li.nav-item a.nav-link').removeAttr('data-active');
    $('li.ps_sidebar_nav_parent_'+navparent+' a.nav-link').attr('data-active', 'true');

    //Remove previous script
    let scriptsToRemove = JSON.parse(window.localStorage.getItem('previous_scripts'));
    if (Array.isArray(scriptsToRemove)) {
        for (let i = 0; i < scriptsToRemove.length; i++) {
            removePageScript(scriptsToRemove[i].split("*")[0]);
        }
    }

    if (pageScripts.split("::")[0] == "multiple" || pageScripts.split("::")[0] == "double") {
        pageScripts = pageScripts.split("::")[1].split(",");
        for (let i = 0; i < pageScripts.length; i++) {
            // addPageScript(pageScripts[i]);
            previous_scripts.push(pageScripts[i]+'*ajax');
        }
    } else {
        if (pageScripts.split("::")[1] == "" || pageScripts.split("::")[1] == undefined) {} else {
            pageScripts = pageScripts.split("::")[1];
            // addPageScript(pageScripts);
            previous_scripts.push(pageScripts+'*ajax');
        }
    }

    //Remove previous 
    localStorage.removeItem("pagination");
    localStorage.removeItem("previous_scripts");

    const pagination = {
        pageFileName: pageFileName,
        appname: appname,
        scripts: pageScripts,
        navparent: navparent
    }
    window.localStorage.setItem('pagination', JSON.stringify(pagination));
    window.localStorage.setItem('previous_scripts', JSON.stringify(previous_scripts));

    //Clear the previous variable
    previous_scripts = [];
}

//A method to open page
function openPage(pageFileName, appname){
    // $('#ps_main_content_display').remove();

    let pageScript = document.createElement("script");

    //Add script src to script tag
    pageScript.setAttribute("src", "forms/"+appname+"/"+pageFileName+".js");
    pageScript.setAttribute("id", pageFileName+"_script");

    
    //Add created script to last part of body
    $('#content div.row').append(`
        <div class="col-md-12" id="ps_main_content_display"></div>
    `);
    document.body.appendChild(pageScript);
}

//A method to add page script(s) to document body
function addPageScript(pageScriptFileName){
    let pageScript = document.createElement("script");
        
    //Add script src to script tag
    pageScript.setAttribute("src", "ajax/"+pageScriptFileName+".js");
    pageScript.setAttribute("id", pageScriptFileName+"_script");

    //Add created script to last part of body
    document.body.appendChild(pageScript);
}

//A method to remove script(s) to document body
function removePageScript(scriptName) {
    const scriptList = document.querySelectorAll("script[src='"+scriptName+".js']");
    const convertedNodeList = Array.from(scriptList);
    const testScript = convertedNodeList.find(script => script.id === scriptName+"_script");
    if (testScript !== undefined) {
        testScript.parentNode.removeChild(testScript);
    }
}

//A method to add external script(s) to document body
function addExternalScript(pageScriptFileName){
    let pageScript = document.createElement("script");
        
    //Add script src to script tag
    pageScript.setAttribute("src", pageScriptFileName);
    pageScript.setAttribute("id", pageScriptFileName+"_script");

    //Add created script to last part of body
    document.body.appendChild(pageScript);
}

//Clear navigation loader
function openNavigationLoader() {
    $('.ps_progress_bar_div').show();
    $('.ps_progress_bar').attr("style", "width: 65%");
    $('.ps_progress_bar').attr("aria-valuenow", 65);
}


//Clear navigation loader
function clearNavigationLoader() {
    $('.ps_progress_bar').attr("style", "width: 100%");
    $('.ps_progress_bar').attr("aria-valuenow", 100);
    setTimeout(() => {
        $('.ps_progress_bar_div').hide();
    }, 500);
}

//Check for empty
function ifEmpty (columns) {
    let checker = [];
    if (columns.length > 0) {
        columns.forEach(item => {
            if (item === '' || item === ' ' || item === undefined || item === null  || item.length <= 0) {
                checker.push('empty');
            }
        });
    } 

    return checker;
}

function makeAllSelectLiveSearch(className, placeholder) {
    if (className) {
        $('.'+className).select2({
            placeholder: placeholder,
            allowClear: true
        });
    }
}

function makeAllSelectLiveSearchModal(className, placeholder) {
    $('.modal select.'+className).select2({
        dropdownParent: $('.modal'),
        placeholder: placeholder,
        allowClear: true
    });
}


//Recreate table tag for mDataTable
function reCreateMdataTable(tableClassName, parentClassName) {
    $('.'+tableClassName).remove();
    $('.m-datatable').remove();
    $('.'+parentClassName).append('<table class="'+tableClassName+'" style="text-align:left"></table>');
}


function displayFileIcon(fileName) {
    let ext = fileName.split(/\.(?=[^\.]+$)/)
    ext = ext[ext.length - 1].toLowerCase()
    let iconsHtml = ''
    if (ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "heic") {
        iconsHtml = (`<img src="uploads/${fileName}" class="" style="width=auto; height:80px"/> `)

    } else if (ext == "pdf" || ext == "pdf-x") {
        iconsHtml = (`<div class="icon-file-pdf icon-5x text-danger-400 d-block w-100 h-70"></div>`)

    } else if (ext == "pptx" || ext == "ppt" || ext == "txt" || ext == "docs" || ext == "doc" || ext == "docx") {
        iconsHtml = (`<div class="icon-file-word icon-5x text-danger-400 d-block w-100 h-70"></div>`)

    } else if (ext == "csv" || ext == "xlxs" || ext == "xlx") {
        iconsHtml = (`<div class="icon-file-excel icon-5x text-danger-400 d-block w-100 h-70"></div>`)

    } else {
        iconsHtml = (`<div class="icon-file-zip icon-5x text-danger-400 d-block w-100 h-70"></div>`)
    }

    return iconsHtml
}

// Load the Google Maps Places API script dynamically
    function loadMaps() {

        function loadGoogleMapsAPI() {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB8sEX-yL1gcEnnCLM5jS4NQGS5c4n3nYI&libraries=places';
            script.async = true;
            script.defer = true;
            script.onload = initAutocomplete;
            document.head.appendChild(script);
        }
    
        // Initialize the autocomplete function
        function initAutocomplete() {
            const input = document.getElementById('autocomplete');
            if (input) {
                const autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.setFields(['address_component']);
            }
        }
    
        // Attach the loadGoogleMapsAPI function to the window load event
        window.addEventListener('load', loadGoogleMapsAPI);
    }


socket.on('_no_remaining_sms_alert', (data) => {
    if (data.type == 'caution') {
        swal({
            title: 'Caution',
            text: data.message,
            type: 'warning',
            padding: '0.5em'
        })
    }
})
