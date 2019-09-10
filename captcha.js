const puppeteer = require('puppeteer');
const request = require('request-promise-native');
const poll = require('promise-poller').default;

const chromeOptions = {
    headless:false,
    defaultViewport: null
};

(async function main() {
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.goto('https://old.reddit.com/login');

    const requestId = initiateCaptchaRequest(apiKey);

    await page.type('#user_reg', 'itsnumbawanna');
    await page.type('#passwd_reg', 'holymolyDonut$hop');
    await page.type('#passwd2_reg', 'holymolyDonut$hop');
    await page.type('#email_reg', 'yaboy@gmail.com');

    const response = await pollForRequestResults(apiKey, requestId);

    // inject your response into the necessary field
    await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);

    await page.click('#register-form button');
})()

// 2Captcha related

// initiate captcha request via 2captcha apikey and pass in formData as entered on their site
// needed in order to obtain requestId to then poll for results
async function initiateCaptchaRequest(apiKey){
    const formData = {
        method: 'userrecaptcha',
        key: apiKey, // my apikey for 2cap
        googlekey: '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC', 
        // ^^^gotten from elements on page ur scraping under data site key
        pageurl: 'https://old.reddit.com/login',
        // url I am scraping
        json: 1
    };
    
    const response = await request.post('http://2captcha.com/in.php', {form: formData});
    
    const requestId = JSON.parse(response).request;

    return requestId;
}

const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));

// use promise-poller library to try fulfilling a Promise miltiple times until you run out of retries
// poll for results with request id previously obtained in order to find the response needed to solve the captcha
async function pollForRequestResults(key, id, retries = 30, interval = 1500, delay = 15000){
    await timeout(delay);

    return pollForRequestResults({
        taskFn: requestCaptchaResults(key, id),
        interval,
        retries
    });
}

// worst part lol

function requestCaptchaResults(apiKey, requestId) {
    // reference this: https://2captcha.com/2captcha-api
    const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
    return async function() {
        return new Promise(async function(resolve, reject){
            const rawResponse = await request.get(url);
            const resp = JSON.parse(rawResponse);
            if (resp.status === 0) return reject(resp.request);
            resolve(resp.request);
        });
    }
}