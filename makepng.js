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
                const baseX = colIndex * cellWidth + (isLeftSide ? 20 : cellWidth - 20);
                const baseY = rowIndex * cellHeight + 25;
                
                let currentX = baseX;
                
                cards.forEach((item, cardIndex) => {
                    if (Array.isArray(item)) {
                        // 友札の場合
                        item.forEach((card, pairIndex) => {
                            drawVerticalText(svg, card, currentX, baseY, isLeftSide);
                            currentX += isLeftSide ? 18 : -18;
                        });
                    } else {
                        // 単独札の場合
                        drawVerticalText(svg, item, currentX, baseY, isLeftSide);
                        currentX += isLeftSide ? 18 : -18;
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

// // SVGをPNGに変換する関数（iPhone対応版）
// function convertSvgToPng(svg, width, height) {
//     // SVGを文字列に変換
//     const serializer = new XMLSerializer();
//     const svgString = serializer.serializeToString(svg);
    
//     // data URIを作成
//     const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    
//     // キャンバスを作成してSVGを描画
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     canvas.width = width * 2; // 高解像度化
//     canvas.height = height * 2;
//     ctx.scale(2, 2);
    
//     const img = new Image();
//     img.onload = function() {
//         ctx.drawImage(img, 0, 0);
        
//         // PNGデータをBase64として取得
//         const dataURL = canvas.toDataURL('image/png');
        
//         // iPhone/Safari対応のダウンロード処理
//         if (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Safari/i)) {
//             // 新しいウィンドウで画像を開く（iPhoneの場合）
//             const newWindow = window.open();
//             newWindow.document.write(`
//                 <html>
//                     <head>
//                         <title>画像ダウンロード</title>
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <style>
//                             body { 
//                                 margin: 0; 
//                                 padding: 20px; 
//                                 text-align: center; 
//                                 font-family: -apple-system, BlinkMacSystemFont, sans-serif;
//                             }
//                             img { 
//                                 max-width: 100%; 
//                                 height: auto; 
//                                 border: 1px solid #ccc;
//                                 margin: 20px 0;
//                             }
//                             .instructions {
//                                 background: #f0f0f0;
//                                 padding: 15px;
//                                 border-radius: 8px;
//                                 margin: 20px 0;
//                                 font-size: 14px;
//                                 line-height: 1.5;
//                             }
//                         </style>
//                     </head>
//                     <body>
//                         <h2>画像が生成されました</h2>
//                         <img src="${dataURL}" alt="生成された画像">
//                         <div class="instructions">
//                             <strong>保存方法：</strong><br>
//                             画像を長押し → 「写真に保存」を選択
//                         </div>
//                         <button onclick="window.close()" style="
//                             padding: 12px 24px;
//                             font-size: 16px;
//                             background: #007AFF;
//                             color: white;
//                             border: none;
//                             border-radius: 8px;
//                             cursor: pointer;
//                         ">閉じる</button>
//                     </body>
//                 </html>
//             `);
//         } else {
//             // デスクトップブラウザの場合は従来の方法
//             canvas.toBlob(function(blob) {
//                 const url = URL.createObjectURL(blob);
//                 const link = document.createElement('a');
//                 link.download = '定位置_' + new Date().toISOString().slice(0, 10) + '.png';
//                 link.href = url;
                
//                 // ユーザーの操作をトリガーとして実行
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//                 URL.revokeObjectURL(url);
//             }, 'image/png');
//         }
//     };
    
//     img.onerror = function(error) {
//         console.error('画像変換エラー:', error);
//         alert('画像の変換に失敗しました。');
//     };
    
//     img.src = svgDataUri;
// }

// さらにシンプルな代替案（Base64データURLを直接表示）
function convertSvgToPng(svg, width, height) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        
        // データURLを新しいタブで開く（すべてのブラウザ対応）
        const newTab = window.open();
        newTab.document.write(`
            <img src="${dataURL}" style="max-width:100%; height:auto;" alt="Generated Image">
            <br><br>
            <p style="font-family: sans-serif; padding: 0 20px;">
                <strong>保存方法：</strong><br>
                • iPhone/iPad: 画像を長押し → 「写真に保存」<br>
                • Android: 画像を長押し → 「画像をダウンロード」<br>
                • PC: 右クリック → 「名前を付けて画像を保存」
            </p>
        `);
    };
    
    img.src = svgDataUri;
}