window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('action') === 'agreement-reset-password') {
        console.log("agreement-reset-password parameter detected, opening modal");

        const userModal = document.getElementById('user-modal');
        const userFrame = document.getElementById('user-frame');
        if (userModal) {
            userModal.classList.add('active');
        }


        if (userFrame) {
            userFrame.style.display = 'block';

            userFrame.src = '/forgot-password?action=agreement-reset-password';
        }
        
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});