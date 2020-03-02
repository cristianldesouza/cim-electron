//DEPENDENCES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const EasyZip = require('easy-zip2').EasyZip;

let users = [];
let blocos = [];
const thisUrl = 'http://localhost:3333';

//CUSTOM
const help = require('./helper.js')
const middlewares = require('./middlewares.js')

//MIDDLEWARES
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(middlewares.imgEdit);

storage = multer.diskStorage(
    {
        destination: __dirname + '/src/uploads/',
        filename: function ( req, file, cb ) {
            let user = req.headers.user;
            let blocoHeader = req.headers.bloco;
            let objBloco = {};
            let existeBloco = true;
            let imgId = 0;

            if (users.indexOf(user) === -1) {
                users.push(user);
                objBloco = {
                    user: user,
                    bloco: blocoHeader,
                    img: 1,
                }
                existeBloco = false;
                imgId = 1
                blocos.push(objBloco);
            } else {
                for (bloco of blocos) {
                    if (bloco.user === user && bloco.bloco === blocoHeader) {
                        bloco.img++
                        imgId = bloco.img;
                        existeBloco = false;
                    }
                }
            }    

            if (existeBloco) {
                objBloco = {
                    user: user,
                    bloco: blocoHeader,
                    img: 1,
                }
                imgId = objBloco.img;
                blocos.push(objBloco);
            }           
            
            cb( null, user + '-' + blocoHeader + '-img-' + imgId +".png");
        }
    }
);
    
const upload = multer({ storage: storage });

app.post('/delete-bloco/', async function (req, res) {
    let user = req.headers.user;
    let bl = req.headers.bloco;
    
    for (bloco of blocos) {
        if (bloco.user === user && bloco.bloco === bl) {
            blocos.splice(blocos.indexOf(bloco), 1);            
        }
    }
    
    res.statusCode = 200;
    res.send({ excluido: true});
});


app.post('/upload', upload.single( 'file' ), function( req, res, next ) {
    // Metadata about the uploaded file can now be found in req.file
    
    req.file.filename = 'D';
    req.file.path = __dirname + `/src/uploads/${req.file.filename}`

    res.redirect("back");
  });


app.get('/teste', async function (req, res) {
    let toSend = await help.compileAll([
        { part: 'teste' },
    ]);
    
    res.send(toSend);
});

app.post('/build-imgs/', async function (req, res) {
    let bls = req.body.blocos;
    let user = req.headers.user;
    let colors = req.body.background;

    let imgs = [];
    let imgsCombination = [];

    for (bloco of blocos) {
        if (bloco.user == user) {
            let blocoId = bloco.bloco;

            for (bl of bls) {
                if (bl.id == blocoId) {
                    bloco.width = bl.width;
                    bloco.height = bl.height;
                    bloco.marginTop = bl.marginTop;
                    bloco.marginBot = bl.marginBot;
                    bloco.marginRight = bl.marginRight;
                    bloco.marginLeft = bl.marginLeft;

                    let blArray = [];

                    for (let i = 1; i <= bloco.img; i++) {
                        let img = {};
                        img.bloco = bloco.bloco;
                        img.url = `${thisUrl}/uploads/${bloco.user}-${bloco.bloco}-img-${i}.png`;
                        blArray.push(img);
                    }

                    imgs.push(blArray);
                } 
            }
        }
    }    

    //console.log('going to combinate: ' + JSON.stringify(imgs));
    imgsCombination = await help.combinate(imgs);

    let config = { 
        user: user,
        colors: colors,
        blocoSize: bls,
        imgs: imgsCombination,
    };

    let dirId = await help.randomInt(10000000, 99000000);
    let dir = __dirname + '/src/prints/' + config.user + '-' + dirId;

    if (!fs.existsSync(dir)){
        await fs.mkdirSync(dir);
    }

    config.imgsDir = dir;

    //console.log(config)
    let count = 1;
    let html = '<html><head><style> html, body { margin: 0;} </style> </head> <body>';
    //let url = `${thisUrl}/print-imgs/?bckg=${color.split('#')[1]}&nbl=${config.blocoSize.length}`;
    let url = `${thisUrl}/print-imgs/?user=${user}`;

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

    let htmlDir = __dirname + '/src/prints/' + config.user + '-result.html' ;

    fs.writeFile(htmlDir, html, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
      
    //console.log(url);
    await help.printBloco(url, config.user + '-' + dirId, count);

    let zip5 = new EasyZip();

    zip5.zipFolder(dir, function() {
        zip5.writeToFile(dir + '.zip', () => {
            res.statusCode = 200;
            
            res.send({download: `/prints/${config.user}-${dirId}.zip`});
        });
    });
    
    
    
    //help.deleteRecursive(dir);
});

app.get('/print-imgs/', async function (req, res) {
    let user = req.query.user;

    let toSend = await help.compileAll([
        { part: `prints/${user}-result` },
    ]);

    res.send(toSend);
});

app.listen(3333, '0.0.0.0', function () {
	console.log('Running');
});