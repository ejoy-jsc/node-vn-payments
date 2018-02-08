// Type definitions for vn-payments 1.0.1
// Project: node-vn-payments
// Definitions by: Nau Studio team <dev@naustud.io>

/**
 * SimpleSchema from <code>simpl-schema</code> npm package
 */
declare class SimpleSchema {}

/**
 * This is the base class for OnePay's domestic and intl payment gateways
 * which bear the common hashing algorithym.
 *
 * It should not be used alone.
 *
 * @private
 */
declare class OnePay {
	/**
	 * OnePay configSchema
	 * @type {SimpleSchema}
	 */
	static configSchema: SimpleSchema;
	/**
	 * '2'
	 * @type {string}
	 */
	static VERSION: string;
	/**
	 * 'pay'
	 * @type {string}
	 */
	static COMMAND: string;
	/**
	 * onepay only support 'VND'
	 * @type {string}
	 */
	static CURRENCY_VND: string;
	/**
	 * 'en'
	 * @type {string}
	 */
	static LOCALE_EN: string;
	/**
	 * 'vn'
	 * @type {string}
	 */
	static LOCALE_VN: string;

	/**
	 * @param  {OnePayConfig} config check OnePay.configSchema for data type requirements
	 * @return {void}
	 */
	constructor(config: onepay.OnePayConfig, type?: string);

	/**
	 * Build checkout URL to redirect to the payment gateway. <br>
	 *
	 * Hàm xây dựng url để redirect qua OnePay gateway, trong đó có tham số mã hóa (còn gọi là public key).
	 *
	 * @param  {OnePayCheckoutPayload} payload Object that contains needed data for the URL builder, refer to typeCheck object above
	 * @return {Promise<URL>} buildCheckoutUrl promise
	 */
	buildCheckoutUrl(payload: onepay.OnePayCheckoutPayload): Promise<URL>;

	/**
	 * Validate checkout payload against specific schema. Throw ValidationErrors if invalid against checkoutSchema
	 * Build the schema in subclass.
	 * @param {OnePayCheckoutPayload} payload
	 */
	validateCheckoutPayload(payload: onepay.OnePayCheckoutPayload): void;

	/**
	 * Return default checkout Payloads
	 * @return {OnePayCheckoutPayload} default payloads
	 */
	checkoutPayloadDefaults: onepay.OnePayCheckoutPayload;

	/**
	 * Verify return query string from OnePay using enclosed vpc_SecureHash string
	 *
	 * Hàm thực hiện xác minh tính đúng đắn của các tham số trả về từ OnePay Payment
	 *
	 * @param  {object} query Query data object from GET handler (`response.query`)
	 * @return {Promise<OnePayDomesticReturnObject>} Normalized return data object, with additional fields like isSuccess
	 */
	verifyReturnUrl(query: object): Promise<onepay.OnePayDomesticReturnObject>;
}

/**
 * OnePay Domestic payment gateway helper.
 *
 * Supports VN domestic ATM cards.
 *
 * @extends OnePay
 */
declare class OnePayDomestic extends OnePay {
	/**
	 *
	 * @param {*} responseCode Responde code from gateway
	 * @param {*} locale Same locale at the buildCheckoutUrl. Note, 'vn' for Vietnamese
	 * @return {string} Localized status string from the response code
	 */
	static getReturnUrlStatus(responseCode: Object, locale: string): string;

	/**
	 * Instantiate a OnePayDomestic checkout helper
	 *
	 * @param  {Object} config check OnePay.configSchema for data type requirements
	 * @return {void}
	 */
	constructor(config: onepay.OnePayConfig);

	/**
	 *
	 * @param {OnePayCheckoutPayload} payload
	 * @override
	 */
	validateCheckoutPayload(payload: onepay.OnePayCheckoutPayload): void;

	/**
	 * @return {OnePayCheckoutPayload} default payload object
	 */
	checkoutPayloadDefaults: onepay.OnePayCheckoutPayload;

	/**
	 * Verify return query string from OnePay using enclosed vpc_SecureHash string
	 *
	 * Hàm thực hiện xác minh tính đúng đắn của các tham số trả về từ onepay Payment
	 *
	 * @param {*} query
	 * @returns { Promise<OnePayDomesticReturnObject> }
	 */
	verifyReturnUrl(query: Promise<onepay.OnePayDomesticReturnObject>): Promise<onepay.OnePayDomesticReturnObject>;
}

export { OnePayDomestic };

declare namespace onepay {
	export interface OnePayConfig {
		/**
		 *
		 */
		accessCode: string;
		/**
		 * Gateway URL provided by payment provider
		 */
		paymentGateway: string;
		/**
		 *
		 */
		secureSecret: string;
	}
	export interface OnePayCheckoutPayload {
		/**
		 * optional: true, max: 64, regEx: urlRegExp
		 */
		againLink?: string;

		/**
		 * The amount to be paid.<br> Khoản tiền cần thanh toán. max: 9999999999
		 */
		amount: number;
		/**
		 * optional: true, max: 64
		 */
		billingCity?: string;
		/**
		 * optional: true, max: 2
		 */
		billingCountry?: string;
		/**
		 * optional: true, max: 64
		 */
		billingPostCode?: string;
		/**
		 * optional: true, max: 64
		 */
		billingStateProvince?: string;
		/**
		 * optional: true, max: 64
		 */
		billingStreet?: string;
		/**
		 * max: 15
		 */
		clientIp: string;
		/**
		 * allowedValues: ['VND']
		 */
		currency: string;
		/**
		 * optional: true, max: 24, regEx: SimpleSchema.RegEx.Email
		 */
		customerEmail?: string;
		/**
		 * optional: true, max: 64
		 */
		customerId?: string;
		/**
		 * optional: true, max: 16
		 */
		customerPhone?: string;
		/**
		 * optional: true, max: 64
		 */
		deliveryAddress?: string;
		/**
		 * optional: true, max: 64
		 */
		deliveryCity?: string;
		/**
		 * optional: true, max: 8
		 */
		deliveryCountry?: string;
		/**
		 * optional: true, max: 64
		 */
		deliveryProvince?: string;
		/**
		 * allowedValues: ['vn', 'en']
		 */
		locale: string;
		/**
		 * max: 32
		 */
		orderId: string;
		/**
		 * max: 255, regEx: urlRegExp. <br>
		 * NOTE: returnURL is documented with 64 chars limit but seem not a hard limit, and 64 is too few in some scenar
		 */
		returnUrl: string;
		/**
		 * optional: true, max: 255. <br>
		 * NOTE: no max limit documented for this field, this is just a safe val
		 */
		title?: string;
		/**
		 * max: 34
		 */
		transactionId: string;
		/**
		 * max: 8
		 */
		vpcAccessCode?: string;
		/**
		 * max: 16
		 */
		vpcCommand: string;
		/**
		 * max: 16
		 */
		vpcMerchant?: string;
		/**
		 * max: 2
		 */
		vpcVersion?: string;
	}
	export interface OnePayDomesticReturnObject {
		/**
		 * whether the payment succeeded or not
		 */
		isSuccess: boolean;
		/**
		 * amount paid by customer, already divided by 100
		 */
		amount: number;
		/**
		 * should be same with checkout request
		 */
		command: string;
		/**
		 * currency code, should be same with checkout request
		 */
		currencyCode: string;
		/**
		 * Gateway's own transaction ID, used to look up at Gateway's side
		 */
		gatewayTransactionNo: string;
		/**
		 * locale code, should be same with checkout request
		 */
		locale: string;
		/**
		 * merchant ID, should be same with checkout request
		 */
		merchant: string;
		/**
		 * Approve or error message based on response code
		 */
		message: string;
		/**
		 * merchant's order ID, should be same with checkout request
		 */
		orderId: string;
		/**
		 * response code, payment has errors if it is non-zero
		 */
		responseCode: string;
		/**
		 * checksum of the returned data, used to verify data integrity
		 */
		secureHash: string;
		/**
		 * merchant's transaction ID, should be same with checkout request
		 */
		transactionId: string;
		/**
		 * should be same with checkout request
		 */
		version: string;
		/**
		 * e.g: 970436
		 */
		vpc_AdditionData?: string;
		/**
		 * e.g: 1000000
		 */
		vpc_Amount?: string;
		/**
		 * e.g: pay
		 */
		vpc_Command?: string;
		/**
		 * e.g: VND
		 */
		vpc_CurrencyCode?: string;
		/**
		 * e.g: vn
		 */
		vpc_Locale?: string;
		/**
		 * e.g: ONEPAY
		 */
		vpc_Merchant?: string;
		/**
		 * e.g: TEST_15160802610161733380665
		 */
		vpc_MerchTxnRef?: string;
		/**
		 * e.g: TEST_15160802610161733380665
		 */
		vpc_OrderInfo?: string;
		/**
		 * e.g: B5CD330E2DC1B1C116A068366F69717F54AD77E1BE0C40E4E3700551BE9D5004
		 */
		vpc_SecureHash?: string;
		/**
		 * e.g: 1618136
		 */
		vpc_TransactionNo?: string;
		/**
		 * e.g: 0
		 */
		vpc_TxnResponseCode?: string;
		/**
		 * e.g: 2
		 */
		vpc_Version?: string;
	}
}

/**
 * Ngan Luong payment gateway helper.
 * Supports VN domestic ATM cards.
 *
 * Hàm hỗ trợ thanh toán qua Ngân Lượng
 *
 */
declare class NganLuong {
	/**
	 * NganLuong configSchema
	 */
	static configSchema: SimpleSchema;

	/**
	 * NganLuong dataSchema
	 */
	static dataSchema: SimpleSchema;

	/**
	 * NganLuong API Version
	 */
	static VERSION: string;

	/**
	 * NganLuong API command string
	 */
	static COMMAND: string;

	/**
	 * NganLuong VND currency code
	 */
	static CURRENCY_VND: string;

	/**
	 * NganLuong English locale code
	 */
	static LOCALE_EN: string;

	/**
	 * NganLuong Vietnamese locale code
	 */
	static LOCALE_VN: string;

	/**
	 * Instantiate a NganLuong checkout helper
	 * <br>
	 * Khởi tạo hàm thanh toán NganLuong
	 *
	 * @param  {Object} config check NganLuong.configSchema for data type requirements <br> Xem NganLuong.configSchema để biết yêu cầu kiểu dữ liệu
	 * @return {void}
	 */
	constructor(config: nganluong.NganLuongConfig);

	/**
	 * Build checkoutUrl to redirect to the payment gateway
	 * <br>
	 * Hàm xây dựng url để redirect qua NganLuong gateway, trong đó có tham số mã hóa (còn gọi là public key)
	 *
	 * @param  {NganLuongCheckoutPayload} payload Object that contains needed data for the URL builder, refer to typeCheck object above <br> Đối tượng chứa các dữ liệu cần thiết để thiết lập đường dẫn.
	 * @return {Promise<URL>} buildCheckoutUrl promise
	 */
	buildCheckoutUrl(payload: nganluong.NganLuongCheckoutPayload): Promise<URL>;

	/**
	 * Validate checkout payload against specific schema. Throw ValidationErrors if invalid against checkoutSchema
	 * <br>
	 * Kiểm tra tính hợp lệ của dữ liệu thanh toán dựa trên một cấu trúc dữ liệu cụ thể. Hiển thị lỗi nếu không hợp lệ với checkoutSchema.
	 *
	 * @param {NganLuongCheckoutPayload} payload
	 */
	validateCheckoutPayload(payload: nganluong.NganLuongCheckoutPayload): void;

	/**
	 * @return {NganLuongCheckoutPayload} default payload object
	 */
	checkoutPayloadDefaults: nganluong.NganLuongCheckoutPayload;

	/**
	 * Verify return query string from NganLuong using enclosed vnp_SecureHash string
	 * <br>
	 * Hàm thực hiện xác minh tính đúng đắn của các tham số trả về từ nganluong Payment
	 *
	 * @param  {Object} query Query data object from GET handler (`response.query`) <br> Dữ liệu được trả về từ GET handler (`response.query`)
	 * @return {Promise<nganluong.NganLuongReturnObject>}
	 */
	verifyReturnUrl(query: object): Promise<nganluong.NganLuongReturnObject>;
}

export { NganLuong };

declare namespace nganluong {
	export interface NganLuongConfig {
		/**
		 * NganLuong payment gateway (API Url to send payment request)
		 */
		paymentGateway: string;
		/**
		 * NganLuong merchant id
		 */
		merchant: string;
		/**
		 * NganLuong receiver email, who will receive the money (usually is merchant email)
		 */
		receiverEmail: string;
		/**
		 * NganLuong merchant secret string
		 */
		secureSecret: string;
	}

	export interface NganLuongCheckoutPayload {
		/**
		 * optional: true
		 */
		createdDate?: string;
		/**
		 *   The payment mount
		 */
		amount: number;
		/**
		 *  optional: true, max: 16
		 */
		clientIp?: string;
		/**
		 *   allowedValues: ['vnd', 'VND', 'USD', 'usd']
		 */
		currency: string;
		/**
		 *   optional: true, max: 255
		 */
		billingCity?: string;
		/**
		 *   optional: true, max: 255
		 */
		billingCountry?: string;
		/**
		 *   optional: true, max: 255
		 */
		billingPostCode?: string;
		/**
		 *   optional: true, max: 255
		 */
		billingStateProvince?: string;
		/**
		 *   optional: true, max: 255
		 */
		billingStreet?: string;
		/**
		 *   optional: true, max: 255
		 */
		customerId?: string;
		/**
		 *   optional: true, max: 255
		 */
		deliveryAddress?: string;
		/**
		 *   optional: true, max: 255
		 */
		deliveryCity?: string;
		/**
		 *   optional: true, max: 255
		 */
		deliveryCountry?: string;
		/**
		 *   optional: true, max: 255
		 */
		deliveryProvince?: string;
		/**
		 *   allowedValues: ['vi', 'en']
		 */
		locale: string;
		/**
		 *   max: 34
		 */
		orderId: string;
		/**
		 *   max: 255, regEx: SimpleSchema.RegEx.Email
		 */
		receiverEmail: string;
		/**
		 *   allowedValues: ['NL', 'VISA', 'ATM_ONLINE', 'ATM_OFFLINE', 'NH_OFFLINE', 'TTVP', 'CREDIT_CARD_PREPAID', 'IB_ONLINE']
		 */
		paymentMethod: string;
		/**
		 *   max: 50
		 */
		bankCode: string;
		/**
		 *   optional: true, allowedValues: ['1', '2']
		 */
		paymentType?: string;
		/**
		 *   optional: true, max: 500
		 */
		orderInfo?: string;
		/**
		 *   Integer, optional: true
		 */
		taxAmount?: number;
		/**
		 *  Integer, optional: true
		 */
		discountAmount?: number;
		/**
		 *  Integer, optional: true
		 */
		feeShipping?: number;
		/**
		 *  max: 255, regEx: SimpleSchema.RegEx.Email
		 */
		customerEmail: string;
		/**
		 *   max: 255
		 */
		customerPhone: string;
		/**
		 *   max: 255
		 */
		customerName: string;
		/**
		 *   max: 255
		 */
		returnUrl: string;
		/**
		 *   max: 255, optional: true
		 */
		cancelUrl?: string;
		/**
		 *   Integer, optional: true; minutes
		 */
		timeLimit?: number;
		/**
		 *  max: 255, optional: true
		 */
		affiliateCode?: string;
		/**
		 *   optional: true
		 */
		totalItem?: string;
		/**
		 *   max: 40
		 */
		transactionId: string;
		/**
		 *   max: 32
		 */
		nganluongSecretKey: string;
		/**
		 *   max: 16
		 */
		nganluongMerchant: string;
		/**
		 *   max: 32
		 */
		nganluongCommand: string;
		/**
		 *   max: 3
		 */
		nganluongVersion: string;
		/**
		 *   regEx: SimpleSchema.RegEx.Url
		 */
		paymentGateway: string;
		/**
		 *
		 */
		merchant: string;
		/**
		 *
		 */
		secureSecret: string;
	}

	export interface NganLuongReturnObject {
		/**
		 * whether the payment succeeded or not
		 */
		isSuccess: boolean;
		/**
		 * Approve or error message based on response code
		 */
		message: string;
		/**
		 * merchant ID, should be same with checkout request
		 */
		merchant: string;
		/**
		 * merchant's transaction ID, should be same with checkout request
		 */
		transactionId: string;
		/**
		 * amount paid by customer
		 */
		amount: string;
		/**
		 * order info, should be same with checkout request
		 */
		orderInfo: string;
		/**
		 * response code, payment has errors if it is non-zero
		 */
		responseCode: string;
		/**
		 * bank code of the bank where payment was occurred
		 */
		bankCode: string;
		/**
		 * Gateway's own transaction ID, used to look up at Gateway's side
		 */
		gatewayTransactionNo: string;
		/**
		 * e.g: '00'
		 */
		error_code: string;
		/**
		 * e.g: '43614-fc2a3698ee92604d5000434ed129d6a8'
		 */
		token: string;
		/**
		 * e.g: ''
		 */
		description: string;
		/**
		 * e.g: '00'
		 */
		transaction_status: string;
		/**
		 * e.g: 'tung.tran@naustud.io'
		 */
		receiver_email: string;
		/**
		 * e.g: 'adidas'
		 */
		order_code: string;
		/**
		 * e.g: '90000'
		 */
		total_amount: string;
		/**
		 * e.g: 'ATM_ONLINE'
		 */
		payment_method: string;
		/**
		 * e.g: 'BAB'
		 */
		bank_code: string;
		/**
		 * e.g: '2'
		 */
		payment_type: string;
		/**
		 * e.g: 'Test'
		 */
		order_description: string;
		/**
		 * e.g: '0'
		 */
		tax_amount: string;
		/**
		 * e.g: '0'
		 */
		discount_amount: string;
		/**
		 * e.g: '0'
		 */
		fee_shipping: string;
		/**
		 * e.g: 'http%3A%2F%2Flocalhost%3A8080%2Fpayment%2Fnganluong%2Fcallback'
		 */
		return_url: string;
		/**
		 * e.g: 'http%3A%2F%2Flocalhost%3A8080%2F'
		 */
		cancel_url: string;
		/**
		 * e.g: 'Nguyen Hue'
		 */
		buyer_fullname: string;
		/**
		 * e.g: 'tu.nguyen@naustud.io'
		 */
		buyer_email: string;
		/**
		 * e.g: '0948231723'
		 */
		buyer_mobile: string;
		/**
		 * e.g: 'TEst'
		 */
		buyer_address: string;
		/**
		 * e.g: ''
		 */
		affiliate_code: string;
		/**
		 * e.g: '19563733'
		 */
		transaction_id: string;
	}
}

/**
 * SohaPay payment gateway helper.
 * NOTE: Our test card deprecated, so we couldn't test this gateway thoroughly.
 *
 * Hàm hỗ trợ thanh toán qua SohaPay
 * Lưu ý: Thẻ thanh toán dùng thử của chúng tôi đã hết được hỗ trợ nên chúng tôi không thể kiểm tra hoàn toàn cổng thanh toán này
 *
 */
declare class SohaPay {
	/**
	 * SohaPay configSchema
	 */
	static configSchema: SimpleSchema;

	/**
	 * SohaPay dataSchema
	 */
	static checkoutSchema: SimpleSchema;

	/**
	 * SohaPay API Version
	 */
	static VERSION: string;

	/**
	 * SohaPay English locale code
	 */
	static LOCALE_EN: string;

	/**
	 * SohaPay Vietnamese locale code
	 */
	static LOCALE_VN: string;

	/**
	 * Instantiate a SohaPay checkout helper
	 * <br>
	 * Khởi tạo hàm thanh toán SohaPay
	 *
	 * @param  {Object} config check SohaPay.configSchema for data type requirements <br> Xem SohaPay.configSchema để biết yêu cầu kiểu dữ liệu
	 * @return {void}
	 */
	constructor(config: sohapay.SohaPayConfig);

	/**
	 * Build checkoutUrl to redirect to the payment gateway
	 * <br>
	 * Hàm xây dựng url để redirect qua SohaPay gateway, trong đó có tham số mã hóa (còn gọi là public key)
	 *
	 * @param  {NganLuongCheckoutPayload} payload Object that contains needed data for the URL builder, refer to typeCheck object above <br> Đối tượng chứa các dữ liệu cần thiết để thiết lập đường dẫn.
	 * @return {Promise<URL>} buildCheckoutUrl promise
	 */
	buildCheckoutUrl(payload: sohapay.SohaPayCheckoutPayload): Promise<URL>;

	/**
	 * Validate checkout payload against checkoutSchema. Throw ValidationErrors if invalid.
	 * <br>
	 * Kiểm tra tính hợp lệ của dữ liệu thanh toán dựa trên một cấu trúc dữ liệu cụ thể. Hiển thị lỗi nếu không hợp lệ.
	 * @param {SohaPayCheckoutPayload} payload
	 */
	validateCheckoutPayload(payload: sohapay.SohaPayCheckoutPayload): Promise<URL>;

	/**
	 * @return {SohaPayCheckoutPayload} default payload object
	 */
	checkoutPayloadDefaults: sohapay.SohaPayCheckoutPayload;

	/**
	 * Verify return query string from SohaPay using enclosed secureCode string
	 * <br>
	 *
	 * Hàm thực hiện xác minh tính đúng đắn của các tham số trả về từ SohaPay Payment
	 *
	 * @param  {Object} query Query data object from GET handler (`response.query`)  <br> Dữ liệu được trả về từ GET handler (`response.query`)
	 * @return {Promise<sohapay.SohaPayReturnObject>}
	 */
	verifyReturnUrl(query: object): Promise<sohapay.SohaPayReturnObject>;
}

export { SohaPay };

declare namespace sohapay {
	export interface SohaPayConfig {
		/**
		 * SohaPay merchant id
		 */
		merchantCode: string;
		/**
		 * SohaPay payment gateway (API Url to send payment request)
		 */
		paymentGateway: string;
		/**
		 * NganLuong merchant secret string
		 */
		secureSecret: string;
	}

	export interface SohaPayCheckoutPayload {
		/**
		 *  max: 16
		 */
		language: string;

		/**
		 *  max: 34
		 */
		orderId: string;

		/**
		 * regEx: SimpleSchema.RegEx.Url
		 * max: 24
		 */
		customerEmail: string;

		/**
		 * max: 15
		 */
		customerPhone: string;

		/**
		 * max: 255
		 */
		returnUrl: string;

		/**
		 * max: 9999999999
		 */
		amount: number;

		/**
		 * max: 1
		 */
		paymentType: string;

		/**
		 * max: 8
		 */
		siteCode: string;

		/**
		 * max: 255
		 */
		transactionInfo: string;

		/**
		 * max: 1
		 */
		version: string;

		/**
		 * optional: true
		 * max: 2
		 */
		locale?: string;

		/**
		 * optional: true
		 * max: 4
		 */
		currency?: string;

		/**
		 * optional: true
		 * max: 64
		 */
		billingCity?: string;

		/**
		 * optional: true
		 * max: 2
		 */
		billingCountry?: string;

		/**
		 * optional: true
		 * max: 64
		 */
		billingPostCode?: string;

		/**
		 * optional: true
		 * max: 64
		 */
		billingStateProvince?: string;

		/**
		 * optional: true
		 * max: 64
		 */
		billingStreet?: string;

		/**
		 * optional: true
		 * max: 255
		 */
		deliveryAddress?: string;

		/**
		 * optional: true
		 * max: 255
		 */
		deliveryCity?: string;

		/**
		 * optional: true
		 * max: 255
		 */
		deliveryCountry?: string;

		/**
		 * optional: true
		 * max: 255
		 */
		deliveryProvince?: string;

		/**
		 * optional: true
		 * max: 15
		 */
		clientIp?: string;

		/**
		 * optional: true
		 * max: 40
		 */
		transactionId?: string;

		/**
		 * optional: true
		 * max: 40
		 */
		customerId?: string;
	}

	export interface SohaPayReturnObject {
		/**
		 * whether the payment succeeded or not
		 */
		isSuccess: boolean;

		/**
		 *
		 */
		message: string;

		/**
		 * transaction id
		 */
		transactionId: string;

		/**
		 *  customer email
		 */
		orderEmail: string;

		/**
		 *  session token came from SohaPay
		 */
		orderSession: string;

		/**
		 *  amount paid by customer
		 */
		amount: string;

		/**
		 * unique code assigned by SohaPay for merchant
		 */
		siteCode: string;

		/**
		 * response status code of SohaPay
		 */
		responseCode: string;

		/**
		 * description of the payment
		 */
		transactionInfo: string;
		/**
		 * response message from SohaPay
		 */
		responseMessage: string;

		/**
		 * checksum of the returned data, used to verify data integrity
		 */
		secureCode: string;

		/**
		 *  Error text returned from SohaPay Gateway
		 *  e.g: 'Giao dịch thanh toán bị huỷ bỏ'
		 */
		error_text: string;

		/**
		 * e.g: 'node-2018-01-19T131933.811Z'
		 */
		order_code: string;

		/**
		 *  e.g: 'dev@naustud.io'
		 */
		order_email: string;

		/**
		 * e.g: 'd3bdef93fa01cd37f7e426fa25f5d1a0'
		 */
		order_session: string;

		/**
		 * e.g: '90000'
		 */
		price: string;

		/**
		 * e.g: 'test'
		 */
		site_code: string;

		/**
		 * e.g: 'Thanh toan giay adidas'
		 */
		transaction_info: string;

		/**
		 * e.g: FC5283C6B93C1D8F9A9329293DA38FFC3204FA6CE75661972419DAA6E5A1B7B5
		 */
		secure_code: string;
	}
}
