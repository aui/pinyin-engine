# pinyin-engine

这是一款简单高效的拼音匹配引擎，它能使用拼音够快速的检索列表中的数据。

1. 使用索引以及缓存机制，从而在客户端实现毫秒级的数据检索
2. 它的字典数据格式经过压缩处理，简体中文版本仅仅 17kb 大小（Gzip）
3. 支持多音字、支持拼音首字母匹配
4. 简体版本覆盖 6718 个汉字，繁体中文覆盖 20846 个汉字

在线演示：<https://aui.github.io/pinyin-engine/example/>

## 安装

```shell
npm install pinyin-engine --save
```

## API

### new PinyinEngine(list, keys)

建立拼音索引。

参数：

1. list `{[string]|[Object]}` 被索引的目标
2. keys `{[string]}` 可选。如果 list 为 `Object`，这里用来设置需要被索引的 key

### .query(keyword)

查询匹配拼音的数据。

参数：

1. keyword `{string}` 拼音或者关键字

返回：

`{[string]|{Object}}`

## 繁体中文版本

包含简体中文与繁体中文。

```js
const PinyinEngine = require('pinyin-engine/tw');
```

## 使用范例

列表项为字符串：

```js
const PinyinEngine = require('pinyin-engine');

// 建立数据索引
const pinyinEngine = new PinyinEngine([
    '清华大学',
    '北京大学',
    '中央美院'
]);

// 查询
pinyinEngine.query('daxue'); // ['清华大学', '北京大学']
```

列表项为对象：

```js
const PinyinEngine = require('pinyin-engine');

// 建立数据索引
const pinyinEngine = new PinyinEngine([
    { id: 0, name: '清华大学' },
    { id: 1, name: '北京大学' },
    { id: 3, name: '中央美院' }
], ['name']);

// 查询
pinyinEngine.query('daxue'); // ['清华大学', '北京大学']
```
