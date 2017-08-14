const dict = require('./dict-cn');
const decode = require('./decode');
const Engine = require('./engine');

const DICT = decode(dict);

/**
 * 拼音查询引擎
 * @param	{[string]|[Object]}	 data    数据
 * @param	{?string|[string]}   indexs  如果 data 为 [Object]，这里需要建立拼音索引 key
 */
class PinyinEngine extends Engine {
    constructor(data, indexs) {
        super(data, indexs, DICT);
    }

    /**
     * 将内容进行分词
     * @param	{string}		  words    目标字符串
     * @return	{string}
     */
    static participle(keyword) {
        return Engine.participle(keyword, DICT);
    }
}

module.exports = PinyinEngine;