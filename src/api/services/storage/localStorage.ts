
/**
 * Gets data from localStorage
 * @param key Storage key
 * @returns Parsed data or empty array
 */
export const getLocalStorageData = <T>(key: string): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    console.log(`Retrieving data for key ${key} from localStorage, found: ${storedData ? 'data' : 'nothing'}`);
    
    if (!storedData) {
      return [];
    }
    
    const parsedData = JSON.parse(storedData);
    if (!Array.isArray(parsedData)) {
      console.warn(`Data for key ${key} is not an array, converting to array`);
      return [parsedData] as T[];
    }
    
    return parsedData;
  } catch (error) {
    console.error(`Error retrieving data for key ${key} from localStorage:`, error);
    return [];
  }
};

/**
 * Saves data to localStorage
 * @param key Storage key
 * @param data Data to store
 */
export const saveToLocalStorage = <T>(key: string, data: T[]): void => {
  try {
    if (!data || !Array.isArray(data)) {
      console.warn(`Attempted to store non-array data for key ${key}, converting to array`);
      data = data ? [data] as T[] : [];
    }
    
    console.log(`Storing ${data.length} items for key ${key} to localStorage`);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for key ${key} to localStorage:`, error);
  }
};

/**
 * Gets string content from localStorage
 * @param key Storage key
 * @returns String content or empty string
 */
export const getLocalStorageContent = (key: string): string => {
  try {
    const content = localStorage.getItem(key);
    return content || '';
  } catch (error) {
    console.error(`Error retrieving content for key ${key} from localStorage:`, error);
    return '';
  }
};

/**
 * Saves string content to localStorage
 * @param key Storage key
 * @param content Content to store
 */
export const saveContentToLocalStorage = (key: string, content: string): void => {
  try {
    localStorage.setItem(key, content);
  } catch (error) {
    console.error(`Error storing content for key ${key} to localStorage:`, error);
  }
};
