(function() {
    // Create a loader element
    const loader = document.createElement('div');
    loader.className = 'd-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light';
    loader.style.zIndex = 9999;
    loader.style.opacity = 1;
    loader.style.transition = 'opacity .4s ease';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border';
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    
    loader.appendChild(spinner);
    document.body.appendChild(loader);

    // Hide loader once content is fully loaded
    window.addEventListener('load', () => {
        loader.style.opacity = 0;
        loader.style.pointerEvents = 'none';
    });
})();
