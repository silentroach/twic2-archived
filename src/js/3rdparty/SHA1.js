/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Modified by Kalashnikov Igor
 */

var SHA1 = { };

/**
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */

/**
 * @const
 * @private
 */
SHA1.chrsz_ = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode */

/**
 * Determine the appropriate additive constant for the current iteration
 * @private
 */
SHA1.sha1_kt_ = function(t) {
	return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
};

/**
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 * @private
 */
SHA1.core_sha1_ = function(x, len) {
	/* append padding */
	x[len >> 5] |= 0x80 << (24 - len % 32);
	x[((len + 64 >> 9) << 4) + 15] = len;

	var
		w = new Array(80),
		a = 1732584193,
		b = -271733879,
		c = -1732584194,
		d = 271733878,
		e = -1009589776,
		olda, oldb, oldc, oldd, olde, j, i, t;

	/**
	 * Perform the appropriate triplet combination function for the current
	 * iteration
	 */
	function sha1_ft(t, b, c, d) {
		if (t < 20) {
			return (b & c) | ((~b) & d);
		}

		if (t < 40) {
			return b ^ c ^ d;
		}

		if (t < 60) {
			return (b & c) | (b & d) | (c & d);
		}

		return b ^ c ^ d;
	}

	/**
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y) {
		var
			lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);

		return (msw << 16) | (lsw & 0xFFFF);
	}

	/**
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	for (i = 0; i < x.length; i += 16) {
		olda = a;
		oldb = b;
		oldc = c;
		oldd = d;
		olde = e;

		for (j = 0; j < 80; j++) {
			if (j < 16) {
				w[j] = x[i + j];
			} else {
				w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
			}

			t = safe_add(
				safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
				safe_add(safe_add(e, w[j]), SHA1.sha1_kt_(j))
			);

			e = d;
			d = c;
			c = rol(b, 30);
			b = a;
			a = t;
		}

		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
		e = safe_add(e, olde);
	}

	return new Array(a, b, c, d, e);
};

/**
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 * @private
 * @param {string} str String
 * @return {Array}
 */
SHA1.str2binb_ = function(str) {
	var
		bin = [],
		mask = (1 << SHA1.chrsz_) - 1,
		i;

	for(i = 0; i < str.length * SHA1.chrsz_; i += SHA1.chrsz_) {
		bin[i>>5] |= (str.charCodeAt(i / SHA1.chrsz_) & mask) << (32 - SHA1.chrsz_ - i%32);
	}

	return bin;
};

/**
 * Calculate the HMAC-SHA1 of a key and some data
 * @private
 * @param {string} key Key
 * @param {string} data Data
 * @return {string}
 */
SHA1.core_hmac_sha1_ = function(key, data) {
	var
		bkey = SHA1.str2binb_(key),
		ipad = new Array(16),
		opad = new Array(16),
		i;

	if (bkey.length > 16) {
		bkey = SHA1.core_sha1_(bkey, key.length * SHA1.chrsz_);
	}

	for(i = 0; i < 16; i++) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5C5C5C5C;
	}

	return SHA1.core_sha1_(opad.concat(SHA1.core_sha1_(ipad.concat(SHA1.str2binb_(data)), 512 + data.length * SHA1.chrsz_)), 512 + 160);
};

/**
 * Convert an array of big-endian words to a base-64 string
 * @private
 * @return {string}
 */
SHA1.binb2b64_ = function(binarray) {
	var
		TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		// ---
		str = "",
		triplet, i, j;

	for(i = 0; i < binarray.length * 4; i += 3) {
		triplet =
			(((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
			| (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8 )
			| ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);

		for (j = 0; j < 4; j++) {
			if (i * 8 + j * 6 > binarray.length * 32) {
				str += '=';
			} else {
				str += TAB.charAt((triplet >> 6 * (3 - j)) & 0x3F);
			}
		}
	}

	return str;
};

/**
 * Encode
 * @param {string} key Key
 * @param {string} data Data
 * @return {string}
 */
SHA1.encode = function(key, data) {
	return SHA1.binb2b64_(SHA1.core_hmac_sha1_(key, data));
};

