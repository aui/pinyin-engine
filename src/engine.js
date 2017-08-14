/**
 * 建立索引
 * @param	{[string]|[Object]}	 data    数据
 * @param	{?string|[string]}   indexs  如果 data 为 [Object]，这里需要建立拼音索引 key
 * @param   {array}              dict    词典数据
 */
class Engine {
    constructor(data, indexs = [], dict = {}) {
        this.indexs = [];
        this.history = { keyword: '', indexs: [], data: [] };
        this.data = data;
        this.dict = dict;

        // 建立拼音关键词索引
        indexs = typeof indexs === 'string' ? [indexs] : indexs;
        for (const item of data) {
            let keywords = '';

            if (typeof item === 'string') {
                keywords = Engine.participle(item, dict);
            } else {
                for (const key of indexs) {
                    const words = item[key];
                    if (words) {
                        keywords += Engine.participle(words, dict);
                    }
                }
            }


            this.indexs.push(keywords);
        }
    }

    /**
     * 查询
     * @param   {string}    keyword     拼音或者关键字
     * @return  {[string]|{Object}}
     */
    query(keyword) {

        keyword = keyword.toLowerCase();
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
        for (const [index, keywords] of indexs.entries()) {
            if (keywords.indexOf(keyword) !== -1) {
                history.indexs.push(keywords);
                result.push(data[index]);
            }
        }

        return result;
    }


    /**
     * 将内容进行分词
     * @param	{string}		  words    目标字符串
     * @param   {Object}          dict     字典
     * @return	{string}
     */
    static participle(words, dict) {
        let result = `${words}`;
        const keywords = [];

        for (const char of words) {
            const pinyin = dict[char];
            if (pinyin) {
                keywords.push(pinyin);
            }
        }

        let current = keywords.shift();

        while(keywords.length) {
            const array = [];
            const next = keywords.shift();
            for (const c of current) {
                for (const n of next) {
                    array.push(c + n);
                }
            }
            current = array;
        }

        if (current) {
            result += `\u0001${current.join('\u0001')}`;
        }
        
        return result;
    }
};

module.exports = Engine;