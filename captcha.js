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
})()