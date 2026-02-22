// 皮肤切换功能
const skinSelect = document.getElementById('skin-select');
const backBtn = document.getElementById('back-btn');
const historySearch = document.getElementById('history-search');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const historyList = document.getElementById('history-list');
const emptyHistory = document.getElementById('empty-history');

// 设置默认皮肤
function setSkin(skinName) {
    document.body.className = skinName;
    localStorage.setItem('marketingCopywriterSkin', skinName);
}

// 加载保存的皮肤
const savedSkin = localStorage.getItem('marketingCopywriterSkin') || 'default';
setSkin(savedSkin);
skinSelect.value = savedSkin;

// 皮肤选择事件
skinSelect.addEventListener('change', (e) => {
    setSkin(e.target.value);
});

// 返回按钮
backBtn.addEventListener('click', () => {
    window.location.href = 'marketing-copywriter.html';
});

// 加载历史记录
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('marketingCopywriterHistory') || '[]');
    
    if (history.length === 0) {
        historyList.style.display = 'none';
        emptyHistory.style.display = 'block';
        return;
    }
    
    historyList.style.display = 'block';
    emptyHistory.style.display = 'none';
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.index = index;
        
        const content = document.createElement('div');
        content.className = 'history-item-content';
        content.textContent = item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '');
        
        const meta = document.createElement('div');
        meta.className = 'history-item-meta';
        
        let metaText = '';
        if (item.category) metaText += `${item.category} · `;
        if (item.type) metaText += `${item.type} · `;
        if (item.style) metaText += `${item.style} · `;
        if (item.topic) metaText += `主题: ${item.topic} · `;
        metaText += `${new Date(item.timestamp).toLocaleString()}`;
        
        meta.textContent = metaText;
        
        const actions = document.createElement('div');
        actions.className = 'history-item-actions';
        actions.innerHTML = `
            <button class="view-history-btn" data-index="${index}">查看详情</button>
            <button class="delete-history-btn" data-index="${index}">删除</button>
        `;
        
        historyItem.appendChild(content);
        historyItem.appendChild(meta);
        historyItem.appendChild(actions);
        historyList.appendChild(historyItem);
        
        // 查看详情
        historyItem.querySelector('.view-history-btn').addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            viewHistoryItem(history[index]);
        });
        
        // 删除
        historyItem.querySelector('.delete-history-btn').addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            deleteHistoryItem(index);
        });
    });
}

// 查看历史记录详情
function viewHistoryItem(item) {
    // 跳转到主页面并加载该历史记录
    localStorage.setItem('selectedHistoryItem', JSON.stringify(item));
    window.location.href = 'marketing-copywriter.html';
}

// 删除历史记录项
function deleteHistoryItem(index) {
    let history = JSON.parse(localStorage.getItem('marketingCopywriterHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('marketingCopywriterHistory', JSON.stringify(history));
    loadHistory();
}

// 清空历史记录
function clearHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
        localStorage.removeItem('marketingCopywriterHistory');
        loadHistory();
    }
}

// 搜索历史记录
function searchHistory() {
    const searchTerm = historySearch.value.toLowerCase();
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        const content = item.querySelector('.history-item-content').textContent.toLowerCase();
        const meta = item.querySelector('.history-item-meta').textContent.toLowerCase();
        
        if (content.includes(searchTerm) || meta.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 事件监听器
clearHistoryBtn.addEventListener('click', clearHistory);
historySearch.addEventListener('input', searchHistory);

// 初始化
loadHistory();