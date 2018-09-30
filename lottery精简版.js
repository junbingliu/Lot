
export default function($) {
    var supportedCSS, styles = document.getElementsByTagName("head")[0].style, toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
    for (var a = 0; a < toCheck.length; a++)
        if (styles[toCheck[a]] !== undefined)
            supportedCSS = toCheck[a];

    $.fn.extend({
        rotate: function(parameters) {
            if (this.length === 0 || typeof parameters == "undefined")
                return;
            if (typeof parameters == "number")
                parameters = {
                    angle: parameters
                };
            var returned = [];
            for (var i = 0, i0 = this.length; i < i0; i++) {
                var element = this.get(i);
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var paramClone = $.extend(true, {}, parameters);
                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                    returned.push($(newRotObject));
                } else {
                    element.Wilq32.PhotoEffect._handleRotation(parameters);
                }
            }
            return returned;
        },
        stopRotate: function() {
            for (var i = 0, i0 = this.length; i < i0; i++) {
                var element = this.get(i);
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
        }
    });

    window.Wilq32 = {};
    Wilq32.PhotoEffect = (function() {
            return function(img, parameters) {
                img.Wilq32 = {
                    PhotoEffect: this
                };

                this._img = this._rootObj = this._eventObj = img;
                this._handleRotation(parameters);
            }
        }
    )();

    Wilq32.PhotoEffect.prototype = {
        _setupParameters: function(parameters) {
            this._parameters = this._parameters || {};
            if (typeof this._angle !== "number")
                this._angle = 0;
            if (typeof parameters.angle === "number")
                this._angle = parameters.angle;
            this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle);

            this._parameters.step = parameters.step || this._parameters.step || null;
            this._parameters.easing = parameters.easing || this._parameters.easing || function(x, t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            }
            this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
            this._parameters.callback = parameters.callback || this._parameters.callback || function() {}
            ;
            if (parameters.bind && parameters.bind != this._parameters.bind)
                this._BindEvents(parameters.bind);
        },
        _handleRotation: function(parameters) {
            this._setupParameters(parameters);
            if (this._angle == this._parameters.animateTo) {
                this._rotate(this._angle);
            } else {
                this._animateStart();
            }
        },

        _BindEvents: function(events) {
            if (events && this._eventObj) {
                if (this._parameters.bind) {
                    var oldEvents = this._parameters.bind;
                    for (var a in oldEvents)
                        if (oldEvents.hasOwnProperty(a))
                            $(this._eventObj).unbind(a, oldEvents[a]);
                }

                this._parameters.bind = events;
                for (var a in events)
                    if (events.hasOwnProperty(a))
                        $(this._eventObj).bind(a, events[a]);
            }
        },

        _animateStart: function() {
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._animateStartTime = +new Date;
            this._animateStartAngle = this._angle;
            this._animate();
        },
        _animate: function() {
            var actualTime = +new Date;
            var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;
            if (checkEnd && !this._parameters.animatedGif) {
                clearTimeout(this._timer);
            } else {
                if (this._canvas || this._vimage || this._img) {
                    var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                    this._rotate((~~(angle * 10)) / 10);
                }
                if (this._parameters.step) {
                    this._parameters.step(this._angle);
                }
                var self = this;
                this._timer = setTimeout(function() {
                    self._animate.call(self);
                }, 10);
            }

            if (this._parameters.callback && checkEnd) {
                this._angle = this._parameters.animateTo;
                this._rotate(this._angle);
                this._parameters.callback.call(this._rootObj);
            }
        },

        _rotate: (function() {
                var rad = Math.PI / 180;

                return function(angle) {
                    this._angle = angle;
                    this._img.style[supportedCSS] = "rotate(" + (angle % 360) + "deg)";
                }

            }
        )()
    }
}
