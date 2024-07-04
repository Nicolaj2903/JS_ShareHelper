
// Return
const returnValue = document.getElementById("value");

// Buttons
const btns = document.querySelectorAll(".btn");

// Inputs
const currentPriceInput = document.getElementById("currentPrice");
const salesPriceInput = document.getElementById("salesPrice");
const shareAmountInput = document.getElementById("shareAmount");


// FUNCTIONS
btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("afkast")) {
            capitalGain();
        } else if (styles.contains("procent")) {
            // Beregn procent afkast
        } else {
            reset();
        }
    });
});

function reset() {
    returnValue.textContent = 0;
    currentPriceInput.value = 0;
    salesPriceInput.value = 0;
    shareAmountInput.value = 0;

    returnValue.style.color = "#222";
};

function capitalGain() {
    let currentPrice = currentPriceInput.value;
    let salesPrice = salesPriceInput.value;
    let shareAmount = shareAmountInput.value;

    let profitPerShare = salesPrice - currentPrice;
    let profit = shareAmount * profitPerShare;

    let brokerage = 20; // 20 kr. i kurtage
    let tax = 1 - 0.17;

    profit -= brokerage;
    profit *= tax;


    returnValue.textContent = parseFloat(profit).toFixed(1);

    if (profit > 0) {
        returnValue.style.color = "green";
    } else if (profit < 0) {
        returnValue.style.color = "red";
    } else {
        returnValue.style.color = "#222";
    };
};

