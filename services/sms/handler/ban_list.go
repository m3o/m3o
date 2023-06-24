package handler

var (
	// crude impression prevention
	BanFrom = []string{
		"Amazon",
		"Google",
		"Paypal",
		"Facebook",
		"Microsoft",
		"Twilio",
		"Stripe",
		"Apple",
		"Uber",
		"Deliveroo",
	}

	// ban certain words
	BanWords = []string{
		"cannabis",
		"canabis",
		"drugs",
		"paypal",
		"bank",
		"crypto",
		"loan",
		"debt",
		"cbd",
		"gambling",
		"casino",
		"sex",
		"hate",
		"fuck",
		"alcohol",
		"tobacco",
		"smoke",
		"gun",
		"marijuana",
	}
)
