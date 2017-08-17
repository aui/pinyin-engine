module.exports = dict => {
    const [word] = dict;
    const keys = dict[1].split(',');
    const map = {};

    if (!dict.length) {
        return map;
    }

    for (let i = 0, charCode = 0, len = word.length; i < len; i ++, charCode ++) {
        const val = word[i];

        // 处理偏移
        if (val < 0) {
            charCode -= val + 1;
            continue;
        }

        const char = String.fromCharCode(charCode);

        if (typeof val === 'number') {
            map[char] = [keys[val]];
        } else {
            map[char] = [];
            for (let w = 0, l = val.length; w < l; w ++) {
                map[char].push(keys[val[w]]);
            }
        }
        
    }

    return map;
};