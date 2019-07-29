var dht; // 溫度&濕度
var fan;

var width = 300,
    height = 330,
    maxTemp = 50,
    minTemp = 10,
    currentTemp = 0,
    prevTemp = currentTemp,
    currentHum = 0;

var bottomY = height - 5,
    topY = 5,
    bulbRadius = 30,
    tubeWidth = 30,
    tubeBorderWidth = 2,
    mercuryColor = "rgb(0, 0, 0)",
    innerBulbColor = "rgb(230, 200, 200)";
tubeBorderColor = "#999999";

var bulb_cy = bottomY - bulbRadius,
    bulb_cx = width / 2,
    top_cy = topY + tubeWidth / 2;

var svg = d3.select("#thermo")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 20)

var defs = svg.append("defs");

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

svg.append("circle")
    .attr("r", tubeWidth / 2)
    .attr("cx", width / 2)
    .attr("cy", top_cy)
    .style("fill", "#FFFFFF")
    .style("stroke", tubeBorderColor)
    .style("stroke-width", tubeBorderWidth + "px");

svg.append("rect")
    .attr("x", width / 2 - tubeWidth / 2)
    .attr("y", top_cy)
    .attr("height", bulb_cy - top_cy)
    .attr("width", tubeWidth)
    .style("shape-rendering", "crispEdges")
    .style("fill", "#FFFFFF")
    .style("stroke", tubeBorderColor)
    .style("stroke-width", tubeBorderWidth + "px");

svg.append("circle")
    .attr("r", tubeWidth / 2 - tubeBorderWidth / 2)
    .attr("cx", width / 2)
    .attr("cy", top_cy)
    .style("fill", "#FFFFFF")
    .style("stroke", "none")

svg.append("circle")
    .attr("r", bulbRadius)
    .attr("cx", bulb_cx)
    .attr("cy", bulb_cy)
    .style("fill", "#FFFFFF")
    .style("stroke", tubeBorderColor)
    .style("stroke-width", tubeBorderWidth + "px");

svg.append("rect")
    .attr("x", width / 2 - (tubeWidth - tubeBorderWidth) / 2)
    .attr("y", top_cy)
    .attr("height", bulb_cy - top_cy)
    .attr("width", tubeWidth - tubeBorderWidth)
    .style("shape-rendering", "crispEdges")
    .style("fill", "#FFFFFF")
    .style("stroke", "none");

var step = 5;

var domain = [
    step * Math.floor(minTemp / step),
    step * Math.ceil(maxTemp / step)
];

if (minTemp - domain[0] < 0.66 * step)
    domain[0] -= step;

if (domain[1] - maxTemp < 0.66 * step)
    domain[1] += step;

var scale = d3.scaleLinear()
    .range([bulb_cy - bulbRadius / 2 - 15.5, top_cy])
    .domain(domain);

[minTemp, maxTemp].forEach(function (t) {

    var isMax = (t == maxTemp),
        label = (isMax ? "max" : "min"),
        textCol = (isMax ? "rgb(230, 0, 0)" : "rgb(0, 0, 230)"),
        textOffset = (isMax ? -4 : 4);

    svg.append("line")
        .attr("id", label + "Line")
        .attr("x1", width / 2 - tubeWidth / 2)
        .attr("x2", width / 2 + tubeWidth / 2 + 45)
        .attr("y1", scale(t))
        .attr("y2", scale(t))
        .style("stroke", tubeBorderColor)
        .style("stroke-width", "1px")
        .style("shape-rendering", "crispEdges");

    svg.append("text")
        .attr("x", width / 2 + tubeWidth / 2 + 2)
        .attr("y", scale(t) + textOffset)
        .attr("dy", isMax ? null : "0.75em")
        .text(label)
        .style("fill", textCol)
        .style("font-size", "25px")

});

var tubeFill_bottom = bulb_cy,
    tubeFill_top = scale(currentTemp);

svg.append("rect")
    .attr("id", "rectLine")
    .attr("x", width / 2 - (tubeWidth - 10) / 2)
    .attr("y", tubeFill_top)
    .attr("width", tubeWidth - 10)
    .attr("height", tubeFill_bottom - tubeFill_top)
    .style("shape-rendering", "crispEdges")
    .style("fill", "rgb(0,0,255)");

svg.append("circle")
    .attr("r", bulbRadius - 3)
    .attr("cx", bulb_cx)
    .attr("cy", bulb_cy)
    .style("fill", "url(#bulbGradient)")
    .style("stroke", mercuryColor)
    .style("stroke-width", "2px");

var tickValues = d3.range((domain[1] - domain[0]) / step + 1).map(v => domain[0] + v * step);

var axis = d3.axisLeft()
    .scale(scale)
    .tickSizeInner(7)
    .tickSizeOuter(0)
    .tickValues(tickValues);

var svgAxis = svg.append("g")
    .attr("id", "tempScale")
    .attr("transform", "translate(" + (width / 2 - tubeWidth / 2) + ",0)")
    .call(axis);

svgAxis.selectAll(".tick text")
    .style("fill", "#777777")
    .style("font-size", "20px");

svgAxis.select("path")
    .style("stroke", "none")
    .style("fill", "none")

svgAxis.selectAll(".tick line")
    .style("stroke", tubeBorderColor)
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1px")

svg.append("text")
    .attr("id", "tempText")
    .attr("x", 137.5)
    .attr("y", 288.5)
    .attr("dy", "0.75em")
    .attr("font-weight", "bold")
    .text(currentTemp + "°C")
    .style("fill", "#FFFFFF")
    .style("font-size", "17px")

svg.append("text")
    .attr("x", 132.5)
    .attr("y", 330)
    .attr("dy", "0.75em")
    .attr("font-weight", "bold")
    .text("溫度")
    .style("font-size", "17px");

/*boardReady({ device: "EVGpX", multi: true }, function (board) {
    board.systemReset();
    board.samplingInterval = 100;
    dht = getDht(board, 8);
    fan = getPin(board, 9);
    fan.setMode(3);
    dht.read(function (evt) {
        currentTemp = dht.temperature;
        currentHum = dht.humidity;
        tubeFill_top = scale(currentTemp);
        var rectLine = d3.select("#rectLine");
        var tempText = $("#tempText");
        var colorTemp = currentTemp <= minTemp ? "rgb(0, 0, 255)" : currentTemp >= maxTemp ? "rgb(255, 0, 0)" : "rgb(18, 85, 1)";
        // rectLine
        rectLine.attr("height", tubeFill_bottom - tubeFill_top);
        rectLine.attr("style", "fill: " + colorTemp);
        // bulbGradient
        bulbGradient.selectAll("stop")
            .style("stop-color", colorTemp);
        bulbGradient.selectAll("stop")._groups[0][0].style["stopColor"] = "#fff"
        // tempText
        tempText.attr("x", currentTemp < 10 ? 137.5 : 132.5);
        tempText.text(currentTemp + "°C");
        fan.write(currentTemp > 75 ? 1 : 0);
        // humidity

    }, 1000);
});*/


$(function () {
    let i = 0;
    function read() {
        prevTemp = currentTemp;
        currentTemp = parseInt(Math.random() * 55);
        if (i > 2) i = 0;
        tubeFill_top = scale(currentTemp);
        var rectLine = d3.select("#rectLine");
        var tempText = d3.select("#tempText");
        var colorTemp = currentTemp <= minTemp ? "rgb(0, 0, 255)" : currentTemp >= maxTemp ? "rgb(255, 0, 0)" : "rgb(18, 85, 1)";
        // rectLine
        rectLine.transition()
            .duration(500)
            .attr("y", tubeFill_top)
            .attr("height", tubeFill_bottom - tubeFill_top)
            .attr("style", "fill: " + colorTemp);
        // bulbGradient
        bulbGradient.selectAll("stop")
            .filter(":not(:first-child)")
            .transition()
            .style("stop-color", colorTemp);
        // tempText
        tempText.attr("x", currentTemp < 10 ? 137.5 : 132.5);
        tempText.transition()
            .duration(500)
            .tween("number", () => {
                var i = d3.interpolateRound(prevTemp, currentTemp);
                return t => this.textContent = i(t) + "°C"
            });
    }
    setInterval(read, 1000);

})