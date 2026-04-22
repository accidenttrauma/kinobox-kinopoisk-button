// ==UserScript==
// @name         Kinobox Flag
// @namespace    https://github.com/accidettrauma/kinobox-kinopoisk-button
// @version      1.0
// @description  Чёрный флажок сверху слева
// @author       accidenttrauma
// @match        https://www.kinopoisk.ru/film/*
// @match        https://www.kinopoisk.ru/series/*
// @grant        none
// @run-at       document-end
// @icon         https://raw.githubusercontent.com/accidenttrauma/kinobox-kinopoisk-button/main/icon.png
// @downloadURL  https://raw.githubusercontent.com/accidenttrauma/kinobox-kinopoisk-button/main/kinobox-kinopoisk-button.user.js
// @updateURL    https://raw.githubusercontent.com/accidenttrauma/kinobox-kinopoisk-button/main/kinobox-kinopoisk-button.user.js
// ==/UserScript==

(function () {
    'use strict';

    function getFilmId() {
        return location.pathname.match(/\/(film|series)\/(\d+)/)?.[2];
    }

    function createFlag(filmId) {
        if (document.getElementById('kinobox-flag')) return;

        const flag = document.createElement('div');
        flag.id = 'kinobox-flag';

        flag.innerHTML = `
            <svg width="34" height="150" viewBox="0 0 128 512" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M128 0H0V512L64 480L128 512Z" fill="#000000"/>
                <!-- Белая кнопка Play, смотрит вправо, ниже центра -->
                <path d="M40 358 L100 390 L40 423 Z" fill="#ffffff"/>
            </svg>
        `;

        flag.style.cssText = `
            position: fixed;
            left: 8px;
            top: -48px;
            width: 32px;
            height: 128px;
            z-index: 2147483647;
            cursor: pointer;
            transition: transform 0.35s ease;
            transform: translateY(0);
        `;

        // Минимальное движение вниз на ~10px
        flag.onmouseenter = () => {
            flag.style.transform = 'translateY(12px)';
        };

        flag.onmouseleave = () => {
            flag.style.transform = 'translateY(0)';
        };

        flag.onclick = (e) => {
            e.stopImmediatePropagation();
            window.open(`https://kinobox.in/movie/${filmId}/`, '_blank');
        };

        document.body.appendChild(flag);
        console.log(`[Kinobox Flag 1.5] Флажок добавлен для ID ${filmId}`);
    }

    function init() {
        const interval = setInterval(() => {
            const id = getFilmId();
            if (id) {
                clearInterval(interval);
                createFlag(id);
            }
        }, 600);
    }

    init();

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 1200);
        }
    }).observe(document, { subtree: true, childList: true });

})();
