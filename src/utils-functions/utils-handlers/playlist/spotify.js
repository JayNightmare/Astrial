require('dotenv').config(); // * Keep me above REST

// Function to validate URL
function isValidUrl(url) {
    const urlRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;
    return urlRegex.test(url);
}

module.exports = { isValidUrl };