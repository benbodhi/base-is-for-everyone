document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        "Base is for everyone",
        "Base es para todos",
        "Base est pour tout le monde",
        "Base ist für alle",
        "Base 是为所有人准备的",
        "Base は皆のためです",
        "Base 는 모두를 위한 것입니다",
        "Base jest dla wszystkich",
        "Base для всех",
        "Base é para todos",
        "Base è per tutti",
        "Base للجميع",
        "Base je za svakoga",
        "Base is voor iedereen",
        "Base είναι για όλους",
        "Base सबके लिए है",
        "Base për të gjithë",
        "Base הוא לכולם",
        "Base для всіх",
        "Base је за све",
        "Base dành cho mọi người",
        "Base je pro všechny",
        "Base pentru toată lumea",
        "Base je za vse",
        "Base hər kəs üçündür",
        "Base ni kwa kila mtu",
        "Base барои ҳама аст",
        "Base е за сите",
        "Base yra visiems",
        "Base ir visiem",
        "Base ke bakeng sa bohle",
        "Base สำหรับทุกคน",
        "Base untuk semua orang",
        "Base é para todos",
        "Base je za sve",
        "Base mindenkié",
        "Base kõigi jaoks",
        "Base er for alle",
        "Base fyrir alla",
        "Base semua",
        "Base pro každého",
        "Base mo ĉiuj",
        "Base هر",
        "Base mỗi người",
        "Base tansi",
        "Base tout moun",
        "Base hver",
        "Base cada pessoa",
        "Base mindenki számára",
        "Base każda osoba",
        "Base każdého",
        "Base varje person",
        "Base mindenki",
        "Base هر کس",
        "Base chiếu mọi người",
        "Base tất cả",
        "Base kõikidele",
        "Base hər kəs üçün",
    ];

    const messageElement = document.getElementById('base-message');
    const stageElement = document.getElementById('stage');
    const measureCanvas = document.createElement('canvas');
    const measureContext = measureCanvas.getContext('2d');

    const fontFamily = 'Montserrat, sans-serif';
    const fontWeight = 500;
    const lineHeight = 1.2;
    const heightBudget = 0.22;
    const widthBudget = 0.88;

    let currentIndex = 0;
    let activePhrase = phrases[0];
    let resizeFrame = null;
    let typeFrame = null;

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

    function getBounds() {
        const rect = stageElement.getBoundingClientRect();
        return {
            width: rect.width * widthBudget,
            height: rect.height * heightBudget,
        };
    }

    function measurePhrase(phrase, fontSize) {
        measureContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const metrics = measureContext.measureText(phrase);
        const width = metrics.width;
        const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.78;
        const descent = metrics.actualBoundingBoxDescent || fontSize * 0.22;
        const height = (ascent + descent) * lineHeight;

        return { width, height };
    }

    function fitMessage(phrase) {
        const { width: maxWidth, height: maxHeight } = getBounds();
        if (maxWidth <= 0 || maxHeight <= 0) {
            return;
        }

        let low = 8;
        let high = Math.floor(Math.min(maxHeight / lineHeight, maxWidth / 3));

        while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            const { width, height } = measurePhrase(phrase, mid);

            if (width <= maxWidth && height <= maxHeight) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }

        messageElement.style.fontSize = `${Math.max(low, 12)}px`;
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

    function writePhrase(phrase, callback) {
        activePhrase = phrase;
        fitMessage(phrase);

        if (typeFrame !== null) {
            cancelAnimationFrame(typeFrame);
        }

        let index = 0;
        let lastTime = 0;
        const charDelay = 69;

        function step(timestamp) {
            if (!lastTime) {
                lastTime = timestamp;
            }

            if (timestamp - lastTime >= charDelay) {
                index += 1;
                lastTime = timestamp;
                messageElement.textContent = phrase.slice(0, index);
            }

            if (index < phrase.length) {
                typeFrame = requestAnimationFrame(step);
                return;
            }

            typeFrame = null;
            setTimeout(callback, 2000);
        }

        messageElement.textContent = '';
        typeFrame = requestAnimationFrame(step);
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
        window.visualViewport.addEventListener('scroll', scheduleFit);
    }

    const newPhrases = createPhrasesArray();
    newPhrases.unshift(phrases[0]);
    cyclePhrases(newPhrases);
});
