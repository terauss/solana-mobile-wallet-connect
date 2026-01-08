/**
 * Detects if the user is on an Android device
 * @returns true if the user agent indicates an Android device
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

