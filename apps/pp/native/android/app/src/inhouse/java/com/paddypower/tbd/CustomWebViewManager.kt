package com.paddypower.tbd

import android.annotation.SuppressLint
import android.net.http.SslError
import android.webkit.SslErrorHandler
import android.webkit.WebView
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativecommunity.webview.RNCWebViewClient
import com.reactnativecommunity.webview.RNCWebViewManager
import com.reactnativecommunity.webview.RNCWebViewWrapper

@ReactModule(name = CustomWebViewManager.REACT_CLASS)
open class CustomWebViewManager : RNCWebViewManager() {
  protected class CustomWebViewClient : RNCWebViewClient() {
    @SuppressLint("WebViewClientOnReceivedSslError")
    override fun onReceivedSslError(view: WebView, handler: SslErrorHandler, error: SslError) {
      handler.proceed()
    }
  }

  override fun getName(): String {
    return REACT_CLASS
  }

  override fun addEventEmitters(reactContext: ThemedReactContext, viewWrapper: RNCWebViewWrapper) {
    viewWrapper.webView.webViewClient = CustomWebViewClient()
  }

  companion object {
    const val REACT_CLASS = "RNCCustomWebView"
  }
}
