const low = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db_config.json')
const db = low(adapter)

db.defaults({ configs: [] })
  .write()

  let configsDb = db.get('configs').value();

  if (configsDb.length > 0) {
    let select = $('#configs')[0];
    
    for (let i = 0; i < configsDb.length; i++) {
        let configName = configsDb[i].name;
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(configName));
        opt.value = configName;
        select.appendChild(opt);
    }

    $(`#load-container`).removeClass('d-none');
}


$('#save-config').on('click', () => {
    let configName = $('#custom-name').val();
    
    if (!configName) {
        return alert('The configuration must have an name!');        
    }

    let bckVariations = $('#qtdColors').val();
    let bckVariationColors = [];

    for (let i = 0; i < bckVariations; i++) {
        let color = $(`#c${i+1}`).val();
        bckVariationColors.push(color);
    }

    let qtdBlocos = $('.img-title').length;
    let blocos = [];

    for (let i = 0; i < qtdBlocos; i++) {
        let bloco = {};

        bloco.heightPercent = $(`#height-bloco-${i+1}`).val(); 
        bloco.widthPercent = $(`#width-bloco-${i+1}`).val(); 
        
        bloco.marginTop = $(`#magin-top-bloco-${i+1}`).val(); 
        bloco.marginRight = $(`#magin-right-bloco-${i+1}`).val(); 
        bloco.marginBot = $(`#magin-bottom-bloco-${i+1}`).val(); 
        bloco.marginLeft = $(`#magin-left-bloco-${i+1}`).val(); 

        bloco.divImg = $(`#img-${i+1}`)[0].outerHTML;

        blocos.push(bloco);
    }

    let config = {
        bckVariations: bckVariations,
        bckVariationColors: bckVariationColors,
        blocos: blocos
    }

    let configuration = {
        name: configName,
        config: config
    }

    let configExists = db.get('configs').find({ name: configName }).value()

    if (configExists) {
        db.get('configs').remove({ name: configName}).write();
    }

    db.get("configs").push(configuration).write()

    let select = $('#configs')[0];

    $('#configs').find('option').remove().end();

    configsDb = db.get('configs').value();
    
    for (let i = 0; i < configsDb.length; i++) {
        let configName = configsDb[i].name;
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(configName));
        opt.value = configName;
        select.appendChild(opt);
    }
    $(`#load-container`).removeClass('d-none');

    return alert('Configuração salva com sucesso!');
   
});


$('#load-config').on('click', () => {
    // Reset actual config
    let qtdBlocos = $('.img-title').length;

    for (let j = 1; j <= qtdBlocos; j++) {
        $(`#delete-bloco-${j}`).trigger('click');

        i = 0;
        imgCount = 0;
    }

    // Effective Loading the config
    let selectedConfig = $('#configs option:selected').text();
    let config = db.get('configs')
    .find({ name: selectedConfig })
    .value()

    config = config.config;

    $('#qtdColors').val(config.bckVariations);
    $('#qtdColors').trigger('change');

    let count = 1;

    for (each of config.bckVariationColors) {
        $(`#c${count}`).val(each);
        $(`#c${count}`).trigger('change');
        count++
    }

    count = 1;

    for (bloco of config.blocos) {
        $('#add-img').trigger('click');

        $(`#height-bloco-${count}`).val(bloco.heightPercent);
        $(`#height-bloco-${count}`).trigger('change');

        $(`#width-bloco-${count}`).val(bloco.widthPercent);
        $(`#width-bloco-${count}`).trigger('change')

        $(`#magin-top-bloco-${count}`).val(bloco.marginTop); 
        $(`#magin-right-bloco-${count}`).val(bloco.marginRight); 
        $(`#magin-bottom-bloco-${count}`).val(bloco.marginBot); 
        $(`#magin-left-bloco-${count}`).val(bloco.marginLeft); 
  
        $(`#img-${count}`)[0].outerHTML = bloco.divImg;

        count++;
    }        
});