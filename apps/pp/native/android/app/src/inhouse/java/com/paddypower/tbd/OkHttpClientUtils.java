package com.paddypower.tbd;

import com.paddypower.tbd.OkHttpClientForInternalCerts;
import com.facebook.react.modules.network.OkHttpClientProvider;

public class OkHttpClientUtils {
  public static void setDevClient() {
    // needed for accepting internal PPB's self signed certificates
    OkHttpClientProvider.setOkHttpClientFactory(new OkHttpClientForInternalCerts());
  }
}
