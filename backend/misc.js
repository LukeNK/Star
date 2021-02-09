module.exports = {
    arr2str: (arr) => {
        let res = '',
            l1 = 0;
        for (; l1 < arr.length; l1++) {
            res += arr[l1] + '/*/';
        }
        return res.substr(0, res.length - 3)
    }
}