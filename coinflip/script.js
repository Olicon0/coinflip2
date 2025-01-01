let isBetPlaced = false;
let canContinue = false;
let betAmount = 0.1;
let lockedBetAmount = null; // Track locked bet amount
let multiplier = 0;

function updateBetAmount() {
    if (lockedBetAmount !== null) {
        document.getElementById("result").textContent = `Bet is locked at ${lockedBetAmount} SOL. Cash out or reset to change.`;
        return;
    }

    const betInput = document.getElementById("bet-amount");
    betAmount = parseFloat(betInput.value) || 0;
}

function setBetAmount(amount) {
    if (lockedBetAmount !== null) {
        document.getElementById("result").textContent = `Bet is locked at ${lockedBetAmount} SOL. Cash out or reset to change.`;
        return;
    }

    betAmount = amount;
    const betInput = document.getElementById("bet-amount");
    betInput.value = amount;
}

function lockBetAmount() {
    lockedBetAmount = betAmount;

    // Disable the bet input and buttons
    const betInput = document.getElementById("bet-amount");
    const betButtons = document.querySelectorAll(".bet-buttons button");

    betInput.disabled = true;
    betButtons.forEach((button) => {
        button.disabled = true;
    });
}

function unlockBetAmount() {
    lockedBetAmount = null;

    // Enable the bet input and buttons
    const betInput = document.getElementById("bet-amount");
    const betButtons = document.querySelectorAll(".bet-buttons button");

    betInput.disabled = false;
    betButtons.forEach((button) => {
        button.disabled = false;
    });
}

function updateMultiplier(reset = false) {
    const multiplierValue = document.getElementById("multiplier-value");

    if (reset) {
        multiplier = 0;
        multiplierValue.textContent = `${multiplier}x`;
        return;
    }

    multiplier = multiplier === 0 ? 1.98 : multiplier * 2;
    multiplierValue.textContent = `${multiplier.toFixed(2)}x`;
}

function placeBet() {
    if (betAmount <= 0) {
        document.getElementById("result").textContent = "Please set a valid bet amount!";
        return;
    }

    if (lockedBetAmount === null) {
        lockBetAmount(); // Lock the bet amount when placing a bet
    }

    isBetPlaced = true;
    canContinue = false;

    const betBtn = document.getElementById("bet-btn");
    const cashOutAmount = document.getElementById("cash-out-amount");
    betBtn.classList.add("disabled");
    betBtn.textContent = "Picking Side...";
    cashOutAmount.textContent = ""; // Clear cash-out display

    const headsBtn = document.getElementById("heads-btn");
    const tailsBtn = document.getElementById("tails-btn");
    headsBtn.disabled = false;
    tailsBtn.disabled = false;
    headsBtn.classList.add("active");
    tailsBtn.classList.add("active");

    document.getElementById("result").textContent = `Bet placed: ${betAmount} SOL. Pick Heads or Tails!`;
}
function cashOut(winnings) {
    const result = document.getElementById("result");
    result.textContent = `You cashed out with ${parseFloat(winnings).toFixed(3)} SOL!`; // Display 3 decimal places

    resetBetButton(); // Reset the game state
    unlockBetAmount(); // Unlock the bet amount after cashing out
}


function selectSide(choice) {
    if (!isBetPlaced && !canContinue) {
        document.getElementById("result").textContent = "Please press 'Bet' first!";
        return;
    }

    const options = ["hlava", "orel"];
    const randomIndex = Math.floor(Math.random() * options.length);
    const coinResult = options[randomIndex];

    const coin = document.getElementById("coin");
    coin.style.animation = "flip 2s ease-in-out";

    setTimeout(() => {
        coin.style.animation = "none";

        if (coinResult === "hlava") {
            coin.style.transform = "rotateY(0deg)";
        } else {
            coin.style.transform = "rotateY(180deg)";
        }

        if (choice === coinResult) {
            document.getElementById("result").textContent = `Padlo: ${coinResult}. Vyhrál jsi ${betAmount} SOL!`;
            updateMultiplier();

            const betBtn = document.getElementById("bet-btn");
            const cashOutAmount = document.getElementById("cash-out-amount");
            const winnings = (betAmount * multiplier).toFixed(2);

            betBtn.textContent = "Cash Out";
            betBtn.onclick = () => cashOut(winnings); // Set cash-out action
            cashOutAmount.textContent = `${winnings} SOL`;
            cashOutAmount.classList.add("cash-out");

            canContinue = true;
        } else {
            document.getElementById("result").textContent = `Padlo: ${coinResult}. Prohrál jsi ${betAmount} SOL.`;
            updateMultiplier(true);
            resetBetButton();
        }

        if (!canContinue) {
            disableButtons();
        }

        isBetPlaced = canContinue;
    }, 2000);
}

function cashOut(winnings) {
    const result = document.getElementById("result");
    result.textContent = `You cashed out with ${winnings} SOL!`;

    resetBetButton(); // Reset the game state
    unlockBetAmount(); // Unlock the bet amount after cashing out
}

function resetBetButton() {
    const betBtn = document.getElementById("bet-btn");
    const cashOutAmount = document.getElementById("cash-out-amount");

    betBtn.classList.remove("disabled");
    betBtn.textContent = "Bet";
    betBtn.onclick = placeBet; // Reset action to placeBet
    cashOutAmount.textContent = "";

    disableButtons();
    isBetPlaced = false;
}

function disableButtons() {
    const headsBtn = document.getElementById("heads-btn");
    const tailsBtn = document.getElementById("tails-btn");
    headsBtn.disabled = true;
    tailsBtn.disabled = true;
    headsBtn.classList.remove("active");
    tailsBtn.classList.remove("active");
}
function doubleBetAmount() {
    if (lockedBetAmount !== null) {
        document.getElementById("result").textContent = `Bet is locked at ${lockedBetAmount} SOL. Cash out or reset to change.`;
        return;
    }

    const betInput = document.getElementById("bet-amount");
    const currentBet = parseFloat(betInput.value) || 0;
    const doubledBet = currentBet * 2;

    // Update the bet input with the doubled amount
    betInput.value = doubledBet.toFixed(2);
    betAmount = doubledBet;
}

function halveBetAmount() {
    if (lockedBetAmount !== null) {
        document.getElementById("result").textContent = `Bet is locked at ${lockedBetAmount} SOL. Cash out or reset to change.`;
        return;
    }

    const betInput = document.getElementById("bet-amount");
    const currentBet = parseFloat(betInput.value) || 0;
    const halvedBet = currentBet / 2;

    // Update the bet input with the halved amount
    betInput.value = halvedBet.toFixed(2);
    betAmount = halvedBet;
}
