export default class Storage {
  static storeData(key, item) {
    try {
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.log(
        `LocalStorage save data key: ${key} item: ${item} error: ${error}`
      );
      return false;
    }
  }

  static retrieveData(key) {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      return item;
    } catch (error) {
      console.log(`LocalStorage get data key: ${key} error: ${error}`);
      return null;
    }
  }
}
