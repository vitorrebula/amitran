export const setToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
}

export const removeToken = () => {
    localStorage.removeItem('token');
}

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        return now < expiry;
    } catch (e) {
        return false;
    }
}
