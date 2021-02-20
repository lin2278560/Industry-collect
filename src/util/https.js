import axios from 'axios'
import iView from 'iview'
import qs from 'qs'

axios.defaults.timeout = 100000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
axios.defaults.baseURL = '/';
// axios.defaults.baseURL = 'https://192.168.5.168:9999'; //采集配置接口地址
// axios.defaults.baseURL = 'https://192.168.12.55:9999'; //采集配置接口地址
// axios.defaults.baseURL = 'https://192.168.5.149:9999'; //上报配置接口地址
axios.defaults.withCredentials = true;
//localhost:8013
//192.168.10.114:8080

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post') {
        //config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事
    if (!res.data.success) {
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    console.log('网络异常', error)
    return Promise.reject(error);
});

// http response 响应拦截器
axios.interceptors.response.use(response => {
    if (response.data.code == 401) {
        sessionStorage.removeItem("users");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("loginType");
        // alert("登录失效,请重新登录后,在访问。");
        iView.Notice.error({ title: "未登录", desc: "请登录后,在访问。", duration: 2.5 });
        setTimeout(function() { window.location.href = "/login"; }, 1500)
    } else if (response.data.code == 301) {
        console.log(sessionStorage.getItem("loginType"), 'sessionStorage.getItem("loginType")')
        if (!sessionStorage.getItem("loginType")) {
            return response;
        }
        sessionStorage.removeItem("users");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("loginType");
        iView.Notice.error({ title: "license不可用", desc: "请登录重新上传license文件后,再访问。", duration: 2.5 });
        setTimeout(function() { window.location.href = response.data.data; }, 1500)
    }
    return response;
}, error => {
    console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params, config) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, config)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//返回一个Promise(发送get请求)
export function fetchGet(url, param, config) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: param }, config)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//返回一个Promise(发送put请求)
export function fetchPut(url, params, config) {
    return new Promise((resolve, reject) => {
        axios.put(url, params, config)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//返回一个Promise(发送delete请求)
export function fetchDelete(url, params, config) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params, config)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


export function getAxios() {
    return axios;
}

export default {
    fetchPost,
    fetchGet,
    fetchPut,
    fetchDelete,
    getAxios
}