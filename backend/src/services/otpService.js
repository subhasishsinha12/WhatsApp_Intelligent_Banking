const { OTPModel } = require('../models');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (mobile, purpose = 'login') => {
  const otp = process.env.DEMO_MODE === 'true' ? '123456' : generateOTP();

  await OTPModel.create(mobile, otp, purpose);

  // In production, this would call WhatsApp API or SMS gateway
  console.log(`[OTP Service] OTP for ${mobile}: ${otp} (Purpose: ${purpose})`);

  // Simulate sending
  if (process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true') {
    console.log(`[DEMO] OTP sent to ${mobile}: ${otp}`);
  }

  return { success: true, message: `OTP sent to ${mobile}`, demo_otp: process.env.DEMO_MODE === 'true' ? otp : undefined };
};

const verifyOTP = async (mobile, otp, purpose = 'login') => {
  const isValid = await OTPModel.verify(mobile, otp, purpose);
  return isValid;
};

module.exports = { sendOTP, verifyOTP };
