// Return
const returnValue = document.getElementById("value");

// Colors
const red = "red";
const green = "green";
const grey = "#222";

// Buttons
const btns = document.querySelectorAll(".btn");

// Inputs
const amountOfShares = document.getElementById("amountOfShares");
const currentGAK = document.getElementById("currentGAK");
const investmentInput = document.getElementById("investment");
const priceInput = document.getElementById("price");
let inputs = Array.from(document.querySelectorAll(".form-input"));

// General text
const missingInputWarning = "Udfyld felter";
const invalidInputWarning = "Ugyldig input";

// Event listeners
btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("newGAK")) {
            calculateNewGAK();
        }
    });
});


function calculateNewGAK() {
    let investment = parseFloat(investmentInput.value);
    let brokage = 30; // Kurtage
    let totalNewInvestmentWithBrokage = investment + brokage;
    
    let previousAmountOfShares = parseFloat(amountOfShares.value);
    let oldGAK = parseFloat(currentGAK.value)   ;
    let totalOldInvestment = previousAmountOfShares * oldGAK;

    let totalAmountOfShares = previousAmountOfShares + calculateTotalAmountOfShares();

    let newGAK = (totalOldInvestment + totalNewInvestmentWithBrokage)/totalAmountOfShares;
    let formattedNumber = formatNumber(newGAK);
    returnValue.textContent = formattedNumber;
}

function calculateTotalAmountOfShares() {
    let shareTotal = 0;
    let investment = parseFloat(investmentInput.value);
    let price = parseFloat(priceInput.value)
    shareTotal = investment/price;
    
    return shareTotal;
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
}