const https = require('https');

function getRequestOptions(path, method, dataToSend) {
	return {
		hostname: 'api.sms4free.co.il',
		path: path,
		method: method,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'User-Agent': 'node ' + process.version,
			'Content-Length': Buffer.byteLength(dataToSend),
		},
	};
}

function sendRequest(dataToSend, options) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = '';

			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				if (res.statusCode !== 200) {
					reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
					return;
				}
				resolve(data);
			});
		});

		req.on('error', reject);

		req.write(dataToSend);
		req.end();
	});
}

class SMSProvider {
	constructor(options) {
		this.key = options['key'];
		this.user = options['user'];
		this.pass = options['pass'];
		this.sender = options['sender'];
	}

	async getBalance() {
		return await SMSProvider.getBalance({ ...this });
	}

	async sendSMS(phoneNumber, message, throwOnBadResponse = true) {
		return await SMSProvider.sendSMS(phoneNumber, message, {
			...this,
			throwOnBadResponse
		});
	}

	static async sendSMS(phoneNumber, message, options) {
		try {
			const throwOnBadResponse = options['throwOnBadResponse'] || true;
			const dataToSend = JSON.stringify({
				key: options['key'],
				user: options['user'],
				pass: options['pass'],
				sender: options['sender'],
				recipient: phoneNumber,
				msg: message,
			});

			const request = getRequestOptions('/ApiSMS/SendSMS', 'POST', dataToSend);

			let response = await sendRequest(dataToSend, request);
			response = parseInt(response);

			if (throwOnBadResponse === true && response <= 0)
				throw new Error(SMSProvider.getErrorMessage(response));

			return response;
		} catch (error) {
			error.message = `Failed to send SMS: ${error.message}`;
			throw error;
		}
	}

	static async getBalance(options) {
		try {
			const dataToSend = JSON.stringify({
				key: options['key'],
				user: options['user'],
				pass: options['pass'],
			});

			const request = getRequestOptions('/ApiSMS/AvailableSMS', 'POST', dataToSend);

			const response = await sendRequest(dataToSend, request);
			return parseInt(response);
		} catch (error) {
			error.message = `Failed to get SMS balance: ${error.message}`;
			console.log(error.stack)
			throw error;
		}
	}

	static getErrorMessage(code) {
		if (code > 0)
			return undefined;
		switch (code) {
			case 0:
				return "שגיאה כללית";
			case -1:
				return "מפתח, שם משתמש או סיסמה שגויים";
			case -2:
				return "שם או מספר שולח ההודעה שגוי";
			case -3:
				return "לא נמצאו נמענים";
			case -4:
				return "לא ניתן לשלוח הודעה, יתרת הודעות פנויות נמוכה";
			case -5:
				return "הודעה לא מתאימה";
			case -6:
				return "צריך לאמת מספר שולח";
			default:
				return "unknown error";
		}
	}
}

module.exports = SMSProvider;