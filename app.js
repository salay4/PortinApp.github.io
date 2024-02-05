document.addEventListener('DOMContentLoaded', function () {
    // Load stored protein value on page load
    displayStoredProtein();
    displayCurrentDate();

    // Check if the app is running on Android and using Chrome
    if (isAndroidChrome()) {
        showInstallPrompt();
    }

    // Event listener for the Reset Protein Counter button
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', showResetConfirmation);
    }

    // Event listener for the confirmation modal
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    if (confirmButton && cancelButton && confirmationModal) {
        confirmButton.addEventListener('click', resetProteinCounter);
        cancelButton.addEventListener('click', hideResetConfirmation);
    }
});

function showResetConfirmation() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'block';
    }
}

function hideResetConfirmation() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'none';
    }
}

function resetProteinCounter() {
    // Reset the protein counter logic here
    // Subtract the current protein value from the total
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10);
    const storageKey = `protein_${dateString}`;
    let storedProtein = parseFloat(localStorage.getItem(storageKey)) || 0;

    // Subtract the current protein value
    storedProtein = Math.max(0, storedProtein - storedProtein);

    // Store updated protein value in localStorage with the date
    localStorage.setItem(storageKey, storedProtein);

    // Display stored protein value
    displayStoredProtein();
    hideResetConfirmation();
}

function isAndroidChrome() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android') && userAgent.includes('chrome');
}

// ... (rest of the code remains unchanged)


function showInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
        // Prevent the default banner from showing
        event.preventDefault();

        // Show the custom install prompt
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => {
                // Trigger the install prompt
                event.prompt();
                // Wait for the user to respond to the prompt
                event.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    // Hide the custom install button
                    installButton.style.display = 'none';
                });
            });
        }
    });
}

function addProtein() {
    // Get protein input value
    const proteinInput = document.getElementById('proteinInput');
    const proteinValue = proteinInput.value;

    if (proteinValue !== '' && !isNaN(proteinValue)) {
        // Get current date based on the user's timezone
        const currentDate = new Date();
        const userTimezoneOffset = currentDate.getTimezoneOffset();
        const userCurrentDate = new Date(currentDate.getTime() + (userTimezoneOffset * 60 * 1000));

        // Retrieve previous protein value
        const dateString = userCurrentDate.toISOString().slice(0, 10);
        const storageKey = `protein_${dateString}`;
        let storedProtein = parseFloat(localStorage.getItem(storageKey)) || 0;

        // Add new protein value to the previous one
        storedProtein += parseFloat(proteinValue);

        // Store updated protein value in localStorage with the date
        localStorage.setItem(storageKey, storedProtein);

        // Display stored protein value
        displayStoredProtein();

        // Clear input field
        proteinInput.value = '';
    } else {
        alert('Please enter a valid protein value.');
    }
}

function displayStoredProtein() {
    // Get current date for display
    const currentDate = new Date();
    const userTimezoneOffset = currentDate.getTimezoneOffset();
    const userCurrentDate = new Date(currentDate.getTime() + (userTimezoneOffset * 60 * 1000));
    const dateString = userCurrentDate.toISOString().slice(0, 10);

    // Retrieve stored protein value
    const storageKey = `protein_${dateString}`;
    const storedProtein = parseFloat(localStorage.getItem(storageKey)) || 0;

    // Display the stored protein value
    const displayProteinElement = document.getElementById('displayProtein');
    if (storedProtein !== null) {
        displayProteinElement.innerHTML = `<p class="total-intake">Your total protein intake up to ${dateString}:</p>`;
        displayProteinElement.innerHTML += `<p class="protein-amount">${storedProtein.toFixed(2)} grams</p>`;
    } else {
        displayProteinElement.innerHTML = `<p class="no-intake">No protein intake recorded for ${dateString}.</p>`;
    }
}

function displayCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().slice(0, 10);
        currentDateElement.textContent = dateString;
    }
}
