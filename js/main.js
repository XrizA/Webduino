var dht;

boardReady({device: 'Device ID', multi: true}, function(board) {
    board.systemReset();
    board.samplingInterval = 100;
    dht = getDht(board, 11);
    document.getElementById("demo-area-01-show").style.fontSize = 50+"px";
    document.getElementById("demo-area-01-show").style.lineHeight = 100+"px";
    dht.read(function(evt){
        document.getElementById("demo-area-01-show").innerHTML = 
        (['溫度：', dht.temperature,'度<br />濕度：',dht.humidity,'%']).join('');
    }, 1000);
});

