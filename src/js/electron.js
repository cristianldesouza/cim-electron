$('#build-button').on('click', async () => {
    let qtdBlocos = $('.img-title').length;
    let colors = [];

    for (let i = 0; i < $('#qtdColors').val(); i++) {
        colors[i] = $(`#c${i+1}`).val();
    }

    for (let i = 0; i < qtdBlocos; i++) {
        if (!$(`#bloco-${i + 1} > div.dz-preview.dz-image-preview`)[0]) {
            $('#build-button').attr('disabled', false);
            $('body').css('cursor', '');
            $('#build-button').css('background-color', '#28a745');
            return alert('Não deve haver blocos vazios')
        }
    }


    for (bloco of blocos) {
        bloco.width = $(`#width-bloco-${bloco.id.split('-')[1]}`).val();
        bloco.height = $(`#height-bloco-${bloco.id.split('-')[1]}`).val();
        bloco.marginTop = $(`#margin-top-bloco-${bloco.id.split('-')[1]}`).val();
        bloco.marginBot = $(`#margin-bottom-bloco-${bloco.id.split('-')[1]}`).val();
        bloco.marginRight =$(`#margin-right-bloco-${bloco.id.split('-')[1]}`).val();
        bloco.marginLeft = $(`#margin-left-bloco-${bloco.id.split('-')[1]}`).val();
    }
    
    let imgsForCombination = [];
    
    for (let i = 0; i < blocos.length; i++) {
        imgsForCombination[i] = [];
        let bl = blocos[i];

        for (img of imgs) {
            if (img.bloco === bl.id) {
                imgsForCombination[i].push(img);
            }
        }

    }

    let imgsCombination = await combinate(imgsForCombination);

    let config = { 
        colors: colors,
        blocoSize: blocos,
        imgs: imgsCombination,
    };

    let dir = __dirname.split('/src')[0] + '/images/' + moment.tz('America/Sao_Paulo').format('DD-MM-YYYY_HH:mm:ss');


    if (!fs.existsSync(dir)){
        await fs.mkdirSync(dir);
    }

    config.imgsDir = dir;

    let count = 1;
    let html = '<html><head><style> html, body { margin: 0;} </style> </head> <body>';

    for (color of colors) {
        for (combination of config.imgs) {
            html += ` <div id="div-${count}" style="background-color: ${color}; height: 1080px; width: 1080px; margin:auto">`
            for (let i = 0; i < combination.length; i++) {
                for (each of config.blocoSize) {
    
                    if (each.id === combination[i].bloco) {
                        width = each.width;
                        height = each.height;
                        marginTop = each.marginTop;
                        marginBot = each.marginBot;
                        marginRight = each.marginRight;
                        marginLeft = each.marginLeft;
                        marginWidth = parseFloat(marginRight) + parseFloat(marginLeft);
                        marginHeight = parseFloat(marginTop) + parseFloat(marginBot);
                    }

                }
                html += `<div style="margin-top: ${marginTop}; margin-left:${marginLeft}; margin-right: ${marginRight}; margin-bottom: ${marginBot}; background-size:cover; float:left; width: calc(${width}% - ${marginWidth}px); height: calc(${height}% - ${marginHeight}px); background-image: url('${combination[i].url}')">
                </div>`;
            }
            html += `</div>`
            count++;
            
        }
    }

    let htmlDir = __dirname + '/result.html' ;

    fs.writeFile(htmlDir, html, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 

    try {
        await printBloco(`file:${htmlDir}`, dir, count);
    }
    catch (err) {}

    console.log('agora vai fdp');

    

});