// 笛卡尔乘积，返回两个数组的所有可能的组合
const product = (a, b, sp) => {
    const r = [];
    const str = [];
    for (let i = 0, l = a.length; i < l; i++) {
        for (let j = 0, m = b.length; j < m; j++) {
            const val = r[r.length] = (a[i] instanceof Array) ? a[i].concat(b[j]) : [].concat(a[i], b[j]);
            str.push(val.join(''));
        }
    }
    return {
        array: r,
        string: str.join(sp || '')
    };
};

/**
 * 建立索引
 * @param	{[string]|[Object]}	 data    数据
 * @param	{?string|[string]}   indexs  如果 data 为 [Object]，这里需要建立拼音索引 key
 * @param   {array}              dict    词典数据
 */
class Engine {
    constructor(data, indexs, dict) {
        this.indexs = [];
        this.history = { keyword: '', indexs: [], data: [] };
        this.data = data;
        this.dict = dict;

        // 建立拼音关键词索引
        indexs = typeof indexs === 'string' ? [indexs] : indexs;
        const excision = '\u0001';
        for (const item of data) {
            let keywords = '';

            for (const key of indexs) {
                const words = item[key];
                if (words) {
                    keywords += words + excision + this.toPinyin(words, false, excision);
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
     * 汉字转拼音（支持多音字）
     * @param	{String}		要转为拼音的目标字符串（汉字）
     * @param	{Boolean}		是否仅保留匹配的第一个拼音
     * @param	{String}		返回结果的分隔符，默认返回数组集合
     * @return	{String, Array} 如果 sp 为 null，则返回 Array
     *							否则，返回以 sp 分隔的字符串
    */
    toPinyin(keyword, single, sp) {
        const dict = this.dict;
        const len = keyword.length;

        if (len === 0) {
            return single ? '' : []
        }
        if (len === 1) {
            const y = dict[keyword];
            if (single) {
                return y && y[0] ? y[0] : keyword
            }
            return y || [keyword];
        } else {
            const py = [];
            for (let i = 0; i < len; i++) {
                const y = dict[keyword.charAt(i)];
                if (y) {
                    py[py.length] = single ? y[0] : y;
                } else {
                    py[py.length] = single ? keyword.charAt(i) : [keyword.charAt(i)];
                };
            }
            if (single) {
                return sp == null ? py : py.join(sp || '')
            }

            let pys = py[0];
            const pyl = py.length;
            let prt;
            for (let i = 1; i < pyl; i++) {
                prt = product(pys, py[i], sp);
                pys = prt.array;
            }
            return sp == null ? pys : prt.string;
        }
    }
};

module.exports = Engine;