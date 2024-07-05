
// Return
const returnValue = document.getElementById("value");

// Buttons
const btns = document.querySelectorAll(".btn");

// Inputs
const currentPriceInput = document.getElementById("currentPrice");
const salesPriceInput = document.getElementById("salesPrice");
const shareAmountInput = document.getElementById("shareAmount");


// Event listeners
btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("afkast")) {
            capitalGain();
        } else if (styles.contains("procent")) {
            // Beregn procent afkast
            calculateProcentage();
        } else {
            reset();
        }
    });
});

function capitalGain() {
    let currentPrice = currentPriceInput.value;
    let salesPrice = salesPriceInput.value;
    let shareAmount = shareAmountInput.value;

    if (isNaN(currentPrice) || isNaN(salesPrice) || isNaN(shareAmount)) {
        returnValue.textContent = "Ugyldig input";
        returnValue.style.color = "red";
        return;
    }

    let profitPerShare = shareDifference();
    let profit = shareAmount * profitPerShare;

    let brokerage = 20; // 20 kr. i kurtage
    let tax = 1 - 0.17;

    profit -= brokerage;
    profit *= tax;


    returnValue.textContent = parseFloat(profit).toFixed(1) + " kr";
    colorDecider(profit);
};

function shareDifference() {
    let currentPrice = currentPriceInput.value;
    let salesPrice = salesPriceInput.value;

    return salesPrice - currentPrice;
};

function colorDecider(value) {
    if (value > 0) {
        returnValue.style.color = "green";
    } else if (value < 0) {
        returnValue.style.color = "red";
    } else {
        returnValue.style.color = "#222";
    };
};


function calculateProcentage() {
    let currentPrice = currentPriceInput.value;
    let calculatedProcentage = 0;

    let profitPerShare = shareDifference();
    calculatedProcentage = (profitPerShare / currentPrice) * 100;

    colorDecider(calculatedProcentage);

    returnValue.textContent = calculatedProcentage + "%";
};

function reset() {
    returnValue.textContent = 0;
    currentPriceInput.value = "";
    salesPriceInput.value = "";
    shareAmountInput.value = "";

    returnValue.style.color = "#222";
};