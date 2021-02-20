
let util = {

    /**
     * 时间戳转时间对象
     * 该返回对象可以根据表达式进行格式化输出时间（Date.format('yyyy-MM-dd h:m:s')）
     * @param time_stamp  毫秒时间戳
     * @returns {Date}    时间对象
     */
    time_stamp2time_date: (time_stamp) => {
        let date = new Date();
        if (time_stamp)
            date.setTime(time_stamp);

        //给日期对象原型添加一个方法
        date.format = function (format) {
            let date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                        date[k] : (   (k == 'S+' ? '000' :"00")    + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        };

        return date;
    },

    time_format: (time, format) => {
        let date = {
            "M+": time.getMonth() + 1,
            "d+": time.getDate(),
            "h+": time.getHours(),
            "m+": time.getMinutes(),
            "s+": time.getSeconds(),
            "q+": Math.floor((time.getMonth() + 3) / 3),
            "S+": time.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                    date[k] : ((k == 'S+' ? '000' :"00")  + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    },
    resetSetItem: function (key, newVal) {
        if (key =='nodetree') {
            // 创建一个StorageEvent事件
            var newStorageEvent = document.createEvent('StorageEvent');
            const storage = {
                setItem: function (k, val) {
                    sessionStorage.setItem(k, val);
    
                    // 初始化创建的事件
                    newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
    
                    // 派发对象
                    window.dispatchEvent(newStorageEvent)
                }
            }
            return storage.setItem(key, newVal);
        }
    },
    
    //检验数字
    queryNum:(ip) =>{  
        let exp = /^[0-9]*$/
        let flag = ip.match(exp);  
        if(flag != undefined && flag!=""){  
            return true;  
        } else {  
            return false;  
        }  
    },
    //检验mac地址
    queryMAC:(num) =>{  
        let exp = /^[A-F0-9]{2}([-:]?[A-F0-9]{2})([-:.]?[A-F0-9]{2})([-:]?[A-F0-9]{2})([-:.]?[A-F0-9]{2})([-:]?[A-F0-9]{2})$/
        let flag = num.match(exp);  
        if(flag != undefined && flag!=""){  
            return true;  
        } else {  
            return false;  
        }  
    },
    //检验ipv4
    queryDevIP4:(ip) =>{  
        let exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;  
        let flag = ip.match(exp);  
        if(flag != undefined && flag!=""){  
            return true;  
        } else {  
            return false;  
        }  
    },

    //校验ipv6
    queryDevIP6:(ipvalue)=>{
        let matchStr = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    
        let ret = ipvalue.match(matchStr);
        if (ret != undefined && ret!="") {
            return true;
        } else {
            return false;
        }
    },
    //校验端口号
    testportnumber:(port) =>{
        let exp=/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
        let flag = port.match(exp);  
        if(flag != undefined && flag!=""){  
            return true;  
        } else {  
            return false;  
        }  
    },

    //校验邮箱
    testportMail:(port) =>{
        let exp=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        let flag = port.match(exp);  
        if(flag != undefined && flag!=""){  
            return true;  
        } else {  
            return false;  
        }  
    },

    /**
    * Check if an element has a class
    * @param {HTMLElement} elm
    * @param {string} cls
    * @returns {boolean}
    */
    hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    },

    /**
    * Add class to element
    * @param {HTMLElement} elm
    * @param {string} cls
    */
    addClass(ele, cls) {
        if (!this.hasClass(ele, cls)) ele.className += ' ' + cls
    },

    /**
    * Remove class from element
    * @param {HTMLElement} elm
    * @param {string} cls
    */
    removeClass(ele, cls) {
        if (this.hasClass(ele, cls)) {
            const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
            ele.className = ele.className.replace(reg, ' ')
        }
    },

    //类型检查
    isOfType :() => {
        const type = Object.create(null);
        type.null = x => x === null;
        type.undefined = x => x === undefined;
        type.nil = x => type.null(x) || type.undefined(x);
        type.string = x => !type.nil(x) && (typeof x === 'string' || x instanceof String);
        type.number = x => !type.nil(x) 
            && (// NaN & Infinity have typeof "number" and this excludes that
            (!isNaN(x) && isFinite(x)
            && typeof x === 'number'
            ) || x instanceof Number);
        type.boolean = x => !type.nil(x) && (typeof x === 'boolean' || x instanceof Boolean);
        type.array = x => !type.nil(x) && Array.isArray(x);
        type.object = x => ({}).toString.call(x) === '[object Object]';
        type.type = (x, X) => !type.nil(x) && x instanceof X;
        type.set = x => type.type(x, Set);
        type.map = x => type.type(x, Map);
        type.date = x => type.type(x, Date);
        return type;
    },

    //检查是否为空，甚至检查大小
    isEmpty(x) {
        if(Array.isArray(x)|| typeof x === 'string'|| x instanceof String) {
            return x.length === 0;
        }
        if(x instanceof Map || x instanceof Set) {
            return x.size === 0;
        }
        if(({}).toString.call(x) === '[object Object]') {
            return Object.keys(x).length === 0;
        }
        return false;
        },

    //一堆异步或普通函数都返回 promise，要求一个接一个地执行。会获取函数或 promise 列表，并使用数组 reduce 方法按顺序解析.
    asyncSequentializer :() => {
        const toPromise = (x) => {
            if(x instanceof Promise) { // if promise just return it
            return x;
            }

            if(typeof x === 'function') {
            // if function is not async this will turn its result into a promise
            // if it is async this will await for the result
            return (async () => await x())();
            }

            return Promise.resolve(x)
        }

        return (list) => {
            const results = [];

            return list
            .reduce((lastPromise, currentPromise) => {
                return lastPromise.then(res => {
                results.push(res); // collect the results
                return toPromise(currentPromise);
                });
            }, toPromise(list.shift()))
            // collect the final result and return the array of results as resolved promise
            .then(res => Promise.resolve([...results, res]));
        }
    },

    //轮询数据
    //持续检查数据更新，但系统中没有 WebSocket。适合上传文件时，想要持续检查文件是否已完成处理的情况，
    //或者使用第三方 API（例如 dropbox 或 uber）并且想要持续检查过程是否完成或骑手是否到达目的地的情况
    async poll(fn, validate, interval = 2500) {
        const resolver = async (resolve, reject) => {
            try { // catch any error thrown by the "fn" function
            const result = await fn(); // fn does not need to be asynchronous or return promise
            // call validator to see if the data is at the state to stop the polling
            const valid = validate(result);
            if (valid === true) {
                resolve(result);
            } else if (valid === false) {
                setTimeout(resolver, interval, resolve, reject);
            } // if validator returns anything other than "true" or "false" it stops polling
            } catch (e) {
            reject(e);
            }
        };
        return new Promise(resolver);
    },
    //数组中交换位置
    //arr 数组， i,j交换位置的索引
    swapNewWay: (arr,i,j)=>{
        const arrayCopy = [...arr]
        [arrayCopy[i],arrayCopy[j]] = [arrayCopy[j],arrayCopy[i]]
        return arrayCopy;
    },
    //深拷贝
    deepClone :(obj) => {
        let clone = obj;
        if (obj && typeof obj === "object") {
            clone = new obj.constructor();
            Object.getOwnPropertyNames(obj).forEach(
                prop => (clone[prop] = deepClone(obj[prop]))
            );
        }
        return clone;
    },
}

export default util;
