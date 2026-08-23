document.addEventListener('DOMContentLoaded', () => {
    const translations = [
        "is for everyone",
        "es para todos",
        "est pour tout le monde",
        "ist für alle",
        "是为所有人准备的",
        "は皆のためです",
        "는 모두를 위한 것입니다",
        "jest dla wszystkich",
        "для всех",
        "é para todos",
        "è per tutti",
        "للجميع",
        "is voor iedereen",
        "είναι για όλους",
        "सबके लिए है",
        "është për të gjithë",
        "הוא לכולם",
        "для всіх",
        "је за све",
        "dành cho mọi người",
        "je pro všechny",
        "este pentru toată lumea",
        "je za vse",
        "hər kəs üçündür",
        "ni kwa kila mtu",
        "барои ҳама аст",
        "е за сите",
        "yra visiems",
        "ir visiem",
        "สำหรับทุกคน",
        "untuk semua orang",
        "je za sve",
        "mindenkié",
        "on kõigi jaoks",
        "er for alle",
        "er fyrir alla",
        "je pre každého",
        "estas por ĉiuj",
        "برای همه است",
        "para sa lahat",
        "är för alla",
        "on kaikille",
        "herkes içindir",
        "je za svakoga",
        "għal kulħadd",
        "est per a tothom",
        "thuộc về mọi người",
        "для усіх",
        "е за всички",
        "არის ყველასთვის",
        "բոլորի համար է",
        "барлығы үшін",
        "hamma uchun",
        "бүх хүнд",
        "is vir almal",
        "est omnibus",
        "est destiné à tous",
        "ist für jeden",
        "geldt voor iedereen",
        "سب کے لیے ہے",
        "সবার জন্য",
        "அனைவருக்கும்",
        "అందరికీ",
        "सर्वांसाठी आहे",
        "દરેક માટે છે",
        "ಎಲ್ಲರಿಗೂ",
        "എല്ലാവർക്കും",
        "ਸਭ ਲਈ ਹੈ",
        "සැමටම",
        "សម្រាប់គ្រប់គ្នា",
        "ສຳລັບທຸກຄົນ",
        "အားလုံးအတွက်",
        "je za vsakogar",
        "е за всеки",
        "для каждого",
        "é per a tothom",
        "está para todos",
        "on kaikkien",
        "är till för alla",
        "do gach duine é",
        "tha e airson a h-uile duine",
        "evit an holl eo",
        "ar gyfer pawb yw",
        "guztiontzako da",
        "ke bakeng sa bohle",
        "kwa wote",
        "fun gbogbo eniyan",
        "mo e tagata uma",
        "para ki te katoa",
        "cho mọi người",
        "sa lahat",
        "para kaninuman",
        "bagi semua",
        "ha kila mtu",
        "kwa kila mmoja",
        "binhi ya bantu nyonso",
        "ni ya kila mtu",
        "di na obi ọ bụla",
        "ye bɛɛ ye",
        "di na mɔgɔ bɛɛ ye",
        "di maa mɔ ni nyinaa",
        "kwa watu wote",
        "no te mea e",
        "para todos os",
        "está para toda a gente",
        "é para toda a gente",
        "está para toda la gente",
        "適合所有人",
        "皆のものです",
        "모두를 위한",
        "jest dla każdego",
        "для всех нас",
        "для кожного",
        "для кожного з нас",
        "pentru toți",
        "pentru toată lumea",
        "za sve",
        "za svakoga",
        "za vsakogar",
        "pro každého",
        "pro všechny",
        "pre každého",
        "pre všetkých",
        "mindenki számára",
    ];

    const messageElement = document.getElementById('base-message');
    const suffixElement = document.getElementById('base-suffix');
    const stageElement = document.getElementById('stage');
    const measureCanvas = document.createElement('canvas');
    const measureContext = measureCanvas.getContext('2d');

    const fontFamily = 'Montserrat, sans-serif';
    const fontWeight = 500;
    const lineHeight = 1.2;
    const heightBudget = 0.11;
    const widthBudget = 0.88;
    const charDelay = 69;
    const holdDuration = 2000;
    const basePrefix = 'Base ';

    let deck = [];
    let currentSuffix = '';
    let lockedFontSize = null;
    let lockedSuffixWidth = null;
    let resizeFrame = null;
    let typeFrame = null;
    let cycling = false;

    function shuffle(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function refillDeck(exclude) {
        deck = shuffle(translations);
        if (deck.length > 1 && deck[0] === exclude) {
            [deck[0], deck[1]] = [deck[1], deck[0]];
        }
    }

    function nextSuffix(exclude) {
        if (deck.length === 0) {
            refillDeck(exclude);
        }
        return deck.pop();
    }

    function getBounds() {
        const rect = stageElement.getBoundingClientRect();
        return {
            width: rect.width * widthBudget,
            height: rect.height * heightBudget,
        };
    }

    function measureText(text, fontSize) {
        measureContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const metrics = measureContext.measureText(text);
        const width = metrics.width;
        const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.78;
        const descent = metrics.actualBoundingBoxDescent || fontSize * 0.22;
        const height = (ascent + descent) * lineHeight;

        return { width, height };
    }

    function widestPhrase(fontSize) {
        let widest = `${basePrefix}${translations[0]}`;
        let maxWidth = measureText(widest, fontSize).width;

        for (const suffix of translations) {
            const candidate = `${basePrefix}${suffix}`;
            const width = measureText(candidate, fontSize).width;
            if (width > maxWidth) {
                maxWidth = width;
                widest = candidate;
            }
        }

        return widest;
    }

    function widestSuffix(fontSize) {
        let widest = translations[0];
        let maxWidth = measureText(widest, fontSize).width;

        for (const suffix of translations) {
            const width = measureText(suffix, fontSize).width;
            if (width > maxWidth) {
                maxWidth = width;
                widest = suffix;
            }
        }

        return { suffix: widest, width: maxWidth };
    }

    function applyLockedLayout() {
        if (lockedFontSize === null || lockedSuffixWidth === null) {
            return;
        }

        messageElement.style.fontSize = `${lockedFontSize}px`;
        suffixElement.style.setProperty('--suffix-width', `${Math.ceil(lockedSuffixWidth)}px`);
    }

    function lockLayout() {
        const { width: maxWidth, height: maxHeight } = getBounds();
        if (maxWidth <= 0 || maxHeight <= 0) {
            return;
        }

        const sample = widestPhrase(100);
        let low = 8;
        let high = Math.floor(Math.min(maxHeight / lineHeight, maxWidth));

        while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            const { width, height } = measureText(sample, mid);

            if (width <= maxWidth && height <= maxHeight) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }

        lockedFontSize = Math.max(low, 12);
        lockedSuffixWidth = widestSuffix(lockedFontSize).width;
        applyLockedLayout();
    }

    function scheduleLayoutLock() {
        if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = null;
            lockLayout();
        });
    }

    function stopTyping() {
        if (typeFrame !== null) {
            cancelAnimationFrame(typeFrame);
            typeFrame = null;
        }
    }

    function typeSuffix(suffix, onComplete) {
        stopTyping();

        let index = 0;
        let lastTime = 0;
        suffixElement.textContent = '';

        function step(timestamp) {
            if (!lastTime) {
                lastTime = timestamp;
            }

            if (timestamp - lastTime >= charDelay) {
                index += 1;
                lastTime = timestamp;
                suffixElement.textContent = suffix.slice(0, index);
            }

            if (index < suffix.length) {
                typeFrame = requestAnimationFrame(step);
                return;
            }

            typeFrame = null;
            onComplete();
        }

        typeFrame = requestAnimationFrame(step);
    }

    function cycle() {
        if (cycling) {
            return;
        }
        cycling = true;

        const run = () => {
            currentSuffix = nextSuffix(currentSuffix);
            typeSuffix(currentSuffix, () => {
                window.setTimeout(() => {
                    run();
                }, holdDuration);
            });
        };

        run();
    }

    window.addEventListener('resize', scheduleLayoutLock);
    window.addEventListener('orientationchange', scheduleLayoutLock);

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleLayoutLock);
        window.visualViewport.addEventListener('scroll', scheduleLayoutLock);
    }

    lockLayout();
    cycle();
});
