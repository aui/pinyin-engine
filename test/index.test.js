const assert = require('assert');
const PinyinEngine = require('../src/cn');

describe('PinyinEngine()', () => {

    describe('#query()', () => {

        it('数据应当支持 `[string]`', () => {
            const pinyinEngine = new PinyinEngine([
                '清华大学',
                '北京大学',
                '中央美院'
            ]);
            assert.deepEqual(['中央美院'], pinyinEngine.query('meiyuan'));
        });
        it('数据应当支持 `[Object]`', () => {
            const pinyinEngine = new PinyinEngine([
                {
                    id: 0,
                    name: '清华大学'
                },
                {
                    id: 1,
                    name: '北京大学'
                },
                {
                    id: 3,
                    name: '中央美院'
                }
            ], ['name']);
            assert.deepEqual([{
                id: 3,
                name: '中央美院'
            }], pinyinEngine.query('meiyuan'));
        });
        it('索引取值应当支持 path 格式', () => {
            const pinyinEngine = new PinyinEngine([{
                    id: 0,
                    deep: {
                        name: '清华大学'
                    }
                },
                {
                    id: 1,
                    deep: {
                        name: '北京大学'
                    }
                },
                {
                    id: 3,
                    deep: {
                        name: '中央美院'
                    }
                }
            ], ['deep.name']);
            assert.deepEqual([{
                id: 3,
                deep: {
                    name: '中央美院'
                }
            }], pinyinEngine.query('meiyuan'));
        });
        it('应当支持拼音首字母', () => {
            const pinyinEngine = new PinyinEngine([
                '清华大学',
                '北京大学',
                '中央美院'
            ]);
            assert.deepEqual(['中央美院'], pinyinEngine.query('zymy'));
        });
        it('应当支持前模糊', () => {
            const pinyinEngine = new PinyinEngine([
                '清华大学',
                '北京大学',
                '中央美院'
            ], '', true);
            assert.notDeepEqual(['中央美院'], pinyinEngine.query('meiyuan'));
            assert.deepEqual(['中央美院'], pinyinEngine.query('zy'));
        });
    });

    describe('PinyinEngine.participle()', () => {

        it('应当支持单个字符', () => {
            assert.deepEqual(['中', 'zhong'].join('\u0001'), PinyinEngine.participle('中'));
        });

        it('应当支持不在字典中的字符', () => {
            assert.deepEqual('😊', PinyinEngine.participle('😊'));
        });

        it('应当支持多个字符', () => {
            assert.deepEqual(['中国人😊', 'zhongguoren', 'zgr'].join('\u0001'), PinyinEngine.participle('中国人😊'));
        });

        it('应当支持单个多音字', () => {
            assert.deepEqual(['乐', 'le', 'yue'].join('\u0001'), PinyinEngine.participle('乐'));
        });

        it('应当支持多音字组合', () => {
            assert.deepEqual(['乐乐😊', 'lele', 'leyue', 'yuele', 'yueyue', 'll', 'ly', 'yl', 'yy'].join('\u0001'), PinyinEngine.participle('乐乐😊'));
        });

    });
});
