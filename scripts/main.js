/*!
 * ScrollMagic v2.0.5 (2015-04-29)
 * The javascript library for magical scroll interactions.
 * (c) 2015 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.5
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic GSAP Animation Plugin.
 *
 * requires: GSAP ~1.14
 * Powered by the Greensock Animation Platform (GSAP): http://www.greensock.com/js
 * Greensock License info at http://www.greensock.com/licensing/
 */
/**
 * This plugin is meant to be used in conjunction with the Greensock Animation Plattform.  
 * It offers an easy API to trigger Tweens or synchronize them to the scrollbar movement.
 *
 * Both the `lite` and the `max` versions of the GSAP library are supported.  
 * The most basic requirement is `TweenLite`.
 * 
 * To have access to this extension, please include `plugins/animation.gsap.js`.
 * @requires {@link http://greensock.com/gsap|GSAP ~1.14.x}
 * @mixin animation.GSAP
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['ScrollMagic', 'TweenMax', 'TimelineMax'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		// Loads whole gsap package onto global scope.
		require('gsap');
		factory(require('scrollmagic'), TweenMax, TimelineMax);
	} else {
		// Browser globals
		factory(root.ScrollMagic || (root.jQuery && root.jQuery.ScrollMagic), root.TweenMax || root.TweenLite, root.TimelineMax || root.TimelineLite);
	}
}(this, function (ScrollMagic, Tween, Timeline) {
	"use strict";
	var NAMESPACE = "animation.gsap";

	var
	console = window.console || {},
		err = Function.prototype.bind.call(console.error || console.log ||
		function () {}, console);
	if (!ScrollMagic) {
		err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
	}
	if (!Tween) {
		err("(" + NAMESPACE + ") -> ERROR: TweenLite or TweenMax could not be found. Please make sure GSAP is loaded before ScrollMagic or use an asynchronous loader like requirejs.");
	}

/*
	 * ----------------------------------------------------------------
	 * Extensions for Scene
	 * ----------------------------------------------------------------
	 */
	/**
	 * Every instance of ScrollMagic.Scene now accepts an additional option.  
	 * See {@link ScrollMagic.Scene} for a complete list of the standard options.
	 * @memberof! animation.GSAP#
	 * @method new ScrollMagic.Scene(options)
	 * @example
	 * var scene = new ScrollMagic.Scene({tweenChanges: true});
	 *
	 * @param {object} [options] - Options for the Scene. The options can be updated at any time.
	 * @param {boolean} [options.tweenChanges=false] - Tweens Animation to the progress target instead of setting it.  
	 Does not affect animations where duration is `0`.
	 */
	/**
	 * **Get** or **Set** the tweenChanges option value.  
	 * This only affects scenes with a duration. If `tweenChanges` is `true`, the progress update when scrolling will not be immediate, but instead the animation will smoothly animate to the target state.  
	 * For a better understanding, try enabling and disabling this option in the [Scene Manipulation Example](../examples/basic/scene_manipulation.html).
	 * @memberof! animation.GSAP#
	 * @method Scene.tweenChanges
	 * 
	 * @example
	 * // get the current tweenChanges option
	 * var tweenChanges = scene.tweenChanges();
	 *
	 * // set new tweenChanges option
	 * scene.tweenChanges(true);
	 *
	 * @fires {@link Scene.change}, when used as setter
	 * @param {boolean} [newTweenChanges] - The new tweenChanges setting of the scene.
	 * @returns {boolean} `get` -  Current tweenChanges option value.
	 * @returns {Scene} `set` -  Parent object for chaining.
	 */
	// add option (TODO: DOC (private for dev))
	ScrollMagic.Scene.addOption("tweenChanges", // name
	false, // default


	function (val) { // validation callback
		return !!val;
	});
	// extend scene
	ScrollMagic.Scene.extend(function () {
		var Scene = this,
			_tween;

		var log = function () {
			if (Scene._log) { // not available, when main source minified
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
				Scene._log.apply(this, arguments);
			}
		};

		// set listeners
		Scene.on("progress.plugin_gsap", function () {
			updateTweenProgress();
		});
		Scene.on("destroy.plugin_gsap", function (e) {
			Scene.removeTween(e.reset);
		});

		/**
		 * Update the tween progress to current position.
		 * @private
		 */
		var updateTweenProgress = function () {
			if (_tween) {
				var
				progress = Scene.progress(),
					state = Scene.state();
				if (_tween.repeat && _tween.repeat() === -1) {
					// infinite loop, so not in relation to progress
					if (state === 'DURING' && _tween.paused()) {
						_tween.play();
					} else if (state !== 'DURING' && !_tween.paused()) {
						_tween.pause();
					}
				} else if (progress != _tween.progress()) { // do we even need to update the progress?
					// no infinite loop - so should we just play or go to a specific point in time?
					if (Scene.duration() === 0) {
						// play the animation
						if (progress > 0) { // play from 0 to 1
							_tween.play();
						} else { // play from 1 to 0
							_tween.reverse();
						}
					} else {
						// go to a specific point in time
						if (Scene.tweenChanges() && _tween.tweenTo) {
							// go smooth
							_tween.tweenTo(progress * _tween.duration());
						} else {
							// just hard set it
							_tween.progress(progress).pause();
						}
					}
				}
			}
		};

		/**
		 * Add a tween to the scene.  
		 * If you want to add multiple tweens, add them into a GSAP Timeline object and supply it instead (see example below).  
		 * 
		 * If the scene has a duration, the tween's duration will be projected to the scroll distance of the scene, meaning its progress will be synced to scrollbar movement.  
		 * For a scene with a duration of `0`, the tween will be triggered when scrolling forward past the scene's trigger position and reversed, when scrolling back.  
		 * To gain better understanding, check out the [Simple Tweening example](../examples/basic/simple_tweening.html).
		 *
		 * Instead of supplying a tween this method can also be used as a shorthand for `TweenMax.to()` (see example below).
		 * @memberof! animation.GSAP#
		 *
		 * @example
		 * // add a single tween directly
		 * scene.setTween(TweenMax.to("obj"), 1, {x: 100});
		 *
		 * // add a single tween via variable
		 * var tween = TweenMax.to("obj"), 1, {x: 100};
		 * scene.setTween(tween);
		 *
		 * // add multiple tweens, wrapped in a timeline.
		 * var timeline = new TimelineMax();
		 * var tween1 = TweenMax.from("obj1", 1, {x: 100});
		 * var tween2 = TweenMax.to("obj2", 1, {y: 100});
		 * timeline
		 *		.add(tween1)
		 *		.add(tween2);
		 * scene.addTween(timeline);
		 *
		 * // short hand to add a TweenMax.to() tween
		 * scene.setTween("obj3", 0.5, {y: 100});
		 *
		 * // short hand to add a TweenMax.to() tween for 1 second
		 * // this is useful, when the scene has a duration and the tween duration isn't important anyway
		 * scene.setTween("obj3", {y: 100});
		 *
		 * @param {(object|string)} TweenObject - A TweenMax, TweenLite, TimelineMax or TimelineLite object that should be animated in the scene. Can also be a Dom Element or Selector, when using direct tween definition (see examples).
		 * @param {(number|object)} duration - A duration for the tween, or tween parameters. If an object containing parameters are supplied, a default duration of 1 will be used.
		 * @param {object} params - The parameters for the tween
		 * @returns {Scene} Parent object for chaining.
		 */
		Scene.setTween = function (TweenObject, duration, params) {
			var newTween;
			if (arguments.length > 1) {
				if (arguments.length < 3) {
					params = duration;
					duration = 1;
				}
				TweenObject = Tween.to(TweenObject, duration, params);
			}
			try {
				// wrap Tween into a Timeline Object if available to include delay and repeats in the duration and standardize methods.
				if (Timeline) {
					newTween = new Timeline({
						smoothChildTiming: true
					}).add(TweenObject);
				} else {
					newTween = TweenObject;
				}
				newTween.pause();
			} catch (e) {
				log(1, "ERROR calling method 'setTween()': Supplied argument is not a valid TweenObject");
				return Scene;
			}
			if (_tween) { // kill old tween?
				Scene.removeTween();
			}
			_tween = newTween;

			// some properties need to be transferred it to the wrapper, otherwise they would get lost.
			if (TweenObject.repeat && TweenObject.repeat() === -1) { // TweenMax or TimelineMax Object?
				_tween.repeat(-1);
				_tween.yoyo(TweenObject.yoyo());
			}
			// Some tween validations and debugging helpers
			if (Scene.tweenChanges() && !_tween.tweenTo) {
				log(2, "WARNING: tweenChanges will only work if the TimelineMax object is available for ScrollMagic.");
			}

			// check if there are position tweens defined for the trigger and warn about it :)
			if (_tween && Scene.controller() && Scene.triggerElement() && Scene.loglevel() >= 2) { // controller is needed to know scroll direction.
				var
				triggerTweens = Tween.getTweensOf(Scene.triggerElement()),
					vertical = Scene.controller().info("vertical");
				triggerTweens.forEach(function (value, index) {
					var
					tweenvars = value.vars.css || value.vars,
						condition = vertical ? (tweenvars.top !== undefined || tweenvars.bottom !== undefined) : (tweenvars.left !== undefined || tweenvars.right !== undefined);
					if (condition) {
						log(2, "WARNING: Tweening the position of the trigger element affects the scene timing and should be avoided!");
						return false;
					}
				});
			}

			// warn about tween overwrites, when an element is tweened multiple times
			if (parseFloat(TweenLite.version) >= 1.14) { // onOverwrite only present since GSAP v1.14.0
				var
				list = _tween.getChildren ? _tween.getChildren(true, true, false) : [_tween],
					// get all nested tween objects
					newCallback = function () {
						log(2, "WARNING: tween was overwritten by another. To learn how to avoid this issue see here: https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another");
					};
				for (var i = 0, thisTween, oldCallback; i < list.length; i++) { /*jshint loopfunc: true */
					thisTween = list[i];
					if (oldCallback !== newCallback) { // if tweens is added more than once
						oldCallback = thisTween.vars.onOverwrite;
						thisTween.vars.onOverwrite = function () {
							if (oldCallback) {
								oldCallback.apply(this, arguments);
							}
							newCallback.apply(this, arguments);
						};
					}
				}
			}
			log(3, "added tween");

			updateTweenProgress();
			return Scene;
		};

		/**
		 * Remove the tween from the scene.  
		 * This will terminate the control of the Scene over the tween.
		 *
		 * Using the reset option you can decide if the tween should remain in the current state or be rewound to set the target elements back to the state they were in before the tween was added to the scene.
		 * @memberof! animation.GSAP#
		 *
		 * @example
		 * // remove the tween from the scene without resetting it
		 * scene.removeTween();
		 *
		 * // remove the tween from the scene and reset it to initial position
		 * scene.removeTween(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the tween will be reset to its initial values.
		 * @returns {Scene} Parent object for chaining.
		 */
		Scene.removeTween = function (reset) {
			if (_tween) {
				if (reset) {
					_tween.progress(0).pause();
				}
				_tween.kill();
				_tween = undefined;
				log(3, "removed tween (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};

	});
}));
"use strict";

var controller = new ScrollMagic.Controller();
var screenHeight = document.documentElement.clientHeight;
var screenWidth = document.documentElement.clientWidth;
var bgMusic = $("#bg_audio")[0];

function startMusic() {
  bgMusic.play();
}

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 4000, triggerHook: 0 }).setTween(new TimelineMax().insert(new TimelineMax().insert(TweenMax.to("#girlOnly", 1, {
  rotation: 50,
  transformOrigin: "left top",
  repeat: 7,
  yoyo: true,
  ease: Linear.easeNone
})).insert(TweenMax.to("#swingOnly", 1, {
  rotation: 50,
  transformOrigin: "left top",
  repeat: 7,
  yoyo: true,
  ease: Linear.easeNone
}))).insert(new TimelineMax().add(TweenMax.to("#line1", 1, {
  opacity: 1
})).add(TweenMax.to("#line1", 0.5, {
  opacity: 0
})).add(TweenMax.to("#line2", 0.5, {
  opacity: 1
})).add(TweenMax.to("#line2", 0.75, {
  opacity: 0
})).add(TweenMax.to("#line3", 0.75, {
  opacity: 1
})).add(TweenMax.to("#line3", 0.75, {
  opacity: 0
})).add(TweenMax.to("#line4", 0.75, {
  opacity: 1
})).add(TweenMax.to("#line4", 0.75, {
  opacity: 0
})).add(TweenMax.to("#line5", 0.75, {
  opacity: 1
})).add(TweenMax.to("#line5", 0.75, {
  opacity: 0
})).add(TweenMax.to("#line6", 0.75, {
  opacity: 1
})))).setPin("#scene_1").addIndicators({ name: "swing" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 1000, offset: 4000, triggerHook: 0 }).setTween(new TimelineMax().insert(TweenMax.to("#girlOnly", 1, { rotation: 390, transformOrigin: "left top" })).insert(TweenMax.to("#swingOnly", 1, { rotation: 390, transformOrigin: "left top" }))).setPin("#scene_1").addIndicators({ name: "roll" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 2000, offset: 5000, triggerHook: 0 }).setTween(new TimelineMax().insert(TweenMax.to("#girl_on_swing", 1, { rotation: -150, transformOrigin: "center center" })).insert(TweenMax.to("#girlOnly", 1, { x: -600, y: 200 }))).setPin("#scene_1").addIndicators({ name: "fly" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 400, offset: 7000, triggerHook: 0 }).setTween(new TimelineMax().insert(TweenMax.to("#girlOnly", 1, { marginLeft: -50, marginTop: 80 }))).on("update", function (e) {
  if (e.scrollPos < 5000 + screenHeight) {
    $("#girl_on_swing").attr('src', 'images/girl_on_swing.png');
  } else if (e.scrollPos > 5000 + screenHeight && e.scrollPos <= 6000 + screenHeight) {
    $("#girl_on_swing").attr('src', 'images/girl_on_swing2.png');
  } else if (e.scrollPos > 6000 + screenHeight && e.scrollPos <= 7400 + screenHeight) {
    $("#girl_on_swing").attr('src', 'images/girl_on_swing3.png');
  } else if (e.scrollPos > 7400 + screenHeight) {
    $("#girl_on_swing").attr('src', 'images/girl_on_ground.png');
  } else {
    $("#girl_on_swing").attr('src', 'images/girl_on_swing.png');
  }
}).setPin("#scene_1").addIndicators({ name: "fall" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 500, offset: 7400, triggerHook: 0 }).setPin("#scene_1").addIndicators({ name: "fly" }).addTo(controller);
//# sourceMappingURL=scene1.js.map

'use strict';

function hover(e) {
  $(e).attr('src', 'images/doll_hover.png');
}

function unhover(e) {
  $(e).attr('src', 'images/doll2.png');
}

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 300, offset: 7900, triggerHook: 0 }).setTween(new TimelineMax().insert(new TimelineMax().insert(TweenMax.to("#ghost", 1, {
  opacity: 1,
  x: '+=700',
  rotation: 10
}))).insert(new TimelineMax().add(TweenMax.to("#line7", 1, {
  opacity: 1
})))).setPin("#scene_2").addIndicators({ name: "ghost1" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 400, offset: 8200, triggerHook: 0 }).setTween(new TimelineMax().add(TweenMax.to("#line7", 1, {
  opacity: 0
})).add(TweenMax.to("#line8", 1, {
  opacity: 1
})).add(TweenMax.to("#ghost_image", 1, {
  rotation: -20,
  zoom: 1.1
})).add(TweenMax.to("#ghost_image", 1, {
  rotation: 30,
  zoom: 1.2
})).add(TweenMax.to("#ghost_image", 1, {
  rotation: 0,
  zoom: 1.3
})).add(TweenMax.to("#line8", 1, {
  opacity: 0
}))).setPin("#scene_2").addIndicators({ name: "ghost2" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 300, offset: 8600, triggerHook: 0 }).setTween(new TimelineMax().insert(TweenMax.to("#ghost", 1, {
  opacity: 0
})).insert(TweenMax.to("#doll", 1, {
  css: { className: '+=glow' },
  immediateRender: false
}))).addIndicators({ name: "ghost3" }).addTo(controller);

var dollDragged = false;

var lockOn;

$(window).scroll(function () {
  if (lockOn) {
    $(window).scrollTop(lockOn);
  }

  if (!dollDragged) {
    if ($(window).scrollTop() >= 8940 + screenHeight) {
      $(window).scrollTop(8940 + screenHeight);
    }
  } else {
    $("#doll").removeClass("glow");
  }
});

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 500, offset: 8900, triggerHook: 0 }).setPin("#scene_3").on("update", function (e) {
  $("#doll").draggable({
    start: function start() {
      if (!dollDragged) {
        $("#doll").css({
          width: '230px',
          height: '298px',
          transform: 'rotate(-10deg)'
        });
        $("#doll").removeClass("glow");
      }
    },
    cursorAt: { top: 150, left: 150 }
  });

  $("#bag_bg").droppable({
    accept: "#doll",
    activeClass: "on-drag",
    drop: function drop() {
      dollDragged = true;
      $("#doll").attr("src", "images/doll2.png").hide();
      $("#bag_bg").attr("src", "images/doll_in_bag.png");
      $("#bag_fe").hide();
      $("#keepScroll").show();
      $(window).scrollTop($(window).scrollTop() + 450);
    }
  });
}).addIndicators({ name: "stand" }).addTo(controller);
//# sourceMappingURL=scene2.js.map

"use strict";

function videoDone() {
  lockOn = $(window).scrollTop();

  $("#replay").css({ top: $(window).scrollTop() + "px" });
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

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 500, offset: 9400, triggerHook: 0 }).setTween(new TimelineMax().insert(TweenMax.to("#keepScroll", 0.01, {
  opacity: 0
})).insert(TweenMax.to("#bag_container", 1, {
  x: screenWidth - 450,
  y: 600,
  scale: 0.6
})).insert(TweenMax.to("#doll", 1, {
  y: 350,
  x: -250
}))).setPin("#fake").addIndicators({ name: "room1" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 400, offset: 9400, triggerHook: 0 }).on("update", function (e) {
  if (e.scrollPos > 9400 + screenHeight) {
    if ($("#bag_bg").attr("src") != "images/empty_bag.png") {
      $("#bag_bg").attr("src", "images/empty_bag.png");
    }

    $("#doll").show();
  }
}).setPin("#fake").addIndicators({ name: "room2" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 3000, offset: 9800, triggerHook: 0 }).setTween(new TimelineMax().insert(TweenMax.to("#lamp", 1, {
  opacity: 0
})).insert(TweenMax.to("#phone", 1, {
  opacity: 0
})).insert(TweenMax.to("#room", 1, {
  top: 0
})).insert(TweenMax.to("#overlay", 1, {
  top: 0
})).insert(TweenMax.to("#doll", 1, {
  top: -300
})).insert(TweenMax.to("#bag_container", 1, {
  top: -300
})).add(new TimelineMax().insert(new TimelineMax().insert(TweenMax.to("#overlay", 1, {
  opacity: 1
})).insert(new TimelineMax().insert(TweenMax.to("#sun", 1, {
  x: -300,
  y: 200
})).insert(new TimelineMax().add(TweenMax.to("#line9", 0.5, {
  opacity: 1
})).add(TweenMax.to("#line9", 0.1, {
  opacity: 0
})).add(TweenMax.to("#line10", 0.1, {
  opacity: 1
})).add(TweenMax.to("#line10", 0.1, {
  opacity: 0
})).add(TweenMax.to("#line11", 0.1, {
  opacity: 1
}))))))).setPin("#scene_3").addIndicators({ name: "moves" }).addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#trigger", duration: 1000, offset: 12500, triggerHook: 0 }).on("update", function (e) {
  if (e.scrollPos >= 14000 + screenHeight) {
    $("#vid")[0].play();
  }

  if (e.scrollPos >= 13000 + screenHeight) {
    setInterval(function () {
      $("#g1").css('opacity', 1);

      if ($("#g1").css('display') == "block") $("#g1").css('display', 'none');else $("#g1").css('display', 'block');
    }, 500);

    setInterval(function () {
      $("#g2").css('opacity', 1);

      if ($("#g2").css('display') == "block") $("#g2").css('display', 'none');else $("#g2").css('display', 'block');
    }, 100);

    setInterval(function () {
      $("#g3").css('opacity', 1);

      if ($("#g3").css('display') == "block") $("#g3").css('display', 'none');else $("#g3").css('display', 'block');
    }, 1000);

    setInterval(function () {
      $("#g5").css('opacity', 1);

      if ($("#g5").css('display') == "block") $("#g5").css('display', 'none');else $("#g5").css('display', 'block');
    }, 1000);

    setInterval(function () {
      $("#g4").css('opacity', 1);

      if ($("#g4").css('display') == "block") $("#g4").css('display', 'none');else $("#g4").css('display', 'block');
    }, 1000);
  }
}).setPin("#fake").addIndicators({ name: "splash" }).addTo(controller);
//# sourceMappingURL=scene4.js.map
