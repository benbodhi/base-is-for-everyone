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
        "pro vsechny",
        "pre každého",
        "pre všetkých",
        "mindenki számára",
    ];

    const messageElement = document.getElementById('base-message');
    const suffixSlot = document.getElementById('suffix-slot');
    const suffixLayers = Array.from(suffixSlot.querySelectorAll('.suffix-layer'));
    const stageElement = document.getElementById('stage');
    const measureCanvas = document.createElement('canvas');
    const measureContext = measureCanvas.getContext('2d');

    const fontFamily = 'Montserrat, sans-serif';
    const fontWeight = 500;
    const lineHeight = 1.2;
    const heightBudget = 0.11;
    const widthBudget = 0.88;
    const holdDuration = 3200;
    const transitionDuration = 900;

    let visibleLayer = 0;
    let currentSuffix = translations[0];
    let deck = [];
    let resizeFrame = null;
    let cycleTimer = null;

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
        let widest = `Base ${translations[0]}`;
        let maxWidth = measureText(widest, fontSize).width;

        for (const suffix of translations) {
            const candidate = `Base ${suffix}`;
            const width = measureText(candidate, fontSize).width;
            if (width > maxWidth) {
                maxWidth = width;
                widest = candidate;
            }
        }

        return widest;
    }

    function fitMessage() {
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

        messageElement.style.fontSize = `${Math.max(low, 12)}px`;
        updateSlotWidth(currentSuffix);
    }

    function updateSlotWidth(suffix) {
        const fontSize = parseFloat(getComputedStyle(messageElement).fontSize) || 16;
        const width = measureText(suffix, fontSize).width;
        suffixSlot.style.width = `${Math.ceil(width)}px`;
    }

    function setLayerText(layerIndex, suffix) {
        suffixLayers[layerIndex].textContent = suffix;
    }

    function resetLayerClasses() {
        suffixLayers.forEach((layer) => {
            layer.className = 'suffix-layer';
        });
    }

    function transitionTo(nextText) {
        const incomingIndex = visibleLayer ^ 1;
        const outgoingIndex = visibleLayer;

        setLayerText(incomingIndex, nextText);

        const fontSize = parseFloat(getComputedStyle(messageElement).fontSize) || 16;
        const nextWidth = measureText(nextText, fontSize).width;
        const currentWidth = measureText(currentSuffix, fontSize).width;
        suffixSlot.style.width = `${Math.ceil(Math.max(nextWidth, currentWidth))}px`;

        resetLayerClasses();
        suffixLayers[outgoingIndex].classList.add('is-visible', 'is-leaving');
        suffixLayers[incomingIndex].classList.add('is-entering');

        requestAnimationFrame(() => {
            suffixLayers[incomingIndex].classList.add('is-visible');
        });

        window.setTimeout(() => {
            resetLayerClasses();
            suffixLayers[incomingIndex].classList.add('is-visible');
            setLayerText(outgoingIndex, '');
            visibleLayer = incomingIndex;
            currentSuffix = nextText;
            updateSlotWidth(currentSuffix);
        }, transitionDuration);
    }

    function scheduleCycle() {
        if (cycleTimer !== null) {
            clearTimeout(cycleTimer);
        }

        cycleTimer = window.setTimeout(() => {
            transitionTo(nextSuffix(currentSuffix));
            scheduleCycle();
        }, holdDuration + transitionDuration);
    }

    function scheduleFit() {
        if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = null;
            fitMessage();
        });
    }

    window.addEventListener('resize', scheduleFit);
    window.addEventListener('orientationchange', scheduleFit);

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleFit);
        window.visualViewport.addEventListener('scroll', scheduleFit);
    }

    refillDeck(null);
    currentSuffix = nextSuffix(null);
    setLayerText(visibleLayer, currentSuffix);
    suffixLayers[visibleLayer].classList.add('is-visible');
    fitMessage();
    scheduleCycle();
});
