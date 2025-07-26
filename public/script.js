// Global variables
	// Add this at the top
	const FAQ_ANIMATION_DURATION = 300;
	function showOptions() {
	  const url = document.getElementById('tiktokUrl').value.trim();
	  const optionsBox = document.getElementById('downloadOptions');
	  const adContainer = document.getElementById('adContainer');
	  if (url === '') {
	    showNotification('Please paste a TikTok link first');
	    return;
	  }
	  if (!optionsBox.style.display || optionsBox.style.display === 'none') {
	    optionsBox.style.display = 'block';
	    adContainer.style.display = 'none';
	  } else {
	    optionsBox.style.display = 'none';
	  }
	}
	function downloadOption(option) {
	  const url = document.getElementById('tiktokUrl').value.trim();
	  if (!url) {
	    showNotification('Please paste a TikTok link first');
	    return;
	  }
	  const downloadBtn = event.target;
	  const originalText = downloadBtn.textContent;
	  downloadBtn.textContent = 'Processing...';
	  downloadBtn.disabled = true;
	  fetch('/.netlify/functions/download', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ url, option })
	  })
	  .then(response => response.json())
	  .then(data => {
	    if (data.success && data.link) {
	      if (option === 'hd') {
	        showAd(data.link);
	      } else {
	        window.open(data.link, '_blank');
	      }
	    } else {
	      showNotification(data.error || 'Error fetching video.');
	    }
	  })
	  .catch(error => {
	    console.error('Download error:', error);
	    showNotification('Something went wrong.');
	  })
	  .finally(() => {
	    downloadBtn.textContent = originalText;
	    downloadBtn.disabled = false;
	  });
	}
	function showAd(videoLink) {
	  const adContainer = document.getElementById('adContainer');
	  const skipBtn = document.getElementById('skipAdBtn');
	  // Reset previous ad state
	  if (adContainer.style.display !== 'none') {
	    adContainer.style.display = 'none';
	  }
	  // Initialize new ad
	  adContainer.style.display = 'block';
	  adContainer.dataset.videoLink = videoLink;
	  // Ad timer
	  let adTimer = setTimeout(() => {
	    completeAd(adTimer, videoLink);
	  }, 30000);
	  // Skip button handler
	  skipBtn.style.display = 'inline-block';
	  skipBtn.onclick = () => completeAd(adTimer, videoLink);
	}
	function completeAd(timer, videoLink) {
	  clearTimeout(timer);
	  document.getElementById('adContainer').style.display = 'none';
	  window.open(videoLink, '_blank');
	}
	// FAQ System
	document.addEventListener('DOMContentLoaded', () => {
	  document.querySelectorAll('.faq-item').forEach(item => {
	    const question = item.querySelector('h3');
	    const content = item.querySelector('p');
	    question.addEventListener('click', () => {
	      const isActive = item.classList.toggle('active');
	      content.style.maxHeight = isActive ? 
	        content.scrollHeight + 'px' : '0';
	    });
	  });
	  // Show more FAQs
	  document.querySelector('.show-more-btn').addEventListener('click', () => {
	    document.querySelectorAll('.hidden-faq').forEach(item => {
	      item.classList.remove('hidden-faq');
	      item.style.maxHeight = item.scrollHeight + 'px';
	    });
	    document.querySelector('.show-more-btn').style.display = 'none';
	  });
	});
	function showNotification(message) {
	  // Notification implementation remains the same
	  // ... (keep your existing notification code)
	}
let adTimer;
let skipTimer;
function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');
  if (url === '') {
    // Use a more user-friendly notification instead of alert
    showNotification('Please paste a TikTok link first.');
    return;
  }
  optionsBox.style.display = 'block';
}
async function downloadOption(option) {
  const url = document.getElementById('tiktokUrl').value.trim();
  if (!url) {
    showNotification('Please paste a TikTok link first.');
    return;
  }
  try {
    // Show loading state
    const downloadBtn = event.target;
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Processing...';
    downloadBtn.disabled = true;
    const response = await fetch('/.netlify/functions/download', {  // Updated URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option })
    });
    const data = await response.json();
    // Reset button state
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
    if (data.success && data.link) {
      if (option === 'hd') {
        // Show ad for 4K download
        showAd(data.link);
      } else {
        // Direct download for other options
        window.open(data.link, '_blank');
      }
    } else {
      showNotification(data.error || 'Error fetching video.');
    }
  } catch (err) {
    console.error(err);
    showNotification('Something went wrong.');
    // Reset button state in case of error
    const downloadBtn = event.target;
    downloadBtn.textContent = 'Download';
    downloadBtn.disabled = false;
  }
}
function showAd(videoLink) {
  const adContainer = document.getElementById('adContainer');
  const skipBtn = document.getElementById('skipAdBtn');
  // Show ad container
  adContainer.style.display = 'block';
  // Set video link as data attribute
  adContainer.dataset.videoLink = videoLink;
  // Start ad timer (30 seconds)
  adTimer = setTimeout(() => {
    // Hide ad container
    adContainer.style.display = 'none';
    // Open video link
    window.open(videoLink, '_blank');
  }, 30000);
  // Show skip button after 10 seconds
  setTimeout(() => {
    skipBtn.style.display = 'inline-block';
  }, 10000);
}
function skipAd() {
  // Clear the ad timer
  clearTimeout(adTimer);
  // Get the video link from the container
  const videoLink = document.getElementById('adContainer').dataset.videoLink;
  // Hide the ad container
  document.getElementById('adContainer').style.display = 'none';
  // Open the video link
  window.open(videoLink, '_blank');
}
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}
function showMoreFAQs() {
  const hiddenItems = document.querySelectorAll('.hidden-faq');
  hiddenItems.forEach(item => {
    item.style.display = 'block';
  });
  document.querySelector('.show-more-btn').style.display = 'none';
}
// Modern notification function instead of using alerts
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#FFD700';
    notification.style.color = '#000';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(notification);
  }
  // Set message and show notification
  notification.textContent = message;
  notification.style.opacity = '1';
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 3000);
}
	// FAQ System
	document.addEventListener('DOMContentLoaded', () => {
	  const faqItems = document.querySelectorAll('.faq-item');
	  faqItems.forEach(item => {
	    const question = item.querySelector('h3');
	    const answer = item.querySelector('p');
	    question.addEventListener('click', () => {
	      item.classList.toggle('active');
	      answer.style.maxHeight = item.classList.contains('active') 
	        ? answer.scrollHeight + 'px' 
	        : '0';
	    });
	  });
	  // Show more FAQs
	  const showMoreBtn = document.querySelector('.show-more-btn');
	  if (showMoreBtn) {
	    showMoreBtn.addEventListener('click', () => {
	      document.querySelectorAll('.hidden-faq').forEach(item => {
	        item.style.display = 'block';
	        item.style.maxHeight = item.scrollHeight + 'px';
	      });
	      showMoreBtn.style.display = 'none';
	    });
	  }
	});
	// Ad Performance Tracking
	window.addEventListener('load', () => {
	  const ads = document.querySelectorAll('.adsbygoogle');
	  ads.forEach(ad => {
	    setTimeout(() => {
	      if (window.adsbygoogle) {
	        window.adsbygoogle.push({});
	      }
	    }, 1000);
	  });
	});
