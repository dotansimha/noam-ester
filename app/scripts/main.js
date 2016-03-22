var controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({triggerElement: "#swing_trigger1", duration: 800, triggerHook: 0.2})
  .setTween(new TimelineMax()
    .add(TweenMax.to("#girl", 1, {rotation: 50, transformOrigin:"left top", repeat: 7, yoyo:true, ease: Linear.easeNone}))
    .add(TweenMax.to("#girl", 1, {rotation: 450, transformOrigin:"left top", ease: Linear.easeNone}))
  )
  .setPin("#girl_container")
  .addIndicators({name: "swing1"})
  .addTo(controller);