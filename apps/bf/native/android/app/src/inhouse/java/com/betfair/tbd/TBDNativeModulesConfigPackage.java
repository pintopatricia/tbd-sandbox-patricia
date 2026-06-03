package com.betfair.tbd;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class TBDNativeModulesConfigPackage implements ReactPackage {
  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();

    try {
      Class<ViewManager> c = (Class<ViewManager>) Class.forName("com.betfair.tbd.CustomWebViewManager");
      viewManagers.add(c.newInstance());
    } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
      e.printStackTrace();
    }

    return viewManagers;
  }

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
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
