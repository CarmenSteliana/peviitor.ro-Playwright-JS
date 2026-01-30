const { test, expect } = require('@playwright/test');
const { JobTitleList } = require('../../pages/JobTitlePage.js');




test('All jobs contain the searched jobTitle', async ({ page }) => {

    await page.goto('https://peviitor.ro/');
    const jobPage = new JobTitleList(page);

    const jobInput = 'chimist';
    await jobPage.jobTitleInput(jobInput);
    await jobPage.loadAllJobs();

    const jobsText = await jobPage.getJobsList();
    const allJobsList = jobsText.every(job => job.toLowerCase().includes(jobInput.toLowerCase()));

    expect(allJobsList).toBeTruthy()

})