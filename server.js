const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const logger = require('morgan');

const rfs = require('rotating-file-stream');
const fs = require('fs');

const app = express();

// ENV Config
dotenv.config({ path: path.resolve(__dirname, 'client/config/.env.' + process.env.NODE_ENV) });

// Ensure log directory exists
let dirLog = path.join(__dirname, './logs');
fs.existsSync(dirLog) || fs.mkdirSync(dirLog)

// Create a rotating write stream
let accessLogStream = rfs.createStream('access.log', {
	interval: '1d', // rotate daily
	path: dirLog
});

// Setup the logger
app.use(logger('combined', { stream: accessLogStream }));

// Allow Cross-Origin
app.use(cors())

// Public Folder
app.use(express.static('public'));

// Meta Data
const axios = require('axios');
const cryptojs = require('crypto-js');

const webclientData = async (req) => {
	let hostdata = req.headers.host.split(':');
	let hostname = (hostdata[0] !== '127.0.0.1') ? hostdata[0].split(".") : hostdata[0];

	if (hostdata[0] !== '127.0.0.1') {
		let firstname = hostname[0].toLowerCase();
		let secondname = (hostname[1]) ? hostname[1].toLowerCase() : '';

		if (process.env.REACT_APP_WHITELIST.split(',').indexOf(firstname) >= 0) {
			return false;
		} else {
			if (['www', 'app', 'app-v2'].indexOf(firstname) >= 0 && process.env.REACT_APP_WHITELIST.split(',').indexOf(secondname) >= 0) {
				return false;
			} else {
				let subdomain = false;
				if (hostname.length > 2) {
					if (firstname === 'www') {
						subdomain = false;
					} else {
						subdomain = true;
					}
				}

				let query = { subdomain: subdomain, keyword: hostname.join('.') };
				return axios.get(`${process.env.REACT_APP_URL_API}/domain/list`, { params: query })
					.then(function (response) {
						return response.data;
					})
					.catch(function (error) {
						let msg = { error: true, message: error.message };
						if (error.response) Object.assign(msg, error.response.data);

						return msg;
					});
			}
		}
	} else {
		return false;
	}
}

const prepHTML = (data, { title, favicon, meta, head }) => {
	data = data.replace(/<title>[\s\S]*?<\/title>/, '<title>' + title + '<\/title>');
	data = data.replace('/favicon.ico', favicon);
	data = data.replace('""</script>', `"${meta}"</script>`);
	// data = data.replace('</head>', `${head}</head>`);

	return data;
}

const universalLoader = async (req, res) => {
	// const baseURL = req.protocol + '://' + req.headers.host;
	const filePath = path.resolve(__dirname, 'public', 'index.html');

	let webclient = await webclientData(req);
	fs.readFile(filePath, 'utf8', async (err, htmlData) => {
		const encryptData = (webclient && webclient.data) ? webclient.data[0] : false;

		let title = "", favicon = "";

		let hostdata = req.headers.host.split(':');
		let hostname = (hostdata[0] !== '127.0.0.1') ? hostdata[0].split(".") : hostdata[0];

		let domainname = false;
		if (hostdata[0] !== '127.0.0.1') {
			let firstname = hostname[0].toLowerCase();
			let secondname = (hostname[1]) ? hostname[1].toLowerCase() : '';

			if (process.env.REACT_APP_WHITELIST.split(',').indexOf(firstname) >= 0) {
				domainname = false;
			} else {
				if (['www', 'app', 'app-v2'].indexOf(firstname) >= 0 && process.env.REACT_APP_WHITELIST.split(',').indexOf(secondname) >= 0) {
					domainname = false;
				} else {
					domainname = true
				}
			}
		}

		if (!domainname) {
			title = "Socialindex App";
			favicon = "/favicon.ico";
		}

		console.log('-----------------------------------------')
		console.log(hostname, title)
		console.log('DATA', encryptData)

		if (encryptData) {
			title = (encryptData.title) ? encryptData.title : title;
			favicon = (encryptData.logo) ? process.env.REACT_APP_URL_API + '/images/' + encryptData.logo : favicon;
		}

		// Form the final HTML response
		const html = prepHTML(htmlData, {
			title: title,
			favicon: favicon,
			meta: (encryptData) ? cryptojs.AES.encrypt(JSON.stringify(encryptData), process.env.REACT_APP_API_ENCRYPT) : '',
			// head: htmlMetaTags(metaTags)
		});

		// Up, up, and away...
		res.send(html);
	})
}

const mcache = require('memory-cache');
const cache = (duration) => {
	return (req, res, next) => {
		let hostdata = req.headers.host.split(':');
		let hostname = (hostdata[0] !== '127.0.0.1') ? hostdata[0].split(".") : hostdata[0];

		if (hostdata[0] !== '127.0.0.1') {
			let firstname = hostname[0].toLowerCase();
			let secondname = (hostname[1]) ? hostname[1].toLowerCase() : '';

			if (process.env.REACT_APP_WHITELIST.split(',').indexOf(firstname) >= 0) {
				hostname = 'localhost';
			} else {
				if (['www', 'app', 'app-v2'].indexOf(firstname) >= 0 && process.env.REACT_APP_WHITELIST.split(',').indexOf(secondname) >= 0) {
					hostname = 'localhost';
				} else {
					hostname = hostname.join('.');
				}
			}
		}
		
		let key = '__express__' + hostname + req.originalUrl || req.url
		let cachedBody = mcache.get(key)
		if (cachedBody) {
			res.send(cachedBody)
			return
		} else {
			res.sendResponse = res.send
			res.send = (body) => {
				mcache.put(key, body, duration * 1000);
				res.sendResponse(body)
			}
			next()
		}
	}
}

app.get('*', cache(10), universalLoader)

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// })

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));