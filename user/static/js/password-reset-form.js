document.addEventListener('DOMContentLoaded', () => {
    // Получаем токен из URL страницы (внутри iframe)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    console.log('[password-reset-form] Токен з URL:', tokenFromUrl);
    
    // Устанавливаем токен в hidden input
    const tokenInput = document.querySelector('input[name="token"]');
    if (tokenInput && tokenFromUrl) {
        tokenInput.value = tokenFromUrl;
        console.log('[password-reset-form] Токен установлено в форму:', tokenInput.value);
    }

    const savePasswordBtn = document.getElementById('save_password');
    const newPasswordForm = document.querySelector('.new-password form');
    const newPasswordInput = document.querySelector('input[name="new_password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_new_password"]');

    if (savePasswordBtn && newPasswordForm) {
        savePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const token = document.querySelector('input[name="token"]')?.value;
            const newPassword = newPasswordInput?.value;
            const confirmPassword = confirmPasswordInput?.value;

            console.log('[password-reset-form] Дані форми:', {
                token: token ? '***' : 'немає',
                newPassword: newPassword ? 'заповнено' : 'порожньо',
                confirmPassword: confirmPassword ? 'заповнено' : 'порожньо'
            });

            // Перевіряємо, що поля заповнено
            if (!newPassword || !confirmPassword) {
                alert('Будь ласка, заповніть обидва поля паролю');
                return;
            }

            // Перевіряємо, що паролі збігаються
            if (newPassword !== confirmPassword) {
                alert('Паролі не збігаються! Будь ласка, перевірте введені паролі.');
                confirmPasswordInput.value = '';
                newPasswordInput.focus();
                return;
            }

            // Перевіряємо, що пароль не порожній
            if (newPassword.length < 3) {
                alert('Пароль повинен мати мінімум 3 символи');
                newPasswordInput.focus();
                return;
            }

            if (!token) {
                console.error('[password-reset-form] Токен не знайдено!');
                alert('Помилка: токен не знайдено. Спробуйте ще раз перейти за посиланням з листа.');
                return;
            }

            // Будуємо FormData з токеном
            const formData = new FormData();
            formData.append('token', token);
            formData.append('new_password', newPassword);
            formData.append('confirm_new_password', confirmPassword);
            formData.append('form_identity', 'save-new-password');

            console.log('[password-reset-form] Відправляю POST запрос на /forgot-password');

            // Отправляем POST запрос
            fetch('/forgot-password', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('[password-reset-form] Ответ статус:', response.status);
                if (response.ok) {
                    console.log('[password-reset-form] Пароль успішно оновлено!');
                    alert('Пароль успішно змінено!');
                    // Закрываем модалку, отправляя сообщение родительскому окну
                    window.parent.postMessage({ type: "close-user" }, "*");
                    // Перенаправляем на главную страницу
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    console.error('[password-reset-form] Ошибка при сохранении пароля, статус:', response.status);
                    return response.text().then(text => {
                        console.error('[password-reset-form] Ответ сервера:', text);
                        alert('Помилка: не вдалося зберегти пароль. ' + text);
                    });
                }
            })
            .catch(error => {
                console.error('[password-reset-form] Ошибка сети:', error);
                alert('Помилка при відправці запиту: ' + error.message);
            });
        });
    } else {
        console.log('[password-reset-form] savePasswordBtn:', savePasswordBtn);
        console.log('[password-reset-form] newPasswordForm:', newPasswordForm);
    }
});
