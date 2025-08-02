import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  /**
   * Set a cookie with secure options
   * @param name Cookie name
   * @param value Cookie value
   * @param days Days until expiration (default: 7 days)
   */
  set(name: string, value: string, days: number = 7, path: string = '/', domain: string = '', secure: boolean = false, sameSite: string = 'Strict'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=${path};SameSite=${sameSite}`;
    
    if (domain) {
      cookieString += `;domain=${domain}`;
    }
    
    // Add secure flag if running on HTTPS or if explicitly requested
    if (secure || window.location.protocol === 'https:') {
      cookieString += ';secure';
    }
    
    document.cookie = cookieString;
  }

  /**
   * Get a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or empty string if not found
   */
  get(name: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
  }

  /**
   * Delete a cookie by name
   * @param name Cookie name
   */
  delete(name: string, path: string = '/'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
  }

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists, false otherwise
   */
  check(name: string): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return this.get(name) !== '';
  }

  /**
   * Get all cookies as an object
   * @returns Object with cookie names as keys and values as values
   */
  getAll(): { [key: string]: string } {
    if (!isPlatformBrowser(this.platformId)) {
      return {};
    }

    const cookies: { [key: string]: string } = {};
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      const eqIndex = c.indexOf('=');
      if (eqIndex > 0) {
        const name = c.substring(0, eqIndex);
        const value = c.substring(eqIndex + 1);
        cookies[name] = value;
      }
    }
    
    return cookies;
  }
} 