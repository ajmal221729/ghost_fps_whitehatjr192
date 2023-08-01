
// Helper functions for the game-manager component.
var GameManagerUtils = {
    generateRandomNumber: function (min, max) {
        return Math.floor(Math.random() * max + min);
    },
    chooseRandomPosition: function () {
        var xPos = this.generateRandomNumber(-5, 5);
        var yPos = 1.6;
        var zPos = this.generateRandomNumber(-5, -10);
        return { 'x': xPos, 'y': yPos, 'z': zPos};
    },
    
    // Create a new enemy entity.
    createEnemy: function (enemyNumber) {
        var enemyId = "enemy" + enemyNumber.toString();
        var newEnemy = document.createElement('a-entity');
        newEnemy.setAttribute('gltf-model', '#ghost');
        newEnemy.setAttribute('enemy', {'health': 1});
        newEnemy.setAttribute('static-body', '');
        newEnemy.setAttribute('id', enemyId);
        newEnemy.setAttribute('type', 'enemy');
        var position = this.chooseRandomPosition();
        var positionStr = position.x.toString() + ' ' + position.y.toString() + ' ' + position.z.toString();
        
        newEnemy.setAttribute('position', position);
        var destinationStr = '0 ' + position.y.toString() + ' 0';
        return newEnemy;
    }
};


// The game-manager A-Frame component automatically 
// generates randomly positioned enemies.
AFRAME.registerComponent('game-manager', {
    init: function () {
        var sceneEl = this.el;

        var enemy = GameManagerUtils.createEnemy(AFPS.gamestate.currentEnemyId);
        sceneEl.addEventListener('loaded', function () {
            sceneEl.appendChild(enemy);
        });

        sceneEl.addEventListener('targetdestroyed', function(e) {
            console.log('caught targetdestroyed');
            console.log(e);
            var targetEl = e.target;
            targetEl.parentNode.removeChild(targetEl);
            AFPS.gamestate.score++;
            console.log('new score', AFPS.gamestate.score);
            var scoreEl = document.getElementById('scoreboard');
            scoreEl.setAttribute('value', 'Score: ' + AFPS.gamestate.score);
            console.log(scoreEl);
            console.log(scoreEl.innerHTML);
            AFPS.gamestate.currentEnemyId++;
            this.appendChild(GameManagerUtils.createEnemy(AFPS.gamestate.currentEnemyId));
        });
    }
});
