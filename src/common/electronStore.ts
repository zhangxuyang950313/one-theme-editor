import ElectronStore from "electron-store";
import PathCollection from "src/data/PathCollection";
import { TypePathConfig } from "src/types/extraConfig";

type TypeElectronStore = {
  serverPort: number;
  hostname: string;
  pathConfig: TypePathConfig;
};
const defaultState: TypeElectronStore = {
  serverPort: 0,
  hostname: "127.0.0.1:0",
  pathConfig: PathCollection.default
};

// class Store {
//   private store: ElectronStore<TypeElectronStore>;
//   constructor(options: ElectronStore.Options<TypeElectronStore>) {
//     this.store = new ElectronStore<TypeElectronStore>(options);
//   }

//   getInstance() {
//     return this.store;
//   }

//   get(key: keyof TypeElectronStore) {
//     return this.store.get(key);
//   }

//   set<K extends keyof TypeElectronStore>(key: K, data: TypeElectronStore[K]) {
//     this.store.set(key, data);
//   }
//   clear() {
//     store.clear();
//   }
// }

const electronStore = new ElectronStore<TypeElectronStore>();

for (const key in defaultState) {
  if (!defaultState[key as keyof TypeElectronStore]) {
    electronStore.set(key, defaultState[key as keyof TypeElectronStore]);
  }
}

export default electronStore;
