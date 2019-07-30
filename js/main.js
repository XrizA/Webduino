var dht;
const dhtPin = 8;
var fan;
const fanPin = 9;
const fanPinMode = 3; // 0(數位輸入) , 1(數位輸出) , 2(類比輸入) , 3(類比輸出PWM)

$(() => {
    const thermometer = new Thermometer("#thermo");
    const humidity = new Humidity("#humidity");
    setInterval(() => {
        thermometer.Update(parseInt(Math.random() * 56));
        humidity.moveTo(parseInt(Math.random() * 101));
    }, 1050);
});

/*boardReady({ device: "EVGpX", multi: true }, (board) => {
    board.systemReset();
    board.samplingInterval = 100;
    dht = getDht(board, dhtPin);
    fan = getPin(board, fanPin);
    fan.setMode(fanPinMode);
    const thermometer = new Thermometer("#thermo");
    const humidity = new Humidity("#humidity");
    dht.read((evt) => {
        thermometer.Update(dht.temperature);
        humidity.moveTo(dht.humidity);
    }, 1000);
});*/