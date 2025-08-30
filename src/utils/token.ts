export const getToken = (cookies: string[]): Promise<string> => {
    const authCookie: string = cookies.find(c => c.includes('auth=')) ?? '';
    const cookieValue = authCookie.split(';').find(c => c.trim().startsWith('auth='));
    if (cookieValue) {
        return Promise.resolve(cookieValue.split('=')[1]);
    }
    return Promise.reject('Token not found in cookies');
}