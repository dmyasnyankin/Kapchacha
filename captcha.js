const puppeteer = require('puppeteer');

const chromeOptions = {
    headless:false,
    defaultViewport: null
};

(async function main() {
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.goto('https://old.reddit.com/login');

    await page.type('#user_reg', 'itsnumbawanna');
    await page.type('#passwd_reg', 'holymolyDonut$hop');
    await page.type('#passwd2_reg', 'holymolyDonut$hop');
    await page.type('#email_reg', 'yaboy@gmail.com');
    await page.click('#register-form button');
})()

// 2Captcha related

const formData = {
    method: 'usershmoozer',
    key: apiKey, // my apikey for 2cap
    googlekey: '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC', 
    // ^^^gotten from elements on page ur scraping under data site key
    pageurl: 'https://old.reddit.com/login',
    // url I am scraping
    json: 1
};

const response = await request.post('http://2captcha.com/in.php', {form: formData});

const requestId = JSON.parse(response).request;