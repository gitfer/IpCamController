var config = require('./config.json');
var cam = require('foscam');
var videoshow = require('videoshow')

function setupCam () {
  console.log('cam', cam);
    cam.setup(
        {
            host: '192.168.1.45',
            port: 80,
            user: 'admin',
            pass: ''
        },
        function( status ) {
            if( !status ) {
                console.error( 'ERROR: can\'t connect' )
            } else{
                console.log(status)
            }
        }
    );

    cam.control.camera('resolution', 640, function () {
      console.log ('Resolution changed to 640x480');
    });
}

const takePicture = (index) => {
  cam.snapshot ('./pictures/save_' + index + '.jpg', console.log);
};

const center = () => {
  console.log('Start center');
  cam.control.decoder('center', function() {
      console.log('End center');
  });  
};

const rotate = (direction, degrees, cam) => {
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


function init(){
    console.log('init');

    let secondsToWait = 4;
    let degrees = 20;
    let directions = ['right', 'right', 'left', 'left' ];
    let nextIndex = 0;

    cam.setup(
    {
        host: '192.168.1.45',
        port: 80,
        user: 'admin',
        pass: ''
    });

    cam.control.camera('resolution', 640, function () {
      console.log ('Resolution changed to 640x480');
      /*center();*/
    });

    const convert = () => {
      var images = [
  './pictures/save_1.jpg',
  './pictures/save_2.jpg',
  './pictures/save_3.jpg',
  './pictures/save_4.jpg',
  './pictures/save_5.jpg',
  './pictures/save_6.jpg',
  './pictures/save_7.jpg'
]

var videoOptions = {
  fps: 20,
  loop: 5, // seconds
  transition: false,
  transitionDuration: 0, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

videoshow(images, videoOptions)
  .save('./videos/video.mp4')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err, stdout, stderr) {
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)
  })
  .on('end', function (output) {
    console.error('Video created in:', output);
    process.exit();
  })
};
    const execute = function() {
            let millisBetweenPacks = 18000;
            let millisBetweenPics = 1000;
            const NUMBER_OF_PICS = 10;
            const fixedPictureInterval = setInterval(function() {
              nextIndex = nextIndex + 1;
              takePicture(nextIndex);
              setTimeout(function () {
              if(nextIndex >= NUMBER_OF_PICS){
                clearInterval(fixedPictureInterval);
                console.log('Ended pack');
                convert();
                nextIndex = 0;
                setTimeout(function () {
                  console.log('Restarting...');
                  execute();
                }, millisBetweenPacks)
              }
              }, millisBetweenPics + 200)
            }, millisBetweenPics);

    };
    execute();
}
init();