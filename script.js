// LocalStorage チェック
function checkLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch(e) {
        return false;
    }
}

if (!checkLocalStorage()) {
    alert('お使いのブラウザでローカルストレージが利用できません。データの保存ができない可能性があります。');
}

// 部品コストのデータ
const partsCosts = {
    'iPhone6s': { 'lcd': 1732, 'battery': 1155, 'batteryTag': 0, 'faceid': 0, 'homeButton': 200 },
    'iPhone6sPlus': { 'lcd': 2679, 'battery': 1386, 'batteryTag': 1700, 'faceid': 0, 'homeButton': 200 },
    'iPhone7': { 'lcd': 1963, 'battery': 1247, 'batteryTag': 0, 'faceid': 0, 'homeButton': 200 },
    'iPhone7Plus': { 'lcd': 2079, 'battery': 1097, 'batteryTag': 0, 'faceid': 0, 'homeButton': 200 },
    'iPhone8': { 'lcd': 3072, 'battery': 1247, 'batteryTag': 0, 'faceid': 0, 'homeButton': 200 },
    'iPhone8Plus': { 'lcd': 2079, 'battery': 1131, 'batteryTag': 0, 'faceid': 0, 'homeButton': 200 },
    'iPhoneX': { 'lcd': 3045, 'battery': 1229, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhoneXS': { 'lcd': 3349, 'battery': 1351, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhoneXSMax': { 'lcd': 3000, 'battery': 1236, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhoneXR': { 'lcd': 2425, 'battery': 1039, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone11': { 'lcd': 2310, 'battery': 2506, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone11Pro': { 'lcd': 3234, 'battery': 31419, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone11ProMax': { 'lcd': 3003, 'battery': 3315, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone12': { 'lcd': 4193, 'battery': 2830, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone12Mini': { 'lcd': 6006, 'battery': 2748, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone12Pro': { 'lcd': 4193, 'battery': 2830, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhone12ProMax': { 'lcd': 5040, 'battery': 3292, 'batteryTag': 0, 'faceid': 0, 'homeButton': 0 },
    'iPhoneSE2': { 'lcd': 3032, 'battery': 843, 'batteryTag': 0, 'faceid': 0, 'homeButton': 200 }
};

// グローバル変数
let isEventListenerAttached = false;
let currentProduct = '';

// 商品状態に応じたタイトルテンプレート
const CONDITION_TITLES = {
    S: '【極美品】',
    A: '【上美品】',
    B: '【美品】',
    C: '【美品】'
};

// タイトル生成関数の修正
function generateTitle(data) {
    try {
        const condition = data.condition || 'C';
        const conditionTitle = CONDITION_TITLES[condition];
        const storage = data.storage ? `${data.storage}GB` : '';
        const productName = data.productName || '';
        const color = data.color || '';

        // 基本タイトル構成（ランクを先頭に配置）
        let title = `${conditionTitle} ${productName} 本体 ${storage} SIMフリー`;
        
        // 色の追加（40文字以内の場合のみ）
        if (color && (title + ` ${color}`).length <= 40) {
            title = `${conditionTitle} ${productName} 本体 ${storage} ${color} SIMフリー`;
        }

        // 40文字を超える場合は切り詰める
        if (title.length > 40) {
            title = title.substring(0, 37) + '...';
        }

        return title;
    } catch (error) {
        console.error('タイトル生成エラー:', error);
        return '【商品タイトル】';
    }
}

// 部品選択時の処理を設定
function initializePartsHandlers() {
    const productSelect = document.getElementById('productName');
    const parts = ['partsName1', 'partsName2', 'partsName3'];
    const costs = ['partsCost1', 'partsCost2', 'partsCost3'];

    parts.forEach((partId, index) => {
        const partSelect = document.getElementById(partId);
        const costInput = document.getElementById(costs[index]);

        if (partSelect && costInput) {
            partSelect.addEventListener('change', function() {
                const selectedProduct = productSelect.value;
                const selectedPart = this.value;
                
                if (selectedProduct && selectedPart && partsCosts[selectedProduct]) {
                    const cost = partsCosts[selectedProduct][selectedPart];
                    costInput.value = cost || 0;
                    suggestSellingPrice();
                }
            });
        }
    });
}

// 部品表示切り替え機能
function initializePartsToggle() {
    const toggleButton = document.getElementById('toggleParts');
    const additionalParts = document.getElementById('additionalParts');
    let isPartsVisible = false;

    if (toggleButton && additionalParts) {
        toggleButton.addEventListener('click', function() {
            isPartsVisible = !isPartsVisible;
            additionalParts.classList.toggle('hidden');
            toggleButton.textContent = isPartsVisible ? '追加部品を隠す' : '追加部品を表示';
            toggleButton.classList.toggle('active');
        });
    }
}

// メインの初期化関数を修正
function initializeApp() {
    if (isEventListenerAttached) return;
    isEventListenerAttached = true;

    initializeFormHandlers();
    initializePartsHandlers(); // 部品選択の初期化を追加
    initializePartsToggle();   // 部品表示切り替えの初期化を追加
    initializeTabs();
    updateResultsList();
    updateStats();
}

// DOMContentLoaded時の処理
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeFormHandlers() {
    const form = document.getElementById('salesForm');
    if (!form) return;

    // フォームのデフォルトのsubmitイベントを削除
    form.onsubmit = function(e) {
        e.preventDefault();
        return false;
    };
    
    // 計算ボタンのイベントリスナー
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.onclick = function(e) {
            e.preventDefault();
            calculateResult();
        };
    }

    // 保存ボタンのイベントリスナー
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.onclick = function(e) {
            e.preventDefault();
            saveResult();
        };
    }

    // 各入力要素のイベントハンドラー設定
    const elements = {
        productName: form.querySelector('#productName'),
        storage: form.querySelector('#storage'),
        partsName1: form.querySelector('#partsName1'),
        partsName2: form.querySelector('#partsName2'),
        partsCost3: form.querySelector('#partsCost3')
    };

    if (elements.productName) {
        elements.productName.addEventListener('change', updateProductSelection);
    }
    if (elements.storage) {
        elements.storage.addEventListener('change', updateProductSelection);
    }
    if (elements.partsName1) {
        elements.partsName1.addEventListener('change', updatePartsCost);
    }
    if (elements.partsName2) {
        elements.partsName2.addEventListener('change', updatePartsCost);
    }
    if (elements.partsCost3) {
        elements.partsCost3.addEventListener('input', suggestSellingPrice);
    }
}
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    // 月選択の変更イベントを追加
    const statsMonth = document.getElementById('statsMonth');
    if (statsMonth) {
        statsMonth.addEventListener('change', function() {
            calculateStats(parseInt(this.value));
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const content = document.getElementById(tabId);
            if (content) {
                content.classList.add('active');
                if (tabId === 'historyTab') {
                    updateResultsList();
                } else if (tabId === 'statsTab') {
                    const currentMonth = new Date().getMonth() + 1;
                    if (statsMonth) {
                        statsMonth.value = currentMonth;
                    }
                    calculateStats(currentMonth);
                }
            }
        });
    });
}

function updateProductSelection() {
    const form = document.getElementById('salesForm');
    if (!form) return;

    const productName = form.querySelector('#productName')?.value;
    const storage = form.querySelector('#storage')?.value;
    
    if (productName && storage) {
        currentProduct = `${productName} ${storage}GB`;
        updatePartsCost();
        suggestSellingPrice();
    }
}

function updatePartsCost() {
    const form = document.getElementById('salesForm');
    if (!form) return;

    const productName = form.querySelector('#productName')?.value;
    const partsName1 = form.querySelector('#partsName1')?.value;
    const partsName2 = form.querySelector('#partsName2')?.value;
    const partsCost1Input = form.querySelector('#partsCost1');
    const partsCost2Input = form.querySelector('#partsCost2');

    if (productName && partsName1 && partsCost1Input) {
        partsCost1Input.value = partsCosts[productName][partsName1] || 0;
    }
    if (productName && partsName2 && partsCost2Input) {
        partsCost2Input.value = partsCosts[productName][partsName2] || 0;
    }

    suggestSellingPrice();
}

function suggestSellingPrice() {
    return;
}

// 計算処理を行う関数
function calculateResult() {
    try {
        const form = document.getElementById('salesForm');
        if (!form) return;

        // フォームから値を取得
        const purchasePrice = parseInt(form.querySelector('#purchasePrice')?.value) || 0;
        const sellingPrice = parseInt(form.querySelector('#sellingPrice')?.value) || 0;
        const shippingCost = parseInt(form.querySelector('#shippingCost')?.value) || 0;
        const partsCost1 = parseInt(form.querySelector('#partsCost1')?.value) || 0;
        const partsCost2 = parseInt(form.querySelector('#partsCost2')?.value) || 0;
        const partsCost3 = parseInt(form.querySelector('#partsCost3')?.value) || 0;

        // 計算処理
        const totalCost = purchasePrice + partsCost1 + partsCost2 + partsCost3 + shippingCost;
        const commission = Math.round(sellingPrice * 0.1);
        const profit = sellingPrice - totalCost - commission;
        const profitMargin = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;

        // 結果を表示
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.innerHTML = `
                <h3>計算結果</h3>
                <p>総コスト: ${totalCost.toLocaleString()}円</p>
                <p>販売手数料: ${commission.toLocaleString()}円</p>
                <p>利益: ${profit.toLocaleString()}円</p>
                <p>利益率: ${profitMargin}%</p>
            `;
        }

    } catch (error) {
        console.error('計算エラー:', error);
        showNotification('計算に失敗しました', 'error');
    }
}

// 保存処理を行う関数
function saveResult() {
    try {
        const form = document.getElementById('salesForm');
        if (!form) return;

        // フォームからデータを取得
        const data = {
            date: new Date().toISOString(),
            productName: form.querySelector('#productName')?.value || '不明',
            storage: form.querySelector('#storage')?.value || '不明',
            condition: form.querySelector('#condition')?.value || 'C',
            color: form.querySelector('#color')?.value || '',  // 色の追加
            purchasePrice: parseInt(form.querySelector('#purchasePrice')?.value) || 0,
            sellingPrice: parseInt(form.querySelector('#sellingPrice')?.value) || 0,
            shippingCost: parseInt(form.querySelector('#shippingCost')?.value) || 0,
            partsCost1: parseInt(form.querySelector('#partsCost1')?.value) || 0,
            partsCost2: parseInt(form.querySelector('#partsCost2')?.value) || 0,
            partsCost3: parseInt(form.querySelector('#partsCost3')?.value) || 0
        };

        // タイトルの生
        data.title = generateTitle(data);

        // 計算処理
        const totalCost = data.purchasePrice + data.partsCost1 + 
                         data.partsCost2 + data.partsCost3 + data.shippingCost;
        const commission = Math.round(data.sellingPrice * 0.1);
        data.profit = data.sellingPrice - totalCost - commission;
        data.profitMargin = data.sellingPrice > 0 ? 
                           Math.round((data.profit / data.sellingPrice) * 100) : 0;

        // データの保存
        const savedResults = JSON.parse(localStorage.getItem('savedResults')) || [];
        savedResults.unshift(data);
        localStorage.setItem('savedResults', JSON.stringify(savedResults));

        // UI更新
        updateResultsList();
        updateStats();
        showNotification('データが保存されました', 'success');

    } catch (error) {
        console.error('保存エラー:', error);
        showNotification('保存に失敗しました', 'error');
    }
}

function updateResultsList() {
    const resultsList = document.getElementById('resultsList');
    const selectedMonth = document.getElementById('historyMonth').value;
    const currentYear = new Date().getFullYear();
    let savedResults = JSON.parse(localStorage.getItem('savedResults')) || [];
    
    // 選択された月のデータをフィルタリング
    const filteredResults = savedResults.filter(result => {
        const date = new Date(result.date);
        return date.getFullYear() === currentYear && 
               (date.getMonth() + 1) === Number(selectedMonth);
    });

    // 日付順（新しい順）にソート
    filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 履歴リストのHTML生成
    resultsList.innerHTML = `
        <div class="month-results">
            ${filteredResults.map(result => {
                const date = new Date(result.date);
                const formattedDate = `${date.getDate()}日`;
                const profitRate = (result.profit / result.sellingPrice * 100).toFixed(1);
                const isHighProfit = Number(profitRate) >= 20;
                
                return `
                    <div class="result-item ${isHighProfit ? 'high-profit' : ''}">
                        <div class="result-info">
                            <span class="result-date">${formattedDate}</span>
                            <span class="product-info">${result.productName} ${result.storage}GB</span>
                            <span class="price">仕入: ${Number(result.purchasePrice).toLocaleString()}円</span>
                            <span class="price">販売: ${Number(result.sellingPrice).toLocaleString()}円</span>
                            <span class="profit">利益: ${Number(result.profit).toLocaleString()}円</span>
                            <span class="profit-rate ${isHighProfit ? 'high-profit-text' : ''}">${profitRate}%</span>
                        </div>
                        <div class="result-actions">
                            <button onclick="deleteResult(${savedResults.indexOf(result)})" class="delete-button">削除</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // データが0件の場合のメッセージ
    if (filteredResults.length === 0) {
        resultsList.innerHTML = `
            <div class="no-data-message">
                ${currentYear}年${selectedMonth}月のデータはありません
            </div>
        `;
    }
}

function calculateStats(month) {
    const savedResults = JSON.parse(localStorage.getItem('savedResults')) || [];
    const currentYear = new Date().getFullYear();
    
    // 指定された月のデータをフィルタリング
    const monthlyResults = savedResults.filter(result => {
        const date = new Date(result.date);
        return date.getFullYear() === currentYear && date.getMonth() === (month - 1);
    });

    // 統計の計算
    const stats = {
        totalPurchase: 0,
        totalSales: 0,
        totalProfit: 0,
        count: monthlyResults.length
    };

    monthlyResults.forEach(result => {
        stats.totalPurchase += Number(result.purchasePrice) || 0;
        stats.totalSales += Number(result.sellingPrice) || 0;
        stats.totalProfit += Number(result.profit) || 0;
    });

    stats.averageMargin = stats.totalSales > 0 ? 
        (stats.totalProfit / stats.totalSales * 100).toFixed(1) : 0;

    // 統計表示の更新
    updateStatsDisplay(stats);
}

function updateStatsDisplay(stats) {
    const elements = {
        totalPurchase: document.getElementById('totalPurchase'),
        totalSales: document.getElementById('totalSales'),
        totalProfit: document.getElementById('totalProfit'),
        averageMargin: document.getElementById('averageMargin')
    };

    if (elements.totalPurchase) {
        elements.totalPurchase.textContent = `${stats.totalPurchase.toLocaleString()}円`;
    }
    if (elements.totalSales) {
        elements.totalSales.textContent = `${stats.totalSales.toLocaleString()}円`;
    }
    if (elements.totalProfit) {
        elements.totalProfit.textContent = `${stats.totalProfit.toLocaleString()}円`;
    }
    if (elements.averageMargin) {
        elements.averageMargin.textContent = `${stats.averageMargin}%`;
    }
}

function deleteResult(index) {
    try {
        const savedResults = JSON.parse(localStorage.getItem('savedResults')) || [];
        savedResults.splice(index, 1);
        localStorage.setItem('savedResults', JSON.stringify(savedResults));
        
        updateResultsList();
        updateStats();
        showNotification('データを削除しました', 'success');
    } catch (error) {
        console.error('削除エラー:', error);
        showNotification('削除に失敗しました', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒後に削除
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// データエクスポート機能
function exportData() {
    try {
        // LocalStorageからデータを取得
        const savedResults = JSON.parse(localStorage.getItem('savedResults')) || [];
        
        // データを整形
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: savedResults
        };
        
        // JSONファイルとしてエクスポート
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンクの作成と実行
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.download = `iphone-sales-data-${date}.json`;
        a.href = url;
        a.click();
        
        // URLを解放
        URL.revokeObjectURL(url);
        
        // 成功メッセージ
        showNotification('データのエクスポートが完了しました', 'success');
    } catch (error) {
        console.error('エクスポートエラー:', error);
        showNotification('エクスポートに失敗しました', 'error');
    }
}

// データインポート機能
function importData(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // データの検証
            if (!Array.isArray(importedData.data)) {
                throw new Error('Invalid data format');
            }
            
            // 既存のデータと結合するか確認
            if (confirm('既存のデータに追加しますか？\nキャンセルを選択すると既存のデータは上書きされます。')) {
                const existingData = JSON.parse(localStorage.getItem('savedResults')) || [];
                const mergedData = [...existingData, ...importedData.data];
                localStorage.setItem('savedResults', JSON.stringify(mergedData));
            } else {
                localStorage.setItem('savedResults', JSON.stringify(importedData.data));
            }
            
            // 画面を更新
            updateResultsList();
            updateStats();
            showNotification('データのインポートが完了しました', 'success');
        } catch (error) {
            console.error('インポートエラー:', error);
            showNotification('インポートに失敗しました', 'error');
        }
    };
    reader.readAsText(file);
}

// 通知表示機能
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// スタイルの追加
const style = document.createElement('style');
style.textContent = `
    .data-management-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    .export-button, .import-button {
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    .export-button:hover, .import-button:hover {
        background-color: #45a049;
    }

    .import-button {
        background-color: #2196F3;
    }

    .import-button:hover {
        background-color: #1976D2;
    }
`;
document.head.appendChild(style);

// クリップボードにコピーする関数
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const text = element.textContent;
    
    // テキストエリアを作成して選択
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // クリップボードにコピー
        document.execCommand('copy');
        
        // コピー成功時のフィードバック
        const button = document.querySelector(`button[onclick="copyToClipboard('${elementId}')"]`);
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'コピーしました！';
            button.classList.add('copied');
            
            // 3秒後に元のテキストに戻す
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 3000);
        }
    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);
    } finally {
        // テキストエリアを削除
        document.body.removeChild(textarea);
    }
}
// 履歴タブ初期化時の処理
document.addEventListener('DOMContentLoaded', function() {
    const historyMonth = document.getElementById('historyMonth');
    if (historyMonth) {
        // 現在の月を設定
        const currentMonth = new Date().getMonth() + 1;
        historyMonth.value = currentMonth;
        // 初期表示
        updateResultsList();
    }
});


