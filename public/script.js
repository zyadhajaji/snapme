	let adTimer = null;
	let downloadFormat = 'watermark';
	function showOptions() {
	    const options = document.getElementById('options');
	    options.style.display = options.style.display === 'none' ? 'block' : 'none';
	}
	function updateStatus(message, type = 'info') {
	    const status = document.getElementById('status');
	    status.className = `status ${type}`;
	    status.textContent = message;
	    setTimeout(() => {
	        status.className = 'status';
	    }, 5000);
	}
	function simulateAd() {
	    return new Promise((resolve) => {
	        adTimer = setTimeout(resolve, 3000);
	        document.getElementById('adContainer').classList.add('active');
	    });
	}
	async function download(format) {
	    const url = document.getElementById('urlInput').value.trim();
	    if (!url) {
	        updateStatus('Please enter a TikTok URL', 'error');
	        return;
	    }
	    try {
	        updateStatus('Processing...', 'info');
	        document.getElementById('adContainer').classList.remove('active');
	        if (format === 'no_watermark') {
	            await simulateAd();
	        }
	        const response = await fetch('/.netlify/functions/download', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	            },
	            body: JSON.stringify({ url, format })
	        });
	        const data = await response.json();
	        if (!response.ok) {
	            throw new Error(data.error || 'Download failed');
	        }
	        window.open(data.url, '_blank');
	        updateStatus('Download started!', 'success');
	    } catch (error) {
	        updateStatus(error.message || 'Download failed', 'error');
	        console.error('Download error:', error);
	    }
	}
	// Close ad when user clicks outside
	document.addEventListener('click', (e) => {
	    const adContainer = document.getElementById('adContainer');
	    if (adContainer.contains(e.target)) return;
	    adContainer.classList.remove('active');
	});
	// Cleanup timer if user leaves page
	window.addEventListener('beforeunload', () => {
	    if (adTimer) clearTimeout(adTimer);
	});
