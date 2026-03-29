package com.pragati.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final SmsService smsService;

    // Structure: MobileNumber -> OtpDetails (OTP and Expiry time)
    private final ConcurrentHashMap<String, OtpDetails> otpCache = new ConcurrentHashMap<>();

    // 5 minutes expiry limit
    private final long OTP_VALIDITY_DURATION = 5 * 60 * 1000;

    public void generateAndSendOtp(String mobileNumber) {
        // Generate robust 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        OtpDetails details = new OtpDetails(otp, System.currentTimeMillis() + OTP_VALIDITY_DURATION);
        
        // Save to temporary memory mapped by mobile number
        otpCache.put(mobileNumber, details);

        // Initiate external SMS
        smsService.sendOtp(mobileNumber, otp);
    }

    public boolean verifyOtp(String mobileNumber, String otp) {
        if (!otpCache.containsKey(mobileNumber)) {
            return false; // OTP not generated or missing
        }
        OtpDetails details = otpCache.get(mobileNumber);
        
        // Time verification check
        if (System.currentTimeMillis() > details.expiryTime) {
            otpCache.remove(mobileNumber); // Expire proactively
            return false;
        }

        // Exact match verification
        if (details.otp.equals(otp)) {
            otpCache.remove(mobileNumber); // Invalidate OTP after first successful usage (no reuse)
            return true;
        }

        return false;
    }

    // Helper Record
    private static class OtpDetails {
        String otp;
        long expiryTime;

        public OtpDetails(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
