	const fetch = require('node-fetch');
	module.exports.handler = async (event) => {
	    try {
	        const { url, format } = JSON.parse(event.body || '{}');
	        if (!url) {
	            return {
	                statusCode: 400,
	                body: JSON.stringify({ error: 'No URL provided' })
	            };
	        }
	        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
	        const data = await response.json();
	        let videoUrl = '';
	        switch(format) {
	            case 'watermark':
	                videoUrl = data.data.wmplay;
	                break;
	            case 'no_watermark':
	                videoUrl = data.data.play;
	                break;
	            case 'mp3':
	                videoUrl = data.data.music;
	                break;
	            default:
	                return { statusCode: 400, body: JSON.stringify({ error: 'Invalid format' }) };
	        }
	        return {
	            statusCode: 200,
	            headers: {
	                'Content-Type': 'application/json',
	                'Access-Control-Allow-Origin': '*'
	            },
	            body: JSON.stringify({
	                success: true,
	                url: videoUrl,
	                format: format
	            })
	        };
	    } catch (error) {
	        console.error('Download error:', error);
	        return {
	            statusCode: 500,
	            body: JSON.stringify({ 
	                success: false,
	                error: error.message || 'Internal server error'
	            })
	        };
	    }
	};
