/* ============================
   МОДАЛЬНОЕ ОКНО ЗАЯВКИ
   ============================ */
var modal = document.getElementById('modalWindow');
var callbackForm = document.getElementById('callbackForm');
var successMessage = document.getElementById('successMessage');
var errorMessage = document.getElementById('errorMessage');
var submitBtn = document.getElementById('submitBtn');
var btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
var btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;
var userNameInput = document.getElementById('userName');
var userPhoneInput = document.getElementById('userPhone');
var userEmailInput = document.getElementById('userEmail');
var userQuestionInput = document.getElementById('userQuestion');

function openModal() {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        setTimeout(resetForm, 300);
    }
}

function resetForm() {
    if (!callbackForm) return;
    callbackForm.style.display = 'block';
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    callbackForm.reset();
    if (userNameInput) userNameInput.classList.remove('input-error');
    if (userPhoneInput) userPhoneInput.classList.remove('input-error');
    if (userEmailInput) userEmailInput.classList.remove('input-error');
    if (userQuestionInput) userQuestionInput.classList.remove('input-error');
    if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
    }
}

window.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (modal && modal.style.display === 'block') closeModal();
        var certModal = document.getElementById('certModal');
        if (certModal && certModal.classList.contains('active')) closeCertModal();
    }
});

/* ============================
   МАСКА ТЕЛЕФОНА
   ============================ */
if (userPhoneInput) {
    userPhoneInput.addEventListener('input', function (e) {
        var value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('8')) {
            value = '7' + value.substring(1);
        }

        if (value.length === 0) {
            e.target.value = '';
            return;
        }

        var formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.substring(1, 4);
        if (value.length >= 4) formatted += ') ' + value.substring(4, 7);
        if (value.length >= 7) formatted += '-' + value.substring(7, 9);
        if (value.length >= 9) formatted += '-' + value.substring(9, 11);

        e.target.value = formatted;
    });

    userPhoneInput.addEventListener('focus', function () {
        if (this.value === '') this.value = '+7';
    });

    userPhoneInput.addEventListener('blur', function () {
        if (this.value === '+7') this.value = '';
    });
}

/* ============================
   ВАЛИДАЦИЯ
   ============================ */
function validateForm() {
    var isValid = true;

    if (userNameInput) {
        var name = userNameInput.value.trim();
        if (name.length < 2) {
            userNameInput.classList.add('input-error');
            userNameInput.placeholder = 'Введите ваше имя';
            isValid = false;
        } else {
            userNameInput.classList.remove('input-error');
        }
    }

    if (userPhoneInput) {
        var phoneDigits = userPhoneInput.value.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            userPhoneInput.classList.add('input-error');
            userPhoneInput.placeholder = 'Введите номер полностью';
            isValid = false;
        } else {
            userPhoneInput.classList.remove('input-error');
        }
    }

    if (userEmailInput && userEmailInput.value.trim() !== '') {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userEmailInput.value.trim())) {
            userEmailInput.classList.add('input-error');
            isValid = false;
        } else {
            userEmailInput.classList.remove('input-error');
        }
    }

    return isValid;
}

/* ============================
   ОТПРАВКА ФОРМЫ
   ============================ */
var YOUR_EMAIL = 'platon.kapa@gmail.com';

if (callbackForm) {
    callbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline';

        var formData = new FormData();
        formData.append('name', userNameInput ? userNameInput.value.trim() : '');
        formData.append('phone', userPhoneInput ? userPhoneInput.value.trim() : '');
        formData.append('email', userEmailInput ? userEmailInput.value.trim() : 'Не указан');
        formData.append('message', userQuestionInput ? userQuestionInput.value.trim() : 'Без вопроса');
        formData.append('_subject', '🔔 Новая заявка с сайта ОЛИМП ГРУПП');
        formData.append('_captcha', 'false');
        formData.append('_template', 'box');

        fetch('https://formsubmit.co/ajax/' + YOUR_EMAIL, {
            method: 'POST',
            body: formData
        })
        .then(function (response) {
            // Считаем успехом любой HTTP 200
            if (response.ok) {
                callbackForm.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';
                if (errorMessage) errorMessage.style.display = 'none';
                setTimeout(closeModal, 4000);
            } else {
                throw new Error('HTTP ' + response.status);
            }
        })
        .catch(function (err) {
            console.error('Ошибка:', err);
            callbackForm.style.display = 'none';
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'block';
        })
        .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
        });
    });
}

/* ============================
   УНИВЕРСАЛЬНЫЙ СЛАЙДЕР
   ============================ */
/* ============================
   УНИВЕРСАЛЬНЫЙ СЛАЙДЕР (Обновленный)
   ============================ */
function initSlider(trackId, leftBtnId, rightBtnId) {
    var track = document.getElementById(trackId);
    var btnLeft = document.getElementById(leftBtnId);
    var btnRight = document.getElementById(rightBtnId);

    if (!track || !btnLeft || !btnRight) return;

    var slides = track.children;
    if (slides.length === 0) return;

    var currentSlideIndex = 0; // Используем индекс вместо пикселей для точности

    function updateTrack() {
        // Получаем ширину первого слайда (она может меняться на мобилке/десктопе)
        var slideWidth = slides[0].getBoundingClientRect().width;
        
        // Получаем отступ (gap) из стилей
        var style = window.getComputedStyle(track);
        var gap = parseFloat(style.gap) || 0;
        
        // Вычисляем шаг смещения
        var step = slideWidth + gap;
        
        // Смещаем трек
        track.style.transform = 'translateX(-' + (currentSlideIndex * step) + 'px)';
        
        // Управление прозрачностью кнопок (опционально)
        btnLeft.style.opacity = currentSlideIndex === 0 ? '0.5' : '1';
        btnLeft.style.pointerEvents = currentSlideIndex === 0 ? 'none' : 'auto';
        
        // Проверка конца слайдера зависит от видимых слайдов
        // Упрощенно считаем, что можно листать до последнего элемента
        var maxIndex = slides.length - 1;
        // Если на экране видно несколько слайдов (десктоп), корректируем maxIndex
        var trackWidth = track.parentElement.offsetWidth;
        var visibleSlides = Math.floor(trackWidth / slideWidth);
        if (visibleSlides > 1) {
            maxIndex = slides.length - visibleSlides;
        }

        btnRight.style.opacity = currentSlideIndex >= maxIndex ? '0.5' : '1';
        btnRight.style.pointerEvents = currentSlideIndex >= maxIndex ? 'none' : 'auto';
    }

    btnRight.addEventListener('click', function () {
        // Проверка на максимум
        var slideWidth = slides[0].getBoundingClientRect().width;
        var trackWidth = track.parentElement.offsetWidth;
        var visibleSlides = Math.max(1, Math.floor(trackWidth / slideWidth));
        
        if (currentSlideIndex < slides.length - visibleSlides) {
            currentSlideIndex++;
            updateTrack();
        }
    });

    btnLeft.addEventListener('click', function () {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateTrack();
        }
    });

    // Пересчет при изменении размера окна
    window.addEventListener('resize', function () {
        // Сбрасываем или корректируем позицию, чтобы не сбилось
        updateTrack();
    });

    // Инициализация (запуск один раз при загрузке)
    setTimeout(updateTrack, 100); // Небольшая задержка, чтобы стили применились

    // --- СВАЙПЫ ДЛЯ МОБИЛЬНЫХ ---
    var touchStartX = 0;
    var touchEndX = 0;

    track.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // Если свайпнули больше чем на 50px
            if (diff > 0) {
                // Свайп влево -> следующий слайд
                btnRight.click();
            } else {
                // Свайп вправо -> предыдущий слайд
                btnLeft.click();
            }
        }
    }
}

// Инициализация обоих слайдеров
initSlider('sliderTrack', 'sliderLeft', 'sliderRight');
initSlider('trustTrack', 'trustLeft', 'trustRight');

/* ============================
   МОДАЛКА СЕРТИФИКАТА (PDF)
   ============================ */
function viewCert(btn) {
    var card = btn.closest('.cert-card');
    if (!card) return;

    var src = card.getAttribute('data-src');
    if (!src) return;

    window.open(src, '_blank');
}


/* ============================
   БУРГЕР-МЕНЮ
   ============================ */
(function () {
    var burgerBtn = document.getElementById('burgerBtn');
    var nav = document.getElementById('mainNav');

    if (!burgerBtn || !nav) return;

    burgerBtn.addEventListener('click', function () {
        nav.classList.toggle('active');
    });

    var navLinks = nav.querySelectorAll('a');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function () {
            nav.classList.remove('active');
        });
    }
})();