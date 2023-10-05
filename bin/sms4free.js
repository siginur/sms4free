#!/usr/bin/env node

const sms4free = require('./../index.js');
const fs = require('fs');

const args = process.argv.slice(2);

// Define default values
let command = null;
let key = null;
let user = null;
let pass = null;
let sender = null;
let number = null;
let message = null;
let configFile = null;
let help = false;

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
	const arg = args[i];
	if (arg === 'balance' || arg === 'send') {
		command = arg;
	}
	else if (arg === '-h' || arg === '--help') {
		help = true;
	}
	else if (arg === '-k' || arg === '--key') {
		key = args[i + 1];
		i++;
	}
	else if (arg === '-u' || arg === '--user') {
		user = args[i + 1];
		i++;
	}
	else if (arg === '-p' || arg === '--pass') {
		pass = args[i + 1];
		i++;
	}
	else if (arg === '-s' || arg === '--sender') {
		sender = args[i + 1];
		i++;
	}
	else if (arg === '-n' || arg === '--number') {
		number = args[i + 1];
		i++;
	}
	else if (arg === '-m' || arg === '--message') {
		message = args[i + 1];
		i++;
	}
	else if (arg === '-o' || arg === '--options') {
		configFile = args[i + 1];
		i++;
	}
}

if (help === true) {
	console.log('Usage: sms4free [command] [args]');
	console.log('Commands:');
	console.log('  balance            Check account balance');
	console.log('  send               Send an SMS');
	console.log('Arguments:');
	console.log('  -k, --key          API key');
	console.log('  -u, --user         User ID');
	console.log('  -p, --pass         Password');
	console.log('  -s, --sender       Sender name');
	console.log('  -n, --number       Recipient phone number (required for "send" command)');
	console.log('  -m, --message      SMS message (required for "send" command)');
	console.log('  --options          Path to JSON configuration file');
	console.log('Note:');
	console.log('  - You can use --key, --user, --pass, --sender arguments or --options argument, but not both');
	console.log('Examples:');
	console.log('  sms4free balance -k API_KEY -u USER_ID -p PASSWORD -s SENDER');
	console.log('  sms4free balance --options config.json');
	return
}

try {
	if (!command)
		throw new Error('Command is missing');
	if (configFile && (key || user || pass || sender))
		throw new Error('Cannot use both configuration file and command line configurations');
	if (!configFile && !(key && user && pass && sender))
		throw new Error('Missing configuration parameters');
} catch (error) {
	console.error(error.message);
	return;
}

// Function to read configuration from a JSON file
async function readConfigFromFile(configFile) {
	try {
		const data = await fs.promises.readFile(configFile, 'utf8');
		const config = JSON.parse(data);
		return config;
	} catch (error) {
		throw new Error(`Error reading configuration file: ${error.message}`);
	}
}

// Main function
async function main() {
	let options;
	if (configFile)
		options = await readConfigFromFile(configFile);
	else
		options = { key, user, pass, sender };

	switch (command) {
		case 'balance': {
			return await sms4free.getBalance(options);
		}
		case 'send': {
			if (!number || !message)
				throw new Error('Missing number and/or message');
			return await sms4free.sendSMS(number, message, options);
		}
	}
}

main()
	.then((response) => {
		console.log(response);
	})
	.catch((error) => {
		console.error(error.message);
	});

