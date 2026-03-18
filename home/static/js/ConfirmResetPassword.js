window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const token = urlParams.get('token');

    if (action === 'agreement-reset-password') {
        const userModal = document.getElementById('user-modal');
        const userFrame = document.getElementById('user-frame');
        const backgroundModal = document.querySelector('.background-modal');

        if (userModal) {
            userModal.classList.add('active');
            userModal.classList.add('new-password'); 
        }

        if (backgroundModal) {
            backgroundModal.style.display = 'block';
        }

        if (userFrame) {
            userFrame.style.display = 'block';
            let iframeUrl = '/forgot-password?action=agreement-reset-password';
            if (token) {
                iframeUrl += `&token=${token}`;
            }
            userFrame.src = iframeUrl;

            userFrame.onload = () => {
                setTimeout(() => {
                    userModal.className = 'active new-password';
                   // console.log("Статус new-password встановлено для форми");
                }, 100);
            };
        }

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
});