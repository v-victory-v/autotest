describe('E-Shop Site', () => {
    it('should allow registering a user', async () => {
        await browser.url('https://demowebshop.tricentis.com/');
        const registerLink = await $('a.ico-register');
        await registerLink.click();

        const maleOption = await $('#gender-male');
        const firstNameInput = await $('#FirstName');
        const lastNameInput = await $('#LastName');
        const emailInput = await $('#Email');
        const passwordInput = await $('#Password');
        const confirmPasswordInput = await $('#ConfirmPassword');

        await maleOption.click();
        await firstNameInput.setValue('Vika');
        await lastNameInput.setValue('VKTest');
        await emailInput.setValue('vikvx1609@yopmail.com');
        await passwordInput.setValue('qwerty');
        await confirmPasswordInput.setValue('qwerty');

        const registerButton = await $('#register-button');
        await registerButton.click();
      
        // You can also add a validation step here to confirm the user registration was successful
    });

    it('Verify that User can Login', () => {
        browser.url('https://demowebshop.tricentis.com/');
        $('a.ico-login').click();
        $('input[name="Email"]').setValue('vkvx1609@yopmail.com');
        $('input[name="Password"]').setValue('qwerty');
        $('input[value="Log in"]').click(); 
        // Add an assertion to confirm that the login was successful. e.g. check for a profile or dashboard button after login
    });

    it('Verify that Computer group has 3 sub-groups with correct names', () => {
        browser.url('/'); // Replace with https://www.yourwebsitename.com when running the test

        // Open 'Computers' submenu
        const computers = $('a[href="/computers"]');
        computers.moveTo();
        
        // Check for the subgroups
        const desktops = $('a[href="/desktops"]');
        const notebooks = $('a[href="/notebooks"]');
        const accessories = $('a[href="/accessories"]');

        // Assertion to check if the sub-groups exist
        expect(desktops).toBePresent();
        expect(notebooks).toBePresent();
        expect(accessories).toBePresent();

        // Assertion to check text of the sub-groups
        expect(desktops).toHaveText('Desktops');
        expect(notebooks).toHaveText('Notebooks');
        expect(accessories).toHaveText('Accessories');
    });

    describe('Test Suite for Sorting Functionality', () => {
        it('Verify sorting by Name: A to Z', () => {
            browser.url('https://demowebshop.tricentis.com/desktops');
            const sortSelect = $('#products-orderby');
            sortSelect.selectByVisibleText('Name: A to Z');
            browser.pause(2000); // Adjust as needed

            // Add your assertion to verify the item sorting
        });

        it('Verify sorting by Name: Z to A', () => {
            browser.url('https://demowebshop.tricentis.com/desktops');
            const sortSelect = $('#products-orderby');
            sortSelect.selectByVisibleText('Name: Z to A');
            browser.pause(2000); // Adjust as needed

            // Add your assertion to verify the item sorting
        });

        it('Verify sorting by Price: Low to High', () => {
            browser.url('https://demowebshop.tricentis.com/desktops');
            const sortSelect = $('#products-orderby');
            sortSelect.selectByVisibleText('Price: Low to High');
            browser.pause(2000); // Adjust as needed

            // Add your assertion to verify the item sorting
        });

        it('Verify sorting by Price: High to Low', () => {
            browser.url('https://demowebshop.tricentis.com/desktops');
            const sortSelect = $('#products-orderby');
            sortSelect.selectByVisibleText('Price: High to Low');
            browser.pause(2000); // Adjust as needed

            // Add your assertion to verify the item sorting
        });
    });
    it('Verify that allows changing number of items on page', () => {
        // Navigate to desktops page
        browser.url('https://demowebshop.tricentis.com/desktops');
        
        const pageSizeSelect = $('#products-pagesize');

        // Select 4 Items per page
        pageSizeSelect.selectByVisibleText('4');
        browser.pause(2000); // adjust as needed.

        // Verify if no. of items is 4
        // Add your assertion logic here...

        // Select 12 Items per page
        pageSizeSelect.selectByVisibleText('12');
        browser.pause(2000); // adjust as needed.

        // Verify if no. of items is 12
        // Add your assertion logic here...
    });
    it('Verify that allows adding an item to the cart', async () => {
        // Navigate to computer page
        await browser.url('https://demowebshop.tricentis.com/build-your-cheap-own-computer');
        
        // Get the Add to Cart button
        const itemAddToCart = await $('#add-to-cart-button-72');
        await itemAddToCart.click();

        // product adding might take some time. Ensure that the confirmation text has appeared.
        await browser.waitUntil(async () => {
            const confirmationText = await $('.content').getText();
            return confirmationText.includes('The product has been added to your shopping cart');
        }, {
            timeout: 5000,
            timeoutMsg: 'Expected confirmation text to appear within 5 seconds'
        });

        // Then verify the success text
        const confirmationText = await $('.content').getText();
        expect(confirmationText).toContain('The product has been added to your shopping cart');
    });
    it('Verify that allows removing an item from the cart', async () => {
        // Add item to cart as before
        await browser.url('https://demowebshop.tricentis.com/build-your-cheap-own-computer');
        
        const itemAddToCart = await $('#add-to-cart-button-72');
        await itemAddToCart.click();

        // Wait for confirmation that item was added to cart
        await browser.waitUntil(async () => {
            const confirmationText = await $('.content').getText();
            return confirmationText.includes('The product has been added to your shopping cart');
        }, {
            timeout: 5000,
            timeoutMsg: 'Expected confirmation text to appear within 5 seconds'
        });

        // navigate to cart
        const cartLink = await $('a.ico-cart');
        await cartLink.click();

        // mark item for removal
        const removeItemCheckbox = await $('input[name="removefromcart"]');
        await removeItemCheckbox.click(); 

        // update the cart
        const updateCartButton = await $('input[name="updatecart"]');
        await updateCartButton.click();
        
        // Insert an assertion here to confirm the item has been removed from the cart after it's updated.
    });
    
    it.only('Verify that allows checkout an item', () => {
        // First, Log in
        browser.url('https://demowebshop.tricentis.com/');
        $('a.ico-login').click();
        $('input[name="Email"]').setValue('vkvx1609@yopmail.com');
        $('input[name="Password"]').setValue('qwerty');
        $('input[value="Log in"]').click();
    
        // Check if Log out link is visible, verifying that login is successful
        $('a.ico-logout').waitForDisplayed({ timeout: 5000 });
    
        // Move to product page and add product to cart
        browser.url('https://demowebshop.tricentis.com/build-your-cheap-own-computer');
        $('#add-to-cart-button-72').waitForDisplayed({ timeout: 5000 });
        const itemAddToCart = $('#add-to-cart-button-72');
        itemAddToCart.click();
    
        // Wait for item to be added to cart
        browser.waitUntil(() => {
            const confirmationText = $('.content').getText();
            return confirmationText.includes('The product has been added to your shopping cart');
        }, {
            timeout: 5000,
            timeoutMsg: 'Expected confirmation text to appear within 5 seconds'
        });
    
        // Go to cart
        $('a.ico-cart').waitForDisplayed({ timeout: 5000 });
        const cartLink = $('a.ico-cart');
        cartLink.click();
    
        // Check terms of service box
        $('#termsofservice').waitForDisplayed({ timeout: 5000 });
        const termsCheckbox = $('#termsofservice');
        termsCheckbox.click(); 
    
        // Print out URL before clicking the checkout button
        const urlBeforeCheckout = browser.getUrl();
        console.log("URL before checkout: ", urlBeforeCheckout);
    
        // Check if checkoutButton is enabled and clickable
        browser.waitUntil(
            function () {
                const checkoutButton = $('#checkout');
                return checkoutButton.isEnabled();
            },
            {
                timeout: 5000,
                timeoutMsg: 'Expected checkout button to become enabled',
            }
        );
    
        // Click on checkout button
        $('#checkout').waitForDisplayed({ timeout: 5000 });
        const checkoutButton = $('#checkout');
        checkoutButton.click();
    
        // Enter into debug mode to check the current state of the page.
        browser.debug();
        //=> DevTools listening on ws://localhost:9222/xxxxxxxx-xxxx-xxxx
    
        // Waiting for url to change
        browser.waitUntil(() => {
            return browser.getUrl() === 'https://demowebshop.tricentis.com/onepagecheckout'
            }, 10000, 'URL not changed');
    
        // Assert that the browser is on the expected URL after clicking the checkout button
        const currentPageUrl = browser.getUrl();
        console.log(currentPageUrl);  // Printing the fetched URL to the console
        expect(currentPageUrl).toBe('https://demowebshop.tricentis.com/onepagecheckout');
    });
    });