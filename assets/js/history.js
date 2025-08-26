        document.addEventListener('DOMContentLoaded', () => {
            const historyBody = document.getElementById('history-body');
            const noHistoryMsg = document.getElementById('no-history-msg');
            const clearHistoryBtn = document.getElementById('clear-history-btn');
            
            const confirmPopup = document.getElementById('confirm-popup');
            const successPopup = document.getElementById('success-popup');
            const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

            function showPopup(popupElement) {
                popupElement.classList.add('show');
            }

            function closePopup(popupElement) {
                popupElement.classList.remove('show');
            }

            document.querySelectorAll('.popup-btn.cancel, .popup-overlay').forEach(el => {
                el.addEventListener('click', (event) => {
                    if (event.target !== event.currentTarget && event.target.tagName !== 'BUTTON') return;
                    const targetId = el.dataset.target || (event.target === el ? el.id : null);
                    if(targetId) {
                        closePopup(document.getElementById(targetId));
                    }
                });
            });

            function loadHistory() {
                historyBody.innerHTML = ''; 
                const history = JSON.parse(localStorage.getItem('linkHistory')) || [];

                if (history.length === 0) {
                    noHistoryMsg.style.display = 'block';
                    clearHistoryBtn.style.display = 'none';
                } else {
                    noHistoryMsg.style.display = 'none';
                    clearHistoryBtn.style.display = 'inline-block';
                    history.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.original}</td>
                            <td><a href="${item.short}" target="_blank" class="short-url">${item.short}</a></td>
                            <td>${item.date}</td>
                        `;
                        historyBody.appendChild(row);
                    });
                }
            }

            clearHistoryBtn.addEventListener('click', () => {
                showPopup(confirmPopup);
            });

            confirmDeleteBtn.addEventListener('click', () => {
                localStorage.removeItem('linkHistory');
                loadHistory(); 
                closePopup(confirmPopup);
                showPopup(successPopup);
            });

            loadHistory();
        });