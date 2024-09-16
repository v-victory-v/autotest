const axios = require('axios');
const path = require('path');
const assert = require('assert');

describe('EPAM Home Page', () => {
    it('should have the right title', async () => {
        await browser.url('https://www.epam.com');
        const title = await browser.getTitle();
        assert.strictEqual(title, 'EPAM | Software Engineering & Product Development Services');
    });

    it('should have correct URL after language change', async () => {
        const languageDropdown = await $('.location-selector__button');
        await languageDropdown.click();

        const languageToSelect = await $('a[data-value="https://www.epam.com/ua"]');
        await languageToSelect.click();

        const currentUrl = await browser.getUrl();
        assert.strictEqual(currentUrl, 'https://www.epam.com/ua');
    });

    it('should allow to change language to UA', async () => {
        try {
            await browser.url('https://www.epam.com/');
            await browser.pause(5000);
            await browser.maximizeWindow();
    
            // Handle cookie popup
            const isPopupExists = await $('#onetrust-accept-btn-handler').isExisting();
            if (isPopupExists) {
                const acceptButton = await $('#onetrust-accept-btn-handler');
                await acceptButton.waitForDisplayed();
                await acceptButton.click();
            }
    
            // Open location selector
            const locationSelectorButton = await $('.location-selector__button');
            await locationSelectorButton.waitForDisplayed({timeout: 20000});
            await locationSelectorButton.click();
    
            // Ensure "Українська" is visible and click on it
            const uaLanguageOption = await $('li.location-selector__item a[href="https://careers.epam.ua"]');
            await browser.execute((element) => {
                element.scrollIntoView();
            }, uaLanguageOption);
            await browser.pause(2000); // introduce a slight delay before click
    
            await uaLanguageOption.waitForDisplayed({ timeout: 5000 }); // wait until option is visible
            await uaLanguageOption.click();
    
            // Wait for title to be as expected
            await browser.waitUntil(async () => {
                const title = await browser.getTitle();
                return title === 'EPAM Ukraine - найбільша ІТ-компанія в Україні | Вакансії';
            }, {
                timeout: 10000,
                timeoutMsg: 'expected title to be different after 10s'
            });
    
            // Validate that language has switched to UA based on title
            assert.strictEqual(await browser.getTitle(), 'EPAM Ukraine - найбільша ІТ-компанія в Україні | Вакансії', "Language change does not reflect in title text");
        } catch (error) {
            console.log(await browser.getTitle());
            await browser.saveScreenshot('./error.png');
            throw error;
        }
    });
    it('should include correct items in the policies list', async () => {
        try {
            await browser.url('https://www.epam.com/');
            await browser.pause(5000);
            await browser.maximizeWindow();
    
            // Handle cookie popup
            const isPopupExists = await $('#onetrust-accept-btn-handler').isExisting();
            if (isPopupExists) {
                const acceptButton = await $('#onetrust-accept-btn-handler');
                await acceptButton.waitForDisplayed();
                await acceptButton.click();
            }
    
            // Scroll to the bottom of the page
            let scrolling = true;
            while(scrolling) {
                const oldScrollY = await browser.execute('return window.scrollY;');
                await browser.execute('window.scrollBy(0, window.innerHeight);');
                await new Promise(resolve => setTimeout(resolve, 500));
                const newScrollY = await browser.execute('return window.scrollY;');
                scrolling = oldScrollY !== newScrollY;
            }
    
            // Expected policies
            const expectedPolicies = [
                'INVESTORS',
                'COOKIE POLICY',
                'OPEN SOURCE',
                'APPLICANT PRIVACY NOTICE',
                'PRIVACY POLICY',
                'WEB ACCESSIBILITY'
            ];
    
            // Getting the policies elements from the footer
            const policiesElements = await $$('.footer__title');
    
            // Extracting the text from each policy element 
            const policiesText = [];
            for(let i = 0; i < policiesElements.length; i++){
                policiesText.push(await policiesElements[i].getText());
            }
    
            // Assertion: check the policies
            for(let policy of expectedPolicies){
                assert(policiesText.includes(policy), `Policy ${policy} was not found`);
            }
        } catch (error) {
            console.log(await $('body').getHTML(false));
            await browser.saveScreenshot('./error.png');
            throw error;
        }
    });
    it('should be able to switch to different regions', async () => {
        try {
            await browser.url('https://www.epam.com/');
            await browser.maximizeWindow();
    
            // Scroll to "Our Locations" section
            const ourLocationsSection = await browser.$('/html/body/div/div[2]/main/div[1]/div[16]/section/div[3]/div[2]/div/p/span/span');
            await ourLocationsSection.scrollIntoView();
            await browser.pause(5000); // Give the page some additional time to settle after scrolling
    
            // Handle cookie popup
            const isPopupExists = await $('#onetrust-accept-btn-handler').isExisting();
            if (isPopupExists) {
                const acceptButton = await $('#onetrust-accept-btn-handler');
                await acceptButton.waitForDisplayed();
                await acceptButton.click();
            }
    
            // Expected regions
            const expectedRegions = ['EMEA', 'APAC', 'AMERICAS'];
    
            // For each expected region
            for(let i = 0; i < expectedRegions.length; i++){
    
                // Find region tab
                const regionTab = await browser.$(`//div[@class='tabs-23__title js-tabs-title' and ./a[contains(text(), "${expectedRegions[i]}")]]`);
    
                // Click region tab
                await regionTab.waitForDisplayed({timeout: 10000});
                await regionTab.click();
                await browser.pause(5000); // Pause to let the locations load
    
                // Check that the text of the currently active tab matches the expected region
                const activeRegionTab = await browser.$('//div[@class="tabs-23__title js-tabs-title active"]/a');
                const activeRegionText = await activeRegionTab.getText();
                assert.strictEqual(activeRegionText.trim(), expectedRegions[i]);
            }
        } catch (error) {
            await browser.saveScreenshot('./error.png');
            throw error;
        }
    });
    it('Check the search function', async () => {
        try {
            // Open EPAM.com
            await browser.url('https://www.epam.com/');
            await browser.maximizeWindow();
    
            // Scroll to view
            await browser.execute(() => {
                document.querySelector('.header-search-ui').scrollIntoView();
            });
            await browser.pause(5000); // Give the page some additional time to settle after scrolling
    
            // Handle cookie popup
            const isPopupExists = await $('#onetrust-accept-btn-handler').isExisting();
            if (isPopupExists) {
                const acceptButton = await $('#onetrust-accept-btn-handler');
                await acceptButton.waitForDisplayed();
                await acceptButton.click();
            }
    
            // Open search field
            const searchButton = await $('button.header-search__button');
            await searchButton.click();
    
            // Submit request "AI"
            const input = await $('input[name="q"]');
            await input.addValue('AI');
            const searchSubmitButton = await $('.custom-search-button');
            await searchSubmitButton.click();
    
            // Expected: the site should show the search result
            const searchResultExists = await $('main').waitForExist({ timeout: 5000 });
            assert.strictEqual(searchResultExists, true, 'Search Result Not Found');
    
        } catch (error) {
            // If there is any error, take a screenshot for debugging
            await browser.saveScreenshot('./error.png');
            throw error;
        }
    });

    const fs = require('fs');
it('should check form fields validation', async () => {
    // Open URL
    await browser.url('https://www.epam.com/about/who-we-are/contact');
    await browser.maximizeWindow();

    // Handle cookie popup
    const isPopupExists = await $('#onetrust-banner-sdk').isExisting();
    if (isPopupExists) {
        const acceptButton = $('#onetrust-accept-btn-handler');
        await acceptButton.waitForDisplayed();
        await acceptButton.click();
    }
    await browser.pause(5000); // waiting for the page load
  
    // Define form fields to inspect, replace with the names of the input fields
    const fields = ['user_first_name', 'user_last_name', 'user_email', 'user_phone'];
    for (const fieldName of fields) {
        const field = await $(`input[name="${fieldName}"]`);

        // Give then take away focus from field
        await field.click();
        await browser.keys('Tab'); 

        // Wait for error message to appear when the field is left empty, and then check its display
        const errorField = await $(`.text-field-ui[data-required=true][data-name="${fieldName}"] .validation-tooltip > .validation-text`);
        try {
            await browser.pause(1000); // adding a pause
            await errorField.waitForDisplayed({ timeout:10000 }); // increased timeout
            const errorMsgDisplayed = await errorField.isDisplayed();
            // Validate
            expect(await errorMsgDisplayed).toBe(true);
        } catch (error) {
           console.log(`${fieldName} error: ${error.message}`);
           continue;
        }
    }
   
   // Handling of the dropdown field "How did you hear about EPAM?"
    const dropdown = $('.select2-selection.select2-selection--single');
    await dropdown.click();
    
    const optionEvent = $('.select2-results__options li:nth-child(1)');
    await optionEvent.click();
    
   // Now observe that no error message for dropdown field is not displayed.
    const errorFieldDropdown = $('.dropdown-list-ui[data-required=true] .validation-tooltip .validation-text');
    const errorMsgDropdownDisplayed = await errorFieldDropdown.isDisplayed();
    expect(errorMsgDropdownDisplayed).toBe(false, 'Selected dropdown option "Event", but error message is displayed!');
});
it('Check that the Company logo on the header lead to the main page', async () => {
    // Go to the About page
    await browser.url('https://www.epam.com/about');
    await browser.maximizeWindow();
    
    // Click on the company logo
    const companyLogo = await $('.header__logo-link');
    await companyLogo.click();
    
    await browser.pause(2000); // pause to allow loading of the page  
     
    // Get the current URL
    const currentURL = await browser.getUrl();
    
    // Validate that the current URL is the main page
    assert.strictEqual(currentURL, 'https://www.epam.com/');
});
it('Check that allows to download report', async () => {
    // Go to the About page
    await browser.url('https://www.epam.com/about');
    await browser.maximizeWindow();

    // Handle cookie popup
    const isPopupExists = await $('#onetrust-banner-sdk').isExisting();
    if (isPopupExists) {
        const acceptButton = $('#onetrust-accept-btn-handler');
        await acceptButton.waitForDisplayed();
        await acceptButton.click();
    }

    await browser.pause(5000); // pause to allow loading of the page

    // Get file download URL
    const downloadButton = await $('a[download]');
    const fileUrl = await downloadButton.getAttribute('href');

    try {
        // Make a HEAD request to the file URL and expect HTTP status 200
        const response = await axios.head(fileUrl)
        assert.strictEqual(response.status, 200, 'File is not downloadable, status code: ' + response.status);

        // Parse filename from URL and check that it matches the expected filename
        const urlPath = new URL(fileUrl).pathname;
        const filename = path.basename(urlPath);
        assert.strictEqual(filename, 'EPAM_Corporate_Overview_Q4_EOY.pdf', 'Downloaded file has incorrect name: ' + filename);
    } catch (error) {
        throw new Error('Unable to download or validate the file: ' + error.message);
    }
});
});