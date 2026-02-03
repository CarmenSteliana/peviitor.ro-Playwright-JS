class CityCheckbox {

    constructor(page) {
        this.page = page;
        this.searchInput = page.locator("input[placeholder='Caută un loc de muncă']")
        this.searchButton = page.locator("button[type='submit']")
        this.citiesResults = page.locator("//section[contains(@class, 'grid')]/div/div[2]/div/p");
        this.loadMoreJobs = page.locator("//button[contains(text(),'Încarcă mai multe')]");
        this.cities = [];


    }

    async typeJobInput(jobInput) {
        await Promise.all([
            this.searchButton.click(),
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        ]);

        await this.searchInput.fill(jobInput)

    }
    async checkCities(...citiesInput) {
        if (citiesInput.length === 0) {
            throw new Error('At least one city must be provided');
        }
        this.cities = citiesInput
        for (let i = 0; i < citiesInput.length; i++) {
            const cityCheckbox = this.page.getByRole('checkbox',
                { name: `${citiesInput[i]}` }
            );
            await cityCheckbox.scrollIntoViewIfNeeded();
            await cityCheckbox.check()
            await this.searchButton.click()
        }

    }

    async loadAllJobs() {
        while (true) {
            // scroll la finalul paginii
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await this.page.waitForTimeout(500);

            const isVisible = await this.loadMoreJobs.isVisible();
            if (!isVisible) break;

            await this.loadMoreJobs.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
    }
    async verifyMatchCities() {
        const allCitiesParagraph = await this.citiesResults.allInnerTexts();

        const checkCities = allCitiesParagraph.every(cityParagraph =>
            this.cities.every(city => cityParagraph.toLowerCase().
                includes(city.toLowerCase().trim()))
        );
        expect(checkCities).toBeTruthy();
    }





}
module.exports = { CityCheckbox }