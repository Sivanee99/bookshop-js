# bookshop-js

A simple book store API in need of input validation/sanitization.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:

- [Go](https://github.com/andey-robins/bookshop-go)
- [Rust](https://github.com/andey-robins/bookshop-rs)

## Versioning

`bookshop-js` is built with:

- node version v16.19.0
- npm version 9.6.2
- nvm version 0.39.3

## Usage

Start the api using `npm run dev`

I recommend using [`httpie`](https://httpie.io) for testing of HTTP endpoints on the terminal. Tutorials are available elsewhere online, and you're free to use whatever tools you deem appropriate for testing your code.

## Security Review

## Security Concerns:
	->Auditability- The code does not have any meausre in place to monitor security breaches that might occur such as unauthorized access attempts. Mitigation practices for this concern can include the following:

		- By using a centralized input validation mechanism, the input validation process may be made uniform and centralized throughout the API.
		-Logging and monitoring should be put into place in order to keep track of any efforts to get around the input validation requirements. 
		-Using a version control system, the input validation rules should be managed and tracked. As a result, developers will be able to keep track of any adjustments made to the input validation rules over time and offer an audit trail of any changes.

	->Availability- Due to the lack of error handling, the server may crash if a user makes a number of bad requests.An attacker may flood the API with invalid or malformed data, causing the input validation mechanism to become overwhelmed and unresponsive. The following practices can be considered to mitigate this issue:

		-To make sure that any erroneous data is rejected and that the user receives the proper error messages, proper error handling should be put into place. This will make it easier to maintain the API's accessibility and responsiveness to user queries.
		-Automated testing can assist in ensuring input validation is available by immediately identifying any problems with the validation method.
		-By restricting the number of queries users may send at once, rate limiting can help to assure the availability of input validation. Denial of service (DoS) attacks may be avoided in this way, and all users will continue to be able to access and use the API.

## Problems Faced

	->Difficulties resulting from duplicate data were observed.Duplicate data generated inconsistent data, which resulted in errors and inconsistent answers from the API.
	These security vulnerabilities can be exploited by attackers to launch attacks like SQL injection or cross-site scripting or to introduce malicious data.
	->The code leads to the site crashing when improper data is given as an input. For example, if the number '1' is the data associated with a parameter like CID and if 
	the user were to imput '2', the site crashes.


## Bugs spotted
	
	In the purchaseOrders file, the number of place holders did not match with the number of parameters in 
	the query string for createPurchaseOrder function.