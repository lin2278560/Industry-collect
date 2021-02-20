/**
 * 简单操作web存储
 * Created by Administrator on 2018/7/28.
 */


let storage = {

  setStorage(key, value){
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  getStorage(key) {
      return sessionStorage.getItem(key);
  },
  removeStorage(key) {
    sessionStorage.removeItem(key);
  },
  clear(){
    sessionStorage.clear();
  }

}


export default storage;
