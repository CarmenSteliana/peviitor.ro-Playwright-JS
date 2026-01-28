const { test, expect } = require('@playwright/test')
import { JobTitle } from '../pages/JobTitlePage'

test('All jobs contain the searched jobTitle', async ({ page }) => {

    await page.goto('https://peviitor.ro/');
    const jobPage = new JobTitle(page);

    const jobInput = 'chimist';
    await jobPage.jobTitleInput(jobInput);

    const jobsText = await jobPage.getJobsList();
    const allJobsList = jobsText.every(job => job.toLowerCase().include(jobInput.toLowerCase()));

    expect(allJobsList).toBeTruthy()

})