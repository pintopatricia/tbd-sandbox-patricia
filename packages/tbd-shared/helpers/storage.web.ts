import { StorageState } from "@ppb/tbd-store/helpers/storage";
import { StorageModule } from "@ppb/tbd-store/modules/StorageModule.types";

const Storage: StorageModule<StorageState> = {
  async getItem(keyName) {
    const retrievedStorageValue = window.localStorage.getItem(keyName);

    try {
      return retrievedStorageValue ? JSON.parse(retrievedStorageValue) : undefined;
    } catch {
      return retrievedStorageValue || undefined;
    }
  },

  async multiGet(keyNames) {
    try {
      const results = keyNames.map((key) => {
        const value = window.localStorage.getItem(key);

        return [key, value ? JSON.parse(value) : null] as const;
      });

      return Object.fromEntries(new Map(results)) as any;
    } catch {
      return {};
    }
  },

  async setItem(keyName, keyValue) {
    window.localStorage.setItem(keyName, JSON.stringify(keyValue));
  },

  async removeItem(keyName) {
    window.localStorage.removeItem(keyName);
  },

  async clear() {
    window.localStorage.clear();
  },
};

export default Storage;
