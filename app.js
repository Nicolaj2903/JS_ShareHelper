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

// Event listeners
btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("afkast")) {

            if (validateInputsAfkastBtn()) {
                if (currencyDropdown.value === "dkk") {
                    capitalGainDK();
                } else if (currencyDropdown.value === "usd") {
                    capitalGainUSD();
                } else {
                    capitalGainEURO();
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
        if (event.ctrlKey && event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();

            const previousIndex = (index - 1 + inputs.length) % inputs.length;
            inputs[previousIndex].focus();
        }

        if (event.ctrlKey && event.key === 'ArrowDown' || event.key === "ArrowRight") {
            event.preventDefault();
            const nextIndex = (index + 1) % inputs.length;
            inputs[nextIndex].focus();
        }
    });
});

// event.keyCode === 13 <=> Pressing Enter
currentPriceInput.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (validateInputsAfkastBtn()) {
            if (currencyDropdown.value === "dkk") {
                capitalGainDK();
            } else if (currencyDropdown.value === "usd") {
                capitalGainUSD();
            } else {
                capitalGainEURO();
            }
        }
    }
});

salesPriceInput.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (validateInputsAfkastBtn()) {
            if (currencyDropdown.value === "dkk") {
                capitalGainDK();
            } else if (currencyDropdown.value === "usd") {
                capitalGainUSD();
            } else {
                capitalGainEURO();
            }
        }
    }
});

shareAmountInput.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (validateInputsAfkastBtn()) {
            if (currencyDropdown.value === "dkk") {
                capitalGainDK();
            } else if (currencyDropdown.value === "usd") {
                capitalGainUSD();
            } else {
                capitalGainEURO();
            }
        }
    }
});

exchangeFeeInput.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (validateInputsAfkastBtn()) {
            if (currencyDropdown.value === "dkk") {
                capitalGainDK();
            } else if (currencyDropdown.value === "usd") {
                capitalGainUSD();
            } else {
                capitalGainEURO();
            }
        }
    }
});


// Functions
function validateInputsAfkastBtn() {
    let currentPrice = parseFloat(currentPriceInput.value);
    let salesPrice = parseFloat(salesPriceInput.value);
    let shareAmount = parseFloat(shareAmountInput.value);

    if (isNaN(currentPrice) || isNaN(salesPrice) || isNaN(shareAmount)) {
        returnValue.textContent = missingInputWarning;
        returnValue.style.color = red;
        return false;
    }

    if (currentPrice < 0 || salesPrice < 0 || shareAmount < 0) {
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
    let shareAmount = parseFloat(shareAmountInput.value);

    if (isNaN(currentPrice) || isNaN(salesPrice)) {
        returnValue.textContent = missingInputWarning;
        returnValue.style.color = red;
        return false;
    }

    if (currentPrice < 0 || salesPrice < 0 || shareAmount < 0) {
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
    if (!validateInputsAfkastBtn()) {
        return;
    }

    let shareAmount = parseFloat(shareAmountInput.value);

    let profit = calculateProfitAfterCosts(shareAmount);
    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " USD";
    colorDecider(profit);
}

function capitalGainEURO() {

    if (!validateInputsAfkastBtn()) {
        return;
    }

    let shareAmount = parseFloat(shareAmountInput.value);

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
    let exchangeFee = parseFloat(exchangeFeeInput.value);

    profitBeforeCost -= exchangeFee;

    let profitInDKK = convertCurrencyToDKK(profitBeforeCost);

    profitInDKK -= brokerage;
    profitInDKK *= tax;

    return profitInDKK;
}

function convertCurrencyToDKK(valuta) {
    let currency = currencyDropdown.value.toLowerCase();

    if (currency === "usd") {
        return valuta * USD;
    } else if (currency === "euro") {
        return valuta * EURO;
    } else {
        return valuta; // Already in DKK
    }
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
    let currentPrice = currentPriceInput.value;
    let calculatedProcentage = 0;

    let profitPerShare = shareDifference();
    calculatedProcentage = (profitPerShare / currentPrice) * 100;

    colorDecider(calculatedProcentage);

    returnValue.textContent = calculatedProcentage.toFixed(1) + "%";
};

function reset() {
    returnValue.textContent = 0;
    currentPriceInput.value = "";
    salesPriceInput.value = "";
    shareAmountInput.value = "";
    exchangeFeeInput.value = "";

    returnValue.style.color = grey;
}