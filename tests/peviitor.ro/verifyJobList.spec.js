const { test, expect } = require('@playwright/test')

test('Jobs List', async ({ page }) => {
    await page.goto('https://peviitor.ro/')
    await page.locator("input[placeholder='Caută un loc de muncă']").fill('tester')

    // when the page is redirect only
    await Promise.all([
        page.click("button[type='submit']"),
        page.waitForLoadState('domcontentloaded')
    ]);

    const loadMoreJobs = page.locator("//button[contains(text(),'Încarcă mai multe')]")
    while (await loadMoreJobs.isVisible().catch(() => false)) {
        await loadMoreJobs.scrollIntoViewIfNeeded();
        await loadMoreJobs.click();
        await page.waitForTimeout(800);
    }


    const titlesJobs = await page.locator("//div/h2").evaluateAll(elements =>
        elements.map(el => el.innerText)
    );
    const jobsList = titlesJobs.every(title => title.toLowerCase().includes('tester'));
    await expect(jobsList).toBe(true)


})