function videoDone() {
  lockOn = $(window).scrollTop();

  $("#replay").css({top: $(window).scrollTop() + "px"});
  $("#replay").fadeIn(500, function () {
    setTimeout(function () {
      $("#wink").attr("src", "images/wink2.png");
      setTimeout(function () {
        $("#wink").attr("src", "images/wink1.png");
      }, 350);

      setTimeout(function () {
        $("#replay_con").show();
      }, 1000);
    }, 300);
  });
}

function replay() {
  window.location.href = window.location.href + "?cache=" + Date.now();
}

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 500, offset: 9400, triggerHook: 0})
  .setTween(new TimelineMax()
    .insert(TweenMax.to("#keepScroll", 0.01, {
      opacity: 0
    }))
    .insert(TweenMax.to("#bag_container", 1, {
      x: screenWidth - 450,
      y: 600,
      scale: 0.6
    }))
    .insert(TweenMax.to("#doll", 1, {
      y: 350,
      x: -250
    }))
  )
  .setPin("#fake")
  .addIndicators({name: "room1"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 400, offset: 9400, triggerHook: 0})
  .on("update", function (e) {
    if (e.scrollPos > 9400 + screenHeight) {
      if ($("#bag_bg").attr("src") != "images/empty_bag.png") {
        $("#bag_bg").attr("src", "images/empty_bag.png");
      }

      $("#doll").show();
    }
  })
  .setPin("#fake")
  .addIndicators({name: "room2"})
  .addTo(controller);


new ScrollMagic.Scene({triggerElement: "#trigger", duration: 3000, offset: 9800, triggerHook: 0})
  .setTween(
    new TimelineMax()
      .insert(TweenMax.to("#lamp", 1, {
        opacity: 0
      }))
      .insert(TweenMax.to("#phone", 1, {
        opacity: 0
      }))
      .insert(TweenMax.to("#room", 1, {
        top: 0
      }))
      .insert(TweenMax.to("#overlay", 1, {
        top: 0
      }))
      .insert(TweenMax.to("#doll", 1, {
        top: -300
      }))
      .insert(TweenMax.to("#bag_container", 1, {
        top: -300
      }))
      .add(
        new TimelineMax()
          .insert(
            new TimelineMax()
              .insert(TweenMax.to("#overlay", 1, {
                opacity: 1
              }))
              .insert(new TimelineMax().insert(TweenMax.to("#sun", 1, {
                  x: -300,
                  y: 200
                })).insert(new TimelineMax()
                .add(TweenMax.to("#line9", 0.5, {
                  opacity: 1
                }))
                .add(TweenMax.to("#line9", 0.1, {
                  opacity: 0
                }))
                .add(TweenMax.to("#line10", 0.1, {
                  opacity: 1
                }))
                .add(TweenMax.to("#line10", 0.1, {
                  opacity: 0
                }))
                .add(TweenMax.to("#line11", 0.1, {
                  opacity: 1
                })))
              )
          )
      )
  )
  .setPin("#scene_3")
  .addIndicators({name: "moves"})
  .addTo(controller);

new ScrollMagic.Scene({triggerElement: "#trigger", duration: 1000, offset: 12500, triggerHook: 0})
  .on("update", function (e) {
    if (e.scrollPos >= 14000 + screenHeight) {
      $("#vid")[0].play();
    }

    if (e.scrollPos >= 13000 + screenHeight) {
      setInterval(function () {
        $("#g1").css('opacity', 1);

        if ($("#g1").css('display') == "block")
          $("#g1").css('display', 'none')
        else
          $("#g1").css('display', 'block')
      }, 500);

      setInterval(function () {
        $("#g2").css('opacity', 1);

        if ($("#g2").css('display') == "block")
          $("#g2").css('display', 'none')
        else
          $("#g2").css('display', 'block')
      }, 100);

      setInterval(function () {
        $("#g3").css('opacity', 1);

        if ($("#g3").css('display') == "block")
          $("#g3").css('display', 'none')
        else
          $("#g3").css('display', 'block')
      }, 1000);

      setInterval(function () {
        $("#g5").css('opacity', 1);

        if ($("#g5").css('display') == "block")
          $("#g5").css('display', 'none')
        else
          $("#g5").css('display', 'block')
      }, 1000);

      setInterval(function () {
        $("#g4").css('opacity', 1);

        if ($("#g4").css('display') == "block")
          $("#g4").css('display', 'none')
        else
          $("#g4").css('display', 'block')
      }, 1000);
    }
  })
  .setPin("#fake")
  .addIndicators({name: "splash"})
  .addTo(controller);
