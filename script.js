document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        "Base is for everyone", // English
        "Base es para todos", // Spanish
        "Base est pour tout le monde", // French
        "Base ist für alle", // German
        "Base 是为所有人准备的", // Chinese (Simplified)
        "Base は皆のためです", // Japanese
        "Base 는 모두를 위한 것입니다", // Korean
        "Base jest dla wszystkich", // Polish
        "Base для всех", // Russian
        "Base é para todos", // Portuguese
        "Base è per tutti", // Italian
        "Base للجميع", // Arabic
        "Base je za svakoga", // Croatian
        "Base is voor iedereen", // Dutch
        "Base είναι για όλους", // Greek
        "Base सबके लिए है", // Hindi
        "Base për të gjithë", // Albanian
        "Base הוא לכולם", // Hebrew
        "Base для всіх", // Ukrainian
        "Base је за све", // Serbian
        "Base dành cho mọi người", // Vietnamese
        "Base je pro všechny", // Czech
        "Base pentru toată lumea", // Romanian
        "Base je za vse", // Slovenian
        "Base hər kəs üçündür", // Azerbaijani
        "Base ni kwa kila mtu", // Swahili
        "Base барои ҳама аст", // Tajik
        "Base е за сите", // Macedonian
        "Base yra visiems", // Lithuanian
        "Base ir visiem", // Latvian
        "Base ke bakeng sa bohle", // Sesotho
        "Base สำหรับทุกคน", // Thai
        "Base untuk semua orang", // Indonesian
        "Base é para todos", // Galician
        "Base je za sve", // Bosnian
        "Base mindenkié", // Hungarian
        "Base kõigi jaoks", // Estonian
        "Base er for alle", // Danish
        "Base fyrir alla", // Icelandic
        "Base semua", // Malay
        "Base pro každého", // Slovak
        "Base mo ĉiuj", // Esperanto
        "Base هر", // Persian
        "Base mỗi người", // Vietnamese (Latin)
        "Base tansi", // Cree
        "Base tout moun", // Haitian Creole
        "Base hver", // Norwegian
        "Base cada pessoa", // Portuguese (Brazilian)
        "Base mỗi người", // Vietnamese
        "Base mindenki számára", // Hungarian (Latin)
        "Base każda osoba", // Polish (Latin)
        "Base każdého", // Czech (Latin)
        "Base varje person", // Swedish
        "Base mindenki", // Hungarian (Latin)
        "Base هر کس", // Persian (Latin)
        "Base chiếu mọi người", // Vietnamese (Latin)
        "Base tất cả", // Vietnamese
        "Base kõikidele", // Estonian
        "Base hər kəs üçün", // Azerbaijani (Latin)
    ];

    let currentIndex = 0;
    const messageElement = document.getElementById('base-message');
    let angle = 0;
    let activePhrase = phrases[0];
    let resizeFrame = null;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createPhrasesArray() {
        const shuffledPhrases = phrases.slice(1);
        shuffle(shuffledPhrases);

        const newPhrases = [];
        for (let i = 0; i < shuffledPhrases.length; i++) {
            if ((i + 1) % 10 === 0) {
                newPhrases.push(phrases[0]);
            }
            newPhrases.push(shuffledPhrases[i]);
        }
        return newPhrases;
    }

    function fitMessage(phrase) {
        const styles = getComputedStyle(messageElement);
        const maxWidth = messageElement.clientWidth;
        const padding = parseFloat(styles.getPropertyValue('--message-padding')) || 0;
        const bodyStyles = getComputedStyle(document.body);
        const verticalInset =
            (parseFloat(bodyStyles.paddingTop) || 0) +
            (parseFloat(bodyStyles.paddingBottom) || 0);
        const maxHeight = window.innerHeight - verticalInset - (padding * 2);

        if (maxWidth <= 0 || maxHeight <= 0) {
            return;
        }

        const previousText = messageElement.textContent;
        messageElement.textContent = phrase;

        let low = 1;
        let high = Math.max(
            Math.floor(maxHeight * 0.92),
            Math.floor(maxWidth / Math.max(phrase.length * 0.3, 1))
        );

        while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            messageElement.style.fontSize = `${mid}px`;

            const fitsWidth = messageElement.scrollWidth <= maxWidth;
            const fitsHeight = messageElement.scrollHeight <= maxHeight * 0.92;

            if (fitsWidth && fitsHeight) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }

        messageElement.style.fontSize = `${Math.max(low, 1)}px`;
        messageElement.textContent = previousText;
    }

    function scheduleFit() {
        if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = null;
            fitMessage(activePhrase);
        });
    }

    function updateBackground() {
        angle = (angle + 0.1) % 360;
        document.body.style.background = `conic-gradient(from ${angle}deg at 50% 50%, #001cf5, #4874f7, #001cf5)`;
        requestAnimationFrame(updateBackground);
    }

    function writePhrase(phrase, callback) {
        activePhrase = phrase;
        fitMessage(phrase);

        let i = 0;
        messageElement.textContent = '';
        const writeInterval = setInterval(() => {
            if (i < phrase.length) {
                messageElement.textContent = phrase.slice(0, i + 1);
                i++;
            } else {
                clearInterval(writeInterval);
                setTimeout(callback, 2000);
            }
        }, 69);
    }

    function cyclePhrases(newPhrases) {
        writePhrase(newPhrases[currentIndex], () => {
            currentIndex = (currentIndex + 1) % newPhrases.length;
            cyclePhrases(newPhrases);
        });
    }

    window.addEventListener('resize', scheduleFit);
    window.addEventListener('orientationchange', scheduleFit);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleFit);
    }

    const newPhrases = createPhrasesArray();
    newPhrases.unshift(phrases[0]);
    updateBackground();
    cyclePhrases(newPhrases);
});
