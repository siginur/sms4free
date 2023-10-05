# sms4free
sms4free is a Node.js library that simplifies sending SMS messages and getting SMS balance using the [sms4free.co.il](https://sms4free.co.il) service.

## Installation

You can install this package using npm:

```bash
npm install sms4free
```

## Usage

To use sms4free, you need to require and create an instance of the class with your sms4free.co.il API credentials. Then, you can call its methods to send SMS messages and get the SMS balance.

```javascript
const SMSProvider = require('sms4free');

const smsProvider = new SMSProvider({
    key: "your-api-key",
    user: "your-username",
    pass: "your-password",
    sender: "your-sender-name"
});

// Send an SMS
smsProvider.sendSMS('1234567890', 'Hello, World!')
  .then(response => console.log(`SMS sent with response code: ${response}`))
  .catch(error => console.error(`Error: ${error.message}`));

// Get SMS balance
smsProvider.getBalance()
  .then(balance => console.log(`Current balance: ${balance}`))
  .catch(error => console.error(`Error: ${error.message}`));
```

Or you can use static methods and pass the credentials as last parameter:
```javascript
const SMSProvider = require('sms4free');

await SMSProvider.sendSMS('1234567890', 'Hello, World!', options)
await SMSProvider.getBalance(options)
```

### Methods
`sendSMS(phoneNumber, message, throwOnBadResponse)`

Sends an SMS message to the specified phone number.

- phoneNumber (String): The recipient's phone number.
- message (String): The SMS message content.
- throwOnBadResponse (Boolean, optional): Set to false if you want to handle bad responses without throwing an error. Defaults to true.

Returns a Promise that resolves with the response code from the API or rejects with an error.

`getBalance()`

Retrieves the SMS balance for your account.

Returns a Promise that resolves with the balance or rejects with an error.


`getErrorMessage(code)`

Retrieves the error message for the specified response code.
Can be used when `throwOnBadResponse` is set to false and you want to handle the error yourself.

- code (Number): The response code from the API.

Returns a String with the error message for the specified response code.

## License

This project is licensed under the MIT License - see the LICENSE file for details.