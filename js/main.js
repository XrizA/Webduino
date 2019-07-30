var dht;
const dhtPin = 8;
var fan;
const fanPin = 9;
const fanPinMode = 3; // 0(數位輸入) , 1(數位輸出) , 2(類比輸入) , 3(類比輸出PWM)

$(() => {
    const thermometer = new Thermometer("#thermo");
    setInterval(() => thermometer.Update(parseInt(Math.random() * 56)), 1000);
});
// "EVGpX"
boardReady({ device: "Device ID", multi: true }, (board) => {
    board.systemReset();
    board.samplingInterval = 100;
    dht = getDht(board, dhtPin);
    fan = getPin(board, fanPin);
    fan.setMode(fanPinMode);
    const thermometer = new Thermometer("#thermo");

    dht.read((evt) => {
        thermometer.Update(dht.temperature);
    }, 1000);
});

//console.log(thermometer);