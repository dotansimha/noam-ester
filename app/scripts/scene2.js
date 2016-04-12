function hover(e) {
  $(e).attr('src', 'images/doll_hover.png');
}

function unhover(e) {
  $(e).attr('src', 'images/doll.png');
}

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 300, offset: 7900, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(
      new TimelineMax().insert(TweenMax.to("#ghost", 1, {
        opacity: 1,
        x: '+=700',
        rotation: 10
      }))
    )
    .insert(
      new TimelineMax()
        .add(TweenMax.to("#line7", 1, {
          opacity: 1
        }))
    )
  )
  .setPin("#scene_2")
  .addIndicators({name: "ghost1"})
  .addTo(controller);


new ScrollMagic.Scene({triggerElement: "#trigger", duration: 400, offset: 8200, triggerHook: 0})
  .setTween(new TimelineMax()
    .add(TweenMax.to("#line7", 1, {
      opacity: 0
    }))
    .add(TweenMax.to("#line8", 1, {
      opacity: 1
    }))
    .add(TweenMax.to("#ghost_image", 1, {
      rotation: -20,
      zoom: 1.1
    }))
    .add(TweenMax.to("#ghost_image", 1, {
      rotation: 30,
      zoom: 1.2
    }))
    .add(TweenMax.to("#ghost_image", 1, {
      rotation: 0,
      zoom: 1.3
    }))
    .add(TweenMax.to("#line8", 1, {
      opacity: 0
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
      css: {className: '+=glow'},
      immediateRender: false
    }))
  )
  .addIndicators({name: "ghost3"})
  .addTo(controller);

var dollDragged = false;

$(window).scroll(function () {
  if (!dollDragged) {
    if ($(window).scrollTop() >= 8940 + screenHeight) {
      $(window).scrollTop(8940 + screenHeight);
    }
  }
  else {
    $("#doll").removeClass("glow");
  }
});

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 500, offset: 8900, triggerHook: 0})
  .setPin("#scene_3")
  .on("update", function (e) {
    $("#doll").draggable({
      start: function () {
        if (!dollDragged) {
          $("#doll").css({
            width: '230px',
            height: '298px',
            transform: 'rotate(-10deg)'
          });
          $("#doll").removeClass("glow");
        }
      },
      cursorAt: {top: 150, left: 150}
    });

    $("#bag_bg").droppable({
      accept: "#doll",
      activeClass: "on-drag",
      drop: function () {
        dollDragged = true;
        $("#doll").attr("src", "images/doll2.png").hide();
        $("#bag_bg").attr("src", "images/doll_in_bag.png");
        $("#bag_fe").hide();
        $(window).scrollTop($(window).scrollTop() + 450);
      }
    });
  })
  .addIndicators({name: "stand"})
  .addTo(controller);
