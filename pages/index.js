	import { useState, useEffect } from 'react';
	import styles from '../styles/Home.module.css';
	export default function Home() {
	  const [url, setUrl] = useState('');
	  const [showOptions, setShowOptions] = useState(false);
	  const [downloadStatus, setDownloadStatus] = useState({
	    loading: false,
	    error: null,
	    success: null
	  });
	  const handleDownload = async (format) => {
	    setDownloadStatus({ loading: true, error: null, success: null });
	    try {
	      const response = await fetch('/.netlify/functions/download', {
	        method: 'POST',
	        headers: {
	          'Content-Type': 'application/json',
	          'Netlify-Function-Name': 'download'
	        },
	        body: JSON.stringify({ url, format })
	      });
	      const data = await response.json();
	      if (!response.ok) throw new Error(data.error || 'Download failed');
	      window.open(data.url, '_blank');
	      setDownloadStatus({ loading: false, success: true });
	    } catch (error) {
	      setDownloadStatus({ loading: false, error: error.message });
	    }
	  };
	  return (
	    <div className={styles.container}>
	      <header className={styles.header}>
	        <h1 className={styles.title}>TikTok Downloader</h1>
	        <div className={styles.inputWrapper}>
	          <input
	            type="url"
	            value={url}
	            onChange={(e) => setUrl(e.target.value)}
	            placeholder="Paste TikTok video URL..."
	            className={styles.input}
	            onKeyPress={(e) => e.key === 'Enter' && setShowOptions(true)}
	          />
	          <button
	            onClick={() => setShowOptions(!showOptions)}
	            className={styles.toggleButton}
	          >
	            {showOptions ? 'Hide Options' : 'Show Options'}
	          </button>
	        </div>
	      </header>
	      {showOptions && (
	        <div className={styles.optionsContainer}>
	          <button
	            onClick={(e) => handleDownload('watermark')}
	            className={clsx(styles.optionButton, styles.watermark)}
	            disabled={downloadStatus.loading}
	          >
	            {downloadStatus.loading ? 'Processing...' : 'Download with Watermark'}
	          </button>
	          <button
	            onClick={(e) => handleDownload('no_watermark')}
	            className={clsx(styles.optionButton, styles.hd)}
	            disabled={downloadStatus.loading}
	          >
	            {downloadStatus.loading ? 'Watching Ad...' : '4K No Watermark (30s Ad)'}
	          </button>
	          <button
	            onClick={(e) => handleDownload('mp3')}
	            className={clsx(styles.optionButton, styles.mp3)}
	            disabled={downloadStatus.loading}
	          >
	            {downloadStatus.loading ? 'Processing...' : 'MP3 Audio'}
	          </button>
	        </div>
	      )}
	      {downloadStatus.error && (
	        <div className={styles.errorBanner}>
	          ⚠️ {downloadStatus.error}
	        </div>
	      )}
	      <div className={styles.adContainer}>
	        {/* AdSense Container */}
	        <ins className="adsbygoogle"
	             style={{ display: 'block' }}
	             data-ad-client="ca-pub-1234567890123456"
	             data-ad-slot="1234567890"
	             data-ad-format="auto"
	             data-full-width-responsive="true"></ins>
	        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
	      </div>
	      <section className={styles.features}>
	        <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
	        <div className={styles.featureGrid}>
	          <div className={styles.featureCard}>
	            <h3>⚡ Fast Downloads</h3>
	            <p>Direct links without redirects</p>
	          </div>
	          <div className={styles.featureCard}>
	            <h3>🎧 MP3 Support</h3>
	            <p>High-quality audio extraction</p>
	          </div>
	          <div className={styles.featureCard}>
	            <h3>📱 Mobile-First</h3>
	            <p>Optimized for iOS/Android</p>
	          </div>
	        </div>
	      </section>
	      <footer className={styles.footer}>
	        <p>© 2024 TikTok Downloader. All rights reserved.</p>
	      </footer>
	    </div>
	  );
	}