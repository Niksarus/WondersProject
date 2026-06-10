//Функция инкремента количества человек
function incrementPeopleCounter() {
    let counter = document.getElementById("peopleCounter");
    //С проверочкой на существование элемента
    if (counter) {
        let currentValue = parseInt(counter.innerText);
        if (currentValue < 8) {
            counter.innerText = currentValue + 1;
        }
    }
}

//Функция декремента количества человек
function decrementPeopleCounter() {
    let counter = document.getElementById("peopleCounter");
    //С проверочкой на существование элемента
    if (counter) {
        let currentValue = parseInt(counter.innerText);
        if (currentValue > 1) {
            counter.innerText = currentValue - 1;
        }
    }
}

//Накидывание обработчиков событий при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    let incrementButton = document.getElementById("incrementCounterButton");
    //Проверка на существование элемента
    if (incrementButton) {
        incrementButton.addEventListener("click", incrementPeopleCounter);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let incrementButton = document.getElementById("decrementCounterButton");
    //Проверка на существование элемента
    if (incrementButton) {
        incrementButton.addEventListener("click", decrementPeopleCounter);
    }
});