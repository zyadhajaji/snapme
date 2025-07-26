	const fetch = require('node-fetch');
	const { getVideoInfo, simulateAd } = require('ssssnap-api');
	module.exports.handler = async (event) => {
	  try {
	    const { url, format } = JSON.parse(event.body || '{}');
	    if (!url) {
	      return {
	        statusCode: 400,
	        body: JSON.stringify({ error: 'No URL provided' })
	      };
	    }
	    let videoData;
	    switch(format) {
	      case 'watermark':
	        videoData = await getVideoInfo(url);
	        break;
	      case 'no_watermark':
	        const adToken = await simulateAd();
	        videoData = await getVideoInfo(url, {
	          quality: '4k',
	          token: adToken,
	          remove_watermark: true
	        });
	        break;
	      case 'mp3':
	        videoData = await getVideoInfo(url, { format: 'mp3' });
	        break;
	      default:
	        return {
	          statusCode: 400,
	          body: JSON.stringify({ error: 'Invalid format' })
	        };
	    }
	    return {
	      statusCode: 200,
	      headers: {
	        'Content-Type': 'application/json',
	        'Access-Control-Allow-Origin': '*',
	        'Cache-Control': 'no-cache, no-store, must-revalidate'
	      },
	      body: JSON.stringify({
	        success: true,
	        url: videoData.url,
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