const parseCookies = (cookieHeader) => {
    const cookies = {};
    cookieHeader && cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        const name = parts.shift().trim();
        const value = decodeURIComponent(parts.join('=').trim());
        cookies[name] = value;
    });
    return cookies;
};

module.exports = parseCookies