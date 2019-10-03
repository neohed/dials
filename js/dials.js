'use strict';

(function ($) {
    $.fn.dial = function (options) {

        var index = 0,
            data = [],
            percentageDegrees,
            dialLabel,
            oldPercentAt = -1;

        function injectDial(dial, txt) {
            var li = "<li class='q{0} slice'><div class='circle' /></li>",
                html = "<ul class='circle'>" +
                    li.replace('{0}', '1') +
                    li.replace('{0}', '2') +
                    li.replace('{0}', '3') +
                    li.replace('{0}', '4') +
                    "</ul><div class=\"dialText\"><p class=\"dialTitle\" /><p class=\"dialDesc\">" +
                    txt +
                    "</p></div>",
                _floor = Math.floor,
            // formula to find largest square that fits inside a circle: sqrt((r * 2)^2 / 2)
                boxWidth = _floor(Math.sqrt(Math.pow(settings.width, 2) / 2) * .85);

            dial.html(html).addClass('dial')
                .css('width', settings.width + 'px')
                .children('ul')
                .css('background-image', 'url(\'' + settings.img_0 + '\')');

            dial.find('.q1 div, .q2 div, .q3 div, .q4 div')
                .css('background-image', 'url(\'' + settings.img_100 + '\')');

            dial.find('.dialText')
                .css({
                    'width': boxWidth + 'px',
                    'height': boxWidth + 'px',
                    'margin-left': _floor((settings.width - boxWidth) / 2) + 'px',
                    'margin-top': _floor(-settings.width * .92) + 'px'
                });
        }

        function segment(quadrant, inner) {
            this.quadrant = quadrant;
            this.inner = inner;
            this.hidden = true;
            this.rot = '';
        }

        function setup(dialId) {
            for (var i = 0; i < 4; i++) {
                var cssSelector = dialId + ' .q' + (i + 1);

                data.push(new segment(
                    $(cssSelector),
                    $(cssSelector + ' div')
                ));
            }

            data[0].rot = 'rotate(90deg)';
            data[1].rot = 'rotate(180deg)';
            data[2].rot = 'rotate(270deg)';

            dialLabel = $(dialId + ' .dialText p:first');
        }

        function animate(angle) {
            var n = 90 - angle;

            if (data[index].hidden) {
                data[index].quadrant.css('visibility', 'visible');
                data[index].hidden = false;
            }

            data[index].quadrant.css('transform', data[index].rot + ' skew(' + n + 'deg)');
            data[index].inner.css('transform', 'skew(-' + n + 'deg)');

            angle += settings.step;
            if (angle > 90) {
                ++index;
                angle -= 90;
            }

            var degreesAt = index * 90 + angle,
                percentAt = Math.floor(degreesAt / 360 * 100);

            if (percentAt != oldPercentAt) {
                oldPercentAt = percentAt;
                dialLabel.text(percentAt + '%');
            }

            if (degreesAt <= percentageDegrees)
                setTimeout(animate, 20, angle);
        }

        var settings = $.extend({
            step: 3,
            percentage: 85,
            text: '',
            img_0: 'img/circle_0.svg',
            img_100: 'img/circle_100.svg',
            width: 120
        }, options);

        percentageDegrees = Math.floor(360 * settings.percentage / 100);

        injectDial(this, settings.text);
        setup('#' + this.attr('id'));
        animate(0);

        return this;
    };

} (jQuery));
