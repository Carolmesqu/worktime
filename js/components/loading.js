export function Loading() {
    return `
        <div class="loading-overlay">
            <div class="loading-spinner">
                <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="25" fill="none" stroke="url(#gradient)" stroke-width="4" stroke-linecap="round">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 30 30"
                            to="360 30 30"
                            dur="1s"
                            repeatCount="indefinite"/>
                    </circle>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
                <p>Carregando...</p>
            </div>
        </div>
    `;
}
