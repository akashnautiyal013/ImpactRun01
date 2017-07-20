/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"
#import "RNGoogleSignin.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <asl.h>
#import "RCTLog.h"
//#import "RCTPushNotificationManager.h"
#import "RCTPushNotificationManager.h"
#import "RCTOneSignal.h"
#import "AppHub/AppHub.h"
#import "RCTBridge.h"
#import "RCTJavaScriptLoader.h"


//#import <CleverTapSDK/CleverTap.h>
@interface AppDelegate() <RCTBridgeDelegate, UIAlertViewDelegate>

@end


@implementation AppDelegate  {
  RCTBridge *_bridge;
}
@synthesize oneSignal = _oneSignal;
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [AppHub setApplicationID:@"IMQoz5u1MtkMFFmTSi5K"];
  
  [Fabric with:@[[Crashlytics class]]];
//  [CleverTap autoIntegrate];
  RCTSetLogThreshold(RCTLogLevelInfo);
  RCTSetLogFunction(CrashlyticsReactLogFunction);
  [AppHub buildManager].automaticPollingEnabled = YES;
  [AppHub buildManager].cellularDownloadsEnabled = YES;
  
//  NSURL *jsCodeLocation;
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"fe19376e-04a5-4ba1-a4a8-74f9ea9b0ca8"];
  
//  if(RCT_DEBUG == 1) {
//    AHBuild *build = [[AppHub buildManager] currentBuild];
//    jsCodeLocation = [NSURL URLWithString:@"http://192.168.0.104:8081/index.ios.bundle?platform=ios&dev=true"];
//  } else {
//     AHBuild *build = [[AppHub buildManager] currentBuild];
//    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  }
  //     jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  //jsCodeLocation = [NSURL URLWithString:@"http://192.168.11.120:8081/index.ios.bundle?platform=ios&dev=true"];
  /**192.168.1.25
   * OPTION 2
   * Load from pre-bundled file on disk. The static bundle is automatically
   * generated by "Bundle React Native code and images" build step.
   */
  //
  //   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  _bridge = [[RCTBridge alloc] initWithDelegate:self
                                  launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:_bridge
                                                   moduleName:@"Impactrun"
                                            initialProperties:nil];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
    
//  [[NSNotificationCenter defaultCenter] addObserver:self
//                                        selector:@selector(newBuildDidBecomeAvailable:)
//                                            name:AHBuildManagerDidMakeBuildAvailableNotification
//                                          object:nil];
  //  return YES;
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
 
}

                           
                           
                           
                           
                           
- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification {
  [RCTOneSignal didReceiveRemoteNotification:notification];
}
                           
                           
                           
                           
                           
                           
                           
                           
                           


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [[RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation],
          
          [FBSDKApplicationDelegate sharedInstance] application:application
          openURL:url
          sourceApplication:sourceApplication
          annotation:annotation];
  
}
                           
                           
                           
                           
                           
                           
                           

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                               RCTLogLevel level,
                                               __unused RCTLogSource source,
                                               NSString *fileName,
                                               NSNumber *lineNumber,
                                               NSString *message
                                               )
                           




{
  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
  
#ifdef DEBUG
  fprintf(stderr, "%s\n", log.UTF8String);
  fflush(stderr);
#else
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
#endif
  
  int aslLevel;
  switch(level) {
    case RCTLogLevelTrace:
      aslLevel = ASL_LEVEL_DEBUG;
      break;
    case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
    case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
    case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
    case RCTLogLevelFatal:
      aslLevel = ASL_LEVEL_CRIT;
      break;
  }
  
  
  
  
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
  
  
};
                           
                           
                           
  - (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge
  {
    NSURL *sourceURL;
    
    /**
     * Loading JavaScript code - uncomment the one you want.
     *
     * OPTION 1
     * Load from development server. Start the server from the repository root:
     *
     * $ react-native start
     *
     * To run on device, change `localhost` to the IP address of your computer
     * (you can get this by typing `ifconfig` into the terminal and selecting the
     * `inet` value under `en0:`) and make sure your computer and iOS device are
     * on the same Wi-Fi network.
     */
    
      sourceURL = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
//
    
    /**
     * OPTION 2 - AppHub
     *
     * Load cached code and images from AppHub. Use this when deploying to test
     * users and the App Store.
     *
     * Make sure to re-generate the static bundle by navigating to your Xcode project
     * folder and running
     *
     * $ react-native bundle --entry-file index.ios.js --platform ios --dev true --bundle-output iOS/main.jsbundle
     *
     */
//    
//    AHBuild *build = [[AppHub buildManager] currentBuild];
//    sourceURL = [build.bundle URLForResource:@"main"
//                               withExtension:@"jsbundle"];

        return sourceURL;
  }

                           - (void)loadSourceForBridge:(RCTBridge *)bridge
                           withBlock:(RCTSourceLoadBlock)loadCallback
  {
    [RCTJavaScriptLoader loadBundleAtURL:[self sourceURLForBridge:bridge]
                              onComplete:loadCallback];
  }
                           
#pragma mark - NSNotificationCenter
                           
//   -(void) newBuildDidBecomeAvailable:(NSNotification *)notification {
//     // Show an alert view when a new build becomes available. The user can choose to "Update" the app, or "Cancel".
//     // If the user presses "Cancel", their app will update when they close the app.
//     
//     AHBuild *build = notification.userInfo[AHBuildManagerBuildKey];
//     NSString *alertMessage = [NSString stringWithFormat:@"There's a new update available.\n\nUpdate description:\n\n %@", build.buildDescription];
//     
//     UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Great news!"
//                                                     message:alertMessage
//                                                    delegate:self
//                                           cancelButtonTitle:@"Cancel"
//                                           otherButtonTitles:@"Update", nil];
//     
//     dispatch_async(dispatch_get_main_queue(), ^{
//       // Show the alert on the main thread.
//       [alert show];
//     });
//   }

#pragma mark - UIAlertViewDelegate
   
   -(void) alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
     if (buttonIndex == 1) {
       // The user pressed "update".
       [_bridge reload];
     }
   }


- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
//// Required for the notification event.
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
//{
//  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
//}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}


@end
