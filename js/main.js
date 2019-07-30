var dht;
const dhtPin = 8;
var fan;
const fanPin = 9;
const fanPinMode = 3; // 0(數位輸入) , 1(數位輸出) , 2(類比輸入) , 3(類比輸出PWM)

/*boardReady({ device: "EVGpX", multi: true }, (board) => {
    board.systemReset();
    board.samplingInterval = 100;
    dht = getDht(board, dhtPin);
    fan = getPin(board, fanPin);
    fan.setMode(fanPinMode);
    const thermometer = new Thermometer("#thermo");
    const humidity = new Humidity("#humidity");
    let currentTemp = 0;
    let currentHum = 0;
    dht.read((evt) => {
        currentTemp = dht.temperature;
        currentHum = dht.humidity;
        thermometer.Update(currentTemp);
        humidity.moveTo(currentHum);
        fan.write(currentTemp > 75 ? 1 : 0);
    }, 1000);
});*/

$(() => {
    const thermometer = new Thermometer("#thermo");
    const humidity = new Humidity("#humidity");
    setInterval(() => {
        //thermometer.Update(29);
        thermometer.Update(parseInt(Math.random()* 56));
        //humidity.moveTo(71);
        humidity.moveTo(parseInt(Math.random()*101))
    }, 1000);
});