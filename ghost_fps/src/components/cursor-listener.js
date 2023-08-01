console.log("cursor-listener.js");

AFRAME.registerComponent('cursor-listener', {  
  init: function () {
    console.log("cursor-listener.init");
    console.log("this:" + this);
    var el = this.el;
    el.addEventListener('click', function (evt) {
      console.log("I was clicked.");
      //el.style.display = 'none';
      //console.log("Visibility set to " + el.getAttribute('visible'));
      el.parentNode.removeChild(el);
    });
  }
});