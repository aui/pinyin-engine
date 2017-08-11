const dict = require('./dict-tw');
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
}

module.exports = PinyinEngine;