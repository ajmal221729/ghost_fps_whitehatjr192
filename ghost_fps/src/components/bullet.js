/* globals AFRAME ABLAST THREE */
AFRAME.registerComponent('bullet', {
  schema: {
    name: { default: '' },
    direction: { type: 'vec3' },
    maxSpeed: { default: 5.0 },
    initialSpeed: { default: 5.0 },
    position: { type: 'vec3' },
    acceleration: { default: 0.5 },
    destroyable: { default: false },
    owner: {default: 'player', oneOf: ['enemy', 'player']},
    color: {default: '#fff'}
  },

  init: function () {
    this.startEnemy = document.getElementById('start_enemy');
    this.backgroundEl = document.getElementById('border');
    this.bullet = ABLAST.BULLETS[this.data.name];
    this.bullet.definition.init.call(this);
    this.hit = false;
    this.direction = new THREE.Vector3();
    this.temps = {
      direction: new THREE.Vector3(),
      position: new THREE.Vector3()
    }
  },

  update: function (oldData) {
    var data = this.data;
    this.owner = this.data.owner;
    this.direction.set(data.direction.x, data.direction.y, data.direction.z);
    this.currentAcceleration = data.acceleration;
    this.speed = data.initialSpeed;
    this.startPosition = data.position;
  },

  play: function () {
    this.initTime = null;
  },

  hitObject: function (type, data) {
    console.log('hitObject');
	if(this.hit==true) return;
    this.bullet.definition.onHit.call(this);
    console.log("type=", type);
    console.log("Setting hit to true.");
    this.hit = true;
    if (type === 'enemy') {
      console.log('Hit enemy');
    }
    if (this.data.owner === 'enemy') {
      this.el.emit('player-hit');
      document.getElementById('hurtSound').components.sound.playSound();
    }
    else {
      if (type === 'bullet') {
        // data is the bullet entity collided with
        data.components.bullet.resetBullet();
        this.el.sceneEl.systems.explosion.createExplosion(type, data.object3D.position, data.getAttribute('bullet').color, 1, this.direction);
        ABLAST.currentScore.validShoot++;
      }
      else if (type === 'background') {
        this.el.sceneEl.systems.decals.addDecal(data.point, data.face.normal);
        var posOffset = data.point.clone().sub(this.direction.clone().multiplyScalar(0.2));
        this.el.sceneEl.systems.explosion.createExplosion(type, posOffset, '#fff', 1, this.direction);
      }
      else if (type === 'enemy') {
        var enemy = data.getAttribute('enemy');
        if (data.components['enemy'].health <= 0) {
          this.el.sceneEl.systems.explosion.createExplosion('enemy', data.object3D.position, enemy.color, enemy.scale, this.direction, enemy.name);
        }
        else {
          this.el.sceneEl.systems.explosion.createExplosion('bullet', this.el.object3D.position, enemy.color, enemy.scale, this.direction);
        }
        ABLAST.currentScore.validShoot++;
      }
    }
    this.resetBullet();
  },

  resetBullet: function () {
    console.log('resetBullet');
    this.hit = false;
    this.bullet.definition.reset.call(this);
    this.initTime = null;

    this.direction.set(this.data.direction.x, this.data.direction.y, this.data.direction.z);

    this.currentAcceleration = this.data.acceleration;
    this.speed = this.data.initialSpeed;
    this.startPosition = this.data.position;

    this.system.returnBullet(this.data.name, this.el);
  },

  tick: (function () {
      var position = new THREE.Vector3();
      var direction = new THREE.Vector3();
    return function tick (time, delta) {
      console.log('bullet.tick');
      // 5/13/2018: Check for collisions.
      var collisionHelper = this.el.getAttribute('collision-helper');
      if (!collisionHelper) { return; }

      var bulletRadius = collisionHelper.radius;
      
      var enemies = AFPS.enemies;
      console.log("Checking for collisions with ", enemies);
      for (var i = 0; i < enemies.length; i++) {
        console.log("Checking enemy ", i);
        var enemy = enemies[i];
        var helper = enemy.getAttribute('collision-helper');
        if (!helper) continue;
        var radius = helper.radius;
        this.temps.position.copy(this.el.getAttribute('position'));
        if (this.temps.position.distanceTo(enemy.object3D.position) < radius + bulletRadius) {
          enemy.emit('hit');
          this.hitObject('enemy', enemy);
          return;
        }
      }
    }

      
    })
  });