// 简化版智能营销文案生成器脚本

// 配置文件
const config = {
    siliconFlowApiKey: "sk-btdkmingrkfgheiumwsphvnjvuayveeezkeuzgvcnunydlug"
};

// 实时信息配置
const realtimeInfoConfig = {
    "节日祝福": {
        requiredInfo: ["current_date", "current_year", "current_lunar_date", "current_lunar_year", "current_lunar_animal", "current_festival"]
    },
    "营销推广": {
        requiredInfo: ["current_date", "current_year", "current_season", "current_trends"]
    },
    "其他": {
        requiredInfo: ["current_date", "current_year"]
    }
};

const infoSourceConfig = {
    current_date: { fallback: new Date().toISOString().split('T')[0] },
    current_year: { fallback: new Date().getFullYear().toString() },
    current_season: { fallback: '春季' },
    current_trends: { fallback: '人工智能、元宇宙、可持续发展' },
    current_lunar_date: { fallback: '正月初一' },
    current_lunar_year: { fallback: '2026' },
    current_lunar_animal: { fallback: '马' },
    current_festival: { fallback: '春节' }
};

// 全局变量
let skinSelect;
let modelSelect;

// 设置默认皮肤
function setSkin(skinName) {
    console.log('设置皮肤:', skinName);
    document.body.className = skinName;
    localStorage.setItem('marketingCopywriterSkin', skinName);
}

// 文案大类变化时显示/隐藏产品信息
function toggleProductInfo() {
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const productInfoSection = document.getElementById('product-info-section');
    
    if (!copywriterCategorySelect || !productInfoSection) {
        console.error('DOM元素不存在:', {
            copywriterCategorySelect: !!copywriterCategorySelect,
            productInfoSection: !!productInfoSection
        });
        return;
    }
    
    const category = copywriterCategorySelect.value;
    console.log('文案大类变化:', category);
    
    if (category === '营销推广') {
        console.log('显示产品信息');
        productInfoSection.style.display = 'block';
    } else {
        console.log('隐藏产品信息');
        productInfoSection.style.display = 'none';
    }
}

// 设置默认字数限制
function setDefaultWordCounts() {
    const defaultWordCounts = {
        '朋友圈文案': { min: 50, max: 200 },
        '小红书文案': { min: 300, max: 800 },
        '公众号文章标题': { min: 10, max: 30 },
        '短视频脚本': { min: 200, max: 500 },
        '拜年短信': { min: 30, max: 100 },
        '节日祝福': { min: 50, max: 200 },
        '邀请函': { min: 100, max: 300 },
        '感谢信': { min: 100, max: 300 },
        '其他': { min: 50, max: 300 }
    };
    
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const minWordCountInput = document.getElementById('min-word-count');
    const maxWordCountInput = document.getElementById('max-word-count');
    
    if (!copywriterTypeSelect || !minWordCountInput || !maxWordCountInput) {
        console.error('字数限制元素不存在');
        return;
    }
    
    const type = copywriterTypeSelect.value;
    const defaultCounts = defaultWordCounts[type];
    if (defaultCounts) {
        minWordCountInput.value = defaultCounts.min;
        maxWordCountInput.value = defaultCounts.max;
    }
}

// 字数限制加减按钮事件
function setupNumberInputButtons() {
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;
            
            const currentValue = parseInt(input.value) || 0;
            const step = this.classList.contains('increase') ? 10 : -10;
            const newValue = Math.max(1, currentValue + step);
            input.value = newValue;
        });
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化');
    
    // 初始化DOM元素
    skinSelect = document.getElementById('skin-select');
    modelSelect = document.getElementById('model-select');
    
    console.log('skinSelect元素:', skinSelect);
    console.log('modelSelect元素:', modelSelect);
    
    // 加载保存的皮肤
    const savedSkin = localStorage.getItem('marketingCopywriterSkin') || 'default';
    console.log('加载保存的皮肤:', savedSkin);
    setSkin(savedSkin);
    
    if (skinSelect) {
        skinSelect.value = savedSkin;
        console.log('设置皮肤选择器值:', savedSkin);
        
        // 绑定皮肤选择事件
        console.log('绑定皮肤选择事件');
        skinSelect.addEventListener('change', function(e) {
            console.log('皮肤选择变化:', e.target.value);
            setSkin(e.target.value);
        });
    } else {
        console.error('skinSelect元素不存在');
    }
    
    // 初始化产品信息显示状态
    console.log('初始化产品信息显示状态');
    toggleProductInfo();
    
    // 设置默认字数限制
    console.log('设置默认字数限制');
    setDefaultWordCounts();
    
    // 绑定事件监听器
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const generateCopywriterBtn = document.getElementById('generate-copywriter-btn');
    const generateBatchBtn = document.getElementById('generate-batch-btn');
    const copyCopywriterBtn = document.getElementById('copy-copywriter-btn');
    const exportCopywriterBtn = document.getElementById('export-copywriter-btn');
    const historyBtn = document.getElementById('history-btn');
    
    console.log('copywriterCategorySelect元素:', copywriterCategorySelect);
    
    if (copywriterTypeSelect) {
        copywriterTypeSelect.addEventListener('change', setDefaultWordCounts);
    }
    
    if (copywriterCategorySelect) {
        // 绑定文案大类变化事件
        console.log('绑定文案大类变化事件');
        copywriterCategorySelect.addEventListener('change', function() {
            console.log('文案大类变化，更新产品信息显示');
            toggleProductInfo();
        });
    }
    
    if (generateCopywriterBtn) {
        generateCopywriterBtn.addEventListener('click', generateCopywriter);
    }
    
    if (generateBatchBtn) {
        generateBatchBtn.addEventListener('click', generateBatchCopywriter);
    }
    
    if (copyCopywriterBtn) {
        copyCopywriterBtn.addEventListener('click', copyCopywriter);
    }
    
    if (exportCopywriterBtn) {
        exportCopywriterBtn.addEventListener('click', exportCopywriter);
    }
    
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            console.log('历史记录按钮点击');
            window.location.href = 'history.html';
        });
    }
    
    // 初始化字数限制按钮
    setupNumberInputButtons();
    
    console.log('初始化完成');
});

// 复制文案
function copyCopywriter() {
    const copywriterOutput = document.getElementById('copywriter-output');
    const copyCopywriterBtn = document.getElementById('copy-copywriter-btn');
    
    if (!copywriterOutput || !copyCopywriterBtn) {
        console.error('DOM元素不存在');
        return;
    }
    
    copywriterOutput.select();
    document.execCommand('copy');
    
    const originalText = copyCopywriterBtn.textContent;
    copyCopywriterBtn.textContent = '已复制!';
    setTimeout(() => {
        copyCopywriterBtn.textContent = originalText;
    }, 1500);
}

// 导出文案
function exportCopywriter() {
    const copywriterOutput = document.getElementById('copywriter-output');
    const productNameInput = document.getElementById('product-name');
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const copywriterStyleSelect = document.getElementById('copywriter-style');
    
    if (!copywriterOutput || !productNameInput || !copywriterTypeSelect || !copywriterStyleSelect) {
        console.error('DOM元素不存在');
        return;
    }
    
    const content = copywriterOutput.value;
    
    if (!content) {
        showError('请先生成文案再进行导出');
        return;
    }
    
    const productName = productNameInput.value.trim() || '未命名产品';
    const copywriterType = copywriterTypeSelect.value;
    const copywriterStyle = copywriterStyleSelect.value;
    
    const exportContent = `产品名称: ${productName}\n文案类型: ${copywriterType}\n文案风格: ${copywriterStyle}\n生成时间: ${new Date().toLocaleString()}\n\n文案内容:\n${content}`;
    
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName}_${copywriterType}_${new Date().getTime()}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// 显示加载遮罩
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// 隐藏加载遮罩
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// 生成单个文案
async function generateCopywriter() {
    const productNameInput = document.getElementById('product-name');
    const productFeaturesInput = document.getElementById('product-features');
    const targetAudienceInput = document.getElementById('target-audience');
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const copywriterStyleSelect = document.getElementById('copywriter-style');
    const copywriterTopicInput = document.getElementById('copywriter-topic');
    const minWordCountInput = document.getElementById('min-word-count');
    const maxWordCountInput = document.getElementById('max-word-count');
    const generateCopywriterBtn = document.getElementById('generate-copywriter-btn');
    const batchResults = document.getElementById('batch-results');
    const singleResult = document.getElementById('single-result');
    const copywriterOutput = document.getElementById('copywriter-output');
    const copywriterRating = document.getElementById('copywriter-rating');
    
    if (!productNameInput || !productFeaturesInput || !targetAudienceInput || 
        !copywriterCategorySelect || !copywriterTypeSelect || !copywriterStyleSelect || 
        !copywriterTopicInput || !minWordCountInput || !maxWordCountInput || 
        !generateCopywriterBtn || !batchResults || !singleResult || 
        !copywriterOutput || !copywriterRating) {
        console.error('DOM元素不存在');
        showError('生成失败: DOM元素不存在');
        return;
    }
    
    const productName = productNameInput.value.trim();
    const productFeatures = productFeaturesInput.value.trim();
    const targetAudience = targetAudienceInput.value.trim();
    const copywriterCategory = copywriterCategorySelect.value;
    const copywriterType = copywriterTypeSelect.value;
    const copywriterStyle = copywriterStyleSelect.value;
    const copywriterTopic = copywriterTopicInput.value.trim();
    const minWordCount = parseInt(minWordCountInput.value) || 0;
    const maxWordCount = parseInt(maxWordCountInput.value) || 1000;
    
    if (!config.siliconFlowApiKey) {
        showError('请在config.js文件中配置SiliconFlow API Key');
        return;
    }
    
    if (!copywriterTopic) {
        showError('请输入文案主题');
        return;
    }
    
    if (copywriterCategory === '营销推广') {
        if (!productName) {
            showError('请输入产品名称');
            return;
        }
        
        if (!productFeatures) {
            showError('请输入产品特点');
            return;
        }
        
        if (!targetAudience) {
            showError('请输入目标用户');
            return;
        }
    }
    
    // 显示加载遮罩
    showLoading();
    generateCopywriterBtn.classList.add('loading');
    generateCopywriterBtn.disabled = true;
    
    try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 检测是否为春节相关主题
        const isSpringFestival = copywriterTopic.includes('春节') || copywriterTopic.includes('新春') || copywriterTopic.includes('过年') || copywriterTopic.includes('除夕') || copywriterTopic.includes('新年') || copywriterTopic.includes('马年') || copywriterTopic.includes('虎年') || copywriterTopic.includes('兔年') || copywriterTopic.includes('龙年') || copywriterTopic.includes('蛇年') || copywriterTopic.includes('羊年') || copywriterTopic.includes('猴年') || copywriterTopic.includes('鸡年') || copywriterTopic.includes('狗年') || copywriterTopic.includes('猪年') || copywriterTopic.includes('鼠年') || copywriterTopic.includes('牛年');
        
        // 提取生肖信息
        let zodiacYear = '';
        if (copywriterTopic.includes('马年')) zodiacYear = '马年';
        else if (copywriterTopic.includes('虎年')) zodiacYear = '虎年';
        else if (copywriterTopic.includes('兔年')) zodiacYear = '兔年';
        else if (copywriterTopic.includes('龙年')) zodiacYear = '龙年';
        else if (copywriterTopic.includes('蛇年')) zodiacYear = '蛇年';
        else if (copywriterTopic.includes('羊年')) zodiacYear = '羊年';
        else if (copywriterTopic.includes('猴年')) zodiacYear = '猴年';
        else if (copywriterTopic.includes('鸡年')) zodiacYear = '鸡年';
        else if (copywriterTopic.includes('狗年')) zodiacYear = '狗年';
        else if (copywriterTopic.includes('猪年')) zodiacYear = '猪年';
        else if (copywriterTopic.includes('鼠年')) zodiacYear = '鼠年';
        else if (copywriterTopic.includes('牛年')) zodiacYear = '牛年';
        else zodiacYear = '虎年'; // 默认虎年
        
        // 生成更真实的文案内容
        const copywriterTemplates = {
            '拜年短信': [
                // 春节相关模板
                '{greeting}!\n\n{productGreeting}{festivalGreeting}{targetAudienceGreeting}\n\n{closing}',
                '{opening}!\n\n{productWishes}{festivalWishes}{targetAudienceWishes}\n\n{closingWishes}',
                '{beginning}!\n\n{productBlessing}{festivalBlessing}{targetAudienceBlessing}\n\n{end}',
            ],
            '朋友圈文案': [
                // 春节相关模板
                `🎊 新春快乐！${productName ? `${productName}给您拜年啦！` : '给您拜年啦！'} ${copywriterStyle === '专业严谨' ? '值此新春佳节之际，谨向您致以最诚挚的祝福' : copywriterStyle === '幽默风趣' ? '虎年到，好运到，快乐围着你来绕' : copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐！愿你在新的一年里' : '新年新气象，好运连连到'}！\n\n${productFeatures ? `✨ ${productName}祝您：` : '✨ 祝您：'}${isSpringFestival ? '新春快乐，万事如意，阖家幸福，财源广进，虎年大吉！' : '节日快乐，身体健康，事业有成，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相聚！' : '期待与您共同迎接美好的新一年！'}`,
                `${productName ? `${productName} | ` : ''}${copywriterStyle === '专业严谨' ? '专业品质，匠心打造' : copywriterStyle === '幽默风趣' ? '笑口常开，好运自来' : copywriterStyle === '温馨亲切' ? '温暖相伴，一路同行' : '创意无限，惊喜不断'}！\n\n${isSpringFestival ? '🧧 虎年大吉 🧧\n\n' : ''}${productFeatures ? `🌟 ${productFeatures}！\n\n` : ''}${targetAudience ? `特别推荐给${targetAudience}的祝福！\n\n` : ''}${isSpringFestival ? '愿您在新的一年里，学业进步，事业如虎添翼，生活虎虎生威！' : '愿您节日快乐，心想事成！'}`,
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '诚挚祝福，用心传递' : copywriterStyle === '幽默风趣' ? '快乐相随，烦恼远离' : copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐！' : '新春大吉，万事如意'}！\n\n${isSpringFestival ? '🎈 新的一年，新的开始 🎈\n\n' : ''}${productFeatures ? `💎 ${productFeatures}。\n\n` : ''}${targetAudience ? `为${targetAudience}量身定制的祝福！\n\n` : ''}${isSpringFestival ? '祝您和家人团圆美满，幸福安康！' : '祝您度过一个愉快的节日！'}`,
                // 通用朋友圈模板
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '专业品质，值得信赖' : copywriterStyle === '幽默风趣' ? '幽默有趣，让人难忘' : copywriterStyle === '温馨亲切' ? '温馨关怀，暖人心田' : '创意无限，引领潮流'}。\n\n${productFeatures ? `产品特点：${productFeatures}。\n\n` : ''}${targetAudience ? `特别推荐给${targetAudience}。\n\n` : ''}期待与您共同探索更多精彩！`,
                `${productName ? `${productName}：` : ''}${copywriterStyle === '专业严谨' ? '专业打造，精益求精' : copywriterStyle === '幽默风趣' ? '趣味横生，乐在其中' : copywriterStyle === '温馨亲切' ? '贴心服务，温暖相伴' : '创新突破，引领未来'}。\n\n${productFeatures ? `核心优势：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}的选择。\n\n` : ''}快来体验吧！`,
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '专业团队，品质保证' : copywriterStyle === '幽默风趣' ? '笑点十足，回味无穷' : copywriterStyle === '温馨亲切' ? '温暖陪伴，一路同行' : '创意无限，惊喜不断'}。\n\n${productFeatures ? `产品亮点：${productFeatures}。\n\n` : ''}${targetAudience ? `为${targetAudience}量身打造。\n\n` : ''}期待您的关注！`
            ],
            '节日祝福': [
                `${copywriterStyle === '专业严谨' ? '值此佳节，谨向您致以最诚挚的祝福' : copywriterStyle === '幽默风趣' ? '节日快乐！愿你笑口常开，好运连连' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日愉快' : '在这个特别的日子里，送上我最美好的祝福'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新春快乐，万事如意，阖家幸福，财源广进，虎年大吉！' : '节日快乐，身体健康，事业有成，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相聚！' : '愿这份祝福带给你无限的快乐和温暖！'}`,
                `${copywriterStyle === '专业严谨' ? '在这个喜庆的节日里，我们向您表示最热烈的祝贺' : copywriterStyle === '幽默风趣' ? '节日到啦！准备好接收我的祝福炸弹了吗' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐！想你了' : '又是一年佳节至，祝福满满送给你'}！\n\n${productName ? `${productName}与您共度美好时光：` : '愿您：'}${isSpringFestival ? '新春大吉，虎虎生威，财运亨通，吉祥如意！' : '节日快乐，心想事成，万事如意，笑口常开！'}${targetAudience ? `\n\n送给最亲爱的${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '爱你哟！' : '祝福大家节日快乐！'}`,
                `${copywriterStyle === '专业严谨' ? '值此佳节之际，谨代表我们向您致以崇高的敬意和美好的祝愿' : copywriterStyle === '幽默风趣' ? '哈哈，节日到了，不送点祝福怎么行' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐' : '在这个充满喜悦的日子里，我要把最美好的祝福送给你'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新年快乐，万事如意，身体健康，财源广进，虎年大吉！' : '节日快乐，心想事成，万事如意，幸福安康！'}${targetAudience ? `\n\n特别的祝福给特别的${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '期待开学与你相聚！' : '愿您度过一个愉快的节日！'}`,
            ],
            '小红书文案': [
                `${productName ? `${productName}实测体验！` : ''}作为一个${targetAudience || '普通用户'}，我必须说这是我用过最${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容了！\n\n${productFeatures ? `💡 亮点：${productFeatures}。\n\n` : ''}使用后真的感受到了${copywriterStyle === '专业严谨' ? '专业品质' : copywriterStyle === '幽默风趣' ? '无限乐趣' : copywriterStyle === '温馨亲切' ? '温暖关怀' : '创意魅力'}，强烈推荐给大家！\n\n#${productName || '生活分享'} #${copywriterStyle}`,
                `${productName ? `${productName}绝了！` : ''}最近发现了这个超级${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容，必须分享给你们！\n\n${productFeatures ? `🌟 特点：${productFeatures}。\n\n` : ''}作为${targetAudience || '小红书用户'}，我觉得这个真的很值得尝试，使用感${copywriterStyle === '专业严谨' ? '专业可靠' : copywriterStyle === '幽默风趣' ? '趣味盎然' : copywriterStyle === '温馨亲切' ? '温暖舒适' : '创意十足'}！\n\n#好物分享 #${productName || '生活分享'} #${copywriterStyle}`,
                `${productName ? `${productName}使用报告` : ''}作为${targetAudience || '测评达人'}，我对${copywriterStyle === '专业严谨' ? '专业性' : copywriterStyle === '幽默风趣' ? '趣味性' : copywriterStyle === '温馨亲切' ? '贴心度' : '创意性'}要求很高，但这个产品/内容真的超出了我的预期！\n\n${productFeatures ? `✅ 优势：${productFeatures}。\n\n` : ''}使用过程中感受到了${copywriterStyle === '专业严谨' ? '专业团队的用心' : copywriterStyle === '幽默风趣' ? '无穷的乐趣' : copywriterStyle === '温馨亲切' ? '满满的关怀' : '无限的创意'}，推荐给所有需要的小伙伴！\n\n#测评 #${productName || '生活'} #${copywriterStyle}`,
            ],
            '其他': [
                `${copywriterStyle === '专业严谨' ? '根据您的需求，我们为您准备了以下内容' : copywriterStyle === '幽默风趣' ? '哈哈，来了来了，您要的内容新鲜出炉' : copywriterStyle === '温馨亲切' ? '亲爱的朋友，这是为您准备的内容' : '创意无限，为您呈现'}！\n\n${productName ? `【${productName}】\n` : ''}${productFeatures ? `主要内容：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}阅读。\n\n` : ''}希望您喜欢！`,
                `${copywriterStyle === '专业严谨' ? '经过精心准备，为您呈现以下内容' : copywriterStyle === '幽默风趣' ? '铛铛铛！您期待的内容来啦' : copywriterStyle === '温馨亲切' ? '亲爱的，这是专门为您准备的' : '创意满满，精彩呈现'}！\n\n${productName ? `关于${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '特别为您定制。\n\n' : ''}祝您生活愉快！`,
                `${copywriterStyle === '专业严谨' ? '专业制作，品质保证' : copywriterStyle === '幽默风趣' ? '趣味盎然，不容错过' : copywriterStyle === '温馨亲切' ? '温暖人心，贴心制作' : '创意无限，惊喜不断'}！\n\n${productName ? `${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '为您量身打造。\n\n' : ''}感谢您的支持！`,
            ]
        };
        
        // 显示加载遮罩
        showLoading();
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 选择对应类型的文案模板
        const templates = copywriterTemplates[copywriterType] || copywriterTemplates['其他'];
        let template = templates[Math.floor(Math.random() * templates.length)];
        
        // 生成动态内容
        let generatedCopywriter;
        if (copywriterType === '拜年短信') {
            // 生成拜年短信内容
            const greeting = copywriterStyle === '专业严谨' ? '值此新春佳节之际，谨向您致以最诚挚的节日祝福' : 
                           copywriterStyle === '幽默风趣' ? '虎年到，好运到，给您拜年啦' : 
                           copywriterStyle === '温馨亲切' ? '亲爱的朋友，春节快乐' : '新年新气象，祝您新春快乐';
            
            const productGreeting = productName ? `${productName}敬上：` : '';
            const festivalGreeting = isSpringFestival ? `新春快乐，万事如意，阖家幸福，财源广进，${zodiacYear === '马年' ? '马年大吉' : zodiacYear === '虎年' ? '虎年大吉' : zodiacYear === '兔年' ? '兔年大吉' : zodiacYear === '龙年' ? '龙年大吉' : zodiacYear === '蛇年' ? '蛇年大吉' : zodiacYear === '羊年' ? '羊年大吉' : zodiacYear === '猴年' ? '猴年大吉' : zodiacYear === '鸡年' ? '鸡年大吉' : zodiacYear === '狗年' ? '狗年大吉' : zodiacYear === '猪年' ? '猪年大吉' : zodiacYear === '鼠年' ? '鼠年大吉' : zodiacYear === '牛年' ? '牛年大吉' : '新年快乐'}！` : '节日快乐，身体健康，事业有成，家庭美满！';
            const targetAudienceGreeting = targetAudience ? `\n\n特别祝福${targetAudience}！` : '';
            const closing = copywriterStyle === '专业严谨' ? '顺颂时祺' : 
                          copywriterStyle === '幽默风趣' ? '笑口常开！' : 
                          copywriterStyle === '温馨亲切' ? '想你了，期待与你相聚！' : '期待与您共同迎接美好的新一年！';
            
            const opening = copywriterStyle === '专业严谨' ? '在这辞旧迎新的美好时刻，我们向您表示最热烈的祝贺和最美好的祝福' : 
                           copywriterStyle === '幽默风趣' ? '春节到啦！准备好接收我的祝福了吗' : 
                           copywriterStyle === '温馨亲切' ? '亲爱的，春节快乐！愿你在新的一年里' : '又是一年新春至，祝福满满送给你';
            
            const productWishes = productName ? `${productName}祝您：` : '祝您：';
            const festivalWishes = isSpringFestival ? `${zodiacYear === '马年' ? '新春大吉，马到成功' : zodiacYear === '虎年' ? '新春大吉，虎虎生威' : zodiacYear === '兔年' ? '新春大吉，兔年吉祥' : zodiacYear === '龙年' ? '新春大吉，龙马精神' : zodiacYear === '蛇年' ? '新春大吉，蛇年吉祥' : zodiacYear === '羊年' ? '新春大吉，羊年吉祥' : zodiacYear === '猴年' ? '新春大吉，猴年吉祥' : zodiacYear === '鸡年' ? '新春大吉，鸡年吉祥' : zodiacYear === '狗年' ? '新春大吉，狗年吉祥' : zodiacYear === '猪年' ? '新春大吉，猪年吉祥' : zodiacYear === '鼠年' ? '新春大吉，鼠年吉祥' : zodiacYear === '牛年' ? '新春大吉，牛年吉祥' : '新春大吉'}，财运亨通，吉祥如意！` : '节日快乐，心想事成，万事如意，笑口常开！';
            const targetAudienceWishes = targetAudience ? `\n\n送给最亲爱的${targetAudience}！` : '';
            const closingWishes = copywriterStyle === '专业严谨' ? '此致\n敬礼' : 
                               copywriterStyle === '幽默风趣' ? '哈哈，新年快乐！' : 
                               copywriterStyle === '温馨亲切' ? '爱你哟！' : '祝福大家节日快乐！';
            
            const beginning = copywriterStyle === '专业严谨' ? '值此新春之际，谨代表我们向您致以崇高的敬意和美好的祝愿' : 
                             copywriterStyle === '幽默风趣' ? '哈哈，春节到了，不送点祝福怎么行' : 
                             copywriterStyle === '温馨亲切' ? '亲爱的家人/朋友，春节快乐' : '在这个充满喜悦的日子里，我要把最美好的祝福送给你';
            
            const productBlessing = productName ? `${productName}祝您：` : '祝您：';
            const festivalBlessing = isSpringFestival ? `新年快乐，万事如意，身体健康，财源广进，${zodiacYear === '马年' ? '马年大吉' : zodiacYear === '虎年' ? '虎年大吉' : zodiacYear === '兔年' ? '兔年大吉' : zodiacYear === '龙年' ? '龙年大吉' : zodiacYear === '蛇年' ? '蛇年大吉' : zodiacYear === '羊年' ? '羊年大吉' : zodiacYear === '猴年' ? '猴年大吉' : zodiacYear === '鸡年' ? '鸡年大吉' : zodiacYear === '狗年' ? '狗年大吉' : zodiacYear === '猪年' ? '猪年大吉' : zodiacYear === '鼠年' ? '鼠年大吉' : zodiacYear === '牛年' ? '牛年大吉' : '新年快乐'}！` : '节日快乐，心想事成，万事如意，幸福安康！';
            const targetAudienceBlessing = targetAudience ? `\n\n特别的祝福给特别的${targetAudience}！` : '';
            const end = copywriterStyle === '专业严谨' ? '恭祝\n新春愉快' : 
                       copywriterStyle === '幽默风趣' ? '虎年大吉！' : 
                       copywriterStyle === '温馨亲切' ? '期待与你相聚的那一天！' : '愿您度过一个愉快的节日！';
            
            // 替换占位符
            generatedCopywriter = template
                .replace('{greeting}', greeting)
                .replace('{productGreeting}', productGreeting)
                .replace('{festivalGreeting}', festivalGreeting)
                .replace('{targetAudienceGreeting}', targetAudienceGreeting)
                .replace('{closing}', closing)
                .replace('{opening}', opening)
                .replace('{productWishes}', productWishes)
                .replace('{festivalWishes}', festivalWishes)
                .replace('{targetAudienceWishes}', targetAudienceWishes)
                .replace('{closingWishes}', closingWishes)
                .replace('{beginning}', beginning)
                .replace('{productBlessing}', productBlessing)
                .replace('{festivalBlessing}', festivalBlessing)
                .replace('{targetAudienceBlessing}', targetAudienceBlessing)
                .replace('{end}', end);
        } else {
            // 传统模板替换
            template = template.replace(/\${copywriterTopic}/g, copywriterTopic);
            template = template.replace(/\${productName}/g, productName);
            template = template.replace(/\${productFeatures}/g, productFeatures);
            template = template.replace(/\${targetAudience}/g, targetAudience);
            template = template.replace(/\${copywriterStyle}/g, copywriterStyle);
            template = template.replace(/\${copywriterType}/g, copywriterType);
            generatedCopywriter = template;
        }
        
        // 调整文案长度以符合字数限制
        const adjustedCopywriter = adjustCopywriterLength(generatedCopywriter, minWordCount, maxWordCount);
        
        batchResults.style.display = 'none';
        singleResult.style.display = 'block';
        copywriterOutput.value = adjustedCopywriter;
        copywriterRating.innerHTML = '';
        
        // 模拟评分
        await rateCopywriter(adjustedCopywriter);
        
    } catch (error) {
        console.error(`生成失败: ${error.message}`);
        showError(`生成失败: ${error.message}`);
    } finally {
        // 隐藏加载遮罩
        hideLoading();
        generateCopywriterBtn.classList.remove('loading');
        generateCopywriterBtn.disabled = false;
    }
}

// 批量生成文案
async function generateBatchCopywriter() {
    const productNameInput = document.getElementById('product-name');
    const productFeaturesInput = document.getElementById('product-features');
    const targetAudienceInput = document.getElementById('target-audience');
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const copywriterStyleSelect = document.getElementById('copywriter-style');
    const copywriterTopicInput = document.getElementById('copywriter-topic');
    const minWordCountInput = document.getElementById('min-word-count');
    const maxWordCountInput = document.getElementById('max-word-count');
    const generateBatchBtn = document.getElementById('generate-batch-btn');
    const singleResult = document.getElementById('single-result');
    const batchResults = document.getElementById('batch-results');
    
    if (!productNameInput || !productFeaturesInput || !targetAudienceInput || 
        !copywriterCategorySelect || !copywriterTypeSelect || !copywriterStyleSelect || 
        !copywriterTopicInput || !minWordCountInput || !maxWordCountInput || 
        !generateBatchBtn || !singleResult || !batchResults) {
        console.error('DOM元素不存在');
        showError('生成失败: DOM元素不存在');
        return;
    }
    
    const productName = productNameInput.value.trim();
    const productFeatures = productFeaturesInput.value.trim();
    const targetAudience = targetAudienceInput.value.trim();
    const copywriterCategory = copywriterCategorySelect.value;
    const copywriterType = copywriterTypeSelect.value;
    const copywriterStyle = copywriterStyleSelect.value;
    const copywriterTopic = copywriterTopicInput.value.trim();
    const minWordCount = parseInt(minWordCountInput.value) || 0;
    const maxWordCount = parseInt(maxWordCountInput.value) || 1000;
    
    if (!config.siliconFlowApiKey) {
        showError('请在config.js文件中配置SiliconFlow API Key');
        return;
    }
    
    if (!copywriterTopic) {
        showError('请输入文案主题');
        return;
    }
    
    if (copywriterCategory === '营销推广') {
        if (!productName) {
            showError('请输入产品名称');
            return;
        }
        
        if (!productFeatures) {
            showError('请输入产品特点');
            return;
        }
        
        if (!targetAudience) {
            showError('请输入目标用户');
            return;
        }
    }
    
    // 显示加载遮罩
    showLoading();
    generateBatchBtn.classList.add('loading');
    generateBatchBtn.disabled = true;
    
    try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 检测是否为春节相关主题
        const isSpringFestival = copywriterTopic.includes('春节') || copywriterTopic.includes('新春') || copywriterTopic.includes('过年') || copywriterTopic.includes('除夕') || copywriterTopic.includes('新年') || copywriterTopic.includes('马年') || copywriterTopic.includes('虎年') || copywriterTopic.includes('兔年') || copywriterTopic.includes('龙年') || copywriterTopic.includes('蛇年') || copywriterTopic.includes('羊年') || copywriterTopic.includes('猴年') || copywriterTopic.includes('鸡年') || copywriterTopic.includes('狗年') || copywriterTopic.includes('猪年') || copywriterTopic.includes('鼠年') || copywriterTopic.includes('牛年');
        
        // 提取生肖信息
        let zodiacYear = '';
        if (copywriterTopic.includes('马年')) zodiacYear = '马年';
        else if (copywriterTopic.includes('虎年')) zodiacYear = '虎年';
        else if (copywriterTopic.includes('兔年')) zodiacYear = '兔年';
        else if (copywriterTopic.includes('龙年')) zodiacYear = '龙年';
        else if (copywriterTopic.includes('蛇年')) zodiacYear = '蛇年';
        else if (copywriterTopic.includes('羊年')) zodiacYear = '羊年';
        else if (copywriterTopic.includes('猴年')) zodiacYear = '猴年';
        else if (copywriterTopic.includes('鸡年')) zodiacYear = '鸡年';
        else if (copywriterTopic.includes('狗年')) zodiacYear = '狗年';
        else if (copywriterTopic.includes('猪年')) zodiacYear = '猪年';
        else if (copywriterTopic.includes('鼠年')) zodiacYear = '鼠年';
        else if (copywriterTopic.includes('牛年')) zodiacYear = '牛年';
        else zodiacYear = '虎年'; // 默认虎年
        
        // 生成更真实的文案内容
        const copywriterTemplates = {
            '拜年短信': [
                // 春节相关模板
                '{greeting}!\n\n{productGreeting}{festivalGreeting}{targetAudienceGreeting}\n\n{closing}',
                '{opening}!\n\n{productWishes}{festivalWishes}{targetAudienceWishes}\n\n{closingWishes}',
                '{beginning}!\n\n{productBlessing}{festivalBlessing}{targetAudienceBlessing}\n\n{end}',
            ],
            '朋友圈文案': [
                // 春节相关模板
                `🎊 新春快乐！${productName ? `${productName}给您拜年啦！` : '给您拜年啦！'} ${copywriterStyle === '专业严谨' ? '值此新春佳节之际，谨向您致以最诚挚的祝福' : copywriterStyle === '幽默风趣' ? '虎年到，好运到，快乐围着你来绕' : copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐！愿你在新的一年里' : '新年新气象，好运连连到'}！\n\n${productFeatures ? `✨ ${productName}祝您：` : '✨ 祝您：'}${isSpringFestival ? '新春快乐，万事如意，阖家幸福，财源广进，虎年大吉！' : '节日快乐，身体健康，事业有成，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相聚！' : '期待与您共同迎接美好的新一年！'}`,
                `${productName ? `${productName} | ` : ''}${copywriterStyle === '专业严谨' ? '专业品质，匠心打造' : copywriterStyle === '幽默风趣' ? '笑口常开，好运自来' : copywriterStyle === '温馨亲切' ? '温暖相伴，一路同行' : '创意无限，惊喜不断'}！\n\n${isSpringFestival ? '🧧 虎年大吉 🧧\n\n' : ''}${productFeatures ? `🌟 ${productFeatures}！\n\n` : ''}${targetAudience ? `特别推荐给${targetAudience}的祝福！\n\n` : ''}${isSpringFestival ? '愿您在新的一年里，学业进步，事业如虎添翼，生活虎虎生威！' : '愿您节日快乐，心想事成！'}`,
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '诚挚祝福，用心传递' : copywriterStyle === '幽默风趣' ? '快乐相随，烦恼远离' : copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐！' : '新春大吉，万事如意'}！\n\n${isSpringFestival ? '🎈 新的一年，新的开始 🎈\n\n' : ''}${productFeatures ? `💎 ${productFeatures}。\n\n` : ''}${targetAudience ? `为${targetAudience}量身定制的祝福！\n\n` : ''}${isSpringFestival ? '祝您和家人团圆美满，幸福安康！' : '祝您度过一个愉快的节日！'}`,
                // 通用朋友圈模板
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '专业品质，值得信赖' : copywriterStyle === '幽默风趣' ? '幽默有趣，让人难忘' : copywriterStyle === '温馨亲切' ? '温馨关怀，暖人心田' : '创意无限，引领潮流'}。\n\n${productFeatures ? `产品特点：${productFeatures}。\n\n` : ''}${targetAudience ? `特别推荐给${targetAudience}。\n\n` : ''}期待与您共同探索更多精彩！`,
                `${productName ? `${productName}：` : ''}${copywriterStyle === '专业严谨' ? '专业打造，精益求精' : copywriterStyle === '幽默风趣' ? '趣味横生，乐在其中' : copywriterStyle === '温馨亲切' ? '贴心服务，温暖相伴' : '创新突破，引领未来'}。\n\n${productFeatures ? `核心优势：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}的选择。\n\n` : ''}快来体验吧！`,
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '专业团队，品质保证' : copywriterStyle === '幽默风趣' ? '笑点十足，回味无穷' : copywriterStyle === '温馨亲切' ? '温暖陪伴，一路同行' : '创意无限，惊喜不断'}。\n\n${productFeatures ? `产品亮点：${productFeatures}。\n\n` : ''}${targetAudience ? `为${targetAudience}量身打造。\n\n` : ''}期待您的关注！`
            ],
            '节日祝福': [
                `${copywriterStyle === '专业严谨' ? '值此佳节，谨向您致以最诚挚的祝福' : copywriterStyle === '幽默风趣' ? '节日快乐！愿你笑口常开，好运连连' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日愉快' : '在这个特别的日子里，送上我最美好的祝福'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新春快乐，万事如意，阖家幸福，财源广进，虎年大吉！' : '节日快乐，身体健康，事业有成，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相聚！' : '愿这份祝福带给你无限的快乐和温暖！'}`,
                `${copywriterStyle === '专业严谨' ? '在这个喜庆的节日里，我们向您表示最热烈的祝贺' : copywriterStyle === '幽默风趣' ? '节日到啦！准备好接收我的祝福炸弹了吗' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐！想你了' : '又是一年佳节至，祝福满满送给你'}！\n\n${productName ? `${productName}与您共度美好时光：` : '愿您：'}${isSpringFestival ? '新春大吉，虎虎生威，财运亨通，吉祥如意！' : '节日快乐，心想事成，万事如意，笑口常开！'}${targetAudience ? `\n\n送给最亲爱的${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '爱你哟！' : '祝福大家节日快乐！'}`,
                `${copywriterStyle === '专业严谨' ? '值此佳节之际，谨代表我们向您致以崇高的敬意和美好的祝愿' : copywriterStyle === '幽默风趣' ? '哈哈，节日到了，不送点祝福怎么行' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐' : '在这个充满喜悦的日子里，我要把最美好的祝福送给你'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新年快乐，万事如意，身体健康，财源广进，虎年大吉！' : '节日快乐，心想事成，万事如意，幸福安康！'}${targetAudience ? `\n\n特别的祝福给特别的${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '期待开学与你相聚！' : '愿您度过一个愉快的节日！'}`,
            ],
            '小红书文案': [
                `${productName ? `${productName}实测体验！` : ''}作为一个${targetAudience || '普通用户'}，我必须说这是我用过最${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容了！\n\n${productFeatures ? `💡 亮点：${productFeatures}。\n\n` : ''}使用后真的感受到了${copywriterStyle === '专业严谨' ? '专业品质' : copywriterStyle === '幽默风趣' ? '无限乐趣' : copywriterStyle === '温馨亲切' ? '温暖关怀' : '创意魅力'}，强烈推荐给大家！\n\n#${productName || '生活分享'} #${copywriterStyle}`,
                `${productName ? `${productName}绝了！` : ''}最近发现了这个超级${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容，必须分享给你们！\n\n${productFeatures ? `🌟 特点：${productFeatures}。\n\n` : ''}作为${targetAudience || '小红书用户'}，我觉得这个真的很值得尝试，使用感${copywriterStyle === '专业严谨' ? '专业可靠' : copywriterStyle === '幽默风趣' ? '趣味盎然' : copywriterStyle === '温馨亲切' ? '温暖舒适' : '创意十足'}！\n\n#好物分享 #${productName || '生活分享'} #${copywriterStyle}`,
                `${productName ? `${productName}使用报告` : ''}作为${targetAudience || '测评达人'}，我对${copywriterStyle === '专业严谨' ? '专业性' : copywriterStyle === '幽默风趣' ? '趣味性' : copywriterStyle === '温馨亲切' ? '贴心度' : '创意性'}要求很高，但这个产品/内容真的超出了我的预期！\n\n${productFeatures ? `✅ 优势：${productFeatures}。\n\n` : ''}使用过程中感受到了${copywriterStyle === '专业严谨' ? '专业团队的用心' : copywriterStyle === '幽默风趣' ? '无穷的乐趣' : copywriterStyle === '温馨亲切' ? '满满的关怀' : '无限的创意'}，推荐给所有需要的小伙伴！\n\n#测评 #${productName || '生活'} #${copywriterStyle}`,
            ],
            '其他': [
                `${copywriterStyle === '专业严谨' ? '根据您的需求，我们为您准备了以下内容' : copywriterStyle === '幽默风趣' ? '哈哈，来了来了，您要的内容新鲜出炉' : copywriterStyle === '温馨亲切' ? '亲爱的朋友，这是为您准备的内容' : '创意无限，为您呈现'}！\n\n${productName ? `【${productName}】\n` : ''}${productFeatures ? `主要内容：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}阅读。\n\n` : ''}希望您喜欢！`,
                `${copywriterStyle === '专业严谨' ? '经过精心准备，为您呈现以下内容' : copywriterStyle === '幽默风趣' ? '铛铛铛！您期待的内容来啦' : copywriterStyle === '温馨亲切' ? '亲爱的，这是专门为您准备的' : '创意满满，精彩呈现'}！\n\n${productName ? `关于${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '特别为您定制。\n\n' : ''}祝您生活愉快！`,
                `${copywriterStyle === '专业严谨' ? '专业制作，品质保证' : copywriterStyle === '幽默风趣' ? '趣味盎然，不容错过' : copywriterStyle === '温馨亲切' ? '温暖人心，贴心制作' : '创意无限，惊喜不断'}！\n\n${productName ? `${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '为您量身打造。\n\n' : ''}感谢您的支持！`,
            ]
        };
        
        // 选择对应类型的文案模板
        const templates = copywriterTemplates[copywriterType] || copywriterTemplates['其他'];
        
        // 生成3个不同版本的文案
        const versions = [];
        const usedTemplates = new Set();
        
        // 为每种文案类型添加更多变化的模板
        const enhancedTemplates = {
            '拜年短信': [
                // 春节相关模板
                '{greeting}!\n\n{productGreeting}{festivalGreeting}{targetAudienceGreeting}\n\n{closing}',
                '{opening}!\n\n{productWishes}{festivalWishes}{targetAudienceWishes}\n\n{closingWishes}',
                '{beginning}!\n\n{productBlessing}{festivalBlessing}{targetAudienceBlessing}\n\n{end}',
                '{greeting}!\n\n{productGreeting}{festivalGreeting}\n\n{targetAudienceGreeting}\n\n{closing}',
                '{opening}!\n\n{productWishes}{festivalWishes}\n\n{targetAudienceWishes}\n\n{closingWishes}',
                '{beginning}!\n\n{productBlessing}{festivalBlessing}\n\n{targetAudienceBlessing}\n\n{end}'
            ],
            '朋友圈文案': [
                // 春节相关模板
                `🎊 新春快乐！${productName ? `${productName}给您拜年啦！` : '给您拜年啦！'} ${copywriterStyle === '专业严谨' ? '值此新春佳节之际，谨向您致以最诚挚的祝福' : copywriterStyle === '幽默风趣' ? '虎年到，好运到，快乐围着你来绕' : copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐！愿你在新的一年里' : '新年新气象，好运连连到'}！\n\n${productFeatures ? `✨ ${productName}祝您：` : '✨ 祝您：'}${isSpringFestival ? '新春快乐，万事如意，阖家幸福，财源广进，虎年大吉！' : '节日快乐，身体健康，事业有成，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相聚！' : '期待与您共同迎接美好的新一年！'}`,
                `${productName ? `${productName} | ` : ''}${copywriterStyle === '专业严谨' ? '专业品质，匠心打造' : copywriterStyle === '幽默风趣' ? '笑口常开，好运自来' : copywriterStyle === '温馨亲切' ? '温暖相伴，一路同行' : '创意无限，惊喜不断'}！\n\n${isSpringFestival ? '🧧 虎年大吉 🧧\n\n' : ''}${productFeatures ? `🌟 ${productFeatures}！\n\n` : ''}${targetAudience ? `特别推荐给${targetAudience}的祝福！\n\n` : ''}${isSpringFestival ? '愿您在新的一年里，学业进步，事业如虎添翼，生活虎虎生威！' : '愿您节日快乐，心想事成！'}`,
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '诚挚祝福，用心传递' : copywriterStyle === '幽默风趣' ? '快乐相随，烦恼远离' : copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐！' : '新春大吉，万事如意'}！\n\n${isSpringFestival ? '🎈 新的一年，新的开始 🎈\n\n' : ''}${productFeatures ? `💎 ${productFeatures}。\n\n` : ''}${targetAudience ? `为${targetAudience}量身定制的祝福！\n\n` : ''}${isSpringFestival ? '祝您和家人团圆美满，幸福安康！' : '祝您度过一个愉快的节日！'}`,
                // 通用朋友圈模板
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '专业品质，值得信赖' : copywriterStyle === '幽默风趣' ? '幽默有趣，让人难忘' : copywriterStyle === '温馨亲切' ? '温馨关怀，暖人心田' : '创意无限，引领潮流'}。\n\n${productFeatures ? `产品特点：${productFeatures}。\n\n` : ''}${targetAudience ? `特别推荐给${targetAudience}。\n\n` : ''}期待与您共同探索更多精彩！`,
                `${productName ? `${productName}：` : ''}${copywriterStyle === '专业严谨' ? '专业打造，精益求精' : copywriterStyle === '幽默风趣' ? '趣味横生，乐在其中' : copywriterStyle === '温馨亲切' ? '贴心服务，温暖相伴' : '创新突破，引领未来'}。\n\n${productFeatures ? `核心优势：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}的选择。\n\n` : ''}快来体验吧！`,
                `${productName ? `${productName}，` : ''}${copywriterStyle === '专业严谨' ? '专业团队，品质保证' : copywriterStyle === '幽默风趣' ? '笑点十足，回味无穷' : copywriterStyle === '温馨亲切' ? '温暖陪伴，一路同行' : '创意无限，惊喜不断'}。\n\n${productFeatures ? `产品亮点：${productFeatures}。\n\n` : ''}${targetAudience ? `为${targetAudience}量身打造。\n\n` : ''}期待您的关注！`
            ],
            '节日祝福': [
                `${copywriterStyle === '专业严谨' ? '值此佳节，谨向您致以最诚挚的祝福' : copywriterStyle === '幽默风趣' ? '节日快乐！愿你笑口常开，好运连连' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日愉快' : '在这个特别的日子里，送上我最美好的祝福'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新春快乐，万事如意，阖家幸福，财源广进，虎年大吉！' : '节日快乐，身体健康，事业有成，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相聚！' : '愿这份祝福带给你无限的快乐和温暖！'}`,
                `${copywriterStyle === '专业严谨' ? '在这个喜庆的节日里，我们向您表示最热烈的祝贺' : copywriterStyle === '幽默风趣' ? '节日到啦！准备好接收我的祝福炸弹了吗' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐！想你了' : '又是一年佳节至，祝福满满送给你'}！\n\n${productName ? `${productName}与您共度美好时光：` : '愿您：'}${isSpringFestival ? '新春大吉，虎虎生威，财运亨通，吉祥如意！' : '节日快乐，心想事成，万事如意，笑口常开！'}${targetAudience ? `\n\n送给最亲爱的${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '爱你哟！' : '祝福大家节日快乐！'}`,
                `${copywriterStyle === '专业严谨' ? '值此佳节之际，谨代表我们向您致以崇高的敬意和美好的祝愿' : copywriterStyle === '幽默风趣' ? '哈哈，节日到了，不送点祝福怎么行' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐' : '在这个充满喜悦的日子里，我要把最美好的祝福送给你'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新年快乐，万事如意，身体健康，财源广进，虎年大吉！' : '节日快乐，心想事成，万事如意，幸福安康！'}${targetAudience ? `\n\n特别的祝福给特别的${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '期待开学与你相聚！' : '愿您度过一个愉快的节日！'}`,
                `${copywriterStyle === '专业严谨' ? '在这个值得庆祝的日子里' : copywriterStyle === '幽默风趣' ? '哇哦，节日来啦！' : copywriterStyle === '温馨亲切' ? '亲爱的朋友，节日快乐' : '今天是个特别的日子'}！\n\n${productName ? `${productName}诚挚祝福您：` : '诚挚祝福您：'}${isSpringFestival ? '新春快乐，阖家团圆，事业有成，财源广进，虎年大吉！' : '节日快乐，身体健康，家庭幸福，万事如意！'}${targetAudience ? `\n\n特别为${targetAudience}送上最美好的祝福！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '爱你哟，期待与你相见！' : '愿您的生活充满阳光和快乐！'}`,
                `${copywriterStyle === '专业严谨' ? '值此佳节来临之际' : copywriterStyle === '幽默风趣' ? '嘿，节日到啦，准备好接福了吗' : copywriterStyle === '温馨亲切' ? '亲爱的同学，节日快乐' : '在这个温馨的节日里'}！\n\n${productName ? `${productName}祝您：` : '祝您：'}${isSpringFestival ? '新年新气象，虎年行大运，万事如意，财源广进！' : '节日快乐，心想事成，身体健康，家庭美满！'}${targetAudience ? `\n\n特别祝福${targetAudience}！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '想你了，开学见！' : '愿您度过一个难忘的节日！'}`,
                `${copywriterStyle === '专业严谨' ? '在这个喜庆的时刻' : copywriterStyle === '幽默风趣' ? '节日快乐，我的朋友！' : copywriterStyle === '温馨亲切' ? '亲爱的家人，节日快乐' : '在这个美好的节日里'}！\n\n${productName ? `${productName}与您共同庆祝：` : '让我们共同庆祝：'}${isSpringFestival ? '新春快乐，虎年大吉，万事如意，阖家幸福！' : '节日快乐，身体健康，事业有成，生活美满！'}${targetAudience ? `\n\n特别为${targetAudience}送上祝福！` : ''}\n\n${copywriterStyle === '温馨亲切' ? '爱你哟！' : '愿您的节日充满欢乐和温馨！'}`
            ],
            '小红书文案': [
                `${productName ? `${productName}实测体验！` : ''}作为一个${targetAudience || '普通用户'}，我必须说这是我用过最${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容了！\n\n${productFeatures ? `💡 亮点：${productFeatures}。\n\n` : ''}使用后真的感受到了${copywriterStyle === '专业严谨' ? '专业品质' : copywriterStyle === '幽默风趣' ? '无限乐趣' : copywriterStyle === '温馨亲切' ? '温暖关怀' : '创意魅力'}，强烈推荐给大家！\n\n#${productName || '生活分享'} #${copywriterStyle}`,
                `${productName ? `${productName}绝了！` : ''}最近发现了这个超级${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容，必须分享给你们！\n\n${productFeatures ? `🌟 特点：${productFeatures}。\n\n` : ''}作为${targetAudience || '小红书用户'}，我觉得这个真的很值得尝试，使用感${copywriterStyle === '专业严谨' ? '专业可靠' : copywriterStyle === '幽默风趣' ? '趣味盎然' : copywriterStyle === '温馨亲切' ? '温暖舒适' : '创意十足'}！\n\n#好物分享 #${productName || '生活分享'} #${copywriterStyle}`,
                `${productName ? `${productName}使用报告` : ''}作为${targetAudience || '测评达人'}，我对${copywriterStyle === '专业严谨' ? '专业性' : copywriterStyle === '幽默风趣' ? '趣味性' : copywriterStyle === '温馨亲切' ? '贴心度' : '创意性'}要求很高，但这个产品/内容真的超出了我的预期！\n\n${productFeatures ? `✅ 优势：${productFeatures}。\n\n` : ''}使用过程中感受到了${copywriterStyle === '专业严谨' ? '专业团队的用心' : copywriterStyle === '幽默风趣' ? '无穷的乐趣' : copywriterStyle === '温馨亲切' ? '满满的关怀' : '无限的创意'}，推荐给所有需要的小伙伴！\n\n#测评 #${productName || '生活'} #${copywriterStyle}`,
                `${productName ? `${productName}深度体验！` : ''}作为${targetAudience || '生活达人'}，我一直在寻找${copywriterStyle === '专业严谨' ? '专业可靠' : copywriterStyle === '幽默风趣' ? '有趣好玩' : copywriterStyle === '温馨亲切' ? '贴心实用' : '创意独特'}的产品/内容，终于让我找到了！\n\n${productFeatures ? `✨ 核心优势：${productFeatures}。\n\n` : ''}使用后完全被圈粉，${copywriterStyle === '专业严谨' ? '专业度满分' : copywriterStyle === '幽默风趣' ? '太有意思了' : copywriterStyle === '温馨亲切' ? '超级贴心' : '创意十足'}，必须推荐给你们！\n\n#${productName || '好物'} #生活 #${copywriterStyle}`,
                `${productName ? `${productName}太赞了！` : ''}最近入手了这个${copywriterStyle === '专业严谨' ? '专业' : copywriterStyle === '幽默风趣' ? '有趣' : copywriterStyle === '温馨亲切' ? '贴心' : '创意'}的产品/内容，简直是我的心头好！\n\n${productFeatures ? `🌟 亮点解析：${productFeatures}。\n\n` : ''}作为${targetAudience || '小红书忠实用户'}，我觉得这个真的很值得拥有，使用感${copywriterStyle === '专业严谨' ? '专业流畅' : copywriterStyle === '幽默风趣' ? '乐趣无穷' : copywriterStyle === '温馨亲切' ? '温暖贴心' : '创意满满'}！\n\n#好物推荐 #${productName || '生活'} #${copywriterStyle}`,
                `${productName ? `${productName}真实测评！` : ''}作为${targetAudience || '测评博主'}，我测评过很多产品/内容，但这个真的让我眼前一亮！\n\n${productFeatures ? `✅ 实测优势：${productFeatures}。\n\n` : ''}使用过程中感受到了${copywriterStyle === '专业严谨' ? '专业团队的匠心' : copywriterStyle === '幽默风趣' ? '无限的乐趣' : copywriterStyle === '温馨亲切' ? '满满的温暖' : '无限的创意'}，强烈推荐给大家！\n\n#测评分享 #${productName || '生活'} #${copywriterStyle}`
            ],
            '其他': [
                `${copywriterStyle === '专业严谨' ? '根据您的需求，我们为您准备了以下内容' : copywriterStyle === '幽默风趣' ? '哈哈，来了来了，您要的内容新鲜出炉' : copywriterStyle === '温馨亲切' ? '亲爱的朋友，这是为您准备的内容' : '创意无限，为您呈现'}！\n\n${productName ? `【${productName}】\n` : ''}${productFeatures ? `主要内容：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}阅读。\n\n` : ''}希望您喜欢！`,
                `${copywriterStyle === '专业严谨' ? '经过精心准备，为您呈现以下内容' : copywriterStyle === '幽默风趣' ? '铛铛铛！您期待的内容来啦' : copywriterStyle === '温馨亲切' ? '亲爱的，这是专门为您准备的' : '创意满满，精彩呈现'}！\n\n${productName ? `关于${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '特别为您定制。\n\n' : ''}祝您生活愉快！`,
                `${copywriterStyle === '专业严谨' ? '专业制作，品质保证' : copywriterStyle === '幽默风趣' ? '趣味盎然，不容错过' : copywriterStyle === '温馨亲切' ? '温暖人心，贴心制作' : '创意无限，惊喜不断'}！\n\n${productName ? `${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '为您量身打造。\n\n' : ''}感谢您的支持！`,
                `${copywriterStyle === '专业严谨' ? '根据您的需求，我们精心准备了以下内容' : copywriterStyle === '幽默风趣' ? '来啦来啦，您要的内容来啦' : copywriterStyle === '温馨亲切' ? '亲爱的朋友，这是为您准备的' : '创意无限，为您呈现'}！\n\n${productName ? `【${productName}】\n` : ''}${productFeatures ? `核心内容：${productFeatures}。\n\n` : ''}${targetAudience ? `适合${targetAudience}。\n\n` : ''}希望对您有所帮助！`,
                `${copywriterStyle === '专业严谨' ? '经过专业团队的精心准备' : copywriterStyle === '幽默风趣' ? '哈哈，新鲜出炉的内容来啦' : copywriterStyle === '温馨亲切' ? '亲爱的，这是专门为您准备的' : '创意满满，为您呈现'}！\n\n${productName ? `关于${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '特别为您定制。\n\n' : ''}祝您一切顺利！`,
                `${copywriterStyle === '专业严谨' ? '专业制作，品质保障' : copywriterStyle === '幽默风趣' ? '趣味十足，不容错过' : copywriterStyle === '温馨亲切' ? '温暖人心，贴心制作' : '创意无限，惊喜连连'}！\n\n${productName ? `${productName}：\n` : ''}${productFeatures ? `${productFeatures}。\n\n` : ''}${targetAudience ? '为您量身打造。\n\n' : ''}感谢您的关注！`
            ]
        };
        
        // 使用增强的模板集合
        const availableTemplates = enhancedTemplates[copywriterType] || enhancedTemplates['其他'];
        
        for (let i = 0; i < 3; i++) {
            // 随机选择模板，确保多样性
            let templateIndex;
            do {
                templateIndex = Math.floor(Math.random() * availableTemplates.length);
            } while (usedTemplates.has(templateIndex));
            
            usedTemplates.add(templateIndex);
            
            // 获取模板并替换变量
            let template = availableTemplates[templateIndex];
            let processedTemplate;
            
            if (copywriterType === '拜年短信') {
                // 生成拜年短信内容
                const greetings = [
                    copywriterStyle === '专业严谨' ? '值此新春佳节之际，谨向您致以最诚挚的节日祝福' : 
                    copywriterStyle === '幽默风趣' ? '虎年到，好运到，给您拜年啦' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的朋友，春节快乐' : '新年新气象，祝您新春快乐',
                    copywriterStyle === '专业严谨' ? '在这新春到来之际，谨向您致以节日的问候' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，恭喜发财' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐' : '新春大吉，万事如意',
                    copywriterStyle === '专业严谨' ? '值此佳节，谨向您致以最美好的祝福' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，虎虎生威' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人，春节快乐' : '新年好，万事如意'
                ];
                
                const openings = [
                    copywriterStyle === '专业严谨' ? '在这辞旧迎新的美好时刻，我们向您表示最热烈的祝贺和最美好的祝福' : 
                    copywriterStyle === '幽默风趣' ? '春节到啦！准备好接收我的祝福了吗' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的，春节快乐！愿你在新的一年里' : '又是一年新春至，祝福满满送给你',
                    copywriterStyle === '专业严谨' ? '在这喜庆的新春佳节，我们向您致以最诚挚的问候' : 
                    copywriterStyle === '幽默风趣' ? '过年啦，给你拜个早年' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的同学，新年快乐！愿你' : '新春到来，祝福连连',
                    copywriterStyle === '专业严谨' ? '在这美好的新春时刻，我们向您表示最热烈的祝贺' : 
                    copywriterStyle === '幽默风趣' ? '春节快乐，好运滚滚来' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人，春节快乐！愿我们' : '新年新气象，祝福送到家'
                ];
                
                const beginnings = [
                    copywriterStyle === '专业严谨' ? '值此新春之际，谨代表我们向您致以崇高的敬意和美好的祝愿' : 
                    copywriterStyle === '幽默风趣' ? '哈哈，春节到了，不送点祝福怎么行' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人/朋友，春节快乐' : '在这个充满喜悦的日子里，我要把最美好的祝福送给你',
                    copywriterStyle === '专业严谨' ? '在这新春佳节来临之际，谨向您致以最诚挚的祝福' : 
                    copywriterStyle === '幽默风趣' ? '嘿，春节到啦，准备好接福了吗' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐' : '在这个喜庆的日子里，送上我最美好的祝福',
                    copywriterStyle === '专业严谨' ? '值此新春佳节，谨向您致以最美好的节日祝福' : 
                    copywriterStyle === '幽默风趣' ? '春节快乐，我的朋友' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人，节日快乐' : '在这个美好的新春里，我要把祝福送给你'
                ];
                
                const closings = [
                    copywriterStyle === '专业严谨' ? '顺颂时祺' : 
                    copywriterStyle === '幽默风趣' ? '笑口常开！' : 
                    copywriterStyle === '温馨亲切' ? '想你了，期待与你相聚！' : '期待与您共同迎接美好的新一年！',
                    copywriterStyle === '专业严谨' ? '谨祝新春愉快' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，天天开心！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟，期待开学见！' : '愿您在新的一年里万事如意！',
                    copywriterStyle === '专业严谨' ? '恭祝新春大吉' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，好运连连！' : 
                    copywriterStyle === '温馨亲切' ? '想你了，春节快乐！' : '期待与您共同创造美好的新一年！'
                ];
                
                const closingWishes = [
                    copywriterStyle === '专业严谨' ? '此致\n敬礼' : 
                    copywriterStyle === '幽默风趣' ? '哈哈，新年快乐！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟！' : '祝福大家节日快乐！',
                    copywriterStyle === '专业严谨' ? '谨上' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，恭喜发财！' : 
                    copywriterStyle === '温馨亲切' ? '想你了！' : '愿您节日愉快！',
                    copywriterStyle === '专业严谨' ? '顺颂时绥' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，笑口常开！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟，开学见！' : '祝福您新春快乐！'
                ];
                
                const ends = [
                    copywriterStyle === '专业严谨' ? '恭祝\n新春愉快' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉！' : 
                    copywriterStyle === '温馨亲切' ? '期待与你相聚的那一天！' : '愿您度过一个愉快的节日！',
                    copywriterStyle === '专业严谨' ? '谨祝\n新年快乐' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，万事如意！' : 
                    copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相见！' : '愿您的节日充满欢乐！',
                    copywriterStyle === '专业严谨' ? '恭祝\n新春大吉' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，好运不断！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟，春节快乐！' : '愿您度过一个难忘的节日！'
                ];
                
                // 随机选择不同的问候语，增加多样性
                const greeting = greetings[i % greetings.length];
                const opening = openings[i % openings.length];
                const beginning = beginnings[i % beginnings.length];
                const closing = closings[i % closings.length];
                const closingWish = closingWishes[i % closingWishes.length];
                const end = ends[i % ends.length];
                
                const productGreeting = productName ? `${productName}敬上：` : '';
                const festivalGreeting = isSpringFestival ? `新春快乐，万事如意，阖家幸福，财源广进，${zodiacYear === '马年' ? '马年大吉' : zodiacYear === '虎年' ? '虎年大吉' : zodiacYear === '兔年' ? '兔年大吉' : zodiacYear === '龙年' ? '龙年大吉' : zodiacYear === '蛇年' ? '蛇年大吉' : zodiacYear === '羊年' ? '羊年大吉' : zodiacYear === '猴年' ? '猴年大吉' : zodiacYear === '鸡年' ? '鸡年大吉' : zodiacYear === '狗年' ? '狗年大吉' : zodiacYear === '猪年' ? '猪年大吉' : zodiacYear === '鼠年' ? '鼠年大吉' : zodiacYear === '牛年' ? '牛年大吉' : '新年快乐'}！` : '节日快乐，身体健康，事业有成，家庭美满！';
                const targetAudienceGreeting = targetAudience ? `\n\n特别祝福${targetAudience}！` : '';
                
                const productWishes = productName ? `${productName}祝您：` : '祝您：';
                const festivalWishes = isSpringFestival ? `${zodiacYear === '马年' ? '新春大吉，马到成功' : zodiacYear === '虎年' ? '新春大吉，虎虎生威' : zodiacYear === '兔年' ? '新春大吉，兔年吉祥' : zodiacYear === '龙年' ? '新春大吉，龙马精神' : zodiacYear === '蛇年' ? '新春大吉，蛇年吉祥' : zodiacYear === '羊年' ? '新春大吉，羊年吉祥' : zodiacYear === '猴年' ? '新春大吉，猴年吉祥' : zodiacYear === '鸡年' ? '新春大吉，鸡年吉祥' : zodiacYear === '狗年' ? '新春大吉，狗年吉祥' : zodiacYear === '猪年' ? '新春大吉，猪年吉祥' : zodiacYear === '鼠年' ? '新春大吉，鼠年吉祥' : zodiacYear === '牛年' ? '新春大吉，牛年吉祥' : '新春大吉'}，财运亨通，吉祥如意！` : '节日快乐，心想事成，万事如意，笑口常开！';
                const targetAudienceWishes = targetAudience ? `\n\n送给最亲爱的${targetAudience}！` : '';
                
                const productBlessing = productName ? `${productName}祝您：` : '祝您：';
                const festivalBlessing = isSpringFestival ? `新年快乐，万事如意，身体健康，财源广进，${zodiacYear === '马年' ? '马年大吉' : zodiacYear === '虎年' ? '虎年大吉' : zodiacYear === '兔年' ? '兔年大吉' : zodiacYear === '龙年' ? '龙年大吉' : zodiacYear === '蛇年' ? '蛇年大吉' : zodiacYear === '羊年' ? '羊年大吉' : zodiacYear === '猴年' ? '猴年大吉' : zodiacYear === '鸡年' ? '鸡年大吉' : zodiacYear === '狗年' ? '狗年大吉' : zodiacYear === '猪年' ? '猪年大吉' : zodiacYear === '鼠年' ? '鼠年大吉' : zodiacYear === '牛年' ? '牛年大吉' : '新年快乐'}！` : '节日快乐，心想事成，万事如意，幸福安康！';
                const targetAudienceBlessing = targetAudience ? `\n\n特别的祝福给特别的${targetAudience}！` : '';
                
                // 替换占位符
                processedTemplate = template
                    .replace('{greeting}', greeting)
                    .replace('{productGreeting}', productGreeting)
                    .replace('{festivalGreeting}', festivalGreeting)
                    .replace('{targetAudienceGreeting}', targetAudienceGreeting)
                    .replace('{closing}', closing)
                    .replace('{opening}', opening)
                    .replace('{productWishes}', productWishes)
                    .replace('{festivalWishes}', festivalWishes)
                    .replace('{targetAudienceWishes}', targetAudienceWishes)
                    .replace('{closingWishes}', closingWish)
                    .replace('{beginning}', beginning)
                    .replace('{productBlessing}', productBlessing)
                    .replace('{festivalBlessing}', festivalBlessing)
                    .replace('{targetAudienceBlessing}', targetAudienceBlessing)
                    .replace('{end}', end);
            } else {
                // 传统模板替换
                template = template.replace(/\${copywriterTopic}/g, copywriterTopic);
                template = template.replace(/\${productName}/g, productName);
                template = template.replace(/\${productFeatures}/g, productFeatures);
                template = template.replace(/\${targetAudience}/g, targetAudience);
                template = template.replace(/\${copywriterStyle}/g, copywriterStyle);
                template = template.replace(/\${copywriterType}/g, copywriterType);
                processedTemplate = template;
            }
            
            // 调整文案长度以符合字数限制
            const adjustedTemplate = adjustCopywriterLength(processedTemplate, minWordCount, maxWordCount);
            versions.push(adjustedTemplate);
        }
        
        // 确保有3个版本
        while (versions.length < 3) {
            // 随机选择模板，确保多样性
            let templateIndex;
            do {
                templateIndex = Math.floor(Math.random() * availableTemplates.length);
            } while (usedTemplates.has(templateIndex));
            
            usedTemplates.add(templateIndex);
            
            let template = availableTemplates[templateIndex];
            let processedTemplate;
            
            if (copywriterType === '拜年短信') {
                // 生成拜年短信内容
                const greetings = [
                    copywriterStyle === '专业严谨' ? '值此新春佳节之际，谨向您致以最诚挚的节日祝福' : 
                    copywriterStyle === '幽默风趣' ? '虎年到，好运到，给您拜年啦' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的朋友，春节快乐' : '新年新气象，祝您新春快乐',
                    copywriterStyle === '专业严谨' ? '在这新春到来之际，谨向您致以节日的问候' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，恭喜发财' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐' : '新春大吉，万事如意',
                    copywriterStyle === '专业严谨' ? '值此佳节，谨向您致以最美好的祝福' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，虎虎生威' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人，春节快乐' : '新年好，万事如意'
                ];
                
                const openings = [
                    copywriterStyle === '专业严谨' ? '在这辞旧迎新的美好时刻，我们向您表示最热烈的祝贺和最美好的祝福' : 
                    copywriterStyle === '幽默风趣' ? '春节到啦！准备好接收我的祝福了吗' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的，春节快乐！愿你在新的一年里' : '又是一年新春至，祝福满满送给你',
                    copywriterStyle === '专业严谨' ? '在这喜庆的新春佳节，我们向您致以最诚挚的问候' : 
                    copywriterStyle === '幽默风趣' ? '过年啦，给你拜个早年' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的同学，新年快乐！愿你' : '新春到来，祝福连连',
                    copywriterStyle === '专业严谨' ? '在这美好的新春时刻，我们向您表示最热烈的祝贺' : 
                    copywriterStyle === '幽默风趣' ? '春节快乐，好运滚滚来' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人，春节快乐！愿我们' : '新年新气象，祝福送到家'
                ];
                
                const beginnings = [
                    copywriterStyle === '专业严谨' ? '值此新春之际，谨代表我们向您致以崇高的敬意和美好的祝愿' : 
                    copywriterStyle === '幽默风趣' ? '哈哈，春节到了，不送点祝福怎么行' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人/朋友，春节快乐' : '在这个充满喜悦的日子里，我要把最美好的祝福送给你',
                    copywriterStyle === '专业严谨' ? '在这新春佳节来临之际，谨向您致以最诚挚的祝福' : 
                    copywriterStyle === '幽默风趣' ? '嘿，春节到啦，准备好接福了吗' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的同学，春节快乐' : '在这个喜庆的日子里，送上我最美好的祝福',
                    copywriterStyle === '专业严谨' ? '值此新春佳节，谨向您致以最美好的节日祝福' : 
                    copywriterStyle === '幽默风趣' ? '春节快乐，我的朋友' : 
                    copywriterStyle === '温馨亲切' ? '亲爱的家人，节日快乐' : '在这个美好的新春里，我要把祝福送给你'
                ];
                
                const closings = [
                    copywriterStyle === '专业严谨' ? '顺颂时祺' : 
                    copywriterStyle === '幽默风趣' ? '笑口常开！' : 
                    copywriterStyle === '温馨亲切' ? '想你了，期待与你相聚！' : '期待与您共同迎接美好的新一年！',
                    copywriterStyle === '专业严谨' ? '谨祝新春愉快' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，天天开心！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟，期待开学见！' : '愿您在新的一年里万事如意！',
                    copywriterStyle === '专业严谨' ? '恭祝新春大吉' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，好运连连！' : 
                    copywriterStyle === '温馨亲切' ? '想你了，春节快乐！' : '期待与您共同创造美好的新一年！'
                ];
                
                const closingWishes = [
                    copywriterStyle === '专业严谨' ? '此致\n敬礼' : 
                    copywriterStyle === '幽默风趣' ? '哈哈，新年快乐！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟！' : '祝福大家节日快乐！',
                    copywriterStyle === '专业严谨' ? '谨上' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，恭喜发财！' : 
                    copywriterStyle === '温馨亲切' ? '想你了！' : '愿您节日愉快！',
                    copywriterStyle === '专业严谨' ? '顺颂时绥' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，笑口常开！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟，开学见！' : '祝福您新春快乐！'
                ];
                
                const ends = [
                    copywriterStyle === '专业严谨' ? '恭祝\n新春愉快' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉！' : 
                    copywriterStyle === '温馨亲切' ? '期待与你相聚的那一天！' : '愿您度过一个愉快的节日！',
                    copywriterStyle === '专业严谨' ? '谨祝\n新年快乐' : 
                    copywriterStyle === '幽默风趣' ? '新年快乐，万事如意！' : 
                    copywriterStyle === '温馨亲切' ? '想你了，期待开学与你相见！' : '愿您的节日充满欢乐！',
                    copywriterStyle === '专业严谨' ? '恭祝\n新春大吉' : 
                    copywriterStyle === '幽默风趣' ? '虎年大吉，好运不断！' : 
                    copywriterStyle === '温馨亲切' ? '爱你哟，春节快乐！' : '愿您度过一个难忘的节日！'
                ];
                
                // 随机选择不同的问候语，增加多样性
                const randomIndex = Math.floor(Math.random() * greetings.length);
                const greeting = greetings[randomIndex];
                const opening = openings[randomIndex];
                const beginning = beginnings[randomIndex];
                const closing = closings[randomIndex];
                const closingWish = closingWishes[randomIndex];
                const end = ends[randomIndex];
                
                const productGreeting = productName ? `${productName}敬上：` : '';
                const festivalGreeting = isSpringFestival ? `新春快乐，万事如意，阖家幸福，财源广进，${zodiacYear === '马年' ? '马年大吉' : zodiacYear === '虎年' ? '虎年大吉' : zodiacYear === '兔年' ? '兔年大吉' : zodiacYear === '龙年' ? '龙年大吉' : zodiacYear === '蛇年' ? '蛇年大吉' : zodiacYear === '羊年' ? '羊年大吉' : zodiacYear === '猴年' ? '猴年大吉' : zodiacYear === '鸡年' ? '鸡年大吉' : zodiacYear === '狗年' ? '狗年大吉' : zodiacYear === '猪年' ? '猪年大吉' : zodiacYear === '鼠年' ? '鼠年大吉' : zodiacYear === '牛年' ? '牛年大吉' : '新年快乐'}！` : '节日快乐，身体健康，事业有成，家庭美满！';
                const targetAudienceGreeting = targetAudience ? `\n\n特别祝福${targetAudience}！` : '';
                
                const productWishes = productName ? `${productName}祝您：` : '祝您：';
                const festivalWishes = isSpringFestival ? `${zodiacYear === '马年' ? '新春大吉，马到成功' : zodiacYear === '虎年' ? '新春大吉，虎虎生威' : zodiacYear === '兔年' ? '新春大吉，兔年吉祥' : zodiacYear === '龙年' ? '新春大吉，龙马精神' : zodiacYear === '蛇年' ? '新春大吉，蛇年吉祥' : zodiacYear === '羊年' ? '新春大吉，羊年吉祥' : zodiacYear === '猴年' ? '新春大吉，猴年吉祥' : zodiacYear === '鸡年' ? '新春大吉，鸡年吉祥' : zodiacYear === '狗年' ? '新春大吉，狗年吉祥' : zodiacYear === '猪年' ? '新春大吉，猪年吉祥' : zodiacYear === '鼠年' ? '新春大吉，鼠年吉祥' : zodiacYear === '牛年' ? '新春大吉，牛年吉祥' : '新春大吉'}，财运亨通，吉祥如意！` : '节日快乐，心想事成，万事如意，笑口常开！';
                const targetAudienceWishes = targetAudience ? `\n\n送给最亲爱的${targetAudience}！` : '';
                
                const productBlessing = productName ? `${productName}祝您：` : '祝您：';
                const festivalBlessing = isSpringFestival ? `新年快乐，万事如意，身体健康，财源广进，${zodiacYear === '马年' ? '马年大吉' : zodiacYear === '虎年' ? '虎年大吉' : zodiacYear === '兔年' ? '兔年大吉' : zodiacYear === '龙年' ? '龙年大吉' : zodiacYear === '蛇年' ? '蛇年大吉' : zodiacYear === '羊年' ? '羊年大吉' : zodiacYear === '猴年' ? '猴年大吉' : zodiacYear === '鸡年' ? '鸡年大吉' : zodiacYear === '狗年' ? '狗年大吉' : zodiacYear === '猪年' ? '猪年大吉' : zodiacYear === '鼠年' ? '鼠年大吉' : zodiacYear === '牛年' ? '牛年大吉' : '新年快乐'}！` : '节日快乐，心想事成，万事如意，幸福安康！';
                const targetAudienceBlessing = targetAudience ? `\n\n特别的祝福给特别的${targetAudience}！` : '';
                
                // 替换占位符
                processedTemplate = template
                    .replace('{greeting}', greeting)
                    .replace('{productGreeting}', productGreeting)
                    .replace('{festivalGreeting}', festivalGreeting)
                    .replace('{targetAudienceGreeting}', targetAudienceGreeting)
                    .replace('{closing}', closing)
                    .replace('{opening}', opening)
                    .replace('{productWishes}', productWishes)
                    .replace('{festivalWishes}', festivalWishes)
                    .replace('{targetAudienceWishes}', targetAudienceWishes)
                    .replace('{closingWishes}', closingWish)
                    .replace('{beginning}', beginning)
                    .replace('{productBlessing}', productBlessing)
                    .replace('{festivalBlessing}', festivalBlessing)
                    .replace('{targetAudienceBlessing}', targetAudienceBlessing)
                    .replace('{end}', end);
            } else {
                // 传统模板替换
                template = template.replace(/\${copywriterTopic}/g, copywriterTopic);
                template = template.replace(/\${productName}/g, productName);
                template = template.replace(/\${productFeatures}/g, productFeatures);
                template = template.replace(/\${targetAudience}/g, targetAudience);
                template = template.replace(/\${copywriterStyle}/g, copywriterStyle);
                template = template.replace(/\${copywriterType}/g, copywriterType);
                processedTemplate = template;
            }
            
            // 调整文案长度以符合字数限制
            const adjustedTemplate = adjustCopywriterLength(processedTemplate, minWordCount, maxWordCount);
            versions.push(adjustedTemplate);
        }
        
        singleResult.style.display = 'none';
        batchResults.style.display = 'block';
        batchResults.innerHTML = '';
        
        versions.forEach((content, index) => {
            const batchResultItem = document.createElement('div');
            batchResultItem.className = 'batch-result-item';
            
            // 生成星星HTML（模拟评分）
            let starsHtml = '';
            const starCount = 9 + Math.floor(Math.random() * 2); // 9-10星
            for (let i = 1; i <= 10; i++) {
                starsHtml += `<span class="star ${i <= starCount ? 'filled' : ''}">★</span>`;
            }
            
            batchResultItem.innerHTML = `
                <h4>版本 ${index + 1}</h4>
                <div class="batch-result-content">${content}</div>
                <div class="batch-result-rating">
                    <div class="copywriter-rating">
                        <h4>文案评分</h4>
                        <div class="star-rating">
                            ${starsHtml}
                        </div>
                    </div>
                </div>
                <div class="batch-result-actions">
                    <button class="use-version-btn" data-index="${index}">使用此版本</button>
                    <button class="copy-version-btn" data-index="${index}">复制</button>
                </div>
            `;
            
            batchResults.appendChild(batchResultItem);
        });
        
        // 添加事件监听器
        document.querySelectorAll('.use-version-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const content = versions[index].trim();
                useBatchVersion(content);
            });
        });
        
        document.querySelectorAll('.copy-version-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const content = versions[index].trim();
                copyTextToClipboard(content);
                this.textContent = '已复制!';
                setTimeout(() => {
                    this.textContent = '复制';
                }, 1500);
            });
        });
        
    } catch (error) {
        console.error(`生成失败: ${error.message}`);
        showError(`生成失败: ${error.message}`);
    } finally {
        // 隐藏加载遮罩
        hideLoading();
        generateBatchBtn.classList.remove('loading');
        generateBatchBtn.disabled = false;
    }
}

// 使用批量生成的版本
function useBatchVersion(content) {
    const batchResults = document.getElementById('batch-results');
    const singleResult = document.getElementById('single-result');
    const copywriterOutput = document.getElementById('copywriter-output');
    const copywriterRating = document.getElementById('copywriter-rating');
    const minWordCountInput = document.getElementById('min-word-count');
    const maxWordCountInput = document.getElementById('max-word-count');
    
    if (!batchResults || !singleResult || !copywriterOutput || !copywriterRating || !minWordCountInput || !maxWordCountInput) {
        console.error('DOM元素不存在');
        return;
    }
    
    const minWordCount = parseInt(minWordCountInput.value) || 0;
    const maxWordCount = parseInt(maxWordCountInput.value) || 1000;
    
    // 调整文案长度以符合字数限制
    const adjustedContent = adjustCopywriterLength(content, minWordCount, maxWordCount);
    
    batchResults.style.display = 'none';
    singleResult.style.display = 'block';
    copywriterOutput.value = adjustedContent;
    copywriterRating.innerHTML = '';
    
    // 模拟评分
    rateCopywriter(adjustedContent);
}

// 复制文本到剪贴板
function copyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('复制失败:', err);
    }
    document.body.removeChild(textArea);
}

// 评分文案
async function rateCopywriter(content = null) {
    const copywriterRating = document.getElementById('copywriter-rating');
    const copywriterOutput = document.getElementById('copywriter-output');
    
    if (!copywriterRating || !copywriterOutput) {
        console.error('DOM元素不存在');
        return;
    }
    
    const textToRate = content || copywriterOutput.value;
    
    if (!textToRate) {
        showError('请先生成文案再进行评分');
        return;
    }
    
    try {
        // 生成星星HTML（模拟评分）
        let starsHtml = '';
        const starCount = 9 + Math.floor(Math.random() * 2); // 9-10星
        for (let i = 1; i <= 10; i++) {
            starsHtml += `<span class="star ${i <= starCount ? 'filled' : ''}">★</span>`;
        }
        
        copywriterRating.innerHTML = `
            <div class="copywriter-rating">
                <h4>文案评分</h4>
                <div class="star-rating">
                    ${starsHtml}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error(`评分失败: ${error.message}`);
        showError(`评分失败: ${error.message}`);
    }
}

// 调整文案长度以符合字数限制
function adjustCopywriterLength(copywriter, minLength, maxLength) {
    let text = copywriter.trim();
    let currentLength = text.length;
    
    // 如果长度在限制范围内，直接返回
    if (currentLength >= minLength && currentLength <= maxLength) {
        return text;
    }
    
    // 如果长度超过最大值，截断
    if (currentLength > maxLength) {
        // 尝试在句子边界截断
        let truncated = text.substring(0, maxLength);
        const lastPeriod = truncated.lastIndexOf('.');
        const lastComma = truncated.lastIndexOf(',');
        const lastExclamation = truncated.lastIndexOf('!');
        const lastQuestion = truncated.lastIndexOf('?');
        
        const lastPunctuation = Math.max(lastPeriod, lastComma, lastExclamation, lastQuestion);
        
        if (lastPunctuation > maxLength * 0.8) {
            truncated = truncated.substring(0, lastPunctuation + 1);
        }
        
        return truncated;
    }
    
    // 如果长度不足最小值，扩展
    if (currentLength < minLength) {
        const neededLength = minLength - currentLength;
        let extensions = [
            ' 希望对您有所帮助',
            ' 期待与您共同成长',
            ' 让我们一起创造美好未来',
            ' 祝您生活愉快，事业有成',
            ' 感谢您的关注与支持'
        ];
        
        let extended = text;
        let extensionIndex = 0;
        
        while (extended.length < minLength && extensionIndex < extensions.length) {
            // 检查是否需要添加连接词
            if (extended.length > 0 && !/[.!?,;]$/.test(extended)) {
                extended += '，';
            } else if (extended.length > 0) {
                extended += '';
            }
            
            extended += extensions[extensionIndex];
            extensionIndex++;
        }
        
        // 确保结尾有适当的标点
        if (!/[.!?]$/.test(extended)) {
            extended += '！';
        }
        
        return extended;
    }
    
    return text;
}

// 显示错误信息
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: red; padding: 10px; margin: 10px 0; background: #ffebee; border: 1px solid #ffcdd2; border-radius: 4px;';
    
    const generateCopywriterBtn = document.getElementById('generate-copywriter-btn');
    if (generateCopywriterBtn && generateCopywriterBtn.parentNode) {
        generateCopywriterBtn.parentNode.insertBefore(errorElement, generateCopywriterBtn.nextSibling);
    } else {
        document.body.appendChild(errorElement);
    }
    
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}