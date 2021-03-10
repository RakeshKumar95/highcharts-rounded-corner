(function (H) {
    var curPercentage=[];
    H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {

        var options = this.options,
            rTopLeft = options.borderRadiusTopLeft || 0,
            rTopRight = options.borderRadiusTopRight || 0,
            rBottomRight = options.borderRadiusBottomRight || 0,
            rBottomLeft = options.borderRadiusBottomLeft || 0,
            topMargin = options.topMargin || 0,
            bottomMargin = options.bottomMargin || 0;

        proceed.call(this);

        if (rTopLeft || rTopRight || rBottomRight || rBottomLeft) {

            H.each(this.points, function (point) {
                var iBottomRight = rBottomRight,
                    iBottomLeft = rBottomLeft,
                    iTopRight = rTopRight,
                    iTopLeft = rTopLeft;

                //console.log(point);
                if (typeof(curPercentage[point.index])=='undefined'){
                    curPercentage[point.index]=0;
                }
                var prevPercentage = curPercentage[point.index];
                curPercentage[point.index]+=1.0*parseFloat(point.percentage).toFixed(6);
                //console.log(prevPercentage);
                //console.log(curPercentage);

                if (prevPercentage==0 & curPercentage[point.index] == 100) {
                    // special case, only one value > 0, preserve all border radius
                    // reset for the next call
                    curPercentage[point.index]=0;

                } else if (prevPercentage==0) {
                    //right side
                    iBottomRight = 0;
                    iBottomLeft = 0;
                } else if (curPercentage[point.index] == 100) {
                    //left side
                    iTopRight = 0;
                    iTopLeft = 0;
                    // reset for the next call
                    curPercentage[point.index]=0;
                } else {
                    // no radius
                    iBottomRight = 0;
                    iBottomLeft = 0;
                    iTopRight = 0;
                    iTopLeft = 0;
                }

                var shapeArgs = point.shapeArgs,
                    w = shapeArgs.width,
                    h = shapeArgs.height,
                    x = shapeArgs.x,
                    y = shapeArgs.y;

                // Preserve the box for data labels
                point.dlBox = point.shapeArgs;

                point.shapeType = 'path';
                point.shapeArgs = {
                    d: [
                        'M', x + iTopLeft, y + topMargin,
                    // top side
                    'L', x + w - iTopRight, y + topMargin,
                    // top right corner
                    'C', x + w - iTopRight / 2, y, x + w, y + iTopRight / 2, x + w, y + iTopRight,
                    // right side
                    'L', x + w, y + h - iBottomRight,
                    // bottom right corner
                    'C', x + w, y + h - iBottomRight / 2, x + w - iBottomRight / 2, y + h, x + w - iBottomRight, y + h + bottomMargin,
                    // bottom side
                    'L', x + iBottomLeft, y + h + bottomMargin,
                    // bottom left corner
                    'C', x + iBottomLeft / 2, y + h, x, y + h - iBottomLeft / 2, x, y + h - iBottomLeft,
                    // left side
                    'L', x, y + iTopLeft,
                    // top left corner
                    'C', x, y + iTopLeft / 2, x + iTopLeft / 2, y, x + iTopLeft, y,
                        'Z']
                };

            });
        }

    });
}(Highcharts));