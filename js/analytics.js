// Keep local previews out of production analytics and avoid external requests.
(() => {
    if (!['tiecluudongcandy.site', 'www.tiecluudongcandy.site'].includes(location.hostname)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-MC1FG3JGZG');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MC1FG3JGZG';
    document.head.appendChild(script);
})();
