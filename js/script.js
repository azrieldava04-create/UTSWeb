/**
 * ===================================================================
 * TOKO BUKU ONLINE - LOGIKA JAVASCRIPT UTAMA (UTS PEMROGRAMAN WEB 1)
 * Berisi: Manipulasi DOM, Validasi Form, Interaksi Modal & Alert,
 * Greeting Dinamis Berdasarkan Waktu, Kalkulasi Checkout, dan Tracking.
 * ===================================================================
 */

// -------------------------------------------------------------------
// 1. HELPER DATA ACCESS (LOCALSTORAGE & DUMMY FALLBACK)
// -------------------------------------------------------------------
function getPenggunaList() {
    var stored = localStorage.getItem("tb_pengguna");
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { }
    }
    return (typeof dataPengguna !== 'undefined') ? dataPengguna : [];
}

function savePenggunaList(list) {
    localStorage.setItem("tb_pengguna", JSON.stringify(list));
}

function getKatalogList() {
    var stored = localStorage.getItem("tb_katalog");
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { }
    }
    return (typeof dataKatalogBuku !== 'undefined') ? dataKatalogBuku : [];
}

function saveKatalogList(list) {
    localStorage.setItem("tb_katalog", JSON.stringify(list));
}

function getTrackingData() {
    var stored = localStorage.getItem("tb_tracking");
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { }
    }
    return (typeof dataTracking !== 'undefined') ? dataTracking : {};
}

function saveTrackingData(data) {
    localStorage.setItem("tb_tracking", JSON.stringify(data));
}

function getPesananList() {
    var stored = localStorage.getItem("tb_pesanan");
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { }
    }
    return (typeof dataPesananAwal !== 'undefined') ? dataPesananAwal : [];
}

function savePesananList(list) {
    localStorage.setItem("tb_pesanan", JSON.stringify(list));
}

function getLoggedInUser() {
    var userJson = sessionStorage.getItem("userLoggedIn");
    if (userJson) {
        try { return JSON.parse(userJson); } catch (e) { }
    }
    return null;
}

// -------------------------------------------------------------------
// 2. MODAL & POP-UP ALERT UTILITIES (DOM INTERACTION)
// -------------------------------------------------------------------
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

// Menutup modal jika pengguna mengklik area backdrop di luar box
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-overlay")) {
        e.target.classList.remove("active");
        document.body.style.overflow = "";
    }
});

// Pop-up Alert Kustom (Memenuhi spesifikasi UTS untuk pop-up/alert box)
function showAlert(message, type, callback) {
    type = type || "error"; // 'error', 'success', 'warning', 'info'
    var alertModal = document.getElementById("customAlertModal");
    if (!alertModal) {
        // Fallback jika modal belum di-render
        alert(message);
        if (typeof callback === "function") callback();
        return;
    }

    var iconEl = document.getElementById("alertIcon");
    var msgEl = document.getElementById("alertMessage");
    var btnOk = document.getElementById("alertBtnOk");

    if (msgEl) msgEl.textContent = message;

    if (iconEl) {
        iconEl.className = "alert-icon " + type;
        if (type === "error") {
            iconEl.innerHTML = "&#10060;"; // ❌
        } else if (type === "success") {
            iconEl.innerHTML = "&#10004;"; // ✔
        } else if (type === "warning") {
            iconEl.innerHTML = "&#9888;"; // ⚠
        } else {
            iconEl.innerHTML = "&#8505;"; // ℹ
        }
    }

    // Set handler tombol OK
    if (btnOk) {
        btnOk.onclick = function () {
            closeModal("customAlertModal");
            if (typeof callback === "function") callback();
        };
    }

    openModal("customAlertModal");
}

// Notifikasi Toast Mengambang
function showToast(message, type) {
    type = type || "info";
    var container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    var toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.innerHTML = "<span>" + message + "</span>";
    container.appendChild(toast);

    setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3200);
}

// -------------------------------------------------------------------
// 3. LOGIKA AUTENTIKASI & HALAMAN LOGIN (index.html)
// -------------------------------------------------------------------
function initLoginPage() {
    var loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    // Jika sudah login sebelumnya, bisa otomatis infokan atau arahkan
    var currentUser = getLoggedInUser();
    if (currentUser) {
        var notice = document.getElementById("loggedInNotice");
        if (notice) {
            notice.style.display = "block";
            notice.innerHTML = "Anda saat ini terdeteksi login sebagai <strong>" + currentUser.nama + "</strong> (" + currentUser.role + "). <a href='dashboard.html'>Masuk ke Dashboard &rarr;</a>";
        }
    }

    // Form Submit Event
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = document.getElementById("loginEmail").value.trim();
        var passwordInput = document.getElementById("loginPassword").value.trim();

        if (!emailInput || !passwordInput) {
            showAlert("email/password yang anda masukkan salah", "error");
            return;
        }

        var daftarPengguna = getPenggunaList();
        var matchUser = daftarPengguna.find(function (u) {
            return u.email.toLowerCase() === emailInput.toLowerCase() && u.password === passwordInput;
        });

        if (matchUser) {
            // Berhasil login: simpan ke session storage dan redirect
            sessionStorage.setItem("userLoggedIn", JSON.stringify(matchUser));
            showAlert("Login Berhasil! Selamat datang, " + matchUser.nama, "success", function () {
                window.location.href = "dashboard.html";
            });
        } else {
            // Sesuai spesifikasi soal: "email/password yang anda masukkan salah"
            showAlert("email/password yang anda masukkan salah", "error");
        }
    });

    // Form Lupa Password
    var forgotForm = document.getElementById("forgotPasswordForm");
    if (forgotForm) {
        forgotForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var forgotEmail = document.getElementById("forgotEmail").value.trim();
            var daftarPengguna = getPenggunaList();
            var user = daftarPengguna.find(function (u) {
                return u.email.toLowerCase() === forgotEmail.toLowerCase();
            });

            closeModal("forgotPasswordModal");
            if (user) {
                showAlert("Instruksi reset password dan kata sandi Anda adalah: '" + user.password + "' telah dikirimkan ke email " + forgotEmail, "info");
            } else {
                showAlert("Email tidak ditemukan dalam sistem database pengguna kami.", "warning");
            }
        });
    }

    // Form Pendaftaran Akun Baru
    var registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var regNama = document.getElementById("regNama").value.trim();
            var regEmail = document.getElementById("regEmail").value.trim();
            var regPassword = document.getElementById("regPassword").value.trim();
            var regRole = document.getElementById("regRole").value || "User";

            if (!regNama || !regEmail || !regPassword) {
                showAlert("Mohon lengkapi seluruh kolom isian pendaftaran!", "warning");
                return;
            }

            var daftarPengguna = getPenggunaList();
            var emailExists = daftarPengguna.some(function (u) {
                return u.email.toLowerCase() === regEmail.toLowerCase();
            });

            if (emailExists) {
                showAlert("Email tersebut sudah terdaftar! Silakan gunakan email lain atau login.", "warning");
                return;
            }

            var newUser = {
                id: Date.now(),
                nama: regNama,
                email: regEmail,
                password: regPassword,
                role: regRole
            };

            daftarPengguna.push(newUser);
            savePenggunaList(daftarPengguna);

            closeModal("registerModal");
            registerForm.reset();

            // Isi otomatis form login
            document.getElementById("loginEmail").value = newUser.email;
            document.getElementById("loginPassword").value = newUser.password;

            showAlert("Pendaftaran berhasil! Akun Anda telah tersimpan. Silakan klik tombol 'Login'.", "success");
        });
    }
}

// Fungsi bantu untuk penguji / dosen: Auto-fill akun demo
function fillDemoAccount(email, password) {
    var emailEl = document.getElementById("loginEmail");
    var passEl = document.getElementById("loginPassword");
    if (emailEl && passEl) {
        emailEl.value = email;
        passEl.value = password;
        showToast("Akun " + email + " terisi otomatis!", "info");
    }
}

// -------------------------------------------------------------------
// 4. LOGIKA DASHBOARD & GREETING WAKTU (dashboard.html)
// -------------------------------------------------------------------
function getGreetingByTime() {
    var now = new Date();
    var hours = now.getHours();

    // Berdasarkan waktu lokal perangkat:
    // Pagi: 04.00 - 10.59
    // Siang: 11.00 - 14.59
    // Sore: 15.00 - 17.59
    // Malam: 18.00 - 03.59
    if (hours >= 4 && hours < 11) {
        return { text: "Selamat Pagi", icon: "🌅", timeBadge: "Pagi" };
    } else if (hours >= 11 && hours < 15) {
        return { text: "Selamat Siang", icon: "☀️", timeBadge: "Siang" };
    } else if (hours >= 15 && hours < 18) {
        return { text: "Selamat Sore", icon: "🌇", timeBadge: "Sore" };
    } else {
        return { text: "Selamat Malam", icon: "🌙", timeBadge: "Malam" };
    }
}

function initDashboardPage() {
    var greetingEl = document.getElementById("dashboardGreeting");
    if (!greetingEl) return;

    var currentUser = getLoggedInUser();
    var userName = currentUser ? currentUser.nama : "Pengunjung";
    var userRole = currentUser ? currentUser.role : "Tamu";

    var greetingData = getGreetingByTime();
    greetingEl.innerHTML = greetingData.icon + " " + greetingData.text + ", <span class='highlight-name'>" + userName + "</span>!";

    var subtextEl = document.getElementById("dashboardGreetingSub");
    if (subtextEl) {
        subtextEl.textContent = "Selamat datang di Portal Operasional Toko Buku Online. Kelola stok katalog, proses pemesanan, dan lacak status DO pengiriman secara terpusat.";
    }

    var timeBadgeEl = document.getElementById("timeBadge");
    if (timeBadgeEl) {
        timeBadgeEl.textContent = "Waktu Sesi: " + greetingData.timeBadge;
    }

    // Tampilkan Jam & Tanggal Lokal Realtime
    var liveClockEl = document.getElementById("liveClock");
    if (liveClockEl) {
        function updateClock() {
            var now = new Date();
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            liveClockEl.textContent = now.toLocaleDateString('id-ID', options);
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Perbarui Statistik Ringkasan
    var katalog = getKatalogList();
    var tracking = getTrackingData();
    var pesanan = getPesananList();

    var totalJudulEl = document.getElementById("statTotalJudul");
    if (totalJudulEl) totalJudulEl.textContent = katalog.length;

    var totalStokEl = document.getElementById("statTotalStok");
    if (totalStokEl) {
        var totalUnit = katalog.reduce(function (sum, item) {
            return sum + (parseInt(item.stok) || 0);
        }, 0);
        totalStokEl.textContent = totalUnit.toLocaleString("id-ID") + " Eksemplar";
    }

    var totalPesananEl = document.getElementById("statPesananAktif");
    if (totalPesananEl) totalPesananEl.textContent = pesanan.length + " Judul Buku";

    var totalTrackingEl = document.getElementById("statTotalDO");
    if (totalTrackingEl) totalTrackingEl.textContent = Object.keys(tracking).length + " Resi Terdata";
}

// -------------------------------------------------------------------
// 5. LOGIKA KATALOG BUKU & TAMBAH STOK VIA DOM (stok.html)
// -------------------------------------------------------------------
function formatRupiah(num) {
    if (typeof num === "string") {
        if (num.indexOf("Rp") !== -1) return num;
        num = parseInt(num.replace(/\D/g, "")) || 0;
    }
    return "Rp " + Number(num).toLocaleString("id-ID");
}

function initStokPage() {
    var katalogTableBody = document.getElementById("katalogTableBody");
    var katalogCardsContainer = document.getElementById("katalogCardsContainer");
    if (!katalogTableBody && !katalogCardsContainer) return;

    var searchInput = document.getElementById("searchBukuInput");
    var filterKategori = document.getElementById("filterKategori");
    var formTambah = document.getElementById("formTambahStok");

    function renderKatalog() {
        var list = getKatalogList();
        var keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
        var kategori = filterKategori ? filterKategori.value : "Semua";

        var filtered = list.filter(function (item) {
            var matchKw = item.namaBarang.toLowerCase().indexOf(keyword) !== -1 ||
                item.kodeBarang.toLowerCase().indexOf(keyword) !== -1;
            var matchKat = (kategori === "Semua") || (item.jenisBarang === kategori);
            return matchKw && matchKat;
        });

        // 1. Render Table Rows (DOM Manipulation)
        if (katalogTableBody) {
            katalogTableBody.innerHTML = "";
            if (filtered.length === 0) {
                var emptyRow = document.createElement("tr");
                emptyRow.innerHTML = "<td colspan='8' style='text-align: center; padding: 2rem; color: var(--text-muted);'>Tidak ada data buku yang sesuai dengan pencarian.</td>";
                katalogTableBody.appendChild(emptyRow);
            } else {
                filtered.forEach(function (buku, idx) {
                    var tr = document.createElement("tr");
                    tr.id = "row-" + buku.kodeBarang;

                    var stokBadgeClass = buku.stok > 200 ? "chip-success" : (buku.stok > 50 ? "chip-warning" : "chip-danger");
                    var stokStatus = buku.stok > 200 ? "Melimpah" : (buku.stok > 50 ? "Tersedia" : "Menipis");

                    tr.innerHTML =
                        "<td><strong>" + (idx + 1) + "</strong></td>" +
                        "<td><img src='" + buku.cover + "' alt='" + buku.namaBarang + "' class='table-cover-img' onerror=\"this.src='https://placehold.co/80x110?text=Buku'\"></td>" +
                        "<td><span class='chip chip-primary'>" + buku.kodeBarang + "</span></td>" +
                        "<td><strong>" + buku.namaBarang + "</strong></td>" +
                        "<td>" + buku.jenisBarang + "</td>" +
                        "<td>Edisi " + buku.edisi + "</td>" +
                        "<td><span class='chip " + stokBadgeClass + "'>" + buku.stok + " (" + stokStatus + ")</span></td>" +
                        "<td><strong style='color: var(--primary);'>" + formatRupiah(buku.harga) + "</strong></td>" +
                        "<td>" +
                        "<button class='btn btn-sm btn-primary' onclick=\"tambahKeKeranjang('" + buku.kodeBarang + "')\">+ Pesan</button>" +
                        "</td>";
                    katalogTableBody.appendChild(tr);
                });
            }
        }

        // 2. Render Cards View (DOM Manipulation)
        if (katalogCardsContainer) {
            katalogCardsContainer.innerHTML = "";
            filtered.forEach(function (buku) {
                var card = document.createElement("div");
                card.className = "card card-buku";
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.justifyContent = "space-between";

                card.innerHTML =
                    "<div style='text-align: center; margin-bottom: 1rem;'>" +
                    "<img src='" + buku.cover + "' alt='" + buku.namaBarang + "' style='max-height: 180px; margin: 0 auto; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);' onerror=\"this.src='https://placehold.co/120x160?text=Buku'\">" +
                    "</div>" +
                    "<div>" +
                    "<div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;'>" +
                    "<span class='chip chip-primary'>" + buku.kodeBarang + "</span>" +
                    "<span class='chip chip-info'>Edisi " + buku.edisi + "</span>" +
                    "</div>" +
                    "<h4 style='font-size: 1.05rem; margin-bottom: 0.35rem; font-weight: 700;'>" + buku.namaBarang + "</h4>" +
                    "<p style='font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;'>" + buku.jenisBarang + " &bull; Stok: <strong>" + buku.stok + "</strong></p>" +
                    "</div>" +
                    "<div style='display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border);'>" +
                    "<span style='font-size: 1.1rem; font-weight: 700; color: var(--primary);'>" + formatRupiah(buku.harga) + "</span>" +
                    "<button class='btn btn-sm btn-primary' onclick=\"tambahKeKeranjang('" + buku.kodeBarang + "')\">+ Pesan</button>" +
                    "</div>";
                katalogCardsContainer.appendChild(card);
            });
        }

        var totalInfo = document.getElementById("infoTotalItem");
        if (totalInfo) {
            totalInfo.textContent = "Menampilkan " + filtered.length + " dari " + list.length + " judul buku";
        }
    }

    if (searchInput) searchInput.addEventListener("input", renderKatalog);
    if (filterKategori) filterKategori.addEventListener("change", renderKatalog);

    // Form Tambah Baris Stok Baru (DOM Manipulation)
    if (formTambah) {
        formTambah.addEventListener("submit", function (e) {
            e.preventDefault();

            var kode = document.getElementById("tambahKode").value.trim().toUpperCase();
            var nama = document.getElementById("tambahNama").value.trim();
            var jenis = document.getElementById("tambahJenis").value;
            var edisi = document.getElementById("tambahEdisi").value.trim();
            var stok = parseInt(document.getElementById("tambahStok").value) || 0;
            var hargaNum = parseInt(document.getElementById("tambahHarga").value) || 0;
            var coverInput = document.getElementById("tambahCover").value.trim();

            if (!kode || !nama || !edisi || stok < 0 || hargaNum <= 0) {
                showAlert("Mohon isi seluruh data buku dengan benar dan valid!", "warning");
                return;
            }

            var list = getKatalogList();
            var exists = list.some(function (b) { return b.kodeBarang === kode; });
            if (exists) {
                showAlert("Kode Barang '" + kode + "' sudah ada dalam katalog! Mohon gunakan kode lain.", "warning");
                return;
            }

            var bukuBaru = {
                kodeBarang: kode,
                namaBarang: nama,
                jenisBarang: jenis,
                edisi: edisi,
                stok: stok,
                harga: formatRupiah(hargaNum),
                cover: coverInput || "img/pengantar_komunikasi.jpg"
            };

            // Tambahkan ke array dan simpan
            list.unshift(bukuBaru);
            saveKatalogList(list);

            closeModal("modalTambahStok");
            formTambah.reset();

            // Render ulang tampilan DOM
            renderKatalog();

            showAlert("Buku baru '" + nama + "' (" + kode + ") berhasil ditambahkan ke daftar katalog stok!", "success");
        });
    }

    renderKatalog();
}

// Fungsi bantu menambahkan buku dari katalog ke daftar pesanan checkout
function tambahKeKeranjang(kodeBarang) {
    var katalog = getKatalogList();
    var target = katalog.find(function (b) { return b.kodeBarang === kodeBarang; });
    if (!target) return;

    var pesanan = getPesananList();
    var existingItem = pesanan.find(function (p) { return p.kodeBarang === kodeBarang; });

    var hargaSatuan = typeof target.harga === "number" ? target.harga : parseInt(target.harga.replace(/\D/g, "")) || 0;

    if (existingItem) {
        existingItem.jumlah += 1;
    } else {
        pesanan.push({
            kodeBarang: target.kodeBarang,
            namaBarang: target.namaBarang,
            jumlah: 1,
            hargaSatuan: hargaSatuan,
            cover: target.cover
        });
    }

    savePesananList(pesanan);
    showToast("'" + target.namaBarang + "' ditambahkan ke keranjang pesanan!", "success");
}

// -------------------------------------------------------------------
// 6. LOGIKA HALAMAN PEMESANAN & CHECKOUT (checkout.html)
// -------------------------------------------------------------------
function initCheckoutPage() {
    var orderTableBody = document.getElementById("orderTableBody");
    if (!orderTableBody) return;

    var formCheckout = document.getElementById("formCheckout");
    var selectKurir = document.getElementById("checkoutKurir");
    var ongkirOngkir = { "JNE": 18000, "Pos Indonesia": 15000, "SiCepat": 17000 };

    // Auto-fill nama pemesan jika sedang login
    var currentUser = getLoggedInUser();
    if (currentUser) {
        var inputNama = document.getElementById("checkoutNama");
        var inputEmail = document.getElementById("checkoutEmail");
        if (inputNama && !inputNama.value) inputNama.value = currentUser.nama;
        if (inputEmail && !inputEmail.value) inputEmail.value = currentUser.email;
    }

    function renderOrderSummary() {
        var pesanan = getPesananList();
        orderTableBody.innerHTML = "";

        if (pesanan.length === 0) {
            orderTableBody.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 2rem; color: var(--text-muted);'>Keranjang pesanan masih kosong.<br><a href='stok.html' class='btn btn-sm btn-outline' style='margin-top: 0.75rem;'>Pilih Buku Dari Katalog</a></td></tr>";
            updateTotals(0);
            return;
        }

        var subtotal = 0;

        pesanan.forEach(function (item, index) {
            var itemTotal = item.jumlah * item.hargaSatuan;
            subtotal += itemTotal;

            var tr = document.createElement("tr");
            tr.innerHTML =
                "<td>" +
                "<div style='display: flex; align-items: center; gap: 0.75rem;'>" +
                "<img src='" + item.cover + "' class='table-cover-img' style='width: 36px; height: 48px;' onerror=\"this.src='https://placehold.co/60x80?text=Buku'\">" +
                "<div>" +
                "<strong>" + item.namaBarang + "</strong>" +
                "<div style='font-size: 0.775rem; color: var(--text-muted);'>" + item.kodeBarang + "</div>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "<td>" + formatRupiah(item.hargaSatuan) + "</td>" +
                "<td>" +
                "<div style='display: flex; align-items: center; gap: 0.35rem;'>" +
                "<button type='button' class='btn btn-secondary btn-sm' style='padding: 2px 8px;' onclick='ubahJumlahPesanan(" + index + ", -1)'>-</button>" +
                "<span style='font-weight: 700; min-width: 24px; text-align: center;'>" + item.jumlah + "</span>" +
                "<button type='button' class='btn btn-secondary btn-sm' style='padding: 2px 8px;' onclick='ubahJumlahPesanan(" + index + ", 1)'>+</button>" +
                "</div>" +
                "</td>" +
                "<td><strong>" + formatRupiah(itemTotal) + "</strong></td>" +
                "<td>" +
                "<button type='button' class='btn btn-danger btn-sm' style='padding: 2px 8px;' title='Hapus' onclick='hapusItemPesanan(" + index + ")'>&times;</button>" +
                "</td>";

            orderTableBody.appendChild(tr);
        });

        updateTotals(subtotal);
    }

    function updateTotals(subtotal) {
        var kurirName = selectKurir ? selectKurir.value : "JNE";
        var ongkir = subtotal > 0 ? (ongkirOngkir[kurirName] || 18000) : 0;
        var totalBayar = subtotal + ongkir;

        var subtotalEl = document.getElementById("summarySubtotal");
        var ongkirEl = document.getElementById("summaryOngkir");
        var totalEl = document.getElementById("summaryTotal");

        if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
        if (ongkirEl) ongkirEl.textContent = formatRupiah(ongkir);
        if (totalEl) totalEl.textContent = formatRupiah(totalBayar);
    }

    if (selectKurir) {
        selectKurir.addEventListener("change", function () {
            var pesanan = getPesananList();
            var subtotal = pesanan.reduce(function (sum, item) {
                return sum + (item.jumlah * item.hargaSatuan);
            }, 0);
            updateTotals(subtotal);
        });
    }

    // Modal Pilih Tambah Item Lain dari Katalog
    var btnBukaModalItem = document.getElementById("btnBukaModalItem");
    if (btnBukaModalItem) {
        btnBukaModalItem.addEventListener("click", function () {
            var katalog = getKatalogList();
            var itemContainer = document.getElementById("pilihItemKatalogContainer");
            if (itemContainer) {
                itemContainer.innerHTML = "";
                katalog.forEach(function (buku) {
                    var div = document.createElement("div");
                    div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid var(--border);";
                    div.innerHTML =
                        "<div style='display: flex; align-items: center; gap: 0.75rem;'>" +
                        "<img src='" + buku.cover + "' style='width: 32px; height: 44px; object-fit: cover; border-radius: 4px;' onerror=\"this.src='https://placehold.co/60x80?text=Buku'\">" +
                        "<div>" +
                        "<div style='font-weight: 600; font-size: 0.9rem;'>" + buku.namaBarang + "</div>" +
                        "<div style='font-size: 0.8rem; color: var(--primary); font-weight: 700;'>" + formatRupiah(buku.harga) + "</div>" +
                        "</div>" +
                        "</div>" +
                        "<button type='button' class='btn btn-sm btn-outline' onclick=\"tambahItemCheckoutModal('" + buku.kodeBarang + "')\">+ Pilih</button>";
                    itemContainer.appendChild(div);
                });
            }
            openModal("modalPilihItem");
        });
    }

    // Submit Checkout & Validasi Form
    if (formCheckout) {
        formCheckout.addEventListener("submit", function (e) {
            e.preventDefault();

            var pesanan = getPesananList();
            if (pesanan.length === 0) {
                showAlert("Keranjang pesanan masih kosong! Silakan tambahkan minimal 1 buku.", "warning");
                return;
            }

            var nama = document.getElementById("checkoutNama").value.trim();
            var alamat = document.getElementById("checkoutAlamat").value.trim();
            var nohp = document.getElementById("checkoutHP").value.trim();
            var kurir = document.getElementById("checkoutKurir").value;
            var pembayaran = document.getElementById("checkoutPembayaran").value;

            // Validasi Sederhana
            if (!nama || !alamat || !nohp || !kurir || !pembayaran) {
                showAlert("Mohon lengkapi seluruh isian data informasi pemesan dan pembayaran!", "warning");
                return;
            }

            if (nohp.length < 9) {
                showAlert("Nomor HP / WhatsApp yang dimasukkan tidak valid (minimal 9 digit)!", "warning");
                return;
            }

            // Hitung Total Bayar
            var subtotal = pesanan.reduce(function (sum, item) {
                return sum + (item.jumlah * item.hargaSatuan);
            }, 0);
            var ongkir = ongkirOngkir[kurir] || 18000;
            var grandTotal = subtotal + ongkir;

            // Buat Nomor DO baru
            var newDO = "2023" + String(Math.floor(1000 + Math.random() * 9000));
            var todayStr = new Date().toISOString().split('T')[0];
            var waktuSekarang = new Date().toISOString().replace('T', ' ').substring(0, 19);

            var paketCode = kurir === "JNE" ? "0JKT02" : "0UPBJJ" + Math.floor(10 + Math.random() * 90);

            // Simpan ke data tracking
            var tracking = getTrackingData();
            tracking[newDO] = {
                nomorDO: newDO,
                nama: nama,
                status: "Diproses",
                ekspedisi: kurir,
                tanggalKirim: todayStr,
                paket: paketCode,
                total: formatRupiah(grandTotal),
                perjalanan: [
                    {
                        waktu: waktuSekarang,
                        keterangan: "Pesanan berhasil dibuat & menunggu penerimaan loket ekspedisi: " + kurir + ". Pengirim: Universitas Terbuka"
                    }
                ]
            };
            saveTrackingData(tracking);

            // Kosongkan keranjang setelah checkout sukses
            savePesananList([]);

            // Tampilkan Modal Sukses Pemesanan
            var invoiceEl = document.getElementById("invoiceDetailContent");
            if (invoiceEl) {
                invoiceEl.innerHTML =
                    "<div style='text-align: center; margin-bottom: 1.25rem;'>" +
                    "<div style='font-size: 3rem;'>🎉</div>" +
                    "<h3 style='color: var(--success); font-size: 1.35rem;'>Pemesanan Berhasil Diproses!</h3>" +
                    "<p style='color: var(--text-muted); font-size: 0.9rem;'>Terima kasih telah berbelanja di Toko Buku Online</p>" +
                    "</div>" +
                    "<div style='background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); font-size: 0.9rem; margin-bottom: 1rem;'>" +
                    "<div style='display: flex; justify-content: space-between; margin-bottom: 0.5rem;'><span>Nomor Delivery Order (DO):</span> <strong>" + newDO + "</strong></div>" +
                    "<div style='display: flex; justify-content: space-between; margin-bottom: 0.5rem;'><span>Nama Pemesan:</span> <strong>" + nama + "</strong></div>" +
                    "<div style='display: flex; justify-content: space-between; margin-bottom: 0.5rem;'><span>Ekspedisi:</span> <span>" + kurir + "</span></div>" +
                    "<div style='display: flex; justify-content: space-between; margin-bottom: 0.5rem;'><span>Metode Bayar:</span> <span>" + pembayaran + "</span></div>" +
                    "<div style='display: flex; justify-content: space-between; border-top: 1px dashed var(--border); padding-top: 0.5rem; font-weight: 700; color: var(--primary);'><span>Total Pembayaran:</span> <span>" + formatRupiah(grandTotal) + "</span></div>" +
                    "</div>" +
                    "<div style='text-align: center;'>" +
                    "<a href='tracking.html?do=" + newDO + "' class='btn btn-primary' style='width: 100%; margin-bottom: 0.5rem;'>Lacak Status Pengiriman DO Sekarang &rarr;</a>" +
                    "<button type='button' class='btn btn-secondary' style='width: 100%;' onclick=\"window.location.href='dashboard.html'\">Kembali ke Dashboard</button>" +
                    "</div>";
                openModal("modalInvoiceSukses");
            } else {
                showAlert("Pesanan Berhasil! Nomor DO Anda: " + newDO + ". Anda dapat melacaknya di halaman Tracking Pengiriman.", "success", function () {
                    window.location.href = "tracking.html?do=" + newDO;
                });
            }
        });
    }

    renderOrderSummary();
}

function ubahJumlahPesanan(index, delta) {
    var pesanan = getPesananList();
    if (pesanan[index]) {
        pesanan[index].jumlah += delta;
        if (pesanan[index].jumlah <= 0) {
            pesanan.splice(index, 1);
        }
        savePesananList(pesanan);
        initCheckoutPage();
    }
}

function hapusItemPesanan(index) {
    var pesanan = getPesananList();
    if (pesanan[index]) {
        pesanan.splice(index, 1);
        savePesananList(pesanan);
        initCheckoutPage();
        showToast("Item dihapus dari keranjang pesanan.", "info");
    }
}

function tambahItemCheckoutModal(kodeBarang) {
    tambahKeKeranjang(kodeBarang);
    closeModal("modalPilihItem");
    initCheckoutPage();
}

// -------------------------------------------------------------------
// 7. LOGIKA HALAMAN TRACKING PENGIRIMAN (tracking.html)
// -------------------------------------------------------------------
function initTrackingPage() {
    var inputDO = document.getElementById("inputNomorDO");
    var btnCari = document.getElementById("btnCariDO");
    var trackingResult = document.getElementById("trackingResult");
    if (!inputDO || !btnCari) return;

    function prosesPencarian(nomorDO) {
        nomorDO = (nomorDO || inputDO.value).trim();

        if (!nomorDO) {
            showAlert("Silakan masukkan Nomor Delivery Order (DO) terlebih dahulu!", "warning");
            return;
        }

        var trackingData = getTrackingData();
        var item = trackingData[nomorDO];

        if (!item) {
            showAlert("Nomor Delivery Order (DO) '" + nomorDO + "' tidak ditemukan dalam sistem!", "error");
            if (trackingResult) trackingResult.style.display = "none";
            return;
        }

        // Tampilkan Hasil Tracking
        if (trackingResult) {
            trackingResult.style.display = "block";

            // 1. Data Pemesan & Pengiriman
            document.getElementById("trackNomorDO").textContent = item.nomorDO;
            document.getElementById("trackNama").textContent = item.nama;
            document.getElementById("trackEkspedisi").textContent = item.ekspedisi;
            document.getElementById("trackTanggal").textContent = item.tanggalKirim;
            document.getElementById("trackPaket").textContent = item.paket;
            document.getElementById("trackTotal").textContent = item.total;

            var statusBadge = document.getElementById("trackStatusBadge");
            if (statusBadge) {
                statusBadge.textContent = item.status;
                if (item.status === "Selesai Antar" || item.status === "Dikirim") {
                    statusBadge.className = "chip chip-success";
                } else if (item.status === "Dalam Perjalanan") {
                    statusBadge.className = "chip chip-primary";
                } else {
                    statusBadge.className = "chip chip-warning";
                }
            }

            // 2. Hitung Progress Bar Stepper
            // Step 1: Loket/Diproses -> Step 2: Hub -> Step 3: Dalam Perjalanan / Antar -> Step 4: Selesai Antar / Dikirim
            var statusLower = item.status.toLowerCase();
            var step1 = document.getElementById("step1");
            var step2 = document.getElementById("step2");
            var step3 = document.getElementById("step3");
            var step4 = document.getElementById("step4");
            var fillBar = document.getElementById("trackingProgressFill");

            // Reset classes
            [step1, step2, step3, step4].forEach(function (el) {
                if (el) el.className = "step-item";
            });

            var progressPercent = "15%";

            if (statusLower.indexOf("selesai") !== -1 || statusLower === "dikirim") {
                if (step1) step1.className = "step-item completed";
                if (step2) step2.className = "step-item completed";
                if (step3) step3.className = "step-item completed";
                if (step4) step4.className = "step-item completed";
                progressPercent = "80%";
            } else if (statusLower.indexOf("perjalanan") !== -1 || statusLower.indexOf("antar") !== -1) {
                if (step1) step1.className = "step-item completed";
                if (step2) step2.className = "step-item completed";
                if (step3) step3.className = "step-item active";
                progressPercent = "55%";
            } else if (statusLower.indexOf("hub") !== -1) {
                if (step1) step1.className = "step-item completed";
                if (step2) step2.className = "step-item active";
                progressPercent = "35%";
            } else {
                if (step1) step1.className = "step-item active";
                progressPercent = "15%";
            }

            if (fillBar) fillBar.style.width = progressPercent;

            // 3. Render Timeline Perjalanan Logistik
            var timelineContainer = document.getElementById("trackingTimelineList");
            if (timelineContainer && item.perjalanan) {
                timelineContainer.innerHTML = "";
                // Urutkan riwayat dari yang terbaru di atas
                var logs = item.perjalanan.slice().reverse();
                logs.forEach(function (log, idx) {
                    var itemDiv = document.createElement("div");
                    itemDiv.className = "timeline-item" + (idx === 0 ? " latest" : "");
                    itemDiv.innerHTML =
                        "<div class='timeline-dot'></div>" +
                        "<div class='timeline-time'>" + log.waktu + "</div>" +
                        "<div class='timeline-content'>" + log.keterangan + "</div>";
                    timelineContainer.appendChild(itemDiv);
                });
            }

            // Scroll ke hasil
            trackingResult.scrollIntoView({ behavior: 'smooth' });
        }
    }

    btnCari.addEventListener("click", function () {
        prosesPencarian();
    });

    inputDO.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            prosesPencarian();
        }
    });

    // Otomatis cari jika ada parameter ?do= di URL
    var urlParams = new URLSearchParams(window.location.search);
    var doParam = urlParams.get("do");
    if (doParam) {
        inputDO.value = doParam;
        prosesPencarian(doParam);
    }
}

// Fungsi bantu cepat pengujian nomor DO
function quickCheckDO(noDO) {
    var inputDO = document.getElementById("inputNomorDO");
    if (inputDO) {
        inputDO.value = noDO;
        var btnCari = document.getElementById("btnCariDO");
        if (btnCari) btnCari.click();
    }
}

// -------------------------------------------------------------------
// 8. LOGOUT & USER BAR HANDLER
// -------------------------------------------------------------------
function setupNavbar() {
    // Hamburger menu toggle
    var menuToggle = document.getElementById("menuToggle");
    var navMenu = document.getElementById("navMenu");
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("open");
        });
    }

    // Tampilkan info user di navbar jika ada
    var userBadgeContainer = document.getElementById("navbarUserBadge");
    var user = getLoggedInUser();

    if (userBadgeContainer) {
        if (user) {
            userBadgeContainer.innerHTML =
                "<div class='user-badge'>" +
                "<div class='user-avatar'>" + user.nama.charAt(0).toUpperCase() + "</div>" +
                "<span>" + user.nama + "</span>" +
                "<span class='chip chip-primary' style='font-size: 0.7rem; padding: 1px 6px;'>" + user.role + "</span>" +
                "</div>" +
                "<button class='btn-logout' onclick='logoutUser()'>Logout</button>";
        } else {
            userBadgeContainer.innerHTML = "<a href='index.html' class='btn btn-sm btn-primary'>Login</a>";
        }
    }
}

function logoutUser() {
    sessionStorage.removeItem("userLoggedIn");
    showToast("Anda telah keluar dari sesi login.", "info");
    setTimeout(function () {
        window.location.href = "index.html";
    }, 600);
}

// -------------------------------------------------------------------
// 9. INISIALISASI SAAT DOM READY
// -------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    setupNavbar();
    initLoginPage();
    initDashboardPage();
    initStokPage();
    initCheckoutPage();
    initTrackingPage();
});

