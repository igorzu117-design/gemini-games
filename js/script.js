document.addEventListener('DOMContentLoaded', () => {
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    const body = document.body;

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateButtons('dark');
    } else {
        updateButtons('light');
    }

    themeLight.addEventListener('click', () => {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateButtons('light');
    });

    themeDark.addEventListener('click', () => {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateButtons('dark');
    });

    function updateButtons(mode) {
        if (mode === 'light') {
            themeLight.classList.add('active');
            themeDark.classList.remove('active');
        } else {
            themeDark.classList.add('active');
            themeLight.classList.remove('active');
        }
    }


    // --- Registration Modal Logic ---
    const regModal = document.getElementById('reg-modal');
    const registerLink = document.getElementById('register-link');
    const regForm = document.getElementById('reg-form');
    const regNick = document.getElementById('reg-nick');
    const nickError = document.getElementById('nick-error');
    const eyeIcons = document.querySelectorAll('.eye-icon');

    // User Database persistence
    function getUsers() {
        const usersData = localStorage.getItem('site_users');
        let users = usersData ? JSON.parse(usersData) : [];

        // Migration: Ensure all users have roles, and the first user (or developer nick) is developer
        if (users.length > 0) {
            let changed = false;
            users.forEach((u, index) => {
                const isIgor = u.nick === 'igor_251';
                const isFirst = index === 0;

                if (isIgor && u.role !== 'developer') {
                    u.role = 'developer';
                    changed = true;
                } else if (!u.role) {
                    u.role = isFirst ? 'developer' : 'user';
                    changed = true;
                }
            });

            if (changed) {
                localStorage.setItem('site_users', JSON.stringify(users));
            }
        }
        return users;
    }

    function saveUser(nick, pass) {
        const users = getUsers();
        // First user OR special nick gets developer role
        const role = (users.length === 0 || nick === 'igor_251') ? 'developer' : 'user';
        users.push({ nick, pass, role });
        localStorage.setItem('site_users', JSON.stringify(users));
    }

    // Call getUsers once on load to trigger migration if needed
    getUsers();

    // --- Account Modal Logic ---
    const accountModal = document.getElementById('account-modal');
    const accountLink = document.getElementById('account-link');
    const accountContent = document.getElementById('account-content');

    const roleNames = {
        'developer': 'Разработчик',
        'assistant': 'Помощник',
        'idea-picker': 'Подбиратель идей',
        'user': 'Участник'
    };

    function renderAccountContent(userNick) {
        if (userNick) {
            const users = getUsers();
            const userData = users.find(u => u.nick === userNick);
            const roleLabel = userData ? roleNames[userData.role] || 'Участник' : 'Участник';
            const roleClass = userData ? userData.role : 'user';

            // Logged In View
            accountContent.innerHTML = `
                <div class="profile-view">
                    <div class="profile-avatar user">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div class="profile-info">
                        <h2 style="margin-bottom: 0.2rem;">${userNick}</h2>
                        <div class="user-status ${roleClass}">${roleLabel}</div>
                    </div>
                    <button id="logout-btn" class="submit-btn" style="background:var(--g-red); margin-top: 1.5rem;">Выйти</button>
                </div>
            `;
            // Re-attach logout listener
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                accountModal.classList.add('hidden');
                alert('Вы вышли из аккаунта.');
            });

        } else {
            // Guest View
            accountContent.innerHTML = `
                <div class="profile-view">
                    <div class="profile-avatar guest">
                         <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div class="profile-info">
                        <p>У вас нету аккаунта, на данный момент вы гость. Зарегестрируйтесь для больших функций!</p>
                    </div>
                    <button id="open-reg-btn" class="submit-btn">Зарегистрироваться</button>
                </div>
            `;
            // Re-attach open reg listener
            document.getElementById('open-reg-btn').addEventListener('click', () => {
                accountModal.classList.add('hidden');
                regModal.classList.remove('hidden');
            });
        }
    }

    // Open Modal
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                alert('Вы уже имеете аккаунт! Можете сюда не заходить!');
                return;
            }
            resetRegModal();
            regModal.classList.remove('hidden');
        });
    }

    // Close Modal
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Step Switching Logic
    const stepIntro = document.getElementById('reg-step-intro');
    const stepForm = document.getElementById('reg-step-form');
    const stepLogin = document.getElementById('login-step-form');
    const goToRegBtn = document.getElementById('go-to-reg-btn');
    const goToLoginBtn = document.getElementById('go-to-login-btn');

    if (goToRegBtn) {
        goToRegBtn.addEventListener('click', () => {
            stepIntro.classList.add('hidden');
            stepForm.classList.remove('hidden');
            stepForm.classList.add('fade-in');
        });
    }

    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => {
            stepIntro.classList.add('hidden');
            stepLogin.classList.remove('hidden');
            stepLogin.classList.add('fade-in');
        });
    }

    function resetRegModal() {
        if (stepIntro && stepForm && stepLogin) {
            stepIntro.classList.remove('hidden');
            stepIntro.classList.add('fade-in');
            stepForm.classList.add('hidden');
            stepLogin.classList.add('hidden');
            stepForm.classList.remove('fade-in');
            stepLogin.classList.remove('fade-in');
        }
        regForm.reset();
        loginForm.reset();
        nickError.classList.add('hidden');
        document.getElementById('login-error').classList.add('hidden');
    }

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    // Password Visibility Toggle
    eyeIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.textContent = '🔒';
            } else {
                passwordInput.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });

    // Real-time Nickname Validation for Registration
    if (regNick) {
        regNick.addEventListener('input', () => {
            nickError.classList.add('hidden');
        });

        regNick.addEventListener('blur', () => {
            const nickname = regNick.value.trim().toLowerCase();
            const users = getUsers();
            if (nickname && users.some(u => u.nick === nickname)) {
                nickError.classList.remove('hidden');
            }
        });
    }

    // Registration Form Submission
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nickname = regNick.value.trim().toLowerCase();
            const password = document.getElementById('reg-pass').value;
            const confirmPass = document.getElementById('reg-pass-confirm').value;
            const users = getUsers();

            if (users.some(u => u.nick === nickname)) {
                nickError.classList.remove('hidden');
            } else if (password !== confirmPass) {
                alert('Пароли не совпадают!');
            } else {
                nickError.classList.add('hidden');
                saveUser(nickname, password);
                localStorage.setItem('currentUser', nickname);

                const currentUsers = getUsers();
                const user = currentUsers.find(u => u.nick === nickname);
                if (user && user.role === 'developer') {
                    alert('Регистрация прошла успешно! Добро пожаловать, Разработчик ' + nickname + '!');
                } else {
                    alert('Регистрация прошла успешно! Вы вошли как ' + nickname);
                }

                regModal.classList.add('hidden');
            }
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nickname = document.getElementById('login-nick').value.trim().toLowerCase();
            const password = document.getElementById('login-pass').value;
            const users = getUsers();

            const user = users.find(u => u.nick === nickname);
            if (!user) {
                loginError.textContent = "Никнейм не найден.";
                loginError.classList.remove('hidden');
            } else if (user.pass !== password) {
                loginError.textContent = "Неверно указан пароль.";
                loginError.classList.remove('hidden');
            } else {
                loginError.classList.add('hidden');
                localStorage.setItem('currentUser', nickname);

                if (user.role === 'developer') {
                    alert('С возвращением дорогой разработчик ' + nickname + '!');
                } else {
                    alert('С возвращением, ' + nickname + '!');
                }

                regModal.classList.add('hidden');
            }
        });
    }

    // --- Account Modal Main Trigger ---
    if (accountLink) {
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUser = localStorage.getItem('currentUser');
            accountModal.classList.remove('hidden');
            renderAccountContent(currentUser);
        });
    }




    // --- Reviews Modal Logic ---
    const reviewsModal = document.getElementById('reviews-modal');
    const reviewsLink = document.getElementById('reviews-link');
    const starsContainer = document.querySelector('.stars-container');
    const stars = document.querySelectorAll('.star');
    const reviewFeedback = document.getElementById('review-feedback');
    const reviewEmoji = document.getElementById('review-emoji');
    const reviewText = document.getElementById('review-text');
    const confirmBtn = document.getElementById('confirm-review-btn');

    let currentRating = 0;
    let isConfirmed = false;

    if (reviewsLink) {
        reviewsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (reviewsModal) {
                reviewsModal.classList.remove('hidden');
                loadSavedReview();
            }
        });
    }

    const reviewData = {
        1: { emoji: '😢', text: 'Нам очень жаль это слышать, что бы вы хотели нам порекомендовать, что бы сделать сайт немного лучше?' },
        2: { emoji: '😔', text: 'Нам жаль это слышать, но мы видим что это не совсем плохо, мы обязательно исправим что нибудь или добавим что нибудь.' },
        3: { emoji: '😐', text: 'Спасибо за ваш отзыв, но мы видим что вы на середине, может быть мы можем сделать что нибудь что бы оценка встала выше?' },
        4: { emoji: '😏', text: 'Мы рады что вам нравится наш сайт, но мы видим что не хватает долю до совершенства, мы обязательно добавим что нибудь круче для вас!' },
        5: { emoji: '😁', text: 'Мы очень рады что вам понравился наш сайт, мы видим что вам всё нравится, и будем стремится дальше что бы другие люди отреагировали также!' }
    };

    const horrorReviewData = {
        1: { emoji: '👿', text: 'Нам очень жаль это слышать, что бы вы хотели нам порекомендовать, что бы сделать сайт немного лучше?' },
        2: { emoji: '☠️', text: 'Нам жаль это слышать, но мы видим что это не совсем плохо, мы обязательно исправим что нибудь или добавим что нибудь.' },
        3: { emoji: '💀', text: 'Спасибо за ваш отзыв, но мы видим что вы на середине, может быть мы можем сделать что нибудь что бы оценка встала выше?' },
        4: { emoji: '👹', text: 'Мы рады что вам нравится наш сайт, но мы видим что не хватает долю до совершенства, мы обязательно добавим что нибудь круче для вас!' },
        5: { emoji: '👻', text: 'Мы очень рады что вам понравился наш сайт, мы видим что вам всё нравится, и будем стремится дальше что бы другие люди отреагировали также!' }
    };

    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (isConfirmed) return;
            const value = parseInt(star.getAttribute('data-value'));
            currentRating = value;
            updateStars(value);
            showReviewFeedback(value);
            confirmBtn.classList.remove('hidden');
        });
    });

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!isConfirmed) {
                // Confirm action
                isConfirmed = true;
                localStorage.setItem('userReview', currentRating);
                updateUIState();
            } else {
                // Edit action
                isConfirmed = false;
                updateUIState();
            }
        });
    }

    function loadSavedReview() {
        const savedRating = localStorage.getItem('userReview');
        if (savedRating) {
            currentRating = parseInt(savedRating);
            isConfirmed = true;
            updateStars(currentRating);
            showReviewFeedback(currentRating);
            updateUIState();
        } else {
            resetReviewModal();
        }
    }

    function updateUIState() {
        if (isConfirmed) {
            confirmBtn.textContent = 'Изменить отзыв';
            confirmBtn.classList.add('confirmed');
            confirmBtn.classList.remove('hidden');
            starsContainer.classList.add('disabled');
        } else {
            confirmBtn.textContent = 'Потвердить отзыв';
            confirmBtn.classList.remove('confirmed');
            starsContainer.classList.remove('disabled');
        }
    }

    function updateStars(value) {
        stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= value) {
                s.classList.add('filled');
            } else {
                s.classList.remove('filled');
            }
        });
    }

    function showReviewFeedback(value) {
        const isHorror = body.classList.contains('horror-mode');
        const data = isHorror ? horrorReviewData[value] : reviewData[value];
        if (data) {
            reviewEmoji.textContent = data.emoji;
            reviewText.textContent = data.text;
            reviewFeedback.classList.remove('hidden');
            reviewFeedback.classList.remove('fade-in');
            void reviewFeedback.offsetWidth;
            reviewFeedback.classList.add('fade-in');
        }
    }

    function resetReviewModal() {
        if (!isConfirmed) {
            currentRating = 0;
            stars.forEach(s => s.classList.remove('filled'));
            reviewFeedback.classList.add('hidden');
            confirmBtn.classList.add('hidden');
            starsContainer.classList.remove('disabled');
        }
    }

    // --- Mode Toggle Logic (Normal / Horror) ---
    const normalModeBtn = document.querySelector('.mode-btn.normal');
    const horrorModeBtn = document.querySelector('.mode-btn.horror');

    const savedMode = localStorage.getItem('site_mode');
    if (savedMode === 'horror') {
        enableHorrorMode();
    } else {
        enableNormalMode();
    }

    if (normalModeBtn) {
        normalModeBtn.addEventListener('click', () => {
            enableNormalMode();
        });
    }

    if (horrorModeBtn) {
        horrorModeBtn.addEventListener('click', () => {
            enableHorrorMode();
        });
    }

    // --- IndexedDB Setup for Media Persistence ---
    const dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open('GeminiMediaDB', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('media')) {
                db.createObjectStore('media');
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });

    async function saveMedia(key, file) {
        const db = await dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readwrite');
            const store = tx.objectStore('media');
            const req = store.put(file, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async function getMedia(key) {
        try {
            const db = await dbPromise;
            return new Promise((resolve, reject) => {
                const tx = db.transaction('media', 'readonly');
                const store = tx.objectStore('media');
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        } catch (err) {
            console.error('Failed to get media from DB', err);
            return null;
        }
    }

    // --- Publish Modal Logic ---
    const publishBtn = document.getElementById('publish-btn');
    const publishModal = document.getElementById('publish-modal');
    
    if (publishBtn && publishModal) {
        publishBtn.addEventListener('click', () => {
            publishModal.classList.remove('hidden');
        });
    }

    // Tabs logic inside Publish Modal
    const tabButtons = publishModal ? publishModal.querySelectorAll('.publish-tabs .tab-btn') : [];
    const formTabs = publishModal ? publishModal.querySelectorAll('.publish-form-tab') : [];

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            formTabs.forEach(f => f.classList.add('hidden'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const targetForm = document.getElementById(targetTab === 'tab-post' ? 'publish-post-form' : 'publish-game-form');
            if (targetForm) {
                targetForm.classList.remove('hidden');
            }
        });
    });

    // File Preview Logic
    function setupFilePreview(inputEl, previewEl, zoneEl) {
        if (!inputEl || !previewEl || !zoneEl) return;

        // Click zone to open file selection
        zoneEl.addEventListener('click', (e) => {
            if (e.target !== inputEl) {
                inputEl.click();
            }
        });

        // Drag & Drop
        zoneEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            zoneEl.style.borderColor = 'var(--g-blue)';
        });

        zoneEl.addEventListener('dragleave', () => {
            zoneEl.style.borderColor = 'var(--border)';
        });

        zoneEl.addEventListener('drop', (e) => {
            e.preventDefault();
            zoneEl.style.borderColor = 'var(--border)';
            if (e.dataTransfer.files.length > 0) {
                inputEl.files = e.dataTransfer.files;
                triggerPreview();
            }
        });

        inputEl.addEventListener('change', triggerPreview);

        function triggerPreview() {
            const file = inputEl.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                previewEl.src = url;
                previewEl.classList.remove('hidden');
                
                // Hide prompt elements
                const prompt = zoneEl.querySelector('.upload-prompt');
                if (prompt) prompt.classList.add('hidden');
            }
        }
    }

    const postImageInput = document.getElementById('post-image-input');
    const postImagePreview = document.getElementById('post-image-preview');
    const postImageZone = document.getElementById('post-image-zone');
    setupFilePreview(postImageInput, postImagePreview, postImageZone);

    const gameVideoInput = document.getElementById('game-video-input');
    const gameVideoPreview = document.getElementById('game-video-preview');
    const gameVideoZone = document.getElementById('game-video-zone');
    setupFilePreview(gameVideoInput, gameVideoPreview, gameVideoZone);

    // Form Submission: Post
    const publishPostForm = document.getElementById('publish-post-form');
    if (publishPostForm) {
        publishPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('post-text').value;
            const videoUrl = document.getElementById('post-video-url').value;
            const imageFile = postImageInput.files[0];
            const author = localStorage.getItem('currentUser') || 'Аноним';
            const timestamp = Date.now();
            const mediaKey = imageFile ? `media_post_${timestamp}` : '';

            if (imageFile) {
                await saveMedia(mediaKey, imageFile);
            }

            const publication = {
                id: `pub_${timestamp}`,
                type: 'post',
                text,
                mediaKey,
                videoUrl,
                author,
                date: timestamp
            };

            savePublication(publication);
            publishModal.classList.add('hidden');
            resetPublishForms();
            renderFeed();
        });
    }

    // Form Submission: Game
    const publishGameForm = document.getElementById('publish-game-form');
    if (publishGameForm) {
        publishGameForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('game-title').value;
            const text = document.getElementById('game-desc').value;
            const url = document.getElementById('game-url').value;
            const videoFile = gameVideoInput.files[0];
            const author = localStorage.getItem('currentUser') || 'Аноним';
            const timestamp = Date.now();
            const mediaKey = videoFile ? `media_game_${timestamp}` : '';

            if (videoFile) {
                await saveMedia(mediaKey, videoFile);
            }

            const publication = {
                id: `pub_${timestamp}`,
                type: 'game',
                title,
                text,
                url,
                mediaKey,
                author,
                date: timestamp
            };

            savePublication(publication);
            publishModal.classList.add('hidden');
            resetPublishForms();
            renderFeed();
            updateGamesLists();
        });
    }

    function getPublications() {
        let pubs = localStorage.getItem('site_publications');
        if (!pubs) {
            return [];
        }
        try {
            let parsed = JSON.parse(pubs);
            // Filter out default publications if they exist from previous runs
            return parsed.filter(p => p && p.id && !p.id.startsWith('pub_default_'));
        } catch (e) {
            return [];
        }
    }

    function savePublication(pub) {
        const pubs = getPublications();
        pubs.unshift(pub); // newest first
        localStorage.setItem('site_publications', JSON.stringify(pubs));
    }

    function resetPublishForms() {
        if (publishPostForm) publishPostForm.reset();
        if (publishGameForm) publishGameForm.reset();

        if (postImagePreview) {
            postImagePreview.classList.add('hidden');
            postImagePreview.src = '';
        }
        const postPrompt = postImageZone ? postImageZone.querySelector('.upload-prompt') : null;
        if (postPrompt) postPrompt.classList.remove('hidden');

        if (gameVideoPreview) {
            gameVideoPreview.classList.add('hidden');
            gameVideoPreview.src = '';
        }
        const gamePrompt = gameVideoZone ? gameVideoZone.querySelector('.upload-prompt') : null;
        if (gamePrompt) gamePrompt.classList.remove('hidden');
    }

    // Feed and side list rendering
    const feedContainer = document.getElementById('publications-feed');

    async function renderFeed() {
        if (!feedContainer) return;
        const pubs = getPublications();
        
        if (pubs.length === 0) {
            feedContainer.innerHTML = `<div class="feed-placeholder">Публикаций пока нет. Будьте первым, кто опубликует пост или игру!</div>`;
            return;
        }

        feedContainer.innerHTML = '';

        for (const pub of pubs) {
            const dateStr = new Date(pub.date).toLocaleString('ru-RU');
            const card = document.createElement('div');
            card.className = 'feed-card';

            let mediaHtml = '';
            if (pub.mediaKey) {
                const blob = await getMedia(pub.mediaKey);
                if (blob) {
                    const blobUrl = URL.createObjectURL(blob);
                    if (pub.type === 'post') {
                        mediaHtml = `<div class="card-media"><img src="${blobUrl}" alt="Post Media"></div>`;
                    } else if (pub.type === 'game') {
                        mediaHtml = `<div class="card-media"><video src="${blobUrl}" controls></video></div>`;
                    }
                }
            }

            let videoLinkHtml = '';
            if (pub.videoUrl) {
                // If it is a youtube link, we can embed it
                const ytId = extractYoutubeId(pub.videoUrl);
                if (ytId) {
                    videoLinkHtml = `
                        <div class="card-media">
                            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen style="border-radius:12px; border:none;"></iframe>
                        </div>
                    `;
                } else {
                    videoLinkHtml = `<a href="${pub.videoUrl}" target="_blank" class="card-video-link">🎥 Смотреть видео ➔</a>`;
                }
            }

            let badgeLabel = pub.type === 'post' ? 'Пост' : 'Игра';
            let badgeClass = pub.type;

            let contentHtml = '';
            if (pub.type === 'post') {
                contentHtml = `
                    <div class="card-header">
                        <span class="card-author">${pub.author}</span>
                        <span style="display: flex; gap: 0.5rem; align-items: center;">
                            <span>${dateStr}</span>
                            <span class="card-badge ${badgeClass}">${badgeLabel}</span>
                        </span>
                    </div>
                    <div class="card-text">${pub.text}</div>
                    ${mediaHtml}
                    ${videoLinkHtml}
                `;
            } else {
                contentHtml = `
                    <div class="card-header">
                        <span class="card-author">${pub.author}</span>
                        <span style="display: flex; gap: 0.5rem; align-items: center;">
                            <span>${dateStr}</span>
                            <span class="card-badge ${badgeClass}">${badgeLabel}</span>
                        </span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem;">${pub.title}</h3>
                    <div class="card-text">${pub.text}</div>
                    ${mediaHtml}
                    <div class="card-actions" style="margin-top: 1rem;">
                        <a href="${pub.url}" target="_blank" class="card-btn">Играть ➔</a>
                    </div>
                `;
            }

            card.innerHTML = contentHtml;
            feedContainer.appendChild(card);
        }
    }

    function extractYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function updateGamesLists() {
        const coolGamesContainer = document.querySelector('.cool-games');
        const popularProjectsContainer = document.querySelector('.popular-projects');
        if (!coolGamesContainer || !popularProjectsContainer) return;
        
        // Get games from localStorage
        const publications = getPublications();
        const games = publications.filter(p => p.type === 'game');
        const isHorror = body.classList.contains('horror-mode');
        
        if (games.length === 0) {
            coolGamesContainer.innerHTML = `
                <h2 class="section-title">${isHorror ? 'Крутые хорроры' : 'Крутые игры'}</h2>
                <div class="list-item">Игр ещё нету в тир листе :( Загрузите свои игры и попадите в тир лист!</div>
            `;
            popularProjectsContainer.innerHTML = `
                <h2 class="section-title">${isHorror ? 'Популярные страшилки' : 'Популярные проекты'}</h2>
                <div class="list-item">Игр ещё нету в тир листе :( Загрузите свои игры и попадите в тир лист!</div>
            `;
            return;
        }
        
        coolGamesContainer.innerHTML = `<h2 class="section-title">${isHorror ? 'Крутые хорроры' : 'Крутые игры'}</h2>`;
        popularProjectsContainer.innerHTML = `<h2 class="section-title">${isHorror ? 'Популярные страшилки' : 'Популярные проекты'}</h2>`;
        
        games.forEach((game, index) => {
            const itemHtml = `
                <div class="list-item" onclick="window.open('${game.url}', '_blank')">
                    <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.3rem;">${game.title}</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">${game.text.substring(0, 80)}${game.text.length > 80 ? '...' : ''}</div>
                    <div style="font-size: 0.8rem; opacity: 0.6; margin-top: 0.5rem; display: flex; justify-content: space-between;">
                        <span>Автор: ${game.author}</span>
                        <span style="color: var(--accent); font-weight: 600;">Играть ➔</span>
                    </div>
                </div>
            `;
            if (index % 2 === 0) {
                coolGamesContainer.insertAdjacentHTML('beforeend', itemHtml);
            } else {
                popularProjectsContainer.insertAdjacentHTML('beforeend', itemHtml);
            }
        });
    }

    // Search Box Filtering
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Filter feed cards
            const cards = feedContainer ? feedContainer.querySelectorAll('.feed-card') : [];
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });

            // Filter bottom game list items
            const listItems = document.querySelectorAll('.bottom-sections .list-item');
            listItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Initial load
    renderFeed();
    updateGamesLists();

    function enableNormalMode() {
        body.classList.remove('horror-mode');
        if (normalModeBtn && horrorModeBtn) {
            normalModeBtn.classList.add('active');
            horrorModeBtn.classList.remove('active');
        }
        localStorage.setItem('site_mode', 'normal');
        if (typeof currentRating !== 'undefined' && currentRating > 0) {
            showReviewFeedback(currentRating);
        }
        updateGamesLists();
    }

    function enableHorrorMode() {
        body.classList.add('horror-mode');
        if (normalModeBtn && horrorModeBtn) {
            horrorModeBtn.classList.add('active');
            normalModeBtn.classList.remove('active');
        }
        localStorage.setItem('site_mode', 'horror');
        if (typeof currentRating !== 'undefined' && currentRating > 0) {
            showReviewFeedback(currentRating);
        }
        updateGamesLists();
    }
});
