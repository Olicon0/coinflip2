let isBetPlaced = false;
let canContinue = false;
let betAmount = 0.1;
let lockedBetAmount = null; // Track locked bet amount
let multiplier = 0;
let seriesCounter = 0; // Track consecutive wins

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

    // Hide cashout frame when starting a new bet
    const coin = document.getElementById("coin");
    const cashoutDisplay = document.getElementById("cashout-display");

    coin.style.display = "block";
    cashoutDisplay.classList.remove("visible");
    cashoutDisplay.classList.add("hidden");

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

    const cashoutDisplay = document.getElementById("cashout-display");
    const coin = document.getElementById("coin");

    // Set multiplier and profit display
    document.getElementById("cashout-multiplier").textContent = `${multiplier.toFixed(2)}x`;
    document.getElementById("cashout-profit").textContent = `${parseFloat(winnings).toFixed(3)} SOL`;

    // Hide coin and make cashout display fully visible
    coin.style.display = "none";
    cashoutDisplay.classList.add("visible");
    cashoutDisplay.classList.remove("hidden");

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
            // Player wins
            document.getElementById("result").textContent = `Padlo: ${coinResult}. Vyhrál jsi ${betAmount} SOL!`;
            updateMultiplier();

            // Increment series counter
            seriesCounter++;
            document.getElementById("series-value").textContent = seriesCounter;

            const betBtn = document.getElementById("bet-btn");
            const cashOutAmount = document.getElementById("cash-out-amount");
            const winnings = (betAmount * multiplier).toFixed(2);

            betBtn.textContent = "Cash Out";
            betBtn.onclick = () => cashOut(winnings); // Set cash-out action
            cashOutAmount.textContent = `${winnings} SOL`;
            cashOutAmount.classList.add("cash-out");

            canContinue = true;
        } else {
            // Player loses
            document.getElementById("result").textContent = `Padlo: ${coinResult}. Prohrál jsi ${betAmount} SOL.`;
            updateMultiplier(true);

            // Reset series counter
            seriesCounter = 0;
            document.getElementById("series-value").textContent = seriesCounter;

            // Unlock bet amount after loss
            unlockBetAmount();

            resetBetButton();
        }

        if (!canContinue) {
            disableButtons();
        }

        isBetPlaced = canContinue;
    }, 2000);
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

    betInput.value = halvedBet.toFixed(2);
    betAmount = halvedBet;
}







import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const SOLANA_HOST = clusterApiUrl("devnet");
const connection = new anchor.web3.Connection(SOLANA_HOST);

const WalletConnection = () => {
    const wallet = useWallet();
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            if (wallet?.publicKey) {
                try {
                    const lamports = await connection.getBalance(wallet.publicKey);
                    setBalance((lamports / LAMPORTS_PER_SOL).toFixed(3));
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                }
            }
        };

        fetchBalance();
    }, [wallet?.publicKey]);

    return (
        <div>
            {wallet.connected ? (
                <div>
                    <p>Wallet Address: {wallet.publicKey.toString()}</p>
                    <p>Balance: {balance ? `${balance} SOL` : "Loading..."}</p>
                </div>
            ) : (
                <p>Wallet not connected</p>
            )}
        </div>
    );
};

export default WalletConnection;

