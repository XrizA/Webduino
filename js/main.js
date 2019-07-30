var dht; // 溫溼度
const dhtPin = 8; // 溫溼度腳位
var fan; // 風扇
const fanPin = 9; // 風扇腳位
const fanPinMode = 3; // 風扇腳位模式

/* 
透過 boardReady 判斷裝置是否上線，當上線之後就會執行 function
    (device: "裝置ID", multi: true/false 是否讓裝置多人同時操控)
    (board) -> 板子資訊，裡面的board文字可隨意改變
*/
boardReady({ device: "EVGpX", multi: true }, (board) => {
    board.systemReset(); // 裝置在第一次連線時，所有腳位輸出預設低電位 (0、off)
    board.samplingInterval = 100; // 類比取樣時間
    dht = getDht(board, dhtPin); // getDht(board, pin) -> 設定 溫溼度 為哪塊板子的幾號腳位
    fan = getPin(board, fanPin); // getPin(board, pin) -> 設定 風扇 為哪塊板子的幾號腳位
    fan.setMode(fanPinMode); // 設定腳位模式[0(數位輸入) , 1(數位輸出) , 2(類比輸入) , 3(類比輸出PWM)]
    const thermometer = new Thermometer("#thermo"); // 產生溫度計元件
    const humidity = new Humidity("#humidity"); // 產生溼度計元件
    let currentTemp = 0; // 宣告目前溫度變數為0
    let currentHum = 0; // 宣告目前濕度變數為0
    dht.read((evt) => { // dht.read((evt) => {}, t) -> 以t/1000從溫溼度感應器讀取值
        currentTemp = dht.temperature; // 從溫溼度感測器裡讀取溫度，將讀取到的值儲存於目前溫度變數
        currentHum = dht.humidity; // 從溫溼度感測器裡讀取濕度，將讀取到的值儲存於目前濕度變數
        thermometer.Update(currentTemp); // 更新溫度計元件
        humidity.Update(currentHum); // 更新溼度計元件
        fan.write(currentTemp > 75 ? 1 : 0); // 當目前濕度達到75時，開啟風扇；否則關閉風扇
    }, 1000);
});

/*$(() => {
    const thermometer = new Thermometer("#thermo");
    const humidity = new Humidity("#humidity");
    setInterval(() => {
        //thermometer.Update(29);
        thermometer.Update(parseInt(Math.random()* 56));
        //humidity.Update(71);
        humidity.Update(parseInt(Math.random()*101))
    }, 1000);
});*/