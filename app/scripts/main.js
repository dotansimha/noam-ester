var controller = new ScrollMagic.Controller();

var tween = TweenMax.to("#girl", 1, {rotation: 50, transformOrigin:"left top", repeat: 5, yoyo:true, ease: Linear.easeNone});

new ScrollMagic.Scene({triggerElement: "#swing_trigger", duration: 400, triggerHook: 0.2})
  .setTween(tween)
  .setPin("#girl_container", {pushSpacers: false})
  .addIndicators({name: "here"})
  .addTo(controller);
