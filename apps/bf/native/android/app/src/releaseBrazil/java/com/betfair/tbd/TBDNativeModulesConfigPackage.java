package com.betfair.tbd;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TBDNativeModulesConfigPackage implements ReactPackage {
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();

    // TBD Native Modules
    modules.add(new AirshipConfigModule(reactContext));
    modules.add(new TBDCurrentScreenModule(reactContext));
    modules.add(new TBDPerformanceModule(reactContext));
    modules.add(new LaunchArgumentsModule(reactContext));
    modules.add(new RCTStartupTime(reactContext));

    return modules;
  }
}
