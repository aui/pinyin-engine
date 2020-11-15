/**
 * 建立索引
 * @param   {[string]|[Object]}	 data         数据
 * @param	{string|[string]}    indexs       如果 data 为 [Object]，这里需要建立拼音索引 key
 * @param   {array}              dict         词典数据
 */
class Engine {
    constructor(data, indexs = [], dict = {}, prefix = '') {
        this.indexs = [];
        this.history = { keyword: '', indexs: [], data: [] };
        this.data = data;
        this.dict = dict;
        this.prefix = prefix;

        // 建立拼音关键词索引
        indexs = typeof indexs === 'string' ? [indexs] : indexs;
        for (const item of data) {
            let keywords = '';

            if (typeof item === 'string') {
                keywords = Engine.participle(item, dict, prefix);
            } else {
                for (const key of indexs) {
                    const words = resolve(key, item);
                    if (words) {
                        keywords += Engine.participle(words, dict, prefix);
                    }
                }
            }

            this.indexs.push(keywords.toLowerCase());
        }
    }

    /**
     * 查询
     * @param   {string}    keyword     拼音或者关键字
     * @return  {[string]|{Object}}
     */
    query(keyword) {

        keyword = keyword.replace(/\s/g, '').toLowerCase();

        let indexs = this.indexs;
        let data = this.data;
        const history = this.history;
        const result = [];

        // 性能优化：在上一次搜索结果中查询
        if (history.data.length && keyword.indexOf(history.keyword) === 0) {
            indexs = history.indexs;
            data = history.data;
        }

        history.keyword = keyword;
        history.indexs = [];
        
        for (let index = 0; index < indexs.length; index ++) {
            if (indexs[index].indexOf(this.prefix+keyword) !== -1) {
                history.indexs.push(indexs[index]);
                result.push(data[index]);
            }
        }

        return result;
    }


    /**
     * 将内容进行分词
     * @param	{string}		  words        目标字符串
     * @param   {Object}          dict         字典
     * @return	{string}
     */
    static participle(words, dict, prefix='') {
        words = words.replace(/\s/g, '');
        let result = `${prefix}${words}`;
        const keywords = [[], []];

        for (const char of words) {
            const pinyin = dict[char];
            if (pinyin) {
                keywords[0].push(pinyin);
                if (words.length > 1) {
                    keywords[1].push(pinyin.map(p => p.charAt(0)));
                }
            }
        }

        for (const list of keywords) {
            let current = list.shift();

            while(list.length) {
                const array = [];
                const next = list.shift();
                for (const c of current) {
                    for (const n of next) {
                        array.push(c + n);
                    }
                }
                current = array;
            }

            if (current) {
                result += `\u0001${prefix}${current.join(`\u0001${prefix}`)}`;
            }
        }
        
        return result;
    }
};

function resolve(path, obj, separator='.') {
    let properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

module.exports = Engine;
