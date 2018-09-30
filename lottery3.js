import $ from 'jquery';
(function($) {
    var supportedCSS, styles = document.getElementsByTagName("head")[0].style, toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
    for (var a = 0; a < toCheck.length; a++)if(styles[toCheck[a]] !== undefined)supportedCSS = toCheck[a];

    window.rotate=function(element,parameters) {
        if (typeof parameters == "undefined")return;
        if (!element.Lot ) {
            var paramClone = $.extend(true, {}, parameters);
            var newRotObject = new Lot(element,paramClone)._rootObj;
        } else {
            element.Lot._handleRotation(parameters);
        }
    }

    window.stopRotate=function(element) {
        if (element.Lot) {
            clearTimeout(element.Lot._timer);
        }
    }

    window.Lot = (function() {
        return function(img, parameters) {
            img.Lot = this;
            this._img = this._rootObj = this._eventObj = img;
            this._handleRotation(parameters);
        }
    })();

    Lot.prototype = {
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
                    for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) $(this._eventObj).unbind(a, oldEvents[a]);
                }
                this._parameters.bind = events;
                for (var a in events) if (events.hasOwnProperty(a)) $(this._eventObj).bind(a, events[a]);
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
})($)





