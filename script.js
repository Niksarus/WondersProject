function incrementPeopleCounter() {
    let counter = document.getElementById("peopleCounter");
    if (counter) {
        let currentValue = parseInt(counter.innerText);
        if (currentValue < 8) {
            counter.innerText = currentValue + 1;
        }
    }
}

function decrementPeopleCounter() {
    let counter = document.getElementById("peopleCounter");
    if (counter) {
        let currentValue = parseInt(counter.innerText);
        if (currentValue > 1) {
            counter.innerText = currentValue - 1;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let incrementButton = document.getElementById("incrementCounterButton");
    if (incrementButton) {
        incrementButton.addEventListener("click", incrementPeopleCounter);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let incrementButton = document.getElementById("decrementCounterButton");
    if (incrementButton) {
        incrementButton.addEventListener("click", decrementPeopleCounter);
    }
});