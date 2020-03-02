const user = makeid(8);
$(".color-picker").spectrum();
const { ipcRenderer } = require('electron');

const colors = ['neutral', 'green', 'red', 'indigo', 'yellow', 'black'];
const secondColors = ['teal', 'thistle', 'tomato'];

let i = 0;
let imgCount = 0;
let blocos = [];
let imgs = [];

$('#qtdColors').on('change', (event) => {
    
    for (let i = 2; i <= 5; i++) {
        $(`#c${i}`).addClass('d-none');
        $(".color-picker").spectrum();
    }

    for (let i = 2; i <= event.target.value; i++) {
        $(`#c${i}`).removeClass('d-none');
        $(".color-picker").spectrum();
    }

    let container = $('.menu-container');

    // console.log(event.target.value);

    switch (event.target.value) {
        case '1':
            container.css('width', '200px');
            break;
        case '2':
            container.css('width', '350px');
            break;
        case '3':
            container.css('width', '513px');
            break;
        case '4': 
            container.css('width', '665px');
            break;
        default:
            container.css('width', '828px');
            break;
    }
});

$('#add-img').on('click', () => {
    imgCount++;

    if (imgCount === 1) {
        $('#build-button').removeClass('d-none');
        //$('#menu-container').removeClass('d-none');
    }

    //CREATING IMG BLOCO
    let container = $('#img-border')[0];
    let bloco = document.createElement('div');
    bloco.setAttribute('class', `${colors[i]} new-bloco`);
    bloco.setAttribute('id', `img-${imgCount}`);

    container.appendChild(bloco);

    
    // CREATING MENU
    container = $('#container')[0];

    let menu = document.createElement('div');
    menu.setAttribute('class', 'img-menu-container');
    menu.setAttribute('id', `img-menu-container-${imgCount}`);

    let imgTitle = document.createElement('div');
    imgTitle.setAttribute('id', `img-menu-${imgCount}`)
    imgTitle.setAttribute('class', `img-title`);
    imgTitle.innerHTML = `Bloco #${imgCount}`;

    let imgSquare = document.createElement('div');
    imgSquare.setAttribute('class', `color-squire squire ${colors[i]}`);

    imgTitle.appendChild(imgSquare);

    let clearButton = document.createElement('button');
    clearButton.setAttribute('id', `clear-bloco-${imgCount}`);
    clearButton.setAttribute('class', 'btn btn-outline-danger float-right clear-button button-bloco');
    clearButton.innerHTML = 'Clear';

    

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('id', `delete-bloco-${imgCount}`);
    deleteButton.setAttribute('class', 'btn btn-danger float-right delete-button button-bloco padding-button ');
    deleteButton.innerHTML = 'X';

    imgTitle.appendChild(deleteButton);
    imgTitle.appendChild(clearButton);

    menu.appendChild(imgTitle);

    let divContainer = document.createElement('div');
    
    let table = document.createElement('table');
    table.setAttribute('class', 'tablezada');
    let tbody = document.createElement('tbody');

    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.innerHTML = 'Altura';
    tr.appendChild(td);
    td = document.createElement('td');
    let tdInput = document.createElement('input');
    tdInput.setAttribute('id', `height-bloco-${imgCount}`);
    tdInput.setAttribute('class', 'form-control input-size');
    tdInput.setAttribute('type', 'number');
    tdInput.setAttribute('value', '25');
    td.appendChild(tdInput);
    tr.appendChild(td);
    tbody.appendChild(tr)

    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = 'Largura';
    tr.appendChild(td);
    td = document.createElement('td');
    tdInput = document.createElement('input');
    tdInput.setAttribute('id', `width-bloco-${imgCount}`);
    tdInput.setAttribute('class', 'form-control input-size');
    tdInput.setAttribute('type', 'number');
    tdInput.setAttribute('value', '25');
    td.appendChild(tdInput);
    tr.appendChild(td);
    tbody.appendChild(tr);

    table.appendChild(tbody);
    divContainer.appendChild(table)
    menu.appendChild(divContainer);

    divContainer = document.createElement('div');
    table = document.createElement('table');
    table.setAttribute('class', 'tablezada');
    tbody = document.createElement('tbody');


    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = 'Margem Topo';
    tr.appendChild(td);
    td = document.createElement('td');
    tdInput = document.createElement('input');
    tdInput.setAttribute('id', `margin-top-bloco-${imgCount}`);
    tdInput.setAttribute('class', 'form-control input-margin-menu-option');
    tdInput.setAttribute('type', 'number');
    tdInput.setAttribute('value', '10');
    td.appendChild(tdInput);
    tr.appendChild(td);
    tbody.appendChild(tr);

    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = 'Margem Bot';
    tr.appendChild(td);
    td = document.createElement('td');
    tdInput = document.createElement('input');
    tdInput.setAttribute('id', `margin-bottom-bloco-${imgCount}`);
    tdInput.setAttribute('class', 'form-control input-margin-menu-option');
    tdInput.setAttribute('type', 'number');
    tdInput.setAttribute('value', '10');

    td.appendChild(tdInput);
    tr.appendChild(td);
    tbody.appendChild(tr);

    table.appendChild(tbody);
    divContainer.appendChild(table)
    menu.appendChild(divContainer);

    divContainer = document.createElement('div');
    table = document.createElement('table');
    table.setAttribute('class', 'tablezada');
    table.setAttribute('id', `last-table-bloco-${imgCount}`);
    tbody = document.createElement('tbody');


    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = 'Margem Left';
    tr.appendChild(td);
    td = document.createElement('td');
    tdInput = document.createElement('input');
    tdInput.setAttribute('id', `margin-left-bloco-${imgCount}`);
    tdInput.setAttribute('class', 'form-control input-margin-menu-option');
    tdInput.setAttribute('type', 'number');
    tdInput.setAttribute('value', '10');
    td.appendChild(tdInput);
    tr.appendChild(td);
    tbody.appendChild(tr);

    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = 'Margem Right';
    tr.appendChild(td);
    td = document.createElement('td');
    tdInput = document.createElement('input');
    tdInput.setAttribute('id', `margin-right-bloco-${imgCount}`);
    tdInput.setAttribute('class', 'form-control input-margin-menu-option');
    tdInput.setAttribute('type', 'number');
    tdInput.setAttribute('value', '10');
    td.appendChild(tdInput);
    tr.appendChild(td);
    tbody.appendChild(tr);

    table.appendChild(tbody);
    divContainer.appendChild(table)
    menu.appendChild(divContainer);

    
    
    // CREATING FORM UPLOAD
    let form = document.createElement('form');
    form.setAttribute('action', '/upload');
    form.setAttribute('class', 'dropzone needsclick dz-clickable');
    form.setAttribute('id', `upload-${imgCount}`);
    
    container = $('#container')[0];;
    
    $(`#bloco-${imgCount}`).removeClass('d-none');
    container.insertBefore(menu, $(`#bloco-${imgCount}`)[0])
 
    $(`#img-${imgCount}`)[0].innerHTML = `${$(`#img-${imgCount}`)[0].offsetHeight}x${$(`#img-${imgCount}`)[0].offsetWidth}`;

    i++;
    if (i === 6) {
        i = 0;
    }

    makeSizeEvent();
    makeMarginEvent();
    makeClearEvent(imgCount);
    makeDeleteEvent();
    switchElements($(`#last-table-bloco-${imgCount}`)[0], $(`#bloco-${imgCount}`)[0]);
    blocos.push({ id: `bloco-${imgCount}` });


    $(`#height-bloco-${imgCount}`).trigger('change');
    $(`#width-bloco-${imgCount}`).trigger('change');
    $(`#margin-top-bloco-${imgCount}`).trigger('change');
    $(`#margin-left-bloco-${imgCount}`).trigger('change');
    $(`#margin-right-bloco-${imgCount}`).trigger('change');
    $(`#margin-bottom-bloco-${imgCount}`).trigger('change');

});


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function getSquireSize(element) {
    let height = document.getElementById(element).offsetHeight;
    let width = document.getElementById(element).offsetWidth;

    height = (height)*100/540;
    width = (width)*100/540;

    return {h: height, w: width};
}

function makeSizeEvent() {
    return $('.input-size').on('change', (event) => {
        let inputId = event.target.id.split('-')[2];
        let bloco = $(`#img-${inputId}`);
        let isHeight = event.target.id.split('-')[0] == 'height'?true:false;
        let size = $(`#${event.target.id}`).val();

        


        if (isHeight) {
            let marginTop = $(`#margin-top-bloco-${inputId}`).val();
            let marginBot = $(`#margin-bottom-bloco-${inputId}`).val();
            let realMargin = parseFloat(marginTop) + parseFloat(marginBot); 

            bloco.css('height', `calc(${size}% - ${realMargin}px)`);
            
            bloco[0].innerHTML = `${bloco[0].offsetHeight}x${bloco[0].offsetWidth}`
            bloco.css('line-height', `calc(${bloco[0].offsetHeight}px - 20px)`);
        } else {
            let marginLeft = $(`#margin-left-bloco-${inputId}`).val();
            let marginRight = $(`#margin-right-bloco-${inputId}`).val();

            let realMargin = parseFloat(marginLeft) + parseFloat(marginRight); 

            bloco.css('width', `calc(${size}% - ${realMargin}px)`);
            bloco[0].innerHTML = `${bloco[0].offsetHeight}x${bloco[0].offsetWidth}`
            bloco.css('line-height', `calc(${bloco[0].offsetHeight}px - 20px)`);
        }

    });
}

function makeMarginEvent() {
    return $('.input-margin-menu-option').on('change', (event) => {
        let inputId = event.target.id.split('-')[3];
        let bloco = $(`#img-${inputId}`);
        let marginOf = event.target.id.split('-')[1];
        let value = event.target.value;

        switch(marginOf) {
            case 'top':
                bloco.css('margin-top', `${value}px`);
                $(`#height-bloco-${inputId}`).trigger('change');
                break;
            case 'right':
                bloco.css('margin-right', `${value}px`);
                $(`#width-bloco-${inputId}`).trigger('change');
                break;
            case 'bottom':
                bloco.css('margin-bottom', `${value}px`);
                $(`#height-bloco-${inputId}`).trigger('change');
                break;
            case 'left':
                bloco.css('margin-left', `${value}px`);
                $(`#width-bloco-${inputId}`).trigger('change');
                break;
            default:
                bloco.css('margin-bottom', `${value}px`);
                $(`#width-bloco-${inputId}`).trigger('change');
                break;
        }
    });
}

function switchElements($ele1, $ele2) {
    $ele1.after($ele2);
}

function makeClearEvent(id) {
    return $(`#clear-bloco-${id}`).on('click', (event) => {
        let blocoN = event.target.id.split('-')[2];
        let formImages = $(`#bloco-${blocoN} > div.dz-preview.dz-image-preview`);

        if (formImages[0]) {
            formImages.remove();
        } 
        

        $(`#bloco-${id}`).css('cursor', 'wait');
        $(`#bloco-${id}`).prop("disabled",true)

        let form = $(`#bloco-${blocoN}`);

        form.removeClass('dz-started');    

        for (img of imgs) {
            if (img.bloco === `bloco-${blocoN}`) {
                imgs.splice(imgs.indexOf(img));
            }
        }
    
    });
}

function makeDeleteEvent() {
    return $('.delete-button').on('click', (event) => {
        let blocoN = event.target.id.split('-')[2];

        $(`#clear-bloco-${blocoN}`).trigger('click');

        $(`#img-${blocoN}`).remove();
        $(`#img-menu-container-${blocoN}`).remove();
    });
}