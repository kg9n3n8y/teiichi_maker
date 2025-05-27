// 札の配置を管理するオブジェクト
const positions = {
    'left-top': [],
    'left-middle': [],
    'left-bottom': [],
    'right-top': [],
    'right-middle': [],
    'right-bottom': []
};

// ランダムに要素を選択する関数
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 配列をシャッフルする関数
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 定位置を生成する関数
function generatePositioning() {
    // 配置をリセット
    Object.keys(positions).forEach(key => positions[key] = []);

    const handedness = document.getElementById('handedness').value;
    const isLeftHanded = handedness === 'left';

    // 左利きの場合の位置変換関数
    function convertPosition(pos) {
        if (!isLeftHanded) return pos;
        const mapping = {
            'left-top': 'right-top',
            'left-middle': 'right-middle',
            'left-bottom': 'right-bottom',
            'right-top': 'left-top',
            'right-middle': 'left-middle',
            'right-bottom': 'left-bottom'
        };
        return mapping[pos];
    }

    // 札を配置する関数
    function placeCard(card, position) {
        positions[convertPosition(position)].push(card);
    }

    // 友札を配置する関数
    function placePair(pair, position) {
        positions[convertPosition(position)].push(pair);
    }

    // 会の指導方針に基づく配置

    // む、めをランダムに配置
    const muMePositions = shuffle(['right-bottom', 'left-bottom']);
    placeCard('む', muMePositions[0]);
    placeCard('め', muMePositions[1]);

    // ふ、ほをランダムに配置
    const fuHoPositions = shuffle(['right-bottom', 'left-bottom']);
    placeCard('ふ', fuHoPositions[0]);
    placeCard('ほ', fuHoPositions[1]);

    // す、さ、せを配置（右下2枚、左下1枚）
    const suSaSe = shuffle(['す', 'さ', 'せ']);
    placeCard(suSaSe[0], 'right-bottom');
    placeCard(suSaSe[1], 'right-bottom');
    placeCard(suSaSe[2], 'left-bottom');

    // 5組の友札を配置
    const fivePairs = shuffle([
        ['うか', 'うら'], ['つき', 'つく'], ['しら', 'しの'], 
        ['もも', 'もろ'], ['ゆう', 'ゆら']
    ]);
    placePair(fivePairs[0], 'right-bottom');
    placePair(fivePairs[1], 'right-middle');
    placePair(fivePairs[2], 'right-middle');
    placePair(fivePairs[3], 'left-bottom');
    placePair(fivePairs[4], 'left-middle');

    // いに、ちは、ひさを配置
    const iniChihaHisaPositions = shuffle(['right-bottom', 'right-middle', 'left-bottom']);
    const iniChihaHisaCards = shuffle(['いに', 'ちは', 'ひさ']);
    const iniChihaHisaMapping = {};
    iniChihaHisaCards.forEach((card, index) => {
        placeCard(card, iniChihaHisaPositions[index]);
        iniChihaHisaMapping[card] = iniChihaHisaPositions[index];
    });

    // いまは・いまこを配置（いにと反対側で段も異なる、上段以外）
    const iniPos = iniChihaHisaMapping['いに'];
    if (iniPos === 'right-bottom') {
        placePair(['いまは', 'いまこ'], 'left-middle');
    } else if (iniPos === 'right-middle') {
        placePair(['いまは', 'いまこ'], 'left-bottom');
    } else if (iniPos === 'left-bottom') {
        placePair(['いまは', 'いまこ'], 'right-middle');
    }

    // ちぎりき・ちぎりおを配置（ちはと反対側で段も異なる、上段以外）
    const chihaPos = iniChihaHisaMapping['ちは'];
    if (chihaPos === 'right-bottom') {
        placePair(['ちぎりき', 'ちぎりお'], 'left-middle');
    } else if (chihaPos === 'right-middle') {
        placePair(['ちぎりき', 'ちぎりお'], 'left-bottom');
    } else if (chihaPos === 'left-bottom') {
        placePair(['ちぎりき', 'ちぎりお'], 'right-middle');
    }

    // ひとは・ひともを配置（ひさと反対側で段も異なる、上段以外）
    const hisaPos = iniChihaHisaMapping['ひさ'];
    if (hisaPos === 'right-bottom') {
        placePair(['ひとは', 'ひとも'], 'left-middle');
    } else if (hisaPos === 'right-middle') {
        placePair(['ひとは', 'ひとも'], 'left-bottom');
    } else if (hisaPos === 'left-bottom') {
        placePair(['ひとは', 'ひとも'], 'right-middle');
    }

    // きりを配置
    placeCard('きり', 'left-bottom');

    // はる系の配置（右上段に1組、左中段に1組をランダムに）
    const haruPairs = shuffle([['はるす', 'はるの'], ['はなさ', 'はなの']]);
    const haruPositions = shuffle(['right-top', 'left-middle']);
    placePair(haruPairs[0], haruPositions[0]);
    placePair(haruPairs[1], haruPositions[1]);

    // や系の配置（右下段に1組、左中段に1組をランダムに）
    const yaPairs = shuffle([['やす', 'やえ'], ['やまが', 'やまざ']]);
    const yaPositions = shuffle(['right-bottom', 'left-middle']);
    placePair(yaPairs[0], yaPositions[0]);
    placePair(yaPairs[1], yaPositions[1]);

    // よを・よもを配置
    placePair(['よを', 'よも'], 'left-middle');

    // か系の配置（右中段に1組、左下段に1組をランダムに）
    const kaPairs = shuffle([['かく', 'かさ'], ['かぜを', 'かぜそ']]);
    const kaPositions = shuffle(['right-middle', 'left-bottom']);
    placePair(kaPairs[0], kaPositions[0]);
    placePair(kaPairs[1], kaPositions[1]);

    // み系の配置
    const miCards = shuffle(['みち', 'みせ', 'みよ']);
    placeCard(miCards[0], 'right-bottom');
    placeCard(miCards[1], 'left-bottom');
    placeCard(miCards[2], 'left-bottom');
    placePair(['みかき', 'みかの'], 'right-top');

    // た系の配置
    const taCards = shuffle(['たか', 'たち', 'たご', 'たま', 'たき', 'たれ']);
    placeCard(taCards[0], 'right-bottom');
    placeCard(taCards[1], 'right-middle');
    placeCard(taCards[2], 'right-middle');
    placeCard(taCards[3], 'left-bottom');
    placeCard(taCards[4], 'left-bottom');
    placeCard(taCards[5], 'left-middle');

    // こ系の配置
    const koCards = shuffle(['この', 'こぬ', 'こい', 'これ']);
    placeCard(koCards[0], 'left-middle');
    placeCard(koCards[1], 'left-middle');
    placeCard(koCards[2], 'right-bottom');
    placeCard(koCards[3], 'right-bottom');
    placePair(['こころあ', 'こころに'], 'right-top');

    // お系の配置
    const oCards = shuffle(['おく', 'おと', 'おぐ', 'おも']);
    placeCard(oCards[0], 'right-bottom');
    placeCard(oCards[1], 'right-middle');
    placeCard(oCards[2], 'left-bottom');
    placeCard(oCards[3], 'left-middle');
    const oo = shuffle(['おおえ', 'おおけ', 'おおこ']);
    placeCard(oo[0], 'right-top');
    placeCard(oo[1], 'right-top');
    placeCard(oo[2], 'left-top');

    // わ系の配置
    placeCard('わび', 'left-bottom');
    const waPairs = shuffle([['わがい', 'わがそ'], ['わすれ', 'わすら']]);
    const waPositions = shuffle(['right-top', 'left-top']);
    placePair(waPairs[0], waPositions[0]);
    placePair(waPairs[1], waPositions[1]);

    // な系の配置
    placeCard('なつ', 'right-bottom');
    placeCard('なにし', 'right-middle');
    placePair(['なにわが', 'なにわえ'], 'left-top');
    const naPairs = shuffle([['ながら', 'ながか'], ['なげき', 'なげけ']]);
    const naPositions = shuffle(['left-middle', 'right-top']);
    placePair(naPairs[0], naPositions[0]);
    placePair(naPairs[1], naPositions[1]);

    // あ系の配置
    const aCards = shuffle(['あい', 'あし', 'あけ']);
    const aPositions = shuffle(['right-bottom', 'right-middle', 'left-bottom']);
    aCards.forEach((card, index) => placeCard(card, aPositions[index]));

    const aPairs1 = shuffle([['あらし', 'あらざ'], ['ありま', 'ありあ']]);
    const aPositions1 = shuffle(['left-bottom', 'right-top']);
    placePair(aPairs1[0], aPositions1[0]);
    placePair(aPairs1[1], aPositions1[1]);

    const aPairs2 = shuffle([['あわじ', 'あわれ'], ['あまつ', 'あまの']]);
    const aPositions2 = shuffle(['left-top', 'right-top']);
    placePair(aPairs2[0], aPositions2[0]);
    placePair(aPairs2[1], aPositions2[1]);

    placePair(['あきの', 'あきか'], 'left-top');
    placeCard('あさじ', 'left-middle');

    // 端の札を配置
    const endPairs1 = shuffle([['よのなかは', 'よのなかよ'], ['あさぼらけあ', 'あさぼらけう']]);
    positions[convertPosition('right-bottom')].unshift(endPairs1[0]);
    positions[convertPosition('right-bottom')].push(endPairs1[1]);

    const endPairs2 = shuffle([['わたのはらや', 'わたのはらこ'], ['きみがためは', 'きみがためお']]);
    positions[convertPosition('right-middle')].unshift(endPairs2[0]);
    positions[convertPosition('right-middle')].push(endPairs2[1]);

    // 表示を更新
    displayPositioning();
}

// 定位置を表示する関数
function displayPositioning() {
    Object.keys(positions).forEach(position => {
        const cell = document.getElementById(position);
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        positions[position].forEach(item => {
            if (Array.isArray(item)) {
                // 友札の場合
                item.forEach(card => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'card';
                    cardDiv.textContent = card;
                    cardContainer.appendChild(cardDiv);
                });
            } else {
                // 単独札の場合
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card';
                cardDiv.textContent = item;
                cardContainer.appendChild(cardDiv);
            }
        });

        cell.innerHTML = '';
        cell.appendChild(cardContainer);
    });

    document.getElementById('positioning-area').style.display = 'block';
    document.getElementById('print-btn').style.display = 'inline-block';
}