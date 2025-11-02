// SVGを使用してPNG画像を生成・ダウンロードする関数
function downloadAsPNG() {
    const table = document.querySelector('.positioning-table');
    const tableRect = table.getBoundingClientRect();
    
    // SVG要素を作成
    const svgWidth = 800;
    const svgHeight = 360; // 120px × 3行
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // 背景を白に設定
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'white');
    svg.appendChild(background);

    // 表の枠線を描画
    const cellWidth = svgWidth / 2;
    const cellHeight = svgHeight / 3;
    
    // 縦線
    for (let i = 0; i <= 2; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', i * cellWidth);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', i * cellWidth);
        line.setAttribute('y2', svgHeight);
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }
    
    // 横線
    for (let i = 0; i <= 3; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', i * cellHeight);
        line.setAttribute('x2', svgWidth);
        line.setAttribute('y2', i * cellHeight);
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // 各セルのテキストを描画
    const cellIds = [
        ['left-top', 'right-top'],
        ['left-middle', 'right-middle'],
        ['left-bottom', 'right-bottom']
    ];

    cellIds.forEach((row, rowIndex) => {
        row.forEach((cellId, colIndex) => {
            const cell = document.getElementById(cellId);
            const cards = positions[cellId];
            
            if (cards && cards.length > 0) {
                const isLeftSide = cellId.includes('left');
                const margin = 20;
                const spacing = 18;
                const totalCardCount = cards.reduce((count, item) => {
                    return count + (Array.isArray(item) ? item.length : 1);
                }, 0);
                const baseX = colIndex * cellWidth + (isLeftSide
                    ? margin
                    : cellWidth - margin - (totalCardCount - 1) * spacing);
                const baseY = rowIndex * cellHeight + 25;
                
                let currentX = baseX;
                
                cards.forEach((item) => {
                    if (Array.isArray(item)) {
                        // 友札の場合
                        item.forEach((card) => {
                            drawVerticalText(svg, card, currentX, baseY, isLeftSide);
                            currentX += spacing;
                        });
                    } else {
                        // 単独札の場合
                        drawVerticalText(svg, item, currentX, baseY, isLeftSide);
                        currentX += spacing;
                    }
                });
            }
        });
    });

    // SVGをPNGに変換してダウンロード
    convertSvgToPng(svg, svgWidth, svgHeight);
}

// 縦書きテキストを描画する関数
function drawVerticalText(svg, text, x, y, isLeftAlign) {
    const chars = text.split('');
    chars.forEach((char, index) => {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y + (index * 15));
        textElement.setAttribute('font-family', 'Hiragino Maru Gothic ProN, Meiryo, sans-serif');
        textElement.setAttribute('font-size', '14');
        textElement.setAttribute('fill', '#000');
        textElement.setAttribute('text-anchor', 'middle');
        textElement.textContent = char;
        svg.appendChild(textElement);
    });
}

// キャンバスに縦書きテキストを描画する関数
function drawVerticalTextOnCanvas(ctx, text, x, y) {
    const chars = text.split('');
    chars.forEach((char, index) => {
        ctx.fillText(char, x, y + (index * 20));
    });
}

// SVGをPNGに変換する関数（iPhone対応版・ポップアップブロック対策付き）
function convertSvgToPng(svg, width, height) {
    // SVGを文字列に変換
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    
    // data URIを作成
    const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    
    // キャンバスを作成してSVGを描画
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width * 2; // 高解像度化
    canvas.height = height * 2;
    ctx.scale(2, 2);
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        
        // PNGデータをBase64として取得
        const dataURL = canvas.toDataURL('image/png');
        
        // iPhone/Safari対応のダウンロード処理
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Safari/i)) {
            // ポップアップを試行
            const newWindow = window.open('', '_blank');
            
            // ポップアップがブロックされた場合の対策
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                // ポップアップが失敗した場合、現在のページに画像を表示
                showImageInCurrentPage(dataURL);
            } else {
                // ポップアップが成功した場合
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>画像ダウンロード</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                body { 
                                    margin: 0; 
                                    padding: 20px; 
                                    text-align: center; 
                                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                                }
                                img { 
                                    max-width: 100%; 
                                    height: auto; 
                                    border: 1px solid #ccc;
                                    margin: 20px 0;
                                }
                                .instructions {
                                    background: #f0f0f0;
                                    padding: 15px;
                                    border-radius: 8px;
                                    margin: 20px 0;
                                    font-size: 14px;
                                    line-height: 1.5;
                                }
                            </style>
                        </head>
                        <body>
                            <h2>画像が生成されました</h2>
                            <img src="${dataURL}" alt="生成された画像">
                            <div class="instructions">
                                <strong>保存方法：</strong><br>
                                上の画像を長押し(or右クリック)<br>
                                → 「保存」を選択
                            </div>
                            <button onclick="window.close()" style="
                                padding: 12px 24px;
                                font-size: 16px;
                                background: #007AFF;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                            ">閉じる</button>
                        </body>
                    </html>
                `);
            }
        } else {
            // デスクトップブラウザの場合は従来の方法
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = '定位置_' + new Date().toISOString().slice(0, 10) + '.png';
                link.href = url;
                
                // ユーザーの操作をトリガーとして実行
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');
        }
    };
    
    img.onerror = function(error) {
        console.error('画像変換エラー:', error);
        alert('画像の変換に失敗しました。');
    };
    
    img.src = svgDataUri;
}

// ポップアップがブロックされた場合に現在のページに画像を表示する関数
function showImageInCurrentPage(dataURL) {
    // 既存のオーバーレイがあれば削除
    const existingOverlay = document.getElementById('image-download-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // オーバーレイを作成
    const overlay = document.createElement('div');
    overlay.id = 'image-download-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
    `;
    
    // コンテンツコンテナ
    const container = document.createElement('div');
    container.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 20px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    container.innerHTML = `
        <h2 style="margin-top: 0; color: #333;">画像が生成されました</h2>
        <img src="${dataURL}" alt="生成された画像" style="
            max-width: 100%; 
            height: auto; 
            border: 1px solid #ccc;
            margin: 20px 0;
            border-radius: 8px;
        ">
        <div style="
            background: #f0f0f0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            line-height: 1.5;
            color: #555;
        ">
            <strong>保存方法：</strong><br>
            上の画像を長押し(or右クリック)<br>
            → 「保存」を選択<br>
            <br>
            <small>※ポップアップがブロックされたため、こちらに表示しています</small>
        </div>
        <button id="close-overlay-btn" style="
            padding: 12px 24px;
            font-size: 16px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-right: 10px;
        ">閉じる</button>
    `;
    
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    // 閉じるボタンのイベント
    document.getElementById('close-overlay-btn').addEventListener('click', function() {
        overlay.remove();
    });
    
    // オーバーレイの背景をクリックしたら閉じる
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
