FusionCharts.ready(function () {
    var chart = new FusionCharts({
        type: 'thermometer',
        renderAt: 'chart-container',
        id  : 'myThm',
        width: '240',
        height: '300',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Temperature Monitor",
                "subcaption": " Central cold store",
                "lowerLimit": "0",
                "upperLimit": "100",
                "numberSuffix": "°C",
                "showhovereffect": "1",
                "thmFillColor": "#008ee4",
                "showGaugeBorder" : "1",
                "gaugeBorderColor" :  "#008ee4",
                "gaugeBorderThickness" :  "2",
                "gaugeBorderAlpha" :  "30",
                "thmOriginX": "100",
                "theme" : "fint"
            },
            "value": "25",
            //All annotations are grouped under this element
            "annotations": {
                "showbelow": "0",
                "groups": [                        
                    {                  
                        //Each group needs a unique ID
                        "id": "indicator",
                        "items": [
                            //Showing Annotation
                            {
                                "id": "background",
                                //Polygon item 
                                "type": "rectangle",
                                "alpha" : "50",
                                "fillColor": "#AABBCC",           
                                "x" : "$gaugeEndX-35",
                                 "tox" : "$gaugeEndX",
                                "y" : "$gaugeEndY+55",
                                "toy" : "$gaugeEndY+72"
                            }
                        ]
                    }
                ]
                
            },
        },
        "events" :{
            "rendered" : function (evt, arg) {
                var chargeInterval = setInterval( function(){
                    var temp = parseInt(Math.random()*100);
                    FusionCharts.items["myThm"].feedData("&value="+temp);
                    //
                }, 100);
            },
            "drawComplete": function () {
                document.querySelectorAll('text')[8].remove();
            }
        }
    })
    .render();
});