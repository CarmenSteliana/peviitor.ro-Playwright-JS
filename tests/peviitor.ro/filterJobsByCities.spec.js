const { test, expect } = require('@playwright/test')

test('Filter Jobs By Cities', async ({ page }) => {
    test.setTimeout(100000);
    await page.goto('https://peviitor.ro/')

    await Promise.all([
        page.click("button[type='submit']"),
        page.waitForLoadState('domcontentloaded')
    ]);

    await page.locator("input[placeholder='Caută un loc de muncă']").fill('ospatar')
    await page.click("button[type='submit']")

    await page.click("//button[contains(text(),'Oraș')]")

    // select two cities from the dropdown and scroll 
    const bucurestiChecbox = page.getByRole('checkbox', { name: 'București' })
    await bucurestiChecbox.scrollIntoViewIfNeeded()
    await bucurestiChecbox.check()

    const constantaChecbox = page.getByRole('checkbox', { name: 'Constanța' })
    await constantaChecbox.scrollIntoViewIfNeeded()
    await constantaChecbox.check()
    await page.click("button[type='submit']")

    //load all the jobs by pressing the "Incarca mai multe" button and wait to be visible
    const loadMoreJobs = page.locator("//button[contains(text(),'Încarcă mai multe')]")
    const citiesResults = page.locator("//section[contains(@class, 'grid')]/div/div[2]/div/p");


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

    const textsCities = await citiesResults.allInnerTexts();
    //const citiesArray = await citiesResults.evaluateAll(cities => cities.map(c => c.innerText));
    //console.log('Numărul de joburi:', citiesArray.length);

    //obtain the text results with inner text, extract only the string number with match
    // and convert it in number
    const h2Locator = page.locator("xpath=//h2[contains(@class, 'text-start')]")
    //await expect(h2Locator).toBeVisible({ timeout: 60000 });
    const countText = await h2Locator.innerText();
    const countResults = parseInt(countText.match(/\d+/)[0], 10);
    console.log(countResults)

    await expect(textsCities.length).toBe(countResults)
})