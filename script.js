// 皮肤切换功能
const skinSelect = document.getElementById('skin-select');

// 设置默认皮肤
function setSkin(skinName) {
    document.body.className = skinName;
    localStorage.setItem('skin', skinName);
}

// 加载保存的皮肤
const savedSkin = localStorage.getItem('skin') || 'default';
setSkin(savedSkin);
skinSelect.value = savedSkin;

// 皮肤选择事件
skinSelect.addEventListener('change', (e) => {
    setSkin(e.target.value);
});

// 文本字数统计
const textInput = document.getElementById('text-input');
const countResult = document.getElementById('count-result');

// 输入即显示的交互方式
textInput.addEventListener('input', () => {
    const text = textInput.value;
    const totalChars = text.length;
    // 统计中文字数（匹配Unicode中文范围）
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    // 统计英文单词数（匹配由字母组成的单词）
    const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length;
    // 统计数字数量（匹配数字字符）
    const numbers = (text.match(/[0-9]/g) || []).length;
    countResult.textContent = `总字符数: ${totalChars}, 中文字数: ${chineseChars}, 英文单词数: ${englishWords}, 数字: ${numbers}`;
});

// 初始化时显示空统计
countResult.textContent = '总字符数: 0, 中文字数: 0, 英文单词数: 0, 数字: 0';

// 清空按钮功能
const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    countResult.textContent = '总字符数: 0, 中文字数: 0, 英文单词数: 0, 数字: 0';
});

// 单位换算器
const converterType = document.getElementById('converter-type');
const inputValue = document.getElementById('input-value');
const fromUnit = document.getElementById('from-unit');
const outputValue = document.getElementById('output-value');
const toUnit = document.getElementById('to-unit');

// 单位配置
const units = {
    length: ['米', '厘米', '英寸', '英尺'],
    weight: ['千克', '克', '磅', '盎司'],
    temperature: ['摄氏度', '华氏度']
};

// 更新单位选择器
function updateUnits() {
    const type = converterType.value;
    const unitList = units[type];
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    unitList.forEach(unit => {
        const fromOption = document.createElement('option');
        fromOption.value = unit;
        fromOption.textContent = unit;
        fromUnit.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unit;
        toOption.textContent = unit;
        toUnit.appendChild(toOption);
    });
    
    // 默认选择不同的单位
    if (unitList.length > 1) {
        toUnit.selectedIndex = 1;
    }
    
    convert();
}

// 单位换算逻辑
function convert() {
    const type = converterType.value;
    const value = parseFloat(inputValue.value) || 0;
    const from = fromUnit.value;
    const to = toUnit.value;
    
    let result = value;
    
    if (type === 'length') {
        // 先转换为米
        let meters = value;
        switch (from) {
            case '厘米': meters = value / 100;
break;
            case '英寸': meters = value * 0.0254;
break;
            case '英尺': meters = value * 0.3048;
break;
        }
        
        // 再转换为目标单位
        switch (to) {
            case '米': result = meters;
break;
            case '厘米': result = meters * 100;
break;
            case '英寸': result = meters / 0.0254;
break;
            case '英尺': result = meters / 0.3048;
break;
        }
    } else if (type === 'weight') {
        // 先转换为千克
        let kilograms = value;
        switch (from) {
            case '克': kilograms = value / 1000;
break;
            case '磅': kilograms = value * 0.453592;
break;
            case '盎司': kilograms = value * 0.0283495;
break;
        }
        
        // 再转换为目标单位
        switch (to) {
            case '千克': result = kilograms;
break;
            case '克': result = kilograms * 1000;
break;
            case '磅': result = kilograms / 0.453592;
break;
            case '盎司': result = kilograms / 0.0283495;
break;
        }
    } else if (type === 'temperature') {
        if (from === '摄氏度' && to === '华氏度') {
            result = (value * 9/5) + 32;
        } else if (from === '华氏度' && to === '摄氏度') {
            result = (value - 32) * 5/9;
        }
    }
    
    outputValue.value = result.toFixed(4);
}

// 事件监听器
converterType.addEventListener('change', updateUnits);
inputValue.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);

// 初始化单位换算器
updateUnits();

// 随机密码生成器
const passwordLength = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');
const generateBtn = document.getElementById('generate-btn');
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const passwordStrength = document.getElementById('password-strength');

// 更新密码长度显示
passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
});

// 生成密码
function generatePassword() {
    const length = parseInt(passwordLength.value);
    const useUppercase = includeUppercase.checked;
    const useLowercase = includeLowercase.checked;
    const useNumbers = includeNumbers.checked;
    const useSymbols = includeSymbols.checked;
    
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let allChars = '';
    if (useUppercase) allChars += uppercaseChars;
    if (useLowercase) allChars += lowercaseChars;
    if (useNumbers) allChars += numberChars;
    if (useSymbols) allChars += symbolChars;
    
    if (allChars === '') {
        passwordOutput.value = '请至少选择一种字符类型';
        passwordStrength.textContent = '';
        return;
    }
    
    // 确保密码包含所有选中的字符类型
    let password = '';
    const requiredChars = [];
    
    // 添加每种选中类型的至少一个字符
    if (useUppercase) {
        requiredChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
    }
    if (useLowercase) {
        requiredChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
    }
    if (useNumbers) {
        requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (useSymbols) {
        requiredChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
    }
    
    // 添加剩余的随机字符
    for (let i = requiredChars.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        requiredChars.push(allChars[randomIndex]);
    }
    
    // 打乱字符顺序
    for (let i = requiredChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
    }
    
    password = requiredChars.join('');
    
    // 添加生成动画效果
    passwordOutput.value = '';
    let index = 0;
    const interval = setInterval(() => {
        passwordOutput.value += password[index];
        index++;
        if (index >= password.length) {
            clearInterval(interval);
            checkPasswordStrength(password);
        }
    }, 50);
}

// 检查密码强度
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+-=\[\]{}|;:,.<>?]/.test(password)) strength += 1;
    
    let strengthText = '';
    let strengthClass = '';
    
    if (strength <= 2) {
        strengthText = '密码强度: 弱';
        strengthClass = 'strength-weak';
    } else if (strength <= 4) {
        strengthText = '密码强度: 中等';
        strengthClass = 'strength-medium';
    } else {
        strengthText = '密码强度: 强';
        strengthClass = 'strength-strong';
    }
    
    passwordStrength.textContent = strengthText;
    passwordStrength.className = strengthClass;
}

// 复制密码
function copyPassword() {
    passwordOutput.select();
    document.execCommand('copy');
    
    // 显示复制成功
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '已复制!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 1500);
}

// 事件监听器
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

// 初始化生成密码
generatePassword();