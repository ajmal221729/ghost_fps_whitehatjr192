window.ABLAST = {};

// Globals
window.AFPS = {
    gamestate: {
        score: 0,
        currentEnemyId: 0
    }
};


require('./a-asset-image.js');

require('./components/bullet.js');
require('./components/collision-helper.js');


// gun.js and weapon.js are causing the Ghost models to become dark silhouettes.
require('./components/gun.js');

require('./components/headset.js');
require('./components/json-model.js');
require('./components/shoot-controls.js');
require('./components/weapon.js');

require('./bullets/player.js');

require('./components/enemy.js');

require('./lib/poolhelper.js');
require('./lib/utils.js');

require('./systems/bullet.js');  

require('./components/game-manager.js');