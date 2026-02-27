/* ============================
   МОДАЛЬНОЕ ОКНО
   ============================ */
const modal = document.getElementById('modalWindow');
const callbackForm = document.getElementById('callbackForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const userNameInput = document.getElementById('userName');
const userPhoneInput = document.getElementById('userPhone');

function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // Сбросить форму через секунду после закрытия
    setTimeout(resetForm, 300);
}

function resetForm() {
    callbackForm.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    callbackForm.reset();
    userNameInput.classList.remove('input-error');
    userPhoneInput.classList.remove('input-error');
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
}

window.addEventListener('click', function (e) {
    if (e.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

/* ============================
   МАСКА ТЕЛЕФОНА
   ============================ */
userPhoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // только цифры

    // Если начинается с 8, заменяем на 7
    if (value.startsWith('8')) {
        value = '7' + value.substring(1);
    }

    // Если пусто, не форматируем
    if (value.length === 0) {
        e.target.value = '';
        return;
    }

    // Форматируем: +7 (XXX) XXX-XX-XX
    let formatted = '+7';
    if (value.length > 1) {
        formatted += ' (' + value.substring(1, 4);
    }
    if (value.length >= 4) {
        formatted += ') ' + value.substring(4, 7);
    }
    if (value.length >= 7) {
        formatted += '-' + value.substring(7, 9);
    }
    if (value.length >= 9) {
        formatted += '-' + value.substring(9, 11);
    }

    e.target.value = formatted;
});

// При фокусе, если пусто, подставляем +7
userPhoneInput.addEventListener('focus', function () {
    if (this.value === '') {
        this.value = '+7';
    }
});

/* ============================
   ВАЛИДАЦИЯ
   ============================ */
function validateForm() {
    let isValid = true;

    // Имя: минимум 2 символа
    const name = userNameInput.value.trim();
    if (name.length < 2) {
        userNameInput.classList.add('input-error');
        userNameInput.placeholder = 'Введите ваше имя';
        isValid = false;
    } else {
        userNameInput.classList.remove('input-error');
    }

    // Телефон: 11 цифр (с семёркой)
    const phoneDigits = userPhoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
        userPhoneInput.classList.add('input-error');
        userPhoneInput.placeholder = 'Введите номер полностью';
        isValid = false;
    } else {
        userPhoneInput.classList.remove('input-error');
    }

    return isValid;
}

/* ============================
   ОТПРАВКА ФОРМЫ
   ============================ */
callbackForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Валидация
    if (!validateForm()) return;

    // Показываем загрузку
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    // Собираем данные
    const formData = new FormData();
    formData.append('name', userNameInput.value.trim());
    formData.append('phone', userPhoneInput.value.trim());

    // Отправляем на PHP-обработчик
    fetch('send-mail.php', {
        method: 'POST',
        body: formData
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data.success) {
            // Успех — показываем сообщение
            callbackForm.style.display = 'none';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Автозакрытие через 4 секунды
            setTimeout(closeModal, 4000);
        } else {
            throw new Error(data.message || 'Ошибка сервера');
        }
    })
    .catch(function (err) {
        console.error('Ошибка отправки:', err);
        callbackForm.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'block';
    })
    .finally(function () {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    });
});

/* ============================
   СЛАЙДЕР ПАРТНЁРОВ
   ============================ */
(function () {
    const track = document.getElementById('sliderTrack');
    const btnLeft = document.getElementById('sliderLeft');
    const btnRight = document.getElementById('sliderRight');

    if (!track || !btnLeft || !btnRight) return;

    const slides = track.querySelectorAll('.partner-slide');
    if (slides.length === 0) return;

    let currentOffset = 0;

    function getSlideStep() {
        var slide = slides[0];
        var style = window.getComputedStyle(track);
        var gap = parseInt(style.gap) || 25;
        return slide.offsetWidth + gap;
    }

    function getViewportWidth() {
        return track.parentElement.offsetWidth;
    }

    function getMaxOffset() {
        var gap = parseInt(window.getComputedStyle(track).gap) || 25;
        var totalWidth = slides.length * getSlideStep() - gap;
        var viewportWidth = getViewportWidth();
        return Math.max(0, totalWidth - viewportWidth);
    }

    function updateTrack() {
        track.style.transform = 'translateX(-' + currentOffset + 'px)';
    }

    btnRight.addEventListener('click', function () {
        var step = getSlideStep();
        var maxOffset = getMaxOffset();
        currentOffset = Math.min(currentOffset + step, maxOffset);
        updateTrack();
    });

    btnLeft.addEventListener('click', function () {
        var step = getSlideStep();
        currentOffset = Math.max(currentOffset - step, 0);
        updateTrack();
    });

    window.addEventListener('resize', function () {
        currentOffset = Math.min(currentOffset, getMaxOffset());
        updateTrack();
    });

    // Свайпы
    var touchStartX = 0;

    track.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
        var touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                btnRight.click();
            } else {
                btnLeft.click();
            }
        }
    }, { passive: true });
})();