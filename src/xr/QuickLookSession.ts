/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import View3D from "../View3D";
import View3DError from "../core/View3DError";
import { IS_IOS } from "../const/browser";
import { QUICK_LOOK_SUPPORTED } from "../const/xr";
import { AR_SESSION_TYPE, EVENTS, QUICK_LOOK_APPLE_PAY_BUTTON_TYPE, QUICK_LOOK_CUSTOM_BANNER_SIZE } from "../const/external";
import ERROR from "../const/error";
import { LiteralUnion, OptionGetters, ValueOf } from "../type/utils";

import ARSession from "./ARSession";

/**
 * @interface
 * @param {boolean} [allowsContentScaling=true] Whether to allow content scaling.
 * @param {string | null} [canonicalWebPageURL=null] The web URL to share when the user invokes the share sheet. If `null` is given, the USDZ file will be shared.
 * @param {string | null} [applePayButtonType=null] Type of the apple pay button in the banner. See {@link QUICK_LOOK_APPLE_PAY_BUTTON_TYPE}
 * @param {string | null} [callToAction=null] A text that will be displayed instead of Apple Pay Button. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405143 Official Guide Page}
 * @param {string | null} [checkoutTitle=null] Title of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
 * @param {string | null} [checkoutSubtitle=null] Subtitle of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
 * @param {string | null} [price=null] Price of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
 * @param {string | null} [custom=null] Custom URL to the banner HTML. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3402837 Official Guide Page}
 * @param {string | null} [customHeight=null] Height of the custom banner. See {@link QUICK_LOOK_CUSTOM_BANNER_SIZE}
 */
export interface QuickLookSessionOptions {
  allowsContentScaling: boolean;
  canonicalWebPageURL: string | null;
  applePayButtonType: LiteralUnion<ValueOf<typeof QUICK_LOOK_APPLE_PAY_BUTTON_TYPE>, string> | null;
  callToAction: string | null;
  checkoutTitle: string | null;
  checkoutSubtitle: string | null;
  price: string | null;
  custom: string | null;
  customHeight: LiteralUnion<ValueOf<typeof QUICK_LOOK_CUSTOM_BANNER_SIZE>, string> | null;
}

/**
 * AR Session using Apple AR Quick Look Viewer
 * @see https://developer.apple.com/augmented-reality/quick-look/
 */
class QuickLookSession implements ARSession, OptionGetters<QuickLookSessionOptions> {
  /**
   * Return the availability of QuickLookSession.
   * QuickLook AR is available on iOS12+
   * @returns {Promise} A Promise that resolves availability of this session(boolean).
   */
  public static isAvailable() {
    return Promise.resolve(QUICK_LOOK_SUPPORTED() && IS_IOS());
  }

  public static readonly type = AR_SESSION_TYPE.QUICK_LOOK;

  // Options
  // As those values are referenced only while entering the session, so I'm leaving this values public
  public allowsContentScaling: QuickLookSessionOptions["allowsContentScaling"];
  public canonicalWebPageURL: QuickLookSessionOptions["canonicalWebPageURL"];
  public applePayButtonType: QuickLookSessionOptions["applePayButtonType"];
  public callToAction: QuickLookSessionOptions["callToAction"];
  public checkoutTitle: QuickLookSessionOptions["checkoutTitle"];
  public checkoutSubtitle: QuickLookSessionOptions["checkoutSubtitle"];
  public price: QuickLookSessionOptions["price"];
  public custom: QuickLookSessionOptions["custom"];
  public customHeight: QuickLookSessionOptions["customHeight"];

  private _view3D: View3D;

  /**
   * Create new instance of QuickLookSession
   * @param {View3D} view3D Instance of the View3D
   * @param {object} [options={}] Quick Look options
   * @param {boolean} [options.allowsContentScaling=true] Whether to allow content scaling.
   * @param {string | null} [options.canonicalWebPageURL=null] The web URL to share when the user invokes the share sheet. If `null` is given, the USDZ file will be shared.
   * @param {string | null} [options.applePayButtonType=null] Type of the apple pay button in the banner. See {@link QUICK_LOOK_APPLE_PAY_BUTTON_TYPE}
   * @param {string | null} [options.callToAction=null] A text that will be displayed instead of Apple Pay Button. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405143 Official Guide Page}
   * @param {string | null} [options.checkoutTitle=null] Title of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
   * @param {string | null} [options.checkoutSubtitle=null] Subtitle of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
   * @param {string | null} [options.price=null] Price of the previewed item. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3405142 Official Guide Page}
   * @param {string | null} [options.custom=null] Custom URL to the banner HTML. See {@link https://developer.apple.com/documentation/arkit/adding_an_apple_pay_button_or_a_custom_action_in_ar_quick_look#3402837 Official Guide Page}
   * @param {string | null} [options.customHeight=null] Height of the custom banner. See {@link QUICK_LOOK_CUSTOM_BANNER_SIZE}
   */
  public constructor(view3D: View3D, {
    allowsContentScaling = true,
    canonicalWebPageURL = null,
    applePayButtonType = null,
    callToAction = null,
    checkoutTitle = null,
    checkoutSubtitle = null,
    price = null,
    custom = null,
    customHeight = null
  }: Partial<QuickLookSessionOptions> = {}) {
    this._view3D = view3D;

    this.allowsContentScaling = allowsContentScaling;
    this.canonicalWebPageURL = canonicalWebPageURL;
    this.applePayButtonType = applePayButtonType;
    this.callToAction = callToAction;
    this.checkoutTitle = checkoutTitle;
    this.checkoutSubtitle = checkoutSubtitle;
    this.price = price;
    this.custom = custom;
    this.customHeight = customHeight;
  }

  /**
   * Enter QuickLook AR Session
   */
  public enter() {
    const view3D = this._view3D;
    const file = view3D.iosSrc;

    if (!file) {
      return Promise.reject(new View3DError(ERROR.MESSAGES.FILE_NOT_SUPPORTED(`${file}`), ERROR.CODES.FILE_NOT_SUPPORTED));
    }

    const canonicalWebPageURL = this.canonicalWebPageURL;
    const custom = this.custom;

    const currentHref = window.location.href;
    const anchor = document.createElement("a") ;
    anchor.setAttribute("rel", "ar");
    anchor.appendChild(document.createElement("img"));

    const hashObj = Object.entries({
      applePayButtonType: this.applePayButtonType,
      callToAction: this.callToAction,
      checkoutTitle: this.checkoutTitle,
      checkoutSubtitle: this.checkoutSubtitle,
      price: this.price,
      customHeight: this.customHeight
    }).reduce((obj, [key, value]) => {
      if (value) {
        obj[key] = value as string;
      }

      return obj;
    }, {} as Record<string, string>);

    const usdzURL = new URL(file, currentHref);
    if (!this.allowsContentScaling) {
      hashObj.allowsContentScaling = "0";
    }

    if (canonicalWebPageURL) {
      hashObj.canonicalWebPageURL = new URL(canonicalWebPageURL, currentHref).href;
    }

    if (custom) {
      hashObj.custom = new URL(custom, currentHref).href;
    }

    usdzURL.hash = new URLSearchParams(hashObj).toString();

    anchor.setAttribute("href", usdzURL.href);
    anchor.addEventListener("message", evt => {
      if ((evt as any).data === "_apple_ar_quicklook_button_tapped") {
        // User tapped either Apple pay button / Custom action button
        view3D.trigger(EVENTS.QUICK_LOOK_TAP, {
          ...evt,
          type: EVENTS.QUICK_LOOK_TAP,
          target: view3D
        });
      }
    }, false);

    anchor.click();

    return Promise.resolve();
  }

  public exit() {
    return Promise.resolve();
  }
}

export default QuickLookSession;
