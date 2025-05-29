document.addEventListener('DOMContentLoaded', function() {
    // Navigasi menu responsif
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    navToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // Slideshow logic (Hanya di index.html, jadi cek dulu elemennya ada atau tidak)
    let slideIndex = 1;
    let autoSlideTimer;
    const slideshowContainer = document.querySelector('.slideshow-container');

    if (slideshowContainer) {
        showSlides(slideIndex);
        startAutoSlides();

        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("mySlides");

            if (n > slides.length) { slideIndex = 1 }
            if (n < 1) { slideIndex = slides.length }

            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[slideIndex - 1].style.display = "block";
        }

        function startAutoSlides() {
            autoSlideTimer = setInterval(function() {
                slideIndex++;
                showSlides(slideIndex);
            }, 5000); // Interval 5 detik
        }

        function stopAutoSlides() {
            clearInterval(autoSlideTimer);
        }

        // Auto-advance tetap pause/resume on hover
        slideshowContainer.addEventListener('mouseover', stopAutoSlides);
        slideshowContainer.addEventListener('mouseout', startAutoSlides);

        // Klik di mana saja pada slideshow untuk maju ke slide berikutnya
        slideshowContainer.addEventListener('click', function() {
            stopAutoSlides();
            slideIndex++;
            showSlides(slideIndex);
            startAutoSlides();
        });
    }


    // Logic untuk Order Top Up / Joki
    const orderButtons = document.querySelectorAll('.order-btn');
    // Hapus jokiOrderCards karena kita tidak lagi menggunakan klik pada kartu joki
    // const jokiOrderCards = document.querySelectorAll('.order-joki-card');

    // Fungsi handler umum untuk proses order (diadaptasi untuk hanya tombol)
    // Sekarang hanya menerima event.target (tombol)
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gamePrefix = this.dataset.gamePrefix;
            const adminWaNumber = this.dataset.adminWhatsapp;

            const userIdInput = document.getElementById(`${gamePrefix}-user-id`);
            const serverIdInput = document.getElementById(`${gamePrefix}-server-id`);
            // selectedPackage akan selalu diambil dari radio button
            const selectedPackage = document.querySelector(`input[name="${gamePrefix}_nominal"]:checked`) ||
                                    document.querySelector(`input[name="${gamePrefix}_package"]:checked`);
            const selectedPayment = document.querySelector(`input[name="${gamePrefix}_payment"]:checked`);
            const errorMessageElement = document.getElementById(`${gamePrefix}-error-message`);

            // Reset error message
            errorMessageElement.textContent = '';

            // Validasi input
            if (!userIdInput.value.trim()) {
                errorMessageElement.textContent = 'Silakan masukkan ID Pengguna (atau Nick) Anda.';
                return;
            }
            if (serverIdInput && !serverIdInput.value.trim()) {
                errorMessageElement.textContent = 'Silakan masukkan ID Server Anda.';
                return;
            }
            if (!selectedPackage) {
                errorMessageElement.textContent = 'Silakan pilih nominal/paket.';
                return;
            }
            if (!selectedPayment) {
                errorMessageElement.textContent = 'Silakan pilih metode pembayaran.';
                return;
            }

            const gameName = this.closest('.order-form').dataset.game;
            const userId = userIdInput.value.trim();
            const serverId = serverIdInput ? serverIdInput.value.trim() : '';
            const packageName = selectedPackage.value;
            const paymentMethod = selectedPayment.value;

            // Buat pesan WhatsApp
            let message = `Halo Admin Lapak Top Up & Joki!\n\n`;
            message += `Saya ingin order:\n`;
            message += `🎮 Game: ${gameName}\n`;
            message += `🆔 ID Pengguna: ${userId}`;
            if (serverId) {
                message += ` (Server ID: ${serverId})`;
            }
            message += `\n`;
            message += `📦 Nominal/Paket: ${packageName}\n`;
            message += `💳 Metode Pembayaran: ${paymentMethod}\n\n`; // Metode pembayaran selalu ada untuk semua order sekarang
            message += `Mohon konfirmasi ID saya dan informasikan detail pembayaran ya. Terima kasih!`;
            message += `\n\n(Mohon pastikan ID yang Anda masukkan sudah benar. Kesalahan ID bukan tanggung jawab kami setelah top up/joki diproses.)`;


            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${adminWaNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    });

    // Hapus event listener untuk kartu order Joki yang lama
    // jokiOrderCards.forEach(card => {
    //     card.addEventListener('click', function(event) {
    //         event.preventDefault();
    //         handleOrder(this);
    //     });
    // });
});