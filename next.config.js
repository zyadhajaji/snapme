	const withTM = require('next-transpile-modules')(['ssssnap-api']);
	module.exports = withTM({
	  images: {
	    domains: ['www.tikwm.com', 'pagead2.googlesyndication.com'],
	    unoptimized: ['*.webp']
	  },
	  async headers() {
	    return [
	      {
	        source: '/(.*)',
	        headers: [
	          { key: 'X-Content-Type-Options', value: 'nosniff' },
	          { key: 'X-Frame-Options', value: 'DENY' },
	          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
	        ]
	      }
	    ];
	  },
	  async redirects() {
	    return [
	      {
	        source: '/download',
	        destination: '/api/download',
	        permanent: false
	      }
	    ];
	  }
	});