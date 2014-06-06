var config = require('./config.json');
var cam = require('./nodejs-foscam');
var program = require('commander');

function setupCam () {
    cam.setup(
        {
            host: config.host,
            port: config.port,
            user: config.username,
            pass: config.password
        },
        function( status ) {
            if( !status ) {
                console.error( 'ERROR: can\'t connect' )
            } else{
                console.log(status)
            }
        }
    );
}

function init(commandName){
    return function(val) {
        setupCam();
      var commandSanitized = commandName.replace(new RegExp('-', 'g'), ' ');
        if(val !== undefined){
            console.log('Setting preset \'' + commandSanitized + '\' to value: ' + val);
            cam.preset[commandSanitized](val);
            return;
        }
        cam.control.decoder(commandSanitized, function() {
            console.log('Executing ' + commandSanitized);
        });  
    };
}

function rotateLeft(degrees) {
    rotate('left', degrees);
}

function rotateRight(degrees) {
    rotate('right', degrees);
}

function rotateUp(degrees) {
    rotate('up', degrees);
}

function rotateDown(degrees) {
    rotate('down', degrees);
}

function rotate(direction, degrees) {
    setupCam();
    var secondsToWait = (degrees * 19)/270;
    cam.control.decoder(direction, function() {
        console.log('Direction: ' + direction + '. Executing rotation by ' + degrees + ' degrees');

        setTimeout(function() {
            cam.control.decoder('stop '+direction, function() {
                console.log('Rotation ended');
            });  
        },secondsToWait * 1000);
    });  
}

program
  .version('0.0.1')
  .option('-C, --center', 'Center cam', init('center'))
  .option('-L, --left', 'Move left completely', init('right'))
  .option('-R, --right', 'Move right completely', init('left'))
  .option('-U, --up', 'Move up completely', init('up'))
  .option('-D, --down', 'Move up completely', init('down'))
  .option('-l, --left-step [degrees]', 'Move left few degrees', rotateRight, 45)
  .option('-r, --right-step [degrees]', 'Move right few degrees', rotateLeft, 45)
  .option('-u, --up-step [degrees]', 'Move up few degrees', rotateUp, 45)
  .option('-d, --down-step [degrees]', 'Move down few degrees', rotateDown, 45)
  .option('-i, --infrared-on', 'IR on', init('io-output-low'))
  .option('-o, --infrared-off', 'IR off', init('io-output-high'))
  .option('-s, --set [pos]', 'Set pos (1-16)', init('set'), 1)
  .option('-g, --go [pos]', 'Go to pos (1-16)', init('go'), 1)
  .option('-p, --patrol', 'Start horizontal patrol', init('horizontal-patrol'))
  .option('-ps, --patrol-stop', 'Stop horizontal patrol', init('stop-horizontal-patrol'))
  .option('-?, --info-cam', 'Log cam', function(){ console.log(cam); })
  .parse(process.argv);
