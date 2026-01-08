/**
 * Detects if the current device is Android
 * @returns {boolean} True if the user agent indicates an Android device
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

/**
 * Detects if the current device is iOS
 * @returns {boolean} True if the user agent indicates an iOS device
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * Detects if the current device is mobile (Android or iOS)
 * @returns {boolean} True if the device is mobile
 */
export function isMobileDevice(): boolean {
  return isAndroidDevice() || isIOSDevice();
}

