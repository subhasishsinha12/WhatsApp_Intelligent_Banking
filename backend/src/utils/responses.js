// Multilingual message templates for English, Hindi, and Gujarati

const MESSAGES = {
  WELCOME: {
    en: `🏦 *Welcome to WhatsApp Banking!*\n\nPlease select your preferred language:\n\n1️⃣ English\n2️⃣ हिंदी (Hindi)\n3️⃣ ગુજરાતી (Gujarati)`,
    hi: `🏦 *WhatsApp Banking में आपका स्वागत है!*\n\nकृपया अपनी भाषा चुनें:\n\n1️⃣ English\n2️⃣ हिंदी (Hindi)\n3️⃣ ગુજรાતી (Gujarati)`,
    gu: `🏦 *WhatsApp બેન્કિંગમાં આપનું સ્વાગત છે!*\n\nકૃપા કરીને આપની ભાષા પસંદ કરો:\n\n1️⃣ English\n2️⃣ हिंदी (Hindi)\n3️⃣ ગુજરાતી (Gujarati)`,
  },

  CUSTOMER_TYPE: {
    en: `Are you an existing customer or new to our bank?\n\n1️⃣ Existing Customer\n2️⃣ New Customer\n3️⃣ General Enquiry`,
    hi: `क्या आप हमारे मौजूदा ग्राहक हैं या नए हैं?\n\n1️⃣ मौजूदा ग्राहक\n2️⃣ नया ग्राहक\n3️⃣ सामान्य पूछताछ`,
    gu: `શું આપ અમારા હાલના ગ્રાહક છો કે નવા છો?\n\n1️⃣ હાલના ગ્રાહક\n2️⃣ નવા ગ્રાહક\n3️⃣ સામાન્ય પૂછપરછ`,
  },

  AUTH_MOBILE_PROMPT: {
    en: `📱 Please enter your registered mobile number:`,
    hi: `📱 कृपया अपना पंजीकृत मोबाइल नंबर दर्ज करें:`,
    gu: `📱 કૃપા કરી આपका નોંધાયેલ મોબાઇલ નંબર દાખલ કરો:`,
  },

  AUTH_OTP_SENT: {
    en: (mobile) => `✅ OTP sent to ${mobile.substring(0,2)}XXXXX${mobile.substring(7)}.\n\n🔐 Please enter the 6-digit OTP:`,
    hi: (mobile) => `✅ OTP भेजा गया ${mobile.substring(0,2)}XXXXX${mobile.substring(7)} पर।\n\n🔐 कृपया 6 अंकों का OTP दर्ज करें:`,
    gu: (mobile) => `✅ OTP મોકલવામાં આવ્યો ${mobile.substring(0,2)}XXXXX${mobile.substring(7)} પર.\n\n🔐 કૃપા કરી 6 અંકનો OTP દાખલ કરો:`,
  },

  AUTH_SUCCESS: {
    en: (name) => `✅ *Authentication Successful!*\n\nWelcome back, *${name}*! 👋`,
    hi: (name) => `✅ *प्रमाणीकरण सफल!*\n\nफिर से स्वागत है, *${name}*! 👋`,
    gu: (name) => `✅ *ઓળખ ચકાસણી સફળ!*\n\nફરી સ્વાગત છે, *${name}*! 👋`,
  },

  AUTH_FAILED: {
    en: `❌ Invalid OTP. Please try again or type *RESEND* for a new OTP.`,
    hi: `❌ अमान्य OTP। कृपया पुनः प्रयास करें या नए OTP के लिए *RESEND* टाइप करें।`,
    gu: `❌ અયોગ્ય OTP. ફરી પ્રયાસ કરો અથવા નવા OTP માટે *RESEND* ટાઇપ કરો.`,
  },

  MOBILE_NOT_FOUND: {
    en: `❌ Mobile number not found in our records. Please check and try again, or type *NEW* to register as a new customer.`,
    hi: `❌ यह मोबाइल नंबर हमारे रिकॉर्ड में नहीं मिला। कृपया जांचें या नए ग्राहक के रूप में पंजीकरण के लिए *NEW* टाइप करें।`,
    gu: `❌ આ મોબાઇલ નંબર અમારા રેકોર્ડમાં મળ્યો નથી. ફરી ચકાસો અથવા નોંધણી માટે *NEW* ટાઇપ કરો.`,
  },

  MAIN_MENU: {
    en: `🏦 *MAIN MENU*\n\n1️⃣ Account Services\n2️⃣ Loans\n3️⃣ Deposits & Investments\n4️⃣ NRI Banking\n5️⃣ Cards\n6️⃣ Insurance\n7️⃣ Offers & Campaigns\n8️⃣ Branch Support\n9️⃣ Talk to RM\n0️⃣ Exit\n\nReply with a number to continue.`,
    hi: `🏦 *मुख्य मेनू*\n\n1️⃣ खाता सेवाएं\n2️⃣ ऋण\n3️⃣ जमा और निवेश\n4️⃣ NRI बैंकिंग\n5️⃣ कार्ड\n6️⃣ बीमा\n7️⃣ ऑफर और अभियान\n8️⃣ शाखा सहायता\n9️⃣ RM से बात करें\n0️⃣ बाहर निकलें\n\nजारी रखने के लिए नंबर से उत्तर दें।`,
    gu: `🏦 *મુખ્ય મેનૂ*\n\n1️⃣ ખાતા સેવાઓ\n2️⃣ લોન\n3️⃣ થાપણ અને રોકાણ\n4️⃣ NRI બેંકિંગ\n5️⃣ કાર્ડ\n6️⃣ વીમો\n7️⃣ ઓફર અને અભિયાન\n8️⃣ શાખા સહાય\n9️⃣ RM સાથે વાત\n0️⃣ બહાર નીકળો\n\nઆગળ વધવા નંબર લખો.`,
  },

  ACCOUNT_SERVICES: {
    en: `💼 *ACCOUNT SERVICES*\n\n1️⃣ Balance Enquiry\n2️⃣ Mini Statement\n3️⃣ Fund Transfer\n4️⃣ Account Statement\n5️⃣ Update Details\n0️⃣ Back to Main Menu`,
    hi: `💼 *खाता सेवाएं*\n\n1️⃣ बैलेंस पूछताछ\n2️⃣ मिनी स्टेटमेंट\n3️⃣ फंड ट्रांसफर\n4️⃣ खाता विवरण\n5️⃣ विवरण अपडेट करें\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `💼 *ખાતા સેવાઓ*\n\n1️⃣ બેલેન્સ પૂછપરછ\n2️⃣ મિની સ્ટેટમેન્ટ\n3️⃣ ફંડ ટ્રાન્સફર\n4️⃣ ખાતા વિવરણ\n5️⃣ વિગત અપડેટ\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  LOANS_MENU: {
    en: `💰 *LOAN PRODUCTS*\n\nWe offer these loan products:\n\n1️⃣ Home Loan (from 8.50% p.a.)\n2️⃣ Auto Loan (from 9.25% p.a.)\n3️⃣ Education Loan (from 8.15% p.a.)\n4️⃣ Personal Loan (from 10.50% p.a.)\n0️⃣ Back to Main Menu`,
    hi: `💰 *ऋण उत्पाद*\n\nहम ये ऋण प्रदान करते हैं:\n\n1️⃣ होम लोन (8.50% प्रति वर्ष से)\n2️⃣ ऑटो लोन (9.25% प्रति वर्ष से)\n3️⃣ शिक्षा ऋण (8.15% प्रति वर्ष से)\n4️⃣ व्यक्तिगत ऋण (10.50% प्रति वर्ष से)\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `💰 *લોન પ્રોડક્ટ્સ*\n\nઅમે આ લોન ઓફર કરીએ છીએ:\n\n1️⃣ હોમ લોન (8.50% p.a. થી)\n2️⃣ ઓટો લોન (9.25% p.a. થી)\n3️⃣ શિક્ષણ લોન (8.15% p.a. થી)\n4️⃣ વ્યક્તિગત લોન (10.50% p.a. થી)\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  DEPOSITS_MENU: {
    en: `🏛️ *DEPOSITS & INVESTMENTS*\n\n1️⃣ Fixed Deposit (7.25% p.a.)\n2️⃣ Recurring Deposit\n3️⃣ Savings Account\n4️⃣ Mutual Funds\n0️⃣ Back to Main Menu`,
    hi: `🏛️ *जमा और निवेश*\n\n1️⃣ सावधि जमा (7.25% प्रति वर्ष)\n2️⃣ आवर्ती जमा\n3️⃣ बचत खाता\n4️⃣ म्यूचुअल फंड\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `🏛️ *થાપણ અને રોકાณ*\n\n1️⃣ ફિક્સ્ડ ડિપોઝિટ (7.25% p.a.)\n2️⃣ રિકરિંગ ડિપોઝિટ\n3️⃣ બચત ખાતું\n4️⃣ મ્યુચ્યુઅલ ફંડ\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  NRI_MENU: {
    en: `🌏 *NRI BANKING SERVICES*\n\n1️⃣ NRE Account\n2️⃣ NRO Account\n3️⃣ FCNR Deposit\n4️⃣ NRI Home Loan\n5️⃣ Talk to NRI Desk\n0️⃣ Back to Main Menu`,
    hi: `🌏 *NRI बैंकिंग सेवाएं*\n\n1️⃣ NRE खाता\n2️⃣ NRO खाता\n3️⃣ FCNR जमा\n4️⃣ NRI होम लोन\n5️⃣ NRI डेस्क से बात\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `🌏 *NRI બેંકિંગ સેવાઓ*\n\n1️⃣ NRE ખાતું\n2️⃣ NRO ખાતું\n3️⃣ FCNR ડિપોઝિટ\n4️⃣ NRI હોમ લોન\n5️⃣ NRI ડેસ્ક સાથે વાત\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  CARDS_MENU: {
    en: `💳 *CARDS SERVICES*\n\n1️⃣ Check Card Limit\n2️⃣ Apply for Credit Card\n3️⃣ Block/Unblock Card\n4️⃣ Card Statement\n5️⃣ Reward Points\n0️⃣ Back to Main Menu`,
    hi: `💳 *कार्ड सेवाएं*\n\n1️⃣ कार्ड सीमा जांचें\n2️⃣ क्रेडिट कार्ड के लिए आवेदन करें\n3️⃣ कार्ड ब्लॉक/अनब्लॉक करें\n4️⃣ कार्ड स्टेटमेंट\n5️⃣ रिवॉर्ड पॉइंट\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `💳 *કાર્ડ સેવાઓ*\n\n1️⃣ કાર્ડ મર્યાદા તપાસ\n2️⃣ ક્રેડિટ કાર્ડ અરજી\n3️⃣ કાર્ડ બ્લોક/અનબ્લોક\n4️⃣ કાર્ડ સ્ટેટમેન્ટ\n5️⃣ રિવોર્ડ પોઈન્ટ\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  INSURANCE_MENU: {
    en: `🛡️ *INSURANCE PRODUCTS*\n\n1️⃣ Life Insurance\n2️⃣ Health Insurance\n3️⃣ Auto Insurance\n4️⃣ Home Insurance\n0️⃣ Back to Main Menu`,
    hi: `🛡️ *बीमा उत्पाद*\n\n1️⃣ जीवन बीमा\n2️⃣ स्वास्थ्य बीमा\n3️⃣ वाहन बीमा\n4️⃣ गृह बीमा\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `🛡️ *વીમા ઉત્પાદો*\n\n1️⃣ જીવન વીમો\n2️⃣ આરોગ્ય વીમો\n3️⃣ વાહન વીમો\n4️⃣ ઘર વીમો\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  BRANCH_SUPPORT: {
    en: `🏢 *BRANCH SUPPORT*\n\n1️⃣ Find Branch / ATM\n2️⃣ Raise a Complaint\n3️⃣ Speak to Agent\n4️⃣ Track Complaint\n0️⃣ Back to Main Menu`,
    hi: `🏢 *शाखा सहायता*\n\n1️⃣ शाखा/ATM खोजें\n2️⃣ शिकायत दर्ज करें\n3️⃣ एजेंट से बात करें\n4️⃣ शिकायत ट्रैक करें\n0️⃣ मुख्य मेनू पर वापस`,
    gu: `🏢 *શાખા સહાય*\n\n1️⃣ શાખા/ATM શોધ\n2️⃣ ફરિયાદ નોંધ\n3️⃣ એજન્ટ સાથે વાત\n4️⃣ ફરિયાદ ટ્રેક\n0️⃣ મુખ્ય મેનૂ પર પાછા`,
  },

  LEAD_NAME_PROMPT: {
    en: `😊 May I have your name please?`,
    hi: `😊 क्या आप अपना नाम बता सकते हैं?`,
    gu: `😊 શું આપ આپकું નામ જણાવી શકો?`,
  },

  RM_CALLBACK_OPTIONS: {
    en: `Would you like our Relationship Manager to call you?\n\n1️⃣ Yes, call me today\n2️⃣ Yes, call me tomorrow\n3️⃣ No thanks, just information`,
    hi: `क्या आप चाहते हैं कि हमारा रिलेशनशिप मैनेजर आपको कॉल करे?\n\n1️⃣ हाँ, आज कॉल करें\n2️⃣ हाँ, कल कॉल करें\n3️⃣ नहीं, सिर्फ जानकारी चाहिए`,
    gu: `શું આप ઇચ્છો છો કે અમારો RM તમને કૉલ કરે?\n\n1️⃣ હા, આજ કૉલ કરો\n2️⃣ હા, કાલ કૉલ કરો\n3️⃣ ના, ફક્ત માહિતી`,
  },

  COMPLAINT_PROMPT: {
    en: `📝 Please describe your complaint briefly:\n(Type your complaint and send)`,
    hi: `📝 कृपया अपनी शिकायत संक्षेप में बताएं:\n(अपनी शिकायत टाइप करें और भेजें)`,
    gu: `📝 કૃપા કરી આpकी ફriyaad ટૂંકમાં જણાવો:\n(ફriyaad ટાઇ� કરો અને મોકálo)`,
  },

  INVALID_OPTION: {
    en: `❌ Invalid option. Please reply with a valid number from the menu.`,
    hi: `❌ अमान्य विकल्प। कृपया मेनू से सही नंबर से उत्तर दें।`,
    gu: `❌ અmany option. કૃrpa meau maat vaalid nambar daakhal karo.`,
  },

  PLEASE_WAIT: {
    en: `⏳ Please wait...`,
    hi: `⏳ कृपया प्रतीक्षा करें...`,
    gu: `⏳ કrpa pratiksha karo...`,
  },

  THANK_YOU: {
    en: `Thank you for banking with us! Have a great day! 🌟`,
    hi: `हमारे साथ बैंकिंग करने के लिए धन्यवाद! आपका दिन शुभ हो! 🌟`,
    gu: `અmar साथ banking maate abhar! Aapno din shubh rehe! 🌟`,
  },

  EXIT: {
    en: `👋 Thank you for using WhatsApp Banking. Have a great day!\n\nType *Hi* anytime to start a new session.`,
    hi: `👋 WhatsApp Banking उपयोग करने के लिए धन्यवाद। आपका दिन शुभ हो!\n\nनया सत्र शुरू करने के लिए कभी भी *Hi* टाइप करें।`,
    gu: `👋 WhatsApp Banking use karava maate abhar. Aapno din saaro rahe!\n\nNavu session sharu karva *Hi* lakho.`,
  },
};

const getMessage = (key, lang = 'en', ...args) => {
  const template = MESSAGES[key];
  if (!template) return `[Message ${key} not found]`;
  const langTemplate = template[lang] || template['en'];
  if (typeof langTemplate === 'function') {
    return langTemplate(...args);
  }
  return langTemplate;
};

module.exports = { MESSAGES, getMessage };
