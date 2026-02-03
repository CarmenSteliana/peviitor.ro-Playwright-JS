
class JobTitleList {
    constructor(page) {
        this.page = page;
        this.searchInput = page.locator("input[placeholder='Caută un loc de muncă']")
        this.searchButton = page.locator("button[type='submit']")
        this.loadMoreJobs = page.locator("//button[contains(text(),'Încarcă mai multe')]");
    }

    async jobTitleInput(jobTitle) {
        if (!jobTitle || jobTitle.trim() === '') {
            throw new Error("Job title input cannot be empty or just spaces");
        }

        await this.searchInput.fill(jobTitle);

        await Promise.all([
            this.searchButton.click(),
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        ]);
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

    async getJobsList() {
        const jobsList = this.page.locator("//section[contains(@class, 'grid')]/div/div[2]/h2");

        const jobsText = await jobsList.evaluateAll(jobs => jobs.map(job => job.innerText.trim()))
        return jobsText

    }

}
module.exports = { JobTitleList };