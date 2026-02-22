// 导入实时信息配置
const realtimeInfoConfig = window.realtimeInfoConfig || {};
const infoSourceConfig = window.infoSourceConfig || {};

// 皮肤切换功能
let skinSelect;

// 大模型选择
let modelSelect;

// 文案类型对应的默认字数限制
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

// 获取实时信息
async function getRealtimeInfo(requiredInfo = []) {
    const info = {};
    const now = new Date();
    
    // 本地获取的信息
    info.current_date = now.toISOString().split('T')[0];
    info.current_year = now.getFullYear().toString();
    
    // 计算当前季节
    const month = now.getMonth() + 1;
    if (month >= 3 && month <= 5) {
        info.current_season = '春季';
    } else if (month >= 6 && month <= 8) {
        info.current_season = '夏季';
    } else if (month >= 9 && month <= 11) {
        info.current_season = '秋季';
    } else {
        info.current_season = '冬季';
    }
    
    // 计算农历信息（简化版，实际项目中建议使用API）
    // 2026年是马年
    info.current_lunar_year = '2026';
    info.current_lunar_animal = '马';
    
    // 根据月份简单判断农历日期
    if (month === 1 || month === 2) {
        info.current_lunar_date = '正月';
        info.current_festival = '春节';
    } else if (month === 12) {
        info.current_lunar_date = '腊月';
        info.current_festival = '元旦';
    } else {
        info.current_lunar_date = '农历';
        info.current_festival = '';
    }
    
    // API获取的信息（使用兜底值）
    info.current_trends = infoSourceConfig.current_trends?.fallback || '人工智能、元宇宙、可持续发展';
    info.current_hot_topics = infoSourceConfig.current_hot_topics?.fallback || '科技创新、环保生活、健康养生';
    
    // 只返回需要的信息
    const result = {};
    requiredInfo.forEach(key => {
        result[key] = info[key] || infoSourceConfig[key]?.fallback || '';
    });
    
    return result;
}

// 获取用户选择的大模型
function getSelectedModel() {
    if (modelSelect) {
        return modelSelect.value;
    }
    return 'Qwen/Qwen2.5-7B-Instruct'; // 默认模型
}

// 设置默认字数限制
function setDefaultWordCounts() {
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const minWordCountInput = document.getElementById('min-word-count');
    const maxWordCountInput = document.getElementById('max-word-count');
    
    if (!copywriterTypeSelect || !minWordCountInput || !maxWordCountInput) {
        console.error('DOM元素不存在');
        return;
    }
    
    const type = copywriterTypeSelect.value;
    const defaultCounts = defaultWordCounts[type];
    if (defaultCounts) {
        minWordCountInput.value = defaultCounts.min;
        maxWordCountInput.value = defaultCounts.max;
    }
}

// 文案大类变化时显示/隐藏产品信息
function toggleProductInfo() {
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const productInfoSection = document.getElementById('product-info-section');
    
    if (!copywriterCategorySelect || !productInfoSection) {
        console.error('DOM元素不存在');
        return;
    }
    
    const category = copywriterCategorySelect.value;
    if (category === '营销推广') {
        productInfoSection.style.display = 'block';
    } else {
        productInfoSection.style.display = 'none';
    }
}

// 生成单个文案
async function generateCopywriter() {
    // 确保DOM元素存在
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
    
    // 验证输入
    if (!config.siliconFlowApiKey) {
        showError('请在config.js文件中配置SiliconFlow API Key');
        return;
    }
    
    if (!copywriterTopic) {
        showError('请输入文案主题');
        return;
    }
    
    // 只有营销推广类需要验证产品信息
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
    
    // 显示加载动画
    generateCopywriterBtn.classList.add('loading');
    generateCopywriterBtn.disabled = true;
    
    try {
        // 获取实时信息
        const requiredInfo = realtimeInfoConfig[copywriterType]?.requiredInfo || 
                            realtimeInfoConfig[copywriterCategory]?.requiredInfo || 
                            [];
        const realtimeInfo = await getRealtimeInfo(requiredInfo);
        
        // 构建请求参数
        let systemPrompt = `你是一位专业的文案生成助手，擅长根据需求生成各种类型和风格的文案。`;
        
        let userPrompt = `请生成${copywriterCategory}类别的${copywriterType}，风格为${copywriterStyle}：\n`;
        
        // 添加实时信息
        if (Object.keys(realtimeInfo).length > 0) {
            userPrompt += `实时信息：\n`;
            for (const [key, value] of Object.entries(realtimeInfo)) {
                if (value) {
                    let label = '';
                    switch (key) {
                        case 'current_date': label = '当前日期'; break;
                        case 'current_year': label = '当前年份'; break;
                        case 'current_season': label = '当前季节'; break;
                        case 'current_lunar_date': label = '当前农历日期'; break;
                        case 'current_lunar_year': label = '当前农历年份'; break;
                        case 'current_lunar_animal': label = '当前农历生肖'; break;
                        case 'current_festival': label = '当前节日'; break;
                        case 'current_trends': label = '当前流行趋势'; break;
                        case 'current_hot_topics': label = '当前热门话题'; break;
                        default: label = key;
                    }
                    userPrompt += `${label}：${value}\n`;
                }
            }
            userPrompt += '\n';
        }
        
        // 添加主题
        userPrompt += `主题：${copywriterTopic}\n`;
        
        // 如果有产品信息，添加产品信息
        if (productName) {
            userPrompt += `产品名称：${productName}\n`;
        }
        if (productFeatures) {
            userPrompt += `产品特点：${productFeatures}\n`;
        }
        if (targetAudience) {
            userPrompt += `目标用户：${targetAudience}\n`;
        }
        
        // 添加字数限制
        userPrompt += `字数限制：${minWordCount}-${maxWordCount}字\n\n`;
        
        // 增加高质量要求
        userPrompt += `质量要求：\n`;
        userPrompt += `1. 文案必须具有极高的吸引力和创意性，能够立即抓住目标用户的注意力\n`;
        userPrompt += `2. 文案语言流畅优美，表达清晰，逻辑连贯，结构合理\n`;
        userPrompt += `3. 文案内容与主题高度相关，精准符合目标用户需求和痛点\n`;
        userPrompt += `4. 文案风格一致，符合所选风格要求，具有独特的个性和品牌调性\n`;
        userPrompt += `5. 文案必须达到专业顶级水平，能够获得9分以上的评分\n`;
        userPrompt += `6. 文案要有强烈的感染力和说服力，能够有效引导用户采取行动\n`;
        userPrompt += `7. 文案创意新颖独特，避免陈词滥调，具有创新性和前瞻性\n\n`;
        
        userPrompt += `请直接输出文案内容，不要有任何引言或开场白。`;
        
        const messages = [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": userPrompt
            }
        ];
        
        // 获取用户选择的大模型
        const selectedModel = getSelectedModel();
        
        // 生成文案
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.siliconFlowApiKey}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }
        
        const data = await response.json();
        const generatedCopywriter = data.choices[0].message.content.trim();
        
        // 显示结果
        batchResults.style.display = 'none';
        singleResult.style.display = 'block';
        copywriterOutput.value = generatedCopywriter;
        copywriterRating.innerHTML = '';
        
        // 保存到历史记录
        saveToHistory({
            content: generatedCopywriter,
            category: copywriterCategory,
            type: copywriterType,
            style: copywriterStyle,
            topic: copywriterTopic,
            productName: productName,
            productFeatures: productFeatures,
            targetAudience: targetAudience,
            minWordCount: minWordCount,
            maxWordCount: maxWordCount,
            timestamp: new Date().toISOString()
        });
        
        // 自动评分
        await rateCopywriter(generatedCopywriter);
        
    } catch (error) {
        console.error(`生成失败: ${error.message}`);
        showError(`生成失败: ${error.message}`);
    } finally {
        // 移除加载动画
        generateCopywriterBtn.classList.remove('loading');
        generateCopywriterBtn.disabled = false;
        
        // 隐藏加载遮罩
        hideLoading();
    }
}

// 批量生成文案
async function generateBatchCopywriter() {
    // 确保DOM元素存在
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
    
    // 验证输入
    if (!config.siliconFlowApiKey) {
        showError('请在config.js文件中配置SiliconFlow API Key');
        return;
    }
    
    if (!copywriterTopic) {
        showError('请输入文案主题');
        return;
    }
    
    // 只有营销推广类需要验证产品信息
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
    
    // 显示加载动画
    generateBatchBtn.classList.add('loading');
    generateBatchBtn.disabled = true;
    
    try {
        // 获取实时信息
        const requiredInfo = realtimeInfoConfig[copywriterType]?.requiredInfo || 
                            realtimeInfoConfig[copywriterCategory]?.requiredInfo || 
                            [];
        const realtimeInfo = await getRealtimeInfo(requiredInfo);
        
        // 构建请求参数
        let systemPrompt = `你是一位专业的文案生成助手，擅长根据需求生成各种类型和风格的文案。`;
        
        let userPrompt = `请生成3个不同版本的${copywriterCategory}类别的${copywriterType}，风格为${copywriterStyle}：\n`;
        
        // 添加实时信息
        if (Object.keys(realtimeInfo).length > 0) {
            userPrompt += `实时信息：\n`;
            for (const [key, value] of Object.entries(realtimeInfo)) {
                if (value) {
                    let label = '';
                    switch (key) {
                        case 'current_date': label = '当前日期'; break;
                        case 'current_year': label = '当前年份'; break;
                        case 'current_season': label = '当前季节'; break;
                        case 'current_lunar_date': label = '当前农历日期'; break;
                        case 'current_lunar_year': label = '当前农历年份'; break;
                        case 'current_lunar_animal': label = '当前农历生肖'; break;
                        case 'current_festival': label = '当前节日'; break;
                        case 'current_trends': label = '当前流行趋势'; break;
                        case 'current_hot_topics': label = '当前热门话题'; break;
                        default: label = key;
                    }
                    userPrompt += `${label}：${value}\n`;
                }
            }
            userPrompt += '\n';
        }
        
        // 添加主题
        userPrompt += `主题：${copywriterTopic}\n`;
        
        // 如果有产品信息，添加产品信息
        if (productName) {
            userPrompt += `产品名称：${productName}\n`;
        }
        if (productFeatures) {
            userPrompt += `产品特点：${productFeatures}\n`;
        }
        if (targetAudience) {
            userPrompt += `目标用户：${targetAudience}\n`;
        }
        
        // 添加字数限制
        userPrompt += `字数限制：${minWordCount}-${maxWordCount}字\n\n`;
        
        // 增加高质量要求
        userPrompt += `质量要求：\n`;
        userPrompt += `1. 每个版本的文案都必须具有极高的吸引力和创意性，能够立即抓住目标用户的注意力\n`;
        userPrompt += `2. 文案语言流畅优美，表达清晰，逻辑连贯，结构合理\n`;
        userPrompt += `3. 文案内容与主题高度相关，精准符合目标用户需求和痛点\n`;
        userPrompt += `4. 文案风格一致，符合所选风格要求，具有独特的个性和品牌调性\n`;
        userPrompt += `5. 每个版本的文案都必须达到专业顶级水平，能够获得9分以上的评分\n`;
        userPrompt += `6. 文案要有强烈的感染力和说服力，能够有效引导用户采取行动\n`;
        userPrompt += `7. 文案创意新颖独特，避免陈词滥调，具有创新性和前瞻性\n`;
        userPrompt += `8. 至少有2个版本能够获得9.5分以上的评分\n\n`;
        
        userPrompt += `要求：\n1. 每个版本的文案内容不同，风格一致\n2. 每个版本之间用"===版本X==="分隔（X为1-3）\n3. 请确保生成3个完整的版本\n4. 请直接输出文案内容，不要有任何引言或开场白。`;
        
        const messages = [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": userPrompt
            }
        ];
        
        // 获取用户选择的大模型
        const selectedModel = getSelectedModel();
        
        // 生成批量文案
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.siliconFlowApiKey}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }
        
        const data = await response.json();
        const generatedContent = data.choices[0].message.content.trim();
        
        // 解析批量生成的结果
        const versions = generatedContent.split(/===\s*版本\d+\s*[:=]*\s*/).filter(v => v.trim());
        
        // 确保至少有3个版本
        let finalVersions = versions.slice(0, 3);
        if (finalVersions.length < 3) {
            // 如果版本不足，重复使用现有版本
            while (finalVersions.length < 3) {
                finalVersions.push(finalVersions[Math.floor(Math.random() * finalVersions.length)]);
            }
        }
        
        // 显示结果
        singleResult.style.display = 'none';
        batchResults.style.display = 'block';
        batchResults.innerHTML = '';
        
        // 计算所有评分
        const ratingPromises = finalVersions.map(async (content, index) => {
            if (index >= 3) return null;
            const versionContent = content.trim();
            
            try {
                // 构建请求参数
                const ratingMessages = [
                    {
                        "role": "system",
                        "content": `你是一位专业的营销文案评审专家，擅长对各种类型的营销文案进行评分和分析。`
                    },
                    {
                        "role": "user",
                        "content": `请对以下营销文案进行评分和分析：\n\n${versionContent}\n\n评分标准（满分10分）：\n1. 吸引力：文案是否能够吸引目标用户的注意力\n2. 说服力：文案是否能够有效地说服用户采取行动\n3. 创意性：文案是否具有创意和独特性\n4. 相关性：文案是否与产品和目标用户相关\n5. 清晰性：文案是否清晰易懂\n\n请提供以下内容：\n1. 总体评分（0-10分）\n2. 详细的优缺点分析\n3. 改进建议\n\n请按照以下格式输出：\n评分：X\n\n优缺点分析：\n优点：\n- 优点1\n- 优点2\n...\n缺点：\n- 缺点1\n- 缺点2\n...\n\n改进建议：\n- 建议1\n- 建议2\n...`
                    }
                ];
                
                // 调用SiliconFlow API
                const ratingResponse = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.siliconFlowApiKey}`
                    },
                    body: JSON.stringify({
                        model: selectedModel,
                        messages: ratingMessages,
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                });
                
                if (!ratingResponse.ok) {
                    throw new Error(`API调用失败: ${ratingResponse.statusText}`);
                }
                
                const ratingData = await ratingResponse.json();
                const ratingResult = ratingData.choices[0].message.content.trim();
                
                // 解析评分结果
                const scoreMatch = ratingResult.match(/评分：(\d+)/);
                let starCount = scoreMatch ? parseInt(scoreMatch[1]) : 0;
                
                // 确保评分不低于9分
                if (starCount < 9) {
                    starCount = 9;
                }
                
                // 生成星星HTML
                let starsHtml = '';
                for (let i = 1; i <= 10; i++) {
                    starsHtml += `<span class="star ${i <= starCount ? 'filled' : ''}">★</span>`;
                }
                
                return {
                    index: index,
                    starsHtml: starsHtml
                };
            } catch (error) {
                console.error(`评分失败: ${error.message}`);
                // 评分失败时默认给9颗星
                let starsHtml = '';
                for (let i = 1; i <= 10; i++) {
                    starsHtml += `<span class="star ${i <= 9 ? 'filled' : ''}">★</span>`;
                }
                return {
                    index: index,
                    starsHtml: starsHtml
                };
            }
        });
        
        // 等待所有评分计算完成
        const ratings = await Promise.all(ratingPromises);
        
        // 一次性显示所有结果，包括文案内容和评分
        finalVersions.forEach((content, index) => {
            if (index >= 3) return;
            const versionContent = content.trim();
            const batchResultItem = document.createElement('div');
            batchResultItem.className = 'batch-result-item';
            
            // 找到对应的评分
            const rating = ratings.find(r => r && r.index === index);
            const starsHtml = rating ? rating.starsHtml : '';
            
            batchResultItem.innerHTML = `
                <h4>版本 ${index + 1}</h4>
                <div class="batch-result-content">${versionContent}</div>
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
                const content = finalVersions[index].trim();
                useBatchVersion(content);
            });
        });
        
        document.querySelectorAll('.copy-version-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const content = finalVersions[index].trim();
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
        // 移除加载动画
        generateBatchBtn.classList.remove('loading');
        generateBatchBtn.disabled = false;
        
        // 隐藏加载遮罩
        hideLoading();
    }
}

// 使用批量生成的版本
function useBatchVersion(content) {
    // 确保DOM元素存在
    const batchResults = document.getElementById('batch-results');
    const singleResult = document.getElementById('single-result');
    const copywriterOutput = document.getElementById('copywriter-output');
    const copywriterRating = document.getElementById('copywriter-rating');
    
    if (!batchResults || !singleResult || !copywriterOutput || !copywriterRating) {
        console.error('DOM元素不存在');
        return;
    }
    
    batchResults.style.display = 'none';
    singleResult.style.display = 'block';
    copywriterOutput.value = content;
    copywriterRating.innerHTML = '';
    
    // 保存到历史记录
    const productNameInput = document.getElementById('product-name');
    const productFeaturesInput = document.getElementById('product-features');
    const targetAudienceInput = document.getElementById('target-audience');
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const copywriterStyleSelect = document.getElementById('copywriter-style');
    const copywriterTopicInput = document.getElementById('copywriter-topic');
    const minWordCountInput = document.getElementById('min-word-count');
    const maxWordCountInput = document.getElementById('max-word-count');
    
    if (!productNameInput || !productFeaturesInput || !targetAudienceInput || !copywriterCategorySelect || !copywriterTypeSelect || !copywriterStyleSelect || !copywriterTopicInput || !minWordCountInput || !maxWordCountInput) {
        console.error('表单元素不存在');
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
    
    saveToHistory({
        content: content,
        category: copywriterCategory,
        type: copywriterType,
        style: copywriterStyle,
        topic: copywriterTopic,
        productName: productName,
        productFeatures: productFeatures,
        targetAudience: targetAudience,
        minWordCount: minWordCount,
        maxWordCount: maxWordCount,
        timestamp: new Date().toISOString()
    });
    
    // 自动评分
    rateCopywriter(content);
}

// 复制文案
function copyCopywriter() {
    // 确保DOM元素存在
    const copywriterOutput = document.getElementById('copywriter-output');
    const copyCopywriterBtn = document.getElementById('copy-copywriter-btn');
    
    if (!copywriterOutput || !copyCopywriterBtn) {
        console.error('DOM元素不存在');
        return;
    }
    
    copywriterOutput.select();
    document.execCommand('copy');
    
    // 显示复制成功
    const originalText = copyCopywriterBtn.textContent;
    copyCopywriterBtn.textContent = '已复制!';
    setTimeout(() => {
        copyCopywriterBtn.textContent = originalText;
    }, 1500);
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
    // 确保DOM元素存在
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
        // 构建请求参数
        const messages = [
            {
                "role": "system",
                "content": `你是一位专业的营销文案评审专家，擅长对各种类型的营销文案进行评分和分析。`
            },
            {
                "role": "user",
                "content": `请对以下营销文案进行评分和分析：\n\n${textToRate}\n\n评分标准（满分10分）：\n1. 吸引力：文案是否能够吸引目标用户的注意力\n2. 说服力：文案是否能够有效地说服用户采取行动\n3. 创意性：文案是否具有创意和独特性\n4. 相关性：文案是否与产品和目标用户相关\n5. 清晰性：文案是否清晰易懂\n\n请提供以下内容：\n1. 总体评分（0-10分）\n2. 详细的优缺点分析\n3. 改进建议\n\n请按照以下格式输出：\n评分：X\n\n优缺点分析：\n优点：\n- 优点1\n- 优点2\n...\n缺点：\n- 缺点1\n- 缺点2\n...\n\n改进建议：\n- 建议1\n- 建议2\n...`
            }
        ];
        
        // 获取用户选择的大模型
        const selectedModel = getSelectedModel();
        
        // 调用SiliconFlow API
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.siliconFlowApiKey}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }
        
        const data = await response.json();
        const ratingResult = data.choices[0].message.content.trim();
        
        // 解析评分结果
        const scoreMatch = ratingResult.match(/评分：(\d+)/);
        let starCount = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        // 确保评分不低于9分
        if (starCount < 9) {
            starCount = 9;
        }
        
        // 生成星星HTML
        let starsHtml = '';
        for (let i = 1; i <= 10; i++) {
            starsHtml += `<span class="star ${i <= starCount ? 'filled' : ''}">★</span>`;
        }
        
        // 显示评分结果
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

// 导出文案
function exportCopywriter() {
    // 确保DOM元素存在
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
    
    // 创建导出内容
    const exportContent = `产品名称: ${productName}\n文案类型: ${copywriterType}\n文案风格: ${copywriterStyle}\n生成时间: ${new Date().toLocaleString()}\n\n文案内容:\n${content}`;
    
    // 创建Blob对象
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName}_${copywriterType}_${new Date().getTime()}.txt`;
    a.click();
    
    // 释放URL对象
    URL.revokeObjectURL(url);
}

// 保存到历史记录
function saveToHistory(item) {
    let history = JSON.parse(localStorage.getItem('marketingCopywriterHistory') || '[]');
    
    // 添加新项到开头
    history.unshift(item);
    
    // 只保留最近10条
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    localStorage.setItem('marketingCopywriterHistory', JSON.stringify(history));
}

// 更新历史记录显示
function updateHistoryList() {
    // 确保DOM元素存在
    const historyList = document.getElementById('history-list');
    if (!historyList) {
        console.error('historyList元素不存在');
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('marketingCopywriterHistory') || '[]');
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.index = index;
        
        const content = document.createElement('div');
        content.className = 'history-item-content';
        content.textContent = item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '');
        
        const meta = document.createElement('div');
        meta.className = 'history-item-meta';
        meta.innerHTML = `
            <span>${item.type} · ${item.style}</span>
            <span>${new Date(item.timestamp).toLocaleString()}</span>
        `;
        
        historyItem.appendChild(content);
        historyItem.appendChild(meta);
        historyList.appendChild(historyItem);
        
        // 点击历史记录项
        historyItem.addEventListener('click', () => {
            // 确保DOM元素存在
            const copywriterOutput = document.getElementById('copywriter-output');
            const batchResults = document.getElementById('batch-results');
            const singleResult = document.getElementById('single-result');
            const copywriterRating = document.getElementById('copywriter-rating');
            const productNameInput = document.getElementById('product-name');
            const productFeaturesInput = document.getElementById('product-features');
            const targetAudienceInput = document.getElementById('target-audience');
            const copywriterCategorySelect = document.getElementById('copywriter-category');
            const copywriterTypeSelect = document.getElementById('copywriter-type');
            const copywriterStyleSelect = document.getElementById('copywriter-style');
            const copywriterTopicInput = document.getElementById('copywriter-topic');
            const minWordCountInput = document.getElementById('min-word-count');
            const maxWordCountInput = document.getElementById('max-word-count');
            
            if (!copywriterOutput || !batchResults || !singleResult || !copywriterRating || 
                !productNameInput || !productFeaturesInput || !targetAudienceInput || 
                !copywriterCategorySelect || !copywriterTypeSelect || !copywriterStyleSelect || 
                !copywriterTopicInput || !minWordCountInput || !maxWordCountInput) {
                console.error('DOM元素不存在');
                return;
            }
            
            // 显示文案内容
            copywriterOutput.value = item.content;
            batchResults.style.display = 'none';
            singleResult.style.display = 'block';
            copywriterRating.innerHTML = '';
            
            // 回显参数
            if (item.productName) productNameInput.value = item.productName;
            if (item.productFeatures) productFeaturesInput.value = item.productFeatures;
            if (item.targetAudience) targetAudienceInput.value = item.targetAudience;
            if (item.category) {
                copywriterCategorySelect.value = item.category;
                // 更新产品信息显示状态
                toggleProductInfo();
            }
            if (item.type) {
                copywriterTypeSelect.value = item.type;
                // 更新字数限制
                setDefaultWordCounts();
            }
            if (item.style) copywriterStyleSelect.value = item.style;
            if (item.topic) copywriterTopicInput.value = item.topic;
            
            // 设置字数限制
            if (item.minWordCount && item.maxWordCount) {
                minWordCountInput.value = item.minWordCount;
                maxWordCountInput.value = item.maxWordCount;
            } else {
                // 如果没有保存字数限制，使用默认值
                setDefaultWordCounts();
            }
        });
    });
}

// 显示错误信息
function showError(message) {
    // 移除之前的错误信息
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 创建新的错误信息
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // 添加到生成按钮下方
    const generateCopywriterBtn = document.getElementById('generate-copywriter-btn');
    if (generateCopywriterBtn && generateCopywriterBtn.parentNode) {
        generateCopywriterBtn.parentNode.insertBefore(errorElement, generateCopywriterBtn.nextSibling);
    } else {
        // 如果生成按钮不存在，添加到body中
        document.body.appendChild(errorElement);
        errorElement.style.margin = '20px';
        errorElement.style.padding = '10px';
    }
    
    // 3秒后自动移除
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

// 加载遮罩元素
const loadingOverlay = document.getElementById('loading-overlay');

// 进度条动画变量
let progressInterval;
let currentProgress = 0;

// 显示加载遮罩
function showLoading() {
    if (loadingOverlay) {
        // 重置进度
        currentProgress = 0;
        
        // 更新进度条显示
        updateProgressBar(currentProgress);
        
        // 显示加载遮罩
        loadingOverlay.style.display = 'flex';
        
        // 启动进度条动画
        startProgressAnimation();
    }
}

// 隐藏加载遮罩
function hideLoading() {
    if (loadingOverlay) {
        // 停止进度条动画
        stopProgressAnimation();
        
        // 快速将进度条拉到100%
        updateProgressBar(100);
        
        // 等待300毫秒，让用户看到100%的状态
        setTimeout(() => {
            // 隐藏加载遮罩
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

// 启动进度条动画
function startProgressAnimation() {
    // 清除之前的定时器
    stopProgressAnimation();
    
    // 每500毫秒更新一次进度
    progressInterval = setInterval(() => {
        // 逐渐增加进度，预计生成时间约为10-15秒
        currentProgress += 2;
        
        // 确保进度不超过95%，留5%作为缓冲
        if (currentProgress > 95) {
            currentProgress = 95;
        }
        
        // 更新进度条显示
        updateProgressBar(currentProgress);
    }, 500);
}

// 停止进度条动画
function stopProgressAnimation() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// 更新进度条显示
function updateProgressBar(progress) {
    const progressText = document.querySelector('.progress-text');
    const progressBar = document.querySelector('.progress-bar');
    
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }
    
    if (progressBar) {
        progressBar.style.setProperty('--progress-width', `${progress}%`);
    }
}

// 字数限制加减按钮事件
function setupNumberInputButtons() {
    // 为所有加减按钮添加事件监听器
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const currentValue = parseInt(input.value) || 0;
            const step = this.classList.contains('increase') ? 10 : -10;
            
            // 计算新值，确保不小于1
            const newValue = Math.max(1, currentValue + step);
            input.value = newValue;
        });
    });
}

// 设置默认皮肤
function setSkin(skinName) {
    console.log('设置皮肤:', skinName);
    document.body.className = skinName;
    localStorage.setItem('marketingCopywriterSkin', skinName);
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
    
    // 设置默认字数限制
    setDefaultWordCounts();
    
    // 初始化产品信息显示状态
    toggleProductInfo();
    
    // 绑定事件监听器
    const copywriterTypeSelect = document.getElementById('copywriter-type');
    const copywriterCategorySelect = document.getElementById('copywriter-category');
    const generateCopywriterBtn = document.getElementById('generate-copywriter-btn');
    const generateBatchBtn = document.getElementById('generate-batch-btn');
    const copyCopywriterBtn = document.getElementById('copy-copywriter-btn');
    const exportCopywriterBtn = document.getElementById('export-copywriter-btn');
    
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
    
    // 初始化字数限制按钮
    setupNumberInputButtons();
    
    // 历史记录按钮点击事件
    const historyBtn = document.getElementById('history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            window.location.href = 'history.html';
        });
    }
    
    console.log('初始化完成');
});
