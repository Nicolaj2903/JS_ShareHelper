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
let exchangeFeeInput = document.getElementById("vekselgebyr");
let inputs = Array.from(document.querySelectorAll(".form-input"));
// Array.from() - converts NodeList to an array to access array methods, map(), filter(), reduce()

// Dropdown
const currencyDropdown = document.getElementById("currencyDropdown");

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

function handleInputKeyDown(event) {
    if (event.ctrlKey && event.keyCode === 13) { // event.keyCode === 13 -> pressing enter
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
}

// Add event listeners to all relevant input fields
function addNavigationListeners() {
    inputs = Array.from(document.querySelectorAll(".form-input")); // Update inputs list

    inputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.ctrlKey && (event.key === "ArrowUp" || event.key === "ArrowLeft")) {
                event.preventDefault();
                const index = inputs.indexOf(event.target);
                const previousIndex = (index - 1 + inputs.length) % inputs.length;
                inputs[previousIndex].focus();
            }

            if (event.ctrlKey && (event.key === 'ArrowDown' || event.key === "ArrowRight")) {
                event.preventDefault();
                const index = inputs.indexOf(event.target);
                const nextIndex = (index + 1) % inputs.length;
                inputs[nextIndex].focus();
            }
        });

        input.addEventListener("keydown", handleInputKeyDown);
    });
}

// Initial setup of navigation listeners
addNavigationListeners();

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

    returnValue.textContent = formattedNumber + " kr.";
    colorDecider(profit);
}

function capitalGainUSD() {
    if (!validateInputsAfkastBtn()) {
        return;
    }

    let shareAmount = parseFloat(shareAmountInput.value);

    let profit = calculateProfitAfterCosts(shareAmount);
    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " kr.";
    colorDecider(profit);
}

function capitalGainEURO() {
    if (!validateInputsAfkastBtn()) {
        return;
    }

    let shareAmount = parseFloat(shareAmountInput.value);

    let profit = calculateProfitAfterCosts(shareAmount);
    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " kr.";
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
    let exchangeFee = exchangeFeeInput ? parseFloat(exchangeFeeInput.value) : 0; // Handle case when exchangeFeeInput might be null

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
    if (exchangeFeeInput) {
        exchangeFeeInput.value = ""; // Handle case when exchangeFeeInput might be null
    }

    returnValue.style.color = grey;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    function updateVekselgebyrField() {
        const selectedCurrency = currencyDropdown.value;

        reset()

        // Check if the input field already exists
        let vekselgebyrGroup = document.getElementById("vekselgebyrGroup");

        if (selectedCurrency === "dkk") {
            if (vekselgebyrGroup) {
                form.removeChild(vekselgebyrGroup); // Remove the field if it exists
                exchangeFeeInput = null; // Update reference to reflect removal
            }
        }
        else {
            if (!vekselgebyrGroup) {
                // Create the field if it does not exist
                vekselgebyrGroup = document.createElement("div");
                vekselgebyrGroup.className = "group";
                vekselgebyrGroup.id = "vekselgebyrGroup";
                vekselgebyrGroup.innerHTML = `
                    <input type="number" id="vekselgebyr" placeholder=" " class="form-input veksel">
                    <label for="vekselgebyr">Vekselgebyr</label>
                `;
                form.appendChild(vekselgebyrGroup);
                exchangeFeeInput = document.getElementById("vekselgebyr"); // Update reference
            }
        }

        // Update the inputs array and add navigation listeners
        addNavigationListeners();
    }

    // Initial check when the page loads
    updateVekselgebyrField();

    // Update the field when the dropdown value changes
    currencyDropdown.addEventListener("change", updateVekselgebyrField);
});
