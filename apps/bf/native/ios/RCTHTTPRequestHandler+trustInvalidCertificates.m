#if ACCEPT_SELF_SIGNED_CERTIFICATES
  #import <React/RCTBridgeModule.h>
  #import <React/RCTHTTPRequestHandler.h>

  @implementation RCTHTTPRequestHandler(trustInvalidCertificates)

  - (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential *credential))completionHandler
  {
    completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
  }
  @end
#endif
