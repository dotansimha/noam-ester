var controller = new ScrollMagic.Controller();

//TweenLite.defaultOverwrite = false;

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 4000, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#girlOnly", 1, {
      rotation: 50,
      transformOrigin: "left top",
      repeat: 7,
      yoyo: true,
      ease: Linear.easeNone
    }))
    .insert(TweenMax.to("#swingOnly", 1, {
      rotation: 50,
      transformOrigin: "left top",
      repeat: 7,
      yoyo: true,
      ease: Linear.easeNone
    }))
  )
  .setPin("#scene_1")
  .addIndicators({name: "swing"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 1000, offset: 4000, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#girlOnly", 1, {rotation: 390, transformOrigin: "left top"}))
    .insert(TweenMax.to("#swingOnly", 1, {rotation: 390, transformOrigin: "left top"}))
  )
  .setPin("#scene_1")
  .addIndicators({name: "roll"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 2000, offset: 5000, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#girl_on_swing", 1, {rotation: -150, transformOrigin: "center center"}))
    .insert(TweenMax.to("#girlOnly", 1, {x: -600, y: 200}))
  )
  .setPin("#scene_1")
  .addIndicators({name: "fly"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 400, offset: 7000, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#girlOnly", 1, {marginLeft: -50, marginTop: 80}))
  )
  .on("update", function (e) {
    if (e.scrollPos < 5000) {
      $("#girl_on_swing").attr('src', 'images/girl_on_swing.png');
    }
    else if (e.scrollPos > 5000 && e.scrollPos < 6000) {
      $("#girl_on_swing").attr('src', 'images/girl_on_swing2.png');
    }
    else if (e.scrollPos > 6000 && e.scrollPos < 7400) {
      $("#girl_on_swing").attr('src', 'images/girl_on_swing3.png');
    }
    else if (e.scrollPos > 7400) {
      $("#girl_on_swing").attr('src', 'images/girl_on_ground.png');
    }
    else {
      $("#girl_on_swing").attr('src', 'images/girl_on_swing.png');
    }
  })
  .setPin("#scene_1")
  .addIndicators({name: "fall"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 500, offset: 7400, triggerHook: 0})
  .setPin("#scene_1")
  .addIndicators({name: "fly"})
  .addTo(controller);
