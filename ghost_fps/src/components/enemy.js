AFRAME.registerComponent('enemy', {
    schema: {
        'health': {type: 'int', default: 1}
    },
    init: function() {
        var el = this.el;
    },

    hit: function() {
        
        console.log('Calling enemy.hit');
        var el = this.el;
        console.log("original health:", this.data.health);
        this.data.health--;
        console.log("current health", this.data.health);
        if (this.data.health <= 0) {
            el.emit('targetdestroyed');
        }
    }

});