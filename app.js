
// Return
const returnValue = document.getElementById("value");

// Buttons
const btns = document.querySelectorAll(".btn");

// Inputs
const currentPriceInput = document.getElementById("currentPrice");
const salesPriceInput = document.getElementById("salesPrice");
const shareAmountInput = document.getElementById("shareAmount");

// General text
const missingInputWarning = "Udfyld felter";
const invalidInputWarning = "Ugyldig input";

// Colors
const red = "red";
const green = "green";
const grey = "#222";


// Event listeners
btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("afkast")) {

            if (validateInputsAfkastBtn()) {
                capitalGain();
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

// event.keyCode === 13 <=> Pressing Enter
currentPriceInput.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (validateInputsAfkastBtn()) {
            capitalGain();
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
            capitalGain();
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
            capitalGain();
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

function capitalGain() {
    let currentPrice = currentPriceInput.value;
    let salesPrice = salesPriceInput.value;
    let shareAmount = shareAmountInput.value;

    if (isNaN(currentPrice) || isNaN(salesPrice) || isNaN(shareAmount)) {
        returnValue.textContent = invalidInputWarning;
        returnValue.style.color = red;
        return;
    }

    let profitPerShare = shareDifference();
    let profit = shareAmount * profitPerShare;

    let brokerage = 20; // 20 kr. i kurtage
    let tax = 1 - 0.17;

    profit -= brokerage;
    profit *= tax;

    let formattedNumber = formatNumber(profit);

    returnValue.textContent = formattedNumber + " kr";
    colorDecider(profit);
};

function shareDifference() {
    let currentPrice = currentPriceInput.value;
    let salesPrice = salesPriceInput.value;

    return salesPrice - currentPrice;
};

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
};

function colorDecider(value) {
    if (value > 0) {
        returnValue.style.color = green;
    } else if (value < 0) {
        returnValue.style.color = red;
    } else {
        returnValue.style.color = grey;
    };
};


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

    returnValue.style.color = grey;
};