import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reactotronRedux } from "reactotron-redux";
import appConfiguration from "../../config/app-configuration.native";

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: appConfiguration.appName,
    onConnect: () => {
      Reactotron.clear();
    },
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .use(reactotronRedux())
  .connect();

export default reactotron;
