var express = require('express');
var app = express();

const request = require('request');
//Get id from coin url or coingecko api
const coingecko_coin_id = "crypto-sports";

async function getAltBitpayRates(resx){
    //Get btc price of altcoin
request('https://api.coingecko.com/api/v3/simple/price?ids=' + coingecko_coin_id + '&vs_currencies=BTC', {
    json: true
}, (err, res, body) => {
    if (err) {
        return console.log(err);
    } else {
        //Store altcoin btc price
        var altbtcprice = body[coingecko_coin_id].btc;
        request('https://bitpay.com/rates', {
            json: true
        }, (err, res, body) => {
            //cycle through currencies returned by bitpay api and multiply it with the btc price,essentially giving fiat rates needed for the altcoin
            for (var i = 0; i < body.data.length; i++) {
                body.data[i].rate = body.data[i].rate * altbtcprice;
            }
            resx.json(body);
        });
    }
});
}
//handle get request for rates
app.get('/',async function (req, res) {
    getAltBitpayRates(res);
});
//start http server
var server = app.listen(80, function () {
    console.log('Node server is running..');
});