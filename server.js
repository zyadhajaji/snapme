	const express = require('express');
	const cors = require('cors');
	const bodyParser = require('body-parser');
	const app = express();
	app.use(cors());
	app.use(bodyParser.json());
	app.post('/.netlify/functions/download', async (req, res) => {
	  try {
	    const { url, option } = req.body;
	    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
	    const data = await response.json();
	    let videoLink = '';
	    if (option === 'hd') {
	      videoLink = data.data.play;
	    } else if (option === 'watermark') {
	      videoLink = data.data.wmplay;
	    } else if (option === 'mp3') {
	      videoLink = data.data.music;
	    }
	    res.json({ link: videoLink });
	  } catch (error) {
	    res.status(500).json({ error: 'Failed to fetch video' });
	  }
	});
	app.listen(8888);
