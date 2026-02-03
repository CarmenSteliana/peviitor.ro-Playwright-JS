const { test } = require('@playwright/test');
const { CityCheckbox } = require('../../pages/CityCheckbox');

test.describe('City filter checkbox tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://peviitor.ro/');
    });

    test('Search job and filter by one city', async ({ page }) => {
        const cityCheckbox = new CityCheckbox(page);

        await cityCheckbox.typeJobInput('QA Tester');
        await cityCheckbox.checkCities('București');
        await cityCheckbox.loadAllJobs();
        await cityCheckbox.verifyMatchCities();
    });

    test('Search job and filter by multiple cities', async ({ page }) => {
        const cityCheckbox = new CityCheckbox(page);

        await cityCheckbox.typeJobInput('Automation');
        await cityCheckbox.checkCities('Cluj-Napoca', 'Timișoara');
        await cityCheckbox.loadAllJobs();
        await cityCheckbox.verifyMatchCities();
    });
});