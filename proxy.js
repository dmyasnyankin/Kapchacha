// http://username:password@ip:port
const request = require('request-promise');

(async () => {
    let response = await request('https://httpbin.org/ip');

    debugger;
})();