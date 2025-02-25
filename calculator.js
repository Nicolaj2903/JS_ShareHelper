// Return
const returnValue = document.getElementById("value");

// Colors
const red = "red";
const green = "green";
const grey = "#222";

// Buttons
const btns = document.querySelectorAll(".btn");

// Inputs
const amountOfSharesInput = document.getElementById("amountOfShares");
const currentGAKInput = document.getElementById("currentGAK");
const investmentInput = document.getElementById("investment");
const priceInput = document.getElementById("price");
let inputs = Array.from(document.querySelectorAll(".form-input"));

// Valuta valg
const currencyDropdown = document.getElementById("currencyDropdown");

// General text
const missingInputWarning = "Udfyld felter";
const invalidInputWarning = "Ugyldig input";

// Brokerage
const brokage = 30; // 30 kr.

// Kurs
let usdKurs = 7.24;   // 1 USD  = 7,24 DKK
let euroKurs = 7.46;  // 1 Euro = 7,46 DKK

// Event listeners
btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;

        if (styles.contains("newGAK")) {
            GAKWithExchangeFeeUSD();
        }
    });
});

function handleInputKeyDown(event) {
    if (event.ctrlKey && event.keyCode === 13) { // event.keyCode === 13 -> pressing enter
        event.preventDefault();
        reset();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        GAKWithExchangeFeeUSD();
    }
};

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
};

// Initial setup of navigation listeners
addNavigationListeners();

function colorDecider(value) {
    if (value > 0) {
        returnValue.style.color = green;
    } else if (value < 0) {
        returnValue.style.color = red;
    } else {
        returnValue.style.color = grey;
    }
};

function reset() {
    returnValue.textContent = 0;
    amountOfSharesInput.value = "";
    currentGAKInput.value = "";
    investmentInput.value = "";
    priceInput.value = "";
    returnValue.style.color = grey;
};

// function calculateNewGAK() {
//     let sharesCurrentAmount = parseFloat(amountOfSharesInput.value);
//     let currentGAK = parseFloat(currentGAKInput.value);
//     let intitalInvestmentAmount = parseFloat(investmentInput.value);
//     let currentSharePrice = parseFloat(priceInput.value);

//     let newAmountOfShares = Math.floor(intitalInvestmentAmount / currentSharePrice); // Kun hele tal
//     let actualInvestmentAmount = (newAmountOfShares * currentSharePrice) + brokage;

//     let currentValue = currentGAK * sharesCurrentAmount;

//     let totalShares = newAmountOfShares + sharesCurrentAmount;

//     let newGAK = (currentValue + actualInvestmentAmount) / totalShares;

//     let formatNewGAK = formatNumber(newGAK);
//     returnValue.textContent = formatNewGAK;
// }

// function calculateNewGAK() {
// let investment = parseFloat(investmentInput.value);
// let brokage = 30; // Kurtage
// let exchangeFee = investment * 0.0025; // Vekselgebyr (0.25%)
// let totalNewInvestmentWithFees = investment + brokage + exchangeFee;

// let previousAmountOfShares = parseFloat(amountOfShares.value);
// let oldGAK = parseFloat(currentGAK.value);
// let totalOldInvestment = previousAmountOfShares * oldGAK;

// let totalAmountOfShares = previousAmountOfShares + calculateTotalAmountOfShares();

// let newGAK = (totalOldInvestment + totalNewInvestmentWithFees) / totalAmountOfShares;
// let formattedNumber = formatNumber(newGAK);
// returnValue.textContent = formattedNumber;
// }

function calculateTotalAmountOfShares() {
    let shareTotal = 0;
    let investment = parseFloat(investmentInput.value);
    let kurs = parseFloat(priceInput.value);

    if (currencyDropdown.value === "usd") {
        shareTotal = investment / usdKurs;
    } else if (currencyDropdown.value === "euro") {
        shareTotal = investment / euroKurs;
    } else {
        shareTotal = investment / kurs;
    }
    console.log("CalculateTotalAmountOfShares: ");
    console.log("Investment: " + investment + ", kurs: " + kurs + ", shareTotal: " + shareTotal)

    return Math.floor(shareTotal); // Afrunder ned til nærmeste heltal
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

function GAKWithExchangeFeeUSD() {
    // Inputs
    let antalGamleAktier = parseFloat(amountOfSharesInput.value);
    console.log("Antal gamle aktier: " + antalGamleAktier)
    let nuværendeGAK = parseFloat(currentGAKInput.value);
    let investeringsBeløb = parseFloat(investmentInput.value);
    let nuværendeKurs = parseFloat(priceInput.value);

    if (currencyDropdown.value === "usd") {
        investeringsBeløb = investeringsBeløb / usdKurs;
        console.log("USD: " + investeringsBeløb)
    } else if (currencyDropdown.value === "euro") {
        investeringsBeløb = investeringsBeløb / euroKurs;
        console.log("EURO: " + investeringsBeløb)
    } else {
        investeringsBeløb = investeringsBeløb;
        console.log("DKK: " + investeringsBeløb)
    }

    let antalNyeAktier = calculateTotalAmountOfShares();
    console.log("Antal nye aktier: " + antalNyeAktier)
    let reeltInvesteretUSD = antalNyeAktier * nuværendeKurs; // Køber så mange aktier som muligt for det investerede beløb

    let vekselGebyr = investeringsBeløb * 0.0025; // 0,25%
    console.log("VekselGebyr = " + vekselGebyr + ", investeringsbeløb: " + investeringsBeløb)

    // Total investering
    let samletNyeInvesteringUSD = reeltInvesteretUSD + vekselGebyr; // Investeret + vekselgebyr
    let tidligereInvesteretUSD = antalGamleAktier * nuværendeGAK; // Tidligere investeret beløb
    let investeretIAltUSD = tidligereInvesteretUSD + samletNyeInvesteringUSD; // Tidligere investering + nye investering i USD

    // Udregn nye GAK
    let antalAktierIalt = antalGamleAktier + antalNyeAktier; // Tidligere købte aktier + ny købte
    console.log("Antal aktier i alt: " + antalAktierIalt)
    let nyeGAKUSD = investeretIAltUSD / antalAktierIalt;
    console.log("Nye GAK USD: " + nyeGAKUSD)

    let prisPrAktieDKK = nyeGAKUSD * usdKurs;
    let investeretIAltDKK = prisPrAktieDKK * antalAktierIalt;

    console.log("Investering i alt i DKK: " + formatNumber(investeretIAltDKK))
    console.log("DKK aktie pris: " + formatNumber(prisPrAktieDKK));

    let formatterNyGAK = formatNumber(nyeGAKUSD);
    returnValue.textContent = formatterNyGAK;
}
