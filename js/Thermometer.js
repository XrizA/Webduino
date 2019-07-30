class Thermometer {
    svgRoot;
    maxTemp = 50;
    minTemp = 10;
    currentTemp = 0;
    prevTemp = 0;
    tubeFill_bottom = 0;
    tubeBorderColor = "#999";
    tubeBorderWidth = 2;
    mercuryColor = "rgb(0, 0, 0)";
    bulb_cy;
    bulbRadius = 30;
    top_cy;
    domain;
    scale;

    set width(w) {
        this.svgRoot.attr("width", this._width = (w != undefined) ? w : this._width);
    }

    set height(h) {
        this.svgRoot.attr("height", this._height = (h != undefined) ? h + 20 : this._height);
    }

    constructor(root, width, height) {
        this._width = width != undefined ? width : 300;
        this._height = height != undefined ? height : 330;

        var bottomY = this._height - 5,
            topY = 5,
            tubeWidth = 30;

        this.bulb_cy = bottomY - this.bulbRadius;

        var bulb_cx = this._width / 2;

        this.top_cy = topY + tubeWidth / 2

        this.svgRoot = d3.select(root)
            .append("svg")
            .attr("width", this._width)
            .attr("height", this._height + 20);

        var defs = this.svgRoot.append("defs");

        var bulbGradient = defs.append("radialGradient")
            .attr("id", "bulbGradient")
            .attr("cx", ".3")
            .attr("cy", ".3")
            .attr("r", ".7");

        bulbGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", "#fff");

        bulbGradient.append("stop")
            .attr("offset", "30%")
            .style("stop-color", "rgb(0, 0, 255)");

        bulbGradient.append("stop")
            .attr("offset", "70%")
            .style("stop-color", "rgb(0, 0, 255)");

        bulbGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", "rgb(0, 0, 255)");

        this.svgRoot.append("circle")
            .attr("r", tubeWidth / 2)
            .attr("cx", this._width / 2)
            .attr("cy", this.top_cy)
            .style("fill", "#FFFFFF")
            .style("stroke", this.tubeBorderColor)
            .style("stroke-width", this.tubeBorderWidth + "px");

        this.svgRoot.append("rect")
            .attr("x", this._width / 2 - tubeWidth / 2)
            .attr("y", this.top_cy)
            .attr("height", this.bulb_cy - this.top_cy)
            .attr("width", tubeWidth)
            .style("shape-rendering", "crispEdges")
            .style("fill", "#FFFFFF")
            .style("stroke", this.tubeBorderColor)
            .style("stroke-width", this.tubeBorderWidth + "px");

        this.svgRoot.append("circle")
            .attr("r", tubeWidth / 2 - this.tubeBorderWidth / 2)
            .attr("cx", this._width / 2)
            .attr("cy", this.top_cy)
            .style("fill", "#FFFFFF");

        this.svgRoot.append("circle")
            .attr("r", this.bulbRadius)
            .attr("cx", bulb_cx)
            .attr("cy", this.bulb_cy)
            .style("stroke", this.tubeBorderColor)
            .style("stroke-width", this.tubeBorderWidth + "px");

        this.svgRoot.append("rect")
            .attr("x", this._width / 2 - (tubeWidth - this.tubeBorderWidth) / 2)
            .attr("y", this.top_cy)
            .attr("width", tubeWidth - this.tubeBorderWidth)
            .attr("height", this.bulb_cy - this.top_cy)
            .style("shape-rendering", "crispEdges")
            .style("fill", "#FFFFFF");

        var step = 5;

        this.domain = [
            step * Math.floor(this.minTemp / step),
            step * Math.ceil(this.maxTemp / step)
        ];

        if (this.minTemp - this.domain[0] < 0.66 * step) this.domain[0] -= step;

        if (this.domain[1] - this.maxTemp < 0.66 * step) this.domain[1] += step;

        this.scale = d3.scaleLinear()
            .range([this.bulb_cy - this.bulbRadius / 2 - 15.5, this.top_cy])
            .domain(this.domain);

        [this.minTemp, this.maxTemp].forEach((t) => {
            var isMax = (t == this.maxTemp),
                label = (isMax ? "max" : "min"),
                textCol = (isMax ? "rgb(230, 0, 0)" : "rgb(0, 0, 230)"),
                textOffset = (isMax ? -4 : 4);

            this.svgRoot.append("line")
                .attr("id", label + "Line")
                .attr("x1", this._width / 2 - tubeWidth / 2)
                .attr("x2", this._width / 2 + tubeWidth / 2 + 45)
                .attr("y1", this.scale(t))
                .attr("y2", this.scale(t))
                .style("stroke", this.tubeBorderColor)
                .style("stroke-width", "1px")
                .style("shape-rendering", "crispEdges");

            this.svgRoot.append("text")
                .attr("x", this._width / 2 + tubeWidth / 2 + 2)
                .attr("y", this.scale(t) + textOffset)
                .attr("dy", isMax ? null : "0.75em")
                .text(label)
                .style("fill", textCol)
                .style("font-size", "25px")
        });

        this.tubeFill_bottom = this.bulb_cy;

        var tubeFill_top = this.scale(this.currentTemp);

        this.svgRoot.append("rect")
            .attr("id", "rectLine")
            .attr("x", this._width / 2 - (tubeWidth - 10) / 2)
            .attr("y", tubeFill_top)
            .attr("width", tubeWidth - 10)
            .attr("height", this.tubeFill_bottom - tubeFill_top)
            .style("shape-rendering", "crispEdges")
            .style("fill", "rgb(0, 0, 255)");

        this.svgRoot.append("circle")
            .attr("r", this.bulbRadius - 3)
            .attr("cx", bulb_cx)
            .attr("cy", this.bulb_cy)
            .style("fill", "url(#bulbGradient)")
            .style("stroke", this.mercuryColor)
            .style("stroke-width", "2px");

        var tickValues = d3.range((this.domain[1] - this.domain[0]) / step + 1)
            .map(v => this.domain[0] + v * step);

        var axis = d3.axisLeft()
            .scale(this.scale)
            .tickSizeInner(7)
            .tickSizeOuter(0)
            .tickValues(tickValues);

        var svgAxis = this.svgRoot.append("g")
            .attr("id", "tempScale")
            .attr("transform", "translate(" + (this._width / 2 - tubeWidth / 2) + ",0)")
            .call(axis);

        svgAxis.selectAll(".tick text")
            .style("fill", "#777777")
            .style("font-size", "20px");

        svgAxis.select("path")
            .style("stroke", "none")
            .style("fill", "none")

        svgAxis.selectAll(".tick line")
            .style("stroke", this.tubeBorderColor)
            .style("shape-rendering", "crispEdges")
            .style("stroke-width", "1px")

        this.svgRoot.append("text")
            .attr("id", "tempText")
            .attr("x", 137.5)
            .attr("y", 288.5)
            .attr("dy", "0.75em")
            .attr("font-weight", "bold")
            .text(this.currentTemp + "°C")
            .style("fill", "#FFFFFF")
            .style("font-size", "17px")

        this.svgRoot.append("text")
            .attr("x", 132.5)
            .attr("y", 330)
            .attr("dy", "0.75em")
            .attr("font-weight", "bold")
            .text("溫度")
            .style("font-size", "17px");
    }

    Update = (temperature) => {
        this.prevTemp = this.currentTemp;
        this.currentTemp = temperature;
        var tubeFill_top = this.scale(this.currentTemp);
        var rectLine = d3.select("#rectLine");
        var tempText = d3.select("#tempText");
        var bulbGradient = d3.select("#bulbGradient");
        var colorTemp = this.currentTemp <= this.minTemp ? "rgb(0, 0, 255)" : this.currentTemp >= this.maxTemp ? "rgb(255, 0, 0)" : "rgb(18, 85, 1)";
        // rectLine
        rectLine.transition()
            .duration(1000)
            .attr("y", tubeFill_top)
            .attr("height", this.tubeFill_bottom - tubeFill_top)
            .attr("style", "fill: " + colorTemp);
        // bulbGradient
        bulbGradient.selectAll("stop")
            .filter(":not(:first-child)")
            .transition()
            .style("stop-color", colorTemp);
        // tempText
        tempText.attr("x", this.currentTemp < 10 ? 137.5 : 132.5);
        tempText.transition()
            .duration(1000)
            .tween("number", () => {
                var i = d3.interpolateRound(this.prevTemp, this.currentTemp);
                return t => tempText.text(i(t) + "°C");
            });
    }
}