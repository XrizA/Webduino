var name = "濕度";

var value = parseInt((Math.random() * 101));

var gaugeMaxValue = 100;

var percentValue = value / gaugeMaxValue;

var needleClient;

(function () {

    var barWidth, chart, chartInset, degToRad, repaintGauge,
        height, margin, numSections, padRad, percToDeg, percToRad,
        percent, radius, sectionIndx, svg, totalPercent, width;

    percent = percentValue;

    numSections = 1;
    sectionPerc = 1 / numSections / 2;
    padRad = 0.025;
    chartInset = 10;

    totalPercent = .75;

    el = d3.select("#humidity");

    margin = { top: 20, right: 40, bottom: 30, left: 40 };

    width = el.node().offsetWidth - margin.left - margin.right;
    height = width;
    radius = Math.min(width, height) / 2;
    barWidth = 40 * width / 300;

    percToDeg = perc => perc * 360;

    degToRad = deg => deg * Math.PI / 180;

    percToRad = perc => degToRad(percToDeg(perc));

    // Create SVG element
    svg = el.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    chart = svg.append("g")
        .attr("transform", "translate(" + ((width + margin.left) / 2) + ", " +
            ((height + margin.top) / 2) + ")");

    chart.append("path").attr("class", "arc chart-first");
    chart.append("path").attr("class", "arc chart-second");
    chart.append("path").attr("class", "arc chart-third");

    arc3 = d3.arc()
        .outerRadius(radius - chartInset)
        .innerRadius(radius - chartInset - barWidth)
    arc2 = d3.arc()
        .outerRadius(radius - chartInset)
        .innerRadius(radius - chartInset - barWidth)
    arc1 = d3.arc()
        .outerRadius(radius - chartInset)
        .innerRadius(radius - chartInset - barWidth)

    repaintGauge = function () {
        perc = 0.5;
        var next_start = totalPercent;
        arcStartRad = percToRad(next_start);
        arcEndRad = arcStartRad + percToRad(perc / 3);
        next_start += perc / 3;


        arc1.startAngle(arcStartRad).endAngle(arcEndRad);

        arcStartRad = percToRad(next_start);
        arcEndRad = arcStartRad + percToRad(perc / 3);
        next_start += perc / 3;

        arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

        arcStartRad = percToRad(next_start);
        arcEndRad = arcStartRad + percToRad(perc / 3);

        arc3.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

        chart.select(".chart-first").attr('d', arc1);
        chart.select(".chart-second").attr('d', arc2);
        chart.select(".chart-third").attr('d', arc3);
    }

    var dataset = [{ metric: name, value: value }]

    var texts = svg.selectAll("text")
        .data(dataset)
        .enter();

    texts.append("text")
        .text(() => dataset[0].metric)
        .attr("id", "Name")
        .attr("transform", "translate(" + ((width + margin.left) / 2.35) + ", " +
            ((height + margin.top) / 1.5) + ")")
        .attr("font-weight", "bold")
        .attr("font-size", 25);

    var trX = width / 2 + 5;
    if (value < 10) trX += 5;
    var trY = width / 2 + 45;

    displayValue = function () {
        texts.append("text")
            .text(() => dataset[0].value + "%")
            .attr("id", "Value")
            .attr("transform", "translate(" + trX + ", " + trY + ")")
            .attr("font-size", 18)
            .attr("font-weight", "bold")
        //value = parseInt((Math.random() * 101));
        //clearTimeout(displayValue)
    }

    texts.append("text")
        .text(() => 0 + "%")
        .attr("id", "")
        .attr("transform", "translate(" + ((width + margin.left) / 100) + ", " +
            ((height + margin.top) / 2) + ")")
        .attr("font-size", 15)
        .attr("font-weight", "bold")
        .style("fill", "#000000");

    texts.append("text")
        .text(() => gaugeMaxValue / 2 + "%")
        .attr("id", "scale10")
        .attr("transform", "translate(" + ((width + margin.left) / 2.15) + ", " +
            ((height + margin.top) / 30) + ")")
        .attr("font-size", 15)
        .attr("font-weight", "bold")
        .style("fill", "#000000");

    texts.append("text")
        .text(() => gaugeMaxValue + "%")
        .attr("id", "scale20")
        .attr("transform", "translate(" + ((width + margin.left) / 1.08) + ", " +
            ((height + margin.top) / 2) + ")")
        .attr("font-size", 15)
        .attr("font-weight", "bold")
        .style("fill", "#fffff");

    var Needle = (function () {
        var recalcPointerPos = function (perc) {
            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
            thetaRad = percToRad(perc / 2);
            centerX = centerY = 0;
            topX = centerX - this.len * Math.cos(thetaRad);
            topY = centerY - this.len * Math.sin(thetaRad);
            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

            return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
        };

        function Needle(el) {
            this.el = el;
            this.len = width / 2.5;
            this.radius = this.len / 8;
        }

        Needle.prototype.render = function () {
            this.el.append("circle")
                .attr("class", "needle-center")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this.radius);

            return this.el.append("path")
                .attr("class", "needle")
                .attr("id", "client-needle")
                .attr("d", recalcPointerPos.call(this, 0));
        };

        Needle.prototype.moveTo = function (perc) {
            var self,
                oldValue = this.perc || 0;

            this.perc = perc;
            self = this;

            this.el
                .transition()
                .delay(100)
                .ease(d3.easeQuad)
                .duration(200)
                .select(".needle")
                .tween("reset-progress", () =>
                    function (percentOfPercent) {

                        var progress = (1 - percentOfPercent) * oldValue;
                        repaintGauge(progress);

                        d3.select(this)
                            .attr("d", recalcPointerPos.call(self, progress));
                    });

            this.el
                .transition()
                .delay(300)
                .ease(d3.easeBounce)
                .duration(1500)
                .select(".needle")
                .tween("progress", () =>
                    function (percentOfPercent) {
                        var progress = percentOfPercent * perc;
                        repaintGauge(progress);
                        return d3.select(this)
                            .attr("d", recalcPointerPos.call(self, progress));
                    }
                );
        };

        return Needle;
    })();

    needle = new Needle(chart);
    needle.render();
    needle.moveTo(percent);

    //setInterval(displayValue, 1000);

})();