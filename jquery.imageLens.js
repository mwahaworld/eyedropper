(function ($) {
    $.fn.imageLens = function (options) {

        var defaults = {
            lensSize: 100,
            borderSize: 4,
            borderColor: "#888"
        };

        var options = $.extend(defaults, options);

        var lensStyle = "background-position: 0px 0px;width: " + String(options.lensSize) + "px;height: " + String(options.lensSize)
            + "px;float: left;display: none;border-radius: " + String(options.lensSize / 2 + options.borderSize)
            + "px;border: " + String(options.borderSize) + "px solid " + options.borderColor
            + ";background-repeat: no-repeat;position: absolute; cursor: crosshair;";

        var getColor = function (x, y){
            var canvas = $('#myCanvas').get(0).getContext('2d');
            var p = canvas.getImageData(x, y, 1, 1).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            $('#colorOutput').text("HEX: " + hex);
            $('#color').css('background-color',hex);
        };

        var rgbToHex = function (r, g, b){
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        };

        return this.each(function () {
            var obj = $(this);

            var offset = $(this).offset();

            // Creating lens
            var target = $("<div style='" + lensStyle + "' class='" + options.lensCss + "'>&nbsp;</div>").appendTo($("body"));

            // Calculating actual size of image
            var imageSrc = options.imageSrc ? options.imageSrc : this.toDataURL(); //$(this).attr("src");
            var imageTag = "<img style='display:none;' src='" + imageSrc + "' />";

            var widthRatio = 0;
            var heightRatio = 0;

            $(imageTag).load(function () {
                widthRatio = $(this).width() / obj.width();
                heightRatio = $(this).height() / obj.height();
            }).appendTo($(this).parent());

            target.css({ backgroundImage: "url('" + imageSrc + "')" });

            target.mousemove(setPosition);
            $(this).mousemove(setPosition);

            function setPosition(e) {

                var leftPos = parseInt(e.pageX - offset.left);
                var topPos = parseInt(e.pageY - offset.top);

                getColor(leftPos-2, topPos-2, this);

                console.log('first(' + leftPos + ',' + topPos + ')');

                if (leftPos < 0 || topPos < 0 || leftPos > obj.width() || topPos > obj.height()) {
                    target.hide();
                }
                else {
                    target.show();

                    var targetLeftPos =((e.pageX - offset.left) * widthRatio - target.width() / 2) * (-1);
                    leftPos = String(targetLeftPos);
                    var targetTopPos = ((e.pageY - offset.top) * heightRatio - target.height() / 2) * (-1);
                    topPos = String(targetTopPos);
                    target.css({ backgroundPosition: leftPos + 'px ' + topPos + 'px' });

                    targetLeftPos = e.pageX - target.width() / 2;
                    leftPos = String(targetLeftPos);

                    targetTopPos = e.pageY - target.height() / 2;
                    topPos = String(targetTopPos);
                    target.css({ left: leftPos + 'px', top: topPos + 'px' });
                }
            }
        });
    };
})(jQuery);