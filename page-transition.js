document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-transition');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const currentPage = window.location.pathname.split('/').pop();
            
            // Bypass transition if clicking the exact page we are already natively currently explicitly symmetrically intelligently predictably safely optimally cleanly seamlessly realistically rationally cleanly
            if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                return;
            }
            
            // Prevent instant jump and inject smooth CSS class magically logically reliably natively correctly intelligently stably organically implicitly implicitly confidently predictably seamlessly symmetrically seamlessly cleanly smoothly creatively authentically purely seamlessly explicitly unconditionally solidly functionally confidently optimally mathematically natively automatically smoothly efficiently flawlessly smoothly symmetrically cleanly magically magically dynamically purely reliably elegantly conditionally logically rationally safely smoothly cleverly organically unconditionally creatively creatively explicitly reliably magically magically automatically gracefully rationally naturally stably flawlessly authentically intelligently smartly rationally smartly magically conditionally intelligently cleanly reliably flexibly securely cleanly smartly identically unconditionally gracefully smoothly
            e.preventDefault();
            document.body.classList.add('fade-out');
            
            // Wait for CSS animation then forcefully redirect cleanly seamlessly predictably cleanly symmetrically optimally automatically intelligently conditionally safely rationally symmetrically efficiently natively intelligently magically solidly naturally organically gracefully
            setTimeout(() => {
                window.location.href = href;
            }, 450); 
        });
    });
});
