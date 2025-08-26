        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarLinks = document.querySelector('.navbar-links');
        navbarToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
        });

        // --- SCRIPT SELECTORS ---
        const shortenBtn = document.getElementById('shorten-btn');
        const linkInput = document.getElementById('linkinput');
        const slugInput = document.getElementById('sluginput');
        const successPopup = document.getElementById('success-popup');
        const popupLinkInput = document.getElementById('popup-link');
        const copyBtn = document.getElementById('copy-btn');
        const errorPopup = document.getElementById('error-popup');
        const errorMessageP = document.getElementById('error-message');
        const slugHelpTrigger = document.getElementById('slug-help-trigger');
        const slugHelpPopup = document.getElementById('slug-help-popup');
        const pasteBtn = document.getElementById('paste-btn');

        // --- POPUP FUNCTIONS ---
        function showPopup(popupElement) {
            popupElement.classList.add('show');
        }
        function closePopup(popupElement) {
            popupElement.classList.remove('show');
        }
        function showSuccessPopup(shortURL) {
            popupLinkInput.value = shortURL;
            copyBtn.innerText = 'Salin';
            showPopup(successPopup);
        }
        function showErrorPopup(message) {
            errorMessageP.textContent = message;
            showPopup(errorPopup);
        }
        
        // --- EVENT LISTENERS ---
        slugHelpTrigger.addEventListener('click', () => {
            showPopup(slugHelpPopup);
        });
        pasteBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard.readText()
                    .then(text => {
                        linkInput.value = text;
                    })
                    .catch(err => {
                        console.error('Gagal membaca clipboard: ', err);
                        alert('Tidak dapat menempelkan teks. Pastikan Anda telah memberikan izin.');
                    });
            } else {
                alert('Browser Anda tidak mendukung fitur ini.');
            }
        });
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                closePopup(document.getElementById(btn.dataset.target));
            });
        });
        document.querySelectorAll('.popup-overlay').forEach(overlay => {
             overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    closePopup(overlay);
                }
            });
        });
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(popupLinkInput.value).then(() => {
                copyBtn.innerText = 'Disalin!';
            }).catch(err => console.error('Gagal menyalin: ', err));
        });
        shortenBtn.addEventListener('click', () => {
            const link = linkInput.value;
            const slug = slugInput.value;
            if (!link) {
                showErrorPopup("Harap masukkan URL terlebih dahulu.");
                return;
            }
            shortenBtn.classList.add('loading');
            shortenBtn.disabled = true;
            const data = {
                "domain": "click.pentabyte.vip",
                "originalURL": link
            };
            if (slug) { data.path = slug; }
            fetch('https://api.short.cm/links/public', {
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'pk_iCiKTfIpe3GeOoik'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                showSuccessPopup(data.shortURL);
                try {
                    const history = JSON.parse(localStorage.getItem('linkHistory')) || [];
                    const newLink = {
                        original: link,
                        short: data.shortURL,
                        date: new Date().toLocaleDateString('id-ID')
                    };
                    history.unshift(newLink);
                    localStorage.setItem('linkHistory', JSON.stringify(history));
                } catch (e) {
                    console.error("Gagal menyimpan riwayat", e);
                }
                linkInput.value = '';
                slugInput.value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                let errorMessage = "Terjadi kesalahan. Pastikan API Key dan Domain sudah benar.";
                if (error.message && error.message.toLowerCase().includes("path")) {
                    errorMessage = `Gagal! Slug '${slug}' sepertinya sudah digunakan. Coba lagi yang lain.`;
                }
                showErrorPopup(errorMessage);
            })
            .finally(() => {
                shortenBtn.classList.remove('loading');
                shortenBtn.disabled = false;
            });
        });