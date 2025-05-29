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

    // 札を右端に配置する関数
    function placeCardRight(card, position) {
        if (!isLeftHanded) {
            positions[convertPosition(position)].push(card);
        } else {
            positions[convertPosition(position)].unshift(card);
        }
    } 

    // 札を左端に配置する関数
    function placeCardLeft(card, position) {
        if (!isLeftHanded) {
            positions[convertPosition(position)].unshift(card);
        } else {
            positions[convertPosition(position)].push(card);
        }
    }

    // 友札を右端に配置する関数
    function placePairRight(pair, position) {
        if (!isLeftHanded) {
            positions[convertPosition(position)].push(pair);
        } else {
            positions[convertPosition(position)].unshift(pair);
        }
    }

    // 友札を左端に配置する関数
    function placePairLeft(pair, position) {
        if (!isLeftHanded) {
            positions[convertPosition(position)].unshift(pair);
        } else {
            positions[convertPosition(position)].push(pair);
        }
    }

    // 会の指導方針に基づく配置

    // む、めをランダムに配置
    const muMe = shuffle(['む', 'め']);
    placeCardRight(muMe[0], 'right-bottom');
    placeCardLeft(muMe[1], 'left-bottom');

    // ふ、ほをランダムに配置
    const fuHo = shuffle(['ふ', 'ほ']);
    placeCardRight(fuHo[0], 'right-bottom');
    placeCardLeft(fuHo[1], 'left-bottom');

    // す、さ、せを配置（右下2枚、左下1枚）
    const suSaSe = shuffle(['す', 'さ', 'せ']);
    placeCardRight(suSaSe[0], 'right-bottom');
    placeCardRight(suSaSe[1], 'right-bottom');
    placeCardLeft(suSaSe[2], 'left-bottom');

    // 5組の友札を配置
    const fivePairs = shuffle([
        ['うか', 'うら'], ['つき', 'つく'], ['しら', 'しの'], 
        ['もも', 'もろ'], ['ゆう', 'ゆら']
    ]);
    placePairRight(fivePairs[0], 'right-bottom');
    placePairRight(fivePairs[1], 'right-middle');
    placePairRight(fivePairs[2], 'right-middle');
    placePairLeft(fivePairs[3], 'left-bottom');
    placePairLeft(fivePairs[4], 'left-middle');

    // いに、ちは、ひさを配置
    const iniChihaHisaCards = shuffle(['いに', 'ちは', 'ひさ']);
    placeCardRight(iniChihaHisaCards[0], 'right-bottom');
    placeCardRight(iniChihaHisaCards[1], 'right-middle');
    placeCardLeft(iniChihaHisaCards[2], 'left-bottom');

    // きりを配置
    placeCardLeft('きり', 'left-bottom');

    // よを・よもを配置
    placePairLeft(['よを', 'よも'], 'left-middle');

    // み(2字札)の配置
    const miCards = shuffle(['みち', 'みせ', 'みよ']);
    placeCardRight(miCards[0], 'right-bottom');
    placeCardLeft(miCards[1], 'left-bottom');
    placeCardLeft(miCards[2], 'left-bottom');

    // た札の配置
    const taCards = shuffle(['たか', 'たち', 'たご', 'たま', 'たき', 'たれ']);
    placeCardRight(taCards[0], 'right-bottom');
    placeCardRight(taCards[1], 'right-middle');
    placeCardRight(taCards[2], 'right-middle');
    placeCardLeft(taCards[3], 'left-bottom');
    placeCardLeft(taCards[4], 'left-bottom');
    placeCardLeft(taCards[5], 'left-middle');

    // こ(2字札)の配置
    const koCards = shuffle(['この', 'こぬ', 'こい', 'これ']);
    placeCardLeft(koCards[0], 'left-middle');
    placeCardLeft(koCards[1], 'left-middle');
    placeCardRight(koCards[2], 'right-bottom');
    placeCardRight(koCards[3], 'right-bottom');

    // お(2字札)の配置
    const oCards = shuffle(['おく', 'おと', 'おぐ', 'おも']);
    placeCardRight(oCards[0], 'right-bottom');
    placeCardRight(oCards[1], 'right-middle');
    placeCardLeft(oCards[2], 'left-bottom');
    placeCardLeft(oCards[3], 'left-middle');

    // わび(左下段)・なつ(右下段)の配置
    placeCardLeft('わび', 'left-bottom');
    placeCardRight('なつ', 'right-bottom');

    // あい・あし・あけの配置（右下段・右中段・左下段に1枚ずつ）
    const aCards = shuffle(['あい', 'あし', 'あけ']);
    placeCardRight(aCards[0], 'right-bottom');
    placeCardRight(aCards[1], 'right-middle');
    placeCardLeft(aCards[2], 'left-bottom');

    // や札の配置（右下段に1組、左中段に1組をランダムに）
    const yaPairs = shuffle([['やす', 'やえ'], ['やまが', 'やまざ']]);
    placePairRight(yaPairs[0], 'right-bottom');
    placePairLeft(yaPairs[1], 'left-middle');
    
    // か札の配置（右中段に1組、左下段に1組をランダムに）
    const kaPairs = shuffle([['かく', 'かさ'], ['かぜを', 'かぜそ']]);
    placePairRight(kaPairs[0], 'right-middle');
    placePairLeft(kaPairs[1], 'left-bottom');

    // いまは・いまこを配置（いにと反対側で段も異なる、上段以外）
    if (iniChihaHisaCards[0] === 'いに') {
        placePairLeft(['いまは', 'いまこ'], 'left-middle');
    } else if (iniChihaHisaCards[1] === 'いに') {
        placePairLeft(['いまは', 'いまこ'], 'left-bottom');
    } else if (iniChihaHisaCards[2] === 'いに') {
        placePairRight(['いまは', 'いまこ'], 'right-middle');
    }

    // ひとは・ひともを配置（ひさと反対側で段も異なる、上段以外）
    if (iniChihaHisaCards[0] === 'ひさ') {
        placePairLeft(['ひとは', 'ひとも'], 'left-middle');
    } else if (iniChihaHisaCards[1] === 'ひさ') {
        placePairLeft(['ひとは', 'ひとも'], 'left-bottom');
    } else if (iniChihaHisaCards[2] === 'ひさ') {
        placePairRight(['ひとは', 'ひとも'], 'right-middle');
    }

    // は札の配置（右上段に1組、左中段に1組をランダムに）
    const haruPairs = shuffle([['はるす', 'はるの'], ['はなさ', 'はなの']]);
    placePairRight(haruPairs[0], 'right-top');
    placePairLeft(haruPairs[1], 'left-middle');

    // みかき・みかのを配置（右上段）
    placePairRight(['みかき', 'みかの'], 'right-top');

    // お(3字札)の配置（右上段に2枚、左上段に1枚をランダムに配置）
    const ooCards = shuffle(['おおえ', 'おおけ', 'おおこ']);
    placeCardRight(ooCards[0], 'right-top');
    placeCardRight(ooCards[1], 'right-top');
    placeCardLeft(ooCards[2], 'left-top');

    // わ(3字札)の配置（右上段に1組、左上段に1組をランダムに配置）
    const waPairs = shuffle([['わがい', 'わがそ'], ['わすれ', 'わすら']]);
    placePairRight(waPairs[0], 'right-top');
    placePairLeft(waPairs[1], 'left-top');

    // な(3字札)の配置
    placeCardRight('なにし', 'right-middle');
    const naPairs = shuffle([['ながら', 'ながか'], ['なげき', 'なげけ']]);
    placePairLeft(naPairs[0], 'left-middle');
    placePairRight(naPairs[1], 'right-top');

    // あ(3字札)の配置
    const aPairs1 = shuffle([['あわじ', 'あわれ'], ['あまつ', 'あまの'], ['あきの', 'あきか']]);
    placePairLeft(aPairs1[0], 'left-top');
    placePairLeft(aPairs1[1], 'left-top');
    placePairRight(aPairs1[2], 'right-top');

    const aPairs2 = shuffle([['あらし', 'あらざ'], ['ありま', 'ありあ']]);
    placePairLeft(aPairs2[0], 'left-bottom');
    placePairRight(aPairs2[1], 'right-top');

    placeCardLeft('あさじ', 'left-middle');

    // ちぎりき・ちぎりおを配置（ちはと反対側で段も異なる、上段以外）
    if (iniChihaHisaCards[0] === 'ちは') {
        placePairLeft(['ちぎりき', 'ちぎりお'], 'left-middle');
    } else if (iniChihaHisaCards[1] === 'ちは') {
        placePairLeft(['ちぎりき', 'ちぎりお'], 'left-bottom');
    } else if (iniChihaHisaCards[2] === 'ちは') {
        placePairRight(['ちぎりき', 'ちぎりお'], 'right-middle');
    }

    // こころに・こころあを配置
    placePairRight(['こころあ', 'こころに'], 'right-top');
 
    // なにわが・なにわえを配置
    placePairLeft(['なにわが', 'なにわえ'], 'left-top');

    // 5,6字を配置
    const endPairs1 = shuffle([['よのなかは', 'よのなかよ'], ['あさぼらけあ', 'あさぼらけう']]);
    placePairLeft(endPairs1[0], 'right-bottom');
    placePairRight(endPairs1[1], 'right-bottom');

    const endPairs2 = shuffle([['わたのはらや', 'わたのはらこ'], ['きみがためは', 'きみがためお']]);
    placePairLeft(endPairs2[0], 'right-middle');
    placePairRight(endPairs2[1], 'right-middle');

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