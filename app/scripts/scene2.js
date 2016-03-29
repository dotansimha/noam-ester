new ScrollMagic.Scene({triggerElement: "#trigger", duration: 300, offset: 7900, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#ghost", 1, {
      opacity: 1,
      x: 100,
      rotation: 10
    }))
  )
  .setPin("#scene_2")
  .addIndicators({name: "ghost1"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 400, offset: 8200, triggerHook: 0})
  .setTween(new TimelineMax()
    .add(TweenMax.to("#ghost_image", 1, {
      rotation: -20,
      x: 100,
      zoom: 1.1
    }))
    .add(TweenMax.to("#ghost_image", 1, {
      rotation: 30,
      zoom: 1.2
    }))
    .add(TweenMax.to("#ghost_image", 1, {
      rotation: 0,
      x: 130,
      zoom: 1.3
    }))
  )
  .setPin("#scene_2")
  .addIndicators({name: "ghost2"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 300, offset: 8600, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#ghost", 1, {
      opacity: 0
    }))
    .insert(TweenMax.to("#doll", 1, {
      css: { className: '+=glow' },
      immediateRender: false
    }))
  )
  .addIndicators({name: "ghost3"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 1000, offset: 11500, triggerHook: 0})
  .setPin("#scene_3")
  .addIndicators({name: "stand"})
  .addTo(controller);
