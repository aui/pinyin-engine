module.exports = dict => {
    const [word, key] = dict;
    const cache = {};
    const fromCharCode = String.fromCharCode;

    if (!dict.length) {
        return cache;
    }

    // 对原始数据解压缩
    let keys = key;
    if (typeof keys === 'string') {
        keys = keys.split(',');
    }
    for (let i = 0, arrow = 0, len = word.length; i < len; i++, arrow++) {
        const k = word[i];

        // 处理占位符：负值与空值
        if (k < 0 || k === undefined) {
            arrow += Math.abs(k || 0);
            continue;
        }

        const txt = fromCharCode(arrow + 19968);

        if (typeof k === 'number') {
            cache[txt] = [keys[k]];
            // 多音字数据
        } else {
            cache[txt] = [];
            const l = k.length;
            for (let w = 0; w < l; w++) {
                cache[txt].push(keys[k[w]]);
            }
        }
    }

    return cache;
};