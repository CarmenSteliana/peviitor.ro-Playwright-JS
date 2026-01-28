const { test, expect } = require('@playwright/test')

test('verify job title from official job listing page', async ({ page }) => {
    await page.goto('https://peviitor.ro/')

    //await expect(page).toHaveTitle(/chimist/i);

    await Promise.all([
        page.click("button[type='submit']"),
        page.waitForLoadState('domcontentloaded')
    ]);

    await page.locator("input[placeholder='Caută un loc de muncă']").fill('chimist')
    await page.click("button[type='submit']")

    const loadMoreJobs = page.locator("//button[contains(text(),'Încarcă mai multe')]")
    while (true) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        const isVisible = await loadMoreJobs.isVisible();
        if (!isVisible) {
            break
        }
        await loadMoreJobs.click()
        await page.waitForLoadState('domcontentloaded')
    }


});
