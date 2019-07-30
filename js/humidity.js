class humidity {
    svgRoot;
    name = "濕度";
    value = 50;
    gaugeMaxValue = 100;
    chart;
    width;
    percentValue;
    percent;
    static repaintGauge;
    static percToRad;
    constructor(root) {
        var margin, height, radius, barWidth, chartInset,
            arc3, arc2, arc1, totalPercent, padRad, percent;
        var degToRad, percToDeg;

        this.percentValue = this.value / this.gaugeMaxValue;

        this.percent = this.percentValue;

        this.svgRoot = d3.select(root);

        margin = { top: 20, right: 40, bottom: 30, left: 40 };

        this.width = this.svgRoot.node().offsetWidth - margin.left - margin.right;
        height = this.width;
        radius = Math.min(this.width, height) / 2;
        barWidth = 40 * this.width / 300;
        padRad = 0.025;
        chartInset = 10;

        totalPercent = .75;

        percToDeg = perc => perc * 360;

        degToRad = deg => deg * Math.PI / 180;

        humidity.percToRad = perc => degToRad(percToDeg(perc));

        this.svgRoot = this.svgRoot.append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        this.chart = this.svgRoot.append("g")
            .attr("transform", "translate(" + ((this.width + margin.left) / 2) + ", " +
                ((height + margin.top) / 2) + ")");

        this.chart.append("path").attr("class", "arc chart-first");
        this.chart.append("path").attr("class", "arc chart-second");
        this.chart.append("path").attr("class", "arc chart-third");

        arc3 = d3.arc()
            .outerRadius(radius - chartInset)
            .innerRadius(radius - chartInset - barWidth);
        arc2 = d3.arc()
            .outerRadius(radius - chartInset)
            .innerRadius(radius - chartInset - barWidth);
        arc1 = d3.arc()
            .outerRadius(radius - chartInset)
            .innerRadius(radius - chartInset - barWidth);

        humidity.repaintGauge = () => {
            var perc = 0.5;
            var next_start = totalPercent;
            var arcStartRad = humidity.percToRad(next_start);
            var arcEndRad = arcStartRad + humidity.percToRad(perc / 3);
            next_start += perc / 3;


            arc1.startAngle(arcStartRad).endAngle(arcEndRad);

            arcStartRad = humidity.percToRad(next_start);
            arcEndRad = arcStartRad + humidity.percToRad(perc / 3);
            next_start += perc / 3;

            arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

            arcStartRad = humidity.percToRad(next_start);
            arcEndRad = arcStartRad + humidity.percToRad(perc / 3);

            arc3.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

            this.chart.select(".chart-first").attr('d', arc1);
            this.chart.select(".chart-second").attr('d', arc2);
            this.chart.select(".chart-third").attr('d', arc3);
        };

        var dataset = [{ metric: this.name, value: this.value }];

        var texts = this.svgRoot.selectAll("text")
            .data(dataset)
            .enter();

        texts.append("text")
            .text(() => dataset[0].metric)
            .attr("id", "Name")
            .attr("transform", "translate(" + ((this.width + margin.left) / 2.35) + ", " +
                ((height + margin.top) / 1.5) + ")")
            .attr("font-weight", "bold")
            .attr("font-size", 25);

        var trX = this.width / 2 + 5;
        if (this.value < 10) trX += 5;
        var trY = this.width / 2 + 45;

        texts.append("text")
            .text(() => dataset[0].value + "%")
            .attr("id", "Value")
            .attr("transform", "translate(" + trX + ", " + trY + ")")
            .attr("font-size", 18)
            .attr("font-weight", "bold")

        texts.append("text")
            .text(() => 0 + "%")
            .attr("id", "")
            .attr("transform", "translate(" + ((this.width + margin.left) / 100) + ", " +
                ((height + margin.top) / 2) + ")")
            .attr("font-size", 15)
            .attr("font-weight", "bold")
            .style("fill", "#000000");

        texts.append("text")
            .text(() => this.gaugeMaxValue / 2 + "%")
            .attr("id", "scale10")
            .attr("transform", "translate(" + ((this.width + margin.left) / 2.15) + ", " +
                ((height + margin.top) / 30) + ")")
            .attr("font-size", 15)
            .attr("font-weight", "bold")
            .style("fill", "#000000");

        texts.append("text")
            .text(() => this.gaugeMaxValue + "%")
            .attr("id", "scale20")
            .attr("transform", "translate(" + ((this.width + margin.left) / 1.08) + ", " +
                ((height + margin.top) / 2) + ")")
            .attr("font-size", 15)
            .attr("font-weight", "bold")
            .style("fill", "#fffff");
    }
};

class Needle {

    constructor(el, width) {
        this.el = el;
        this.len = width / 2.5;
        this.radius = this.len / 8;
    }

    recalcPointerPos = (perc) => {
        var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
        thetaRad = humidity.percToRad(perc / 2);
        centerX = centerY = 0;
        topX = centerX - this.len * Math.cos(thetaRad);
        topY = centerY - this.len * Math.sin(thetaRad);
        leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
        leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
        rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
        rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

        return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
    };

    render() {
        this.el.append("circle")
            .attr("class", "needle-center")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", this.radius);

        return this.el.append("path")
            .attr("class", "needle")
            .attr("id", "client-needle")
            .attr("d", this.recalcPointerPos.call(this, 0));
    };

    moveTo(perc) {
        var self,
            oldValue = this.perc || 0;

        this.perc = perc;
        self = this;

        this.el
            .transition()
            .delay(1000)
            .ease(d3.easeQuad)
            .duration(200)
            .select(".needle")
            .tween("reset-progress", () =>
                (percentOfPercent) => {
                    var progress = (1 - percentOfPercent) * oldValue;
                    humidity.repaintGauge(progress);

                    return d3.select(this)
                        .attr("d", this.recalcPointerPos.call(self, progress));
                });

        this.el
            .transition()
            .delay(300)
            .ease(d3.easeBounce)
            .duration(1500)
            .select(".needle")
            .tween("progress", () =>
                (percentOfPercent) => {
                    var progress = percentOfPercent * perc;
                    humidity.repaintGauge(progress);
                    return d3.select(this)
                        .attr("d", this.recalcPointerPos.call(self, progress));
                }
            );
    };

}

var h = new humidity("#humidity");
var n = new Needle(h.chart, h.width);
n.render();
n.moveTo(h.percent);