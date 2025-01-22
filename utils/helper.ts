import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToLocal = async (key:string,value:string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
};

export const getFromLocal = async (key:string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if(value !== null) {
        return value;
      }
    } catch(e) {
        // error reading value
    }
};

export const clearByKey = async (key:string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
        // remove error
    }
};

export const saveDraftData = async (value:Object) => {
  const key = `@formData${Date.now()}`
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return key;
    } catch (e) {
      console.log(e);
    }
}

export const getDraftData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filteredKeys = keys.filter((key) => key.includes('@formData'));
      const values = await AsyncStorage.multiGet(filteredKeys);
      return values;
    } catch(e) {
      // error reading value
    }
}

export const clearLocal = async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      // clear error
    }
}

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}