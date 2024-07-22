// Return
const returnValue = document.getElementById("value");

// Exchange rate
const DKK = 0;
const USD = 6.86;
const EURO = 7.46;

// Colors
const red = "red";
const green = "green";
const grey = "#222";

// Buttons
const btns = document.querySelectorAll(".btn");
const toggleModeButton = document.querySelector(".mode-toggle");

// Inputs
const currentPriceInput = document.getElementById("currentPrice");
const salesPriceInput = document.getElementById("salesPrice");
const shareAmountInput = document.getElementById("shareAmount");
const exchangeFeeInput = document.getElementById("vekselgebyr");
const inputs = document.querySelectorAll(".form-input");

// Dropdown
const currencyDropdown = document.querySelector(".dropdown-currency");

// General text
const missingInputWarning = "Udfyld felter";
const invalidInputWarning = "Ugyldig input";

// Object-literal
const currencies = {
    "dkk": capitalGainDK,
    "usd": capitalGainUSD,
    "euro": capitalGainEURO
};

// Event listeners
currencyDropdown.addEventListener("change", function () {
    toggleVekselgebyr();
});

btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("afkast")) {
            if (validateInputsAfkastBtn()) {
                const selectedCurrency = currencyDropdown.value.toLowerCase();
                if (currencies[selectedCurrency]) {
                    currencies[selectedCurrency]();
                }
            }
        } else if (styles.contains("procent")) {
            if (validateInputsProcentBtn()) {
                calculateProcentage();
            }
        } else {
            reset();
        }
    });
});

inputs.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
        if ((event.ctrlKey && event.key === "ArrowUp") || event.key === "ArrowLeft") {
            event.preventDefault();
            const previousIndex = (index - 1 + inputs.length) % inputs.length;
            inputs[previousIndex].focus();
        }

        if ((event.ctrlKey && event.key === 'ArrowDown') || event.key === "ArrowRight") {
            event.preventDefault();
            const nextIndex = (index + 1) % inputs.length;
            inputs[nextIndex].focus();
        }
    });
});

// Handle Enter key press
function handleEnterKey(event, action) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (validateInputsAfkastBtn()) {
            action();
        }
    }
}

currentPriceInput.addEventListener("keydown", (event) => handleEnterKey(event, capitalGainDK));
salesPriceInput.addEventListener("keydown", (event) => handleEnterKey(event, capitalGainDK));
shareAmountInput.addEventListener("keydown", (event) => handleEnterKey(event, capitalGainDK));

// Functions
function validateInputsAfkastBtn() {
    let currentPrice = parseFloat(currentPriceInput.value);
    let salesPrice = parseFloat(salesPriceInput.value);
    let shareAmount = parseFloat(shareAmountInput.value);

    if (isNaN(currentPrice) || isNaN(salesPrice) || isNaN(shareAmount) || currentPrice < 0 || salesPrice < 0 || shareAmount < 0) {
        returnValue.textContent = missingInputWarning;
        returnValue.style.color = red;
        return false;
    }

    returnValue.textContent = "";
    return true;
}

function validateInputsProcentBtn() {
    let currentPrice = parseFloat(currentPriceInput.value);
    let salesPrice = parseFloat(salesPriceInput.value);

    if (isNaN(currentPrice) || isNaN(salesPrice) || currentPrice < 0 || salesPrice < 0) {
        returnValue.textContent = missingInputWarning;
        returnValue.style.color = red;
        return false;
    }

    returnValue.textContent = "";
    return true;
}

function capitalGainDK() {
    let shareAmount = parseFloat(shareAmountInput.value);

    if (!validateInputsAfkastBtn()) {
        return;
    }

    let profit = calculateProfitAfterCosts(shareAmount);
    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " DKK";
    colorDecider(profit);
}

function capitalGainUSD() {
    let shareAmount = parseFloat(shareAmountInput.value);

    if (!validateInputsAfkastBtn()) {
        return;
    }

    let profit = calculateProfitAfterCosts(shareAmount);
    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " USD";
    colorDecider(profit);
}

function capitalGainEURO() {
    let currentPrice = parseFloat(currentPriceInput.value);
    let salesPrice = parseFloat(salesPriceInput.value);
    let shareAmount = parseFloat(shareAmountInput.value);

    if (!validateInputsAfkastBtn()) {
        return;
    }

    let profit = calculateProfitAfterCosts(shareAmount);
    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " EURO";
    colorDecider(profit);
}

function validateInputs(currentPrice, salesPrice, shareAmount) {
    if (isNaN(currentPrice) || isNaN(salesPrice) || isNaN(shareAmount)) {
        returnValue.textContent = invalidInputWarning;
        returnValue.style.color = red;
        return false;
    }
    return true;
}

function calculateProfitAfterCosts(shareAmount) {
    let profitPerShare = shareDifference();
    let profitBeforeCosts = shareAmount * profitPerShare;

    return profitAfterBrokerageAndTax(profitBeforeCosts);
}

function shareDifference() {
    let currentPrice = parseFloat(currentPriceInput.value);
    let salesPrice = parseFloat(salesPriceInput.value);

    return salesPrice - currentPrice;
}

function profitAfterBrokerageAndTax(profitBeforeCost) {
    let brokerage = 20; // 20 kr. i kurtage (2x 10 kr.)
    let tax = 1 - 0.17;
    let exchangeFee = calculateExchangeFee();

    profitBeforeCost -= brokerage;
    profitBeforeCost -= exchangeFee;
    profitBeforeCost *= tax;

    return profitBeforeCost;
}

function calculateExchangeFee() {
    let currency = currencyDropdown.value.toLowerCase();
    let exchangeFee = 0;

    if (currency === "dkk") {
        exchangeFee = 0;
    } else if (currency === "usd") {
        let usdAmount = parseFloat(exchangeFeeInput.value);
        exchangeFee = usdAmount * USD;
    } else if (currency === "euro") {
        let euroAmount = parseFloat(exchangeFeeInput.value);
        exchangeFee = euroAmount * EURO;
    }
    return exchangeFee;
}

function formatNumber(number) {
    if (isNaN(number)) {
        return invalidInputWarning;
    }

    number = Number(number);

    if (Number.isInteger(number)) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
        let parts = number.toFixed(1).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(",");
    }
}

function colorDecider(value) {
    if (value > 0) {
        returnValue.style.color = green;
    } else if (value < 0) {
        returnValue.style.color = red;
    } else {
        returnValue.style.color = grey;
    }
}

function calculateProcentage() {
    let currentPrice = parseFloat(currentPriceInput.value);
    let calculatedProcentage = 0;

    let profitPerShare = shareDifference();
    calculatedProcentage = (profitPerShare / currentPrice) * 100;

    colorDecider(calculatedProcentage);

    returnValue.textContent = calculatedProcentage.toFixed(1) + "%";
}

function reset() {
    returnValue.textContent = 0;
    currentPriceInput.value = "";
    salesPriceInput.value = "";
    shareAmountInput.value = "";
    exchangeFeeInput.value = "";

    returnValue.style.color = grey;
}

function toggleVekselgebyr() {
    const vekselgebyrGroup = document.getElementById("vekselgebyrGroup");
    const selectedCurrency = currencyDropdown.value.toLowerCase();

    if (selectedCurrency === "dkk") {
        vekselgebyrGroup.style.display = "none";
    } else {
        vekselgebyrGroup.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    toggleVekselgebyr();
});
