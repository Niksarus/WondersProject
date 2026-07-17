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


//Функция для создания кнопок Reset и Apply
function addCustomButtons(instance) {
    if (instance.calendarContainer.querySelector('.flatpickr-custom-buttons')) {
        return;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flatpickr-custom-buttons';
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
        border-top: 1px solid #e5e5e5;
        background: #f9f9f9;
        border-radius: 0 0 12px 12px;
    `;

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.type = 'button';
    resetButton.className = 'flatpickr-reset-btn';
    resetButton.style.cssText = `
        padding: 8px 20px;
        background: transparent;
        border: none;
        color: #666;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: color 0.2s;
    `;
    resetButton.onmouseover = function() {
        this.style.color = '#333';
    };
    resetButton.onmouseout = function() {
        this.style.color = '#666';
    };
    
    resetButton.addEventListener('click', function(e) {
        e.stopPropagation();
        instance.clear();
        instance.close();
        
        // Очищаем оба поля
        const departInput = document.getElementById("depart");
        const returnInput = document.getElementById("return");
        if (departInput) departInput.value = '';
        if (returnInput) returnInput.value = '';
    });

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.type = 'button';
    applyButton.className = 'flatpickr-apply-btn';
    applyButton.style.cssText = `
        padding: 8px 30px;
        background: #4CAF50;
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.2s;
    `;
    applyButton.onmouseover = function() {
        this.style.background = '#45a049';
    };
    applyButton.onmouseout = function() {
        this.style.background = '#4CAF50';
    };
    
    applyButton.addEventListener('click', function(e) {
        e.stopPropagation();
        instance.close();
    });

    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(applyButton);
    
    const daysContainer = instance.calendarContainer.querySelector('.flatpickr-days');
    if (daysContainer) {
        daysContainer.parentNode.insertBefore(buttonContainer, daysContainer.nextSibling);
    } else {
        instance.calendarContainer.appendChild(buttonContainer);
    }
}

//Функция для обновления полей при выборе диапазона
function updateDateFields(selectedDates, dateStr, instance) {
    const departInput = document.getElementById("depart");
    const returnInput = document.getElementById("return");
    const roundTripRadio = document.getElementById('round-trip');
    const oneWayRadio = document.getElementById('one-way');
    
    if (selectedDates.length === 0) {
        // Если ничего не выбрано
        if (departInput) departInput.value = '';
        if (returnInput) returnInput.value = '';
        return;
    }
    
    if (selectedDates.length === 1) {
        // Если выбрана только одна дата (Depart)
        const date = selectedDates[0];
        const formattedDate = formatDate(date);
        
        if (departInput) {
            departInput.value = formattedDate;
            // Устанавливаем атрибут для flatpickr
            if (departInput._flatpickr) {
                departInput._flatpickr.setDate(date, false);
            }
        }
        
        // Если выбран One Way или Round Trip, но вторая дата не выбрана
        if (returnInput && oneWayRadio && oneWayRadio.checked) {
            returnInput.value = '';
            if (returnInput._flatpickr) {
                returnInput._flatpickr.clear();
            }
        }
        
        return;
    }
    
    if (selectedDates.length === 2) {
        // Если выбраны две даты (Depart и Return)
        const startDate = selectedDates[0];
        const endDate = selectedDates[1];
        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);
        
        // Проверяем, выбран ли Round Trip
        if (roundTripRadio && roundTripRadio.checked) {
            if (departInput) {
                departInput.value = formattedStart;
                if (departInput._flatpickr) {
                    departInput._flatpickr.setDate(startDate, false);
                }
            }
            
            if (returnInput) {
                returnInput.value = formattedEnd;
                if (returnInput._flatpickr) {
                    returnInput._flatpickr.setDate(endDate, false);
                    // Обновляем минимальную дату для return
                    returnInput._flatpickr.set('minDate', startDate);
                }
            }
        } else {
            // Если One Way, используем только первую дату
            if (departInput) {
                departInput.value = formattedStart;
                if (departInput._flatpickr) {
                    departInput._flatpickr.setDate(startDate, false);
                }
            }
            if (returnInput) {
                returnInput.value = '';
                if (returnInput._flatpickr) {
                    returnInput._flatpickr.clear();
                }
            }
        }
    }
}

//Функция форматирования даты
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

//Функция для переключения режимов (One Way / Round Trip)
function toggleTripMode() {
    const departInput = document.getElementById("depart");
    const returnInput = document.getElementById("return");
    const roundTripRadio = document.getElementById('round-trip');
    const oneWayRadio = document.getElementById('one-way');
    const returnField = document.querySelector('.inputs-group:last-child');
    
    if (roundTripRadio && roundTripRadio.checked) {
        // Round Trip - показываем поле Return
        if (returnField) returnField.style.display = 'flex';
        
        // Если есть диапазон в календаре, обновляем поля
        if (window.rangePicker && window.rangePicker.selectedDates.length === 2) {
            const dates = window.rangePicker.selectedDates;
            if (departInput) {
                departInput.value = formatDate(dates[0]);
                if (departInput._flatpickr) {
                    departInput._flatpickr.setDate(dates[0], false);
                }
            }
            if (returnInput) {
                returnInput.value = formatDate(dates[1]);
                if (returnInput._flatpickr) {
                    returnInput._flatpickr.setDate(dates[1], false);
                    returnInput._flatpickr.set('minDate', dates[0]);
                }
            }
        }
    } else if (oneWayRadio && oneWayRadio.checked) {
        // One Way - скрываем поле Return
        if (returnField) returnField.style.display = 'none';
        
        // Очищаем поле Return
        if (returnInput) {
            returnInput.value = '';
            if (returnInput._flatpickr) {
                returnInput._flatpickr.clear();
            }
        }
        
        // Если в календаре выбраны две даты, используем только первую
        if (window.rangePicker && window.rangePicker.selectedDates.length > 0) {
            const firstDate = window.rangePicker.selectedDates[0];
            if (departInput) {
                departInput.value = formatDate(firstDate);
                if (departInput._flatpickr) {
                    departInput._flatpickr.setDate(firstDate, false);
                }
            }
        }
    }
}

//Накидывание обработчиков событий при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    // === Обработчики для счетчика людей ===
    let incrementButton = document.getElementById("incrementCounterButton");
    if (incrementButton) {
        incrementButton.addEventListener("click", incrementPeopleCounter);
    }
    
    let decrementButton = document.getElementById("decrementCounterButton");
    if (decrementButton) {
        decrementButton.addEventListener("click", decrementPeopleCounter);
    }
    
    // === Инициализация Flatpickr с режимом диапазона ===
    const departInput = document.getElementById("depart");
    const returnInput = document.getElementById("return");
    
    // Создаем один календарь для выбора диапазона
    if (departInput) {
        window.rangePicker = flatpickr("#depart", {
            mode: "range", // Включаем режим выбора диапазона
            dateFormat: "d.m.Y",
            minDate: "today",
            disableMobile: true,
            allowInput: false,
            // Максимум 2 даты в диапазоне
            maxDate: null,
            // Обработчик выбора дат
            onChange: function(selectedDates, dateStr, instance) {
                updateDateFields(selectedDates, dateStr, instance);
            },
            onReady: function(selectedDates, dateStr, instance) {
                addCustomButtons(instance);
                instance.calendarContainer.classList.add('flatpickr-mobile');
                
                // Если уже есть данные в полях, синхронизируем календарь
                if (departInput.value && returnInput.value && document.getElementById('round-trip').checked) {
                    const startDate = parseDate(departInput.value);
                    const endDate = parseDate(returnInput.value);
                    if (startDate && endDate) {
                        instance.setDate([startDate, endDate], false);
                    }
                } else if (departInput.value) {
                    const startDate = parseDate(departInput.value);
                    if (startDate) {
                        instance.setDate(startDate, false);
                    }
                }
            },
            onOpen: function(selectedDates, dateStr, instance) {
                if (window.innerWidth <= 768) {
                    instance.calendarContainer.classList.add('flatpickr-mobile-open');
                }
            }
        });
        
        // Сохраняем ссылку на календарь в глобальной переменной
        window.rangePicker = departInput._flatpickr;
    }
    
    // Настраиваем второе поле только для отображения, без календаря
    if (returnInput) {
        // Просто добавляем обработчик для синхронизации
        returnInput.addEventListener('focus', function() {
            if (window.rangePicker) {
                window.rangePicker.open();
            }
        });
        
        // Запрещаем ручной ввод
        returnInput.readOnly = true;
    }
    
    // Делаем поле Depart тоже readOnly
    if (departInput) {
        departInput.readOnly = true;
    }
    
    // === Управление видимостью поля Return ===
    const roundTripRadio = document.getElementById('round-trip');
    const oneWayRadio = document.getElementById('one-way');
    
    if (roundTripRadio && oneWayRadio) {
        roundTripRadio.addEventListener('change', function() {
            toggleTripMode();
        });
        
        oneWayRadio.addEventListener('change', function() {
            toggleTripMode();
        });
        
        // Инициализируем состояние при загрузке
        toggleTripMode();
    }
    
    // === FAQ: изменение + на - ===
    document.querySelectorAll('.FAQs details').forEach(detail => {
        detail.addEventListener('toggle', function() {
            const icon = this.querySelector('.FAQ-element-icon');
            if (icon) {
                icon.textContent = this.open ? '-' : '+';
            }
        });
    });
    
    // === Бургер меню ===
    const navMenu = document.querySelector('.navigation_menu');
    const menuIcon = document.querySelector('.menu_icon');
    
    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            navMenu.classList.toggle('menu_active');
        });
        
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnMenuIcon = menuIcon.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnMenuIcon && navMenu.classList.contains('menu_active')) {
                navMenu.classList.remove('menu_active');
            }
        });
    }
});

// Вспомогательная функция для парсинга даты из строки
function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
}