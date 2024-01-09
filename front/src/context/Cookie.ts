
const COOKIE_EXP =
    Number(process.env.REACT_APP_COOKIE_EXP_DAYS ?? 1)

export default class Cookie {

    private static AUTH_COOKIE_NAME = "auth";

    private static createCookie(name: string, value: string, days: number): void {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    private static readCookie(name: string): string | null {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
            return cookieValue;
            }
        }
        return null;
    }

    private static deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

    public static createAuthCookie(token: string): void {
        Cookie.createCookie(this.AUTH_COOKIE_NAME, token, COOKIE_EXP)
    }

    public static getAuthToken(): string | null {
        return this.readCookie(this.AUTH_COOKIE_NAME)
    }

    public static removeAuthCookie(): void {
        if (this.getAuthToken() != null) {
            this.deleteCookie(this.AUTH_COOKIE_NAME)
        }
    }
}