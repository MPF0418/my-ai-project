// 实时信息配置文件
// 不同文案类型需要的实时信息配置

const realtimeInfoConfig = {
    // 节日祝福类文案需要的实时信息
    "节日祝福": {
        requiredInfo: [
            "current_date", // 当前日期
            "current_year", // 当前年份
            "current_lunar_date", // 当前农历日期
            "current_lunar_year", // 当前农历年份
            "current_lunar_animal", // 当前农历生肖
            "current_festival" // 当前节日
        ],
        description: "节日祝福类文案需要当前日期、农历信息和节日信息，以确保祝福内容符合当前时间和节日氛围"
    },
    
    // 拜年短信类文案需要的实时信息
    "拜年短信": {
        requiredInfo: [
            "current_date",
            "current_year",
            "current_lunar_date",
            "current_lunar_year",
            "current_lunar_animal",
            "current_festival"
        ],
        description: "拜年短信需要当前农历年份、生肖和节日信息，以确保拜年内容符合当前时间"
    },
    
    // 营销推广类文案需要的实时信息
    "营销推广": {
        requiredInfo: [
            "current_date",
            "current_year",
            "current_season", // 当前季节
            "current_trends" // 当前流行趋势
        ],
        description: "营销推广文案需要当前日期、季节和流行趋势信息，以确保推广内容符合当前市场环境"
    },
    
    // 朋友圈文案类需要的实时信息
    "朋友圈文案": {
        requiredInfo: [
            "current_date",
            "current_season",
            "current_trends"
        ],
        description: "朋友圈文案需要当前日期、季节和流行趋势信息，以确保内容符合当前社交环境"
    },
    
    // 小红书文案类需要的实时信息
    "小红书文案": {
        requiredInfo: [
            "current_date",
            "current_season",
            "current_trends",
            "current_hot_topics" // 当前热门话题
        ],
        description: "小红书文案需要当前日期、季节、流行趋势和热门话题信息，以确保内容符合平台特性"
    },
    
    // 短视频脚本类需要的实时信息
    "短视频脚本": {
        requiredInfo: [
            "current_date",
            "current_season",
            "current_trends",
            "current_hot_topics"
        ],
        description: "短视频脚本需要当前日期、季节、流行趋势和热门话题信息，以确保内容符合平台特性和用户喜好"
    },
    
    // 其他类型文案需要的实时信息
    "其他": {
        requiredInfo: [
            "current_date",
            "current_year"
        ],
        description: "其他类型文案需要基本的当前日期和年份信息"
    }
};

// 实时信息来源配置
const infoSourceConfig = {
    current_date: {
        source: "local", // 本地获取
        description: "从本地系统获取当前日期",
        fallback: "2026-02-19" // 默认日期
    },
    current_year: {
        source: "local",
        description: "从本地系统获取当前年份",
        fallback: "2026"
    },
    current_season: {
        source: "local",
        description: "根据当前月份计算季节",
        fallback: "春季"
    },
    current_lunar_date: {
        source: "api", // 需要API获取
        description: "从农历API获取当前农历日期",
        api_config: {
            url: "", // API地址
            key: "" // API密钥
        },
        fallback: "正月初一"
    },
    current_lunar_year: {
        source: "api",
        description: "从农历API获取当前农历年份",
        api_config: {
            url: "",
            key: ""
        },
        fallback: "2026"
    },
    current_lunar_animal: {
        source: "api",
        description: "从农历API获取当前农历生肖",
        api_config: {
            url: "",
            key: ""
        },
        fallback: "马"
    },
    current_festival: {
        source: "api",
        description: "从节日API获取当前节日",
        api_config: {
            url: "",
            key: ""
        },
        fallback: "春节"
    },
    current_trends: {
        source: "api",
        description: "从趋势API获取当前流行趋势",
        api_config: {
            url: "",
            key: ""
        },
        fallback: "人工智能、元宇宙、可持续发展"
    },
    current_hot_topics: {
        source: "api",
        description: "从热点API获取当前热门话题",
        api_config: {
            url: "",
            key: ""
        },
        fallback: "科技创新、环保生活、健康养生"
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { realtimeInfoConfig, infoSourceConfig };
} else if (typeof window !== 'undefined') {
    window.realtimeInfoConfig = realtimeInfoConfig;
    window.infoSourceConfig = infoSourceConfig;
}
