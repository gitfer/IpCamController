IpCamController
===============

A nodejs command line controller for Foscam ipcameras

Ipcamera script based on [commander](https://github.com/visionmedia/commander.js) and [nodejs-foscam](https://github.com/fvdm/nodejs-foscam)

### Dependencies

The installation and loading are simple with [NPM](https://npmjs.org/).

After checking out nodejs-foscam git submodule, install commander:

	npm install


### Usage

1. Create a 'config.json' file just like the following:

  ```sh
  {
    "host": "hostname",
    "port": "80",
    "username": "admin",
    "password": "password"
  }
  ```
2. In order to show the available options, run:

	```sh
  	node ipcamera-controller.js -h
  	```

