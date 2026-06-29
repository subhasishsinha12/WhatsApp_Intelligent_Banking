const { v4: uuidv4 } = require('uuid');
const { SessionModel, UserModel, MessageModel, TicketModel } = require('../models');
const { getMessage } = require('../utils/responses');
const {
  buildBalanceMessage,
  buildMiniStatement,
  buildProductInfo,
  buildBranchLocations,
  buildTicketConfirmation,
  buildRMHandoff,
} = require('../utils/menuBuilder');
const { sendOTP, verifyOTP } = require('./otpService');
const { createLeadFromChat, assignRM } = require('./leadService');
const { detectLanguage, detectRiskKeywords, answerFAQ } = require('./aiService');

// State machine states
const STATES = {
  WELCOME: 'WELCOME',
  LANGUAGE_SELECTION: 'LANGUAGE_SELECTION',
  CUSTOMER_TYPE: 'CUSTOMER_TYPE',
  AUTH_MOBILE: 'AUTH_MOBILE',
  AUTH_OTP: 'AUTH_OTP',
  MAIN_MENU: 'MAIN_MENU',
  ACCOUNT_SERVICES: 'ACCOUNT_SERVICES',
  BALANCE_ENQUIRY: 'BALANCE_ENQUIRY',
  MINI_STATEMENT: 'MINI_STATEMENT',
  LOANS_MENU: 'LOANS_MENU',
  HOME_LOAN: 'HOME_LOAN',
  AUTO_LOAN: 'AUTO_LOAN',
  EDUCATION_LOAN: 'EDUCATION_LOAN',
  PERSONAL_LOAN: 'PERSONAL_LOAN',
  DEPOSITS_MENU: 'DEPOSITS_MENU',
  NRI_BANKING: 'NRI_BANKING',
  FCNR_DEPOSIT: 'FCNR_DEPOSIT',
  CARDS_MENU: 'CARDS_MENU',
  FUND_TRANSFER: 'FUND_TRANSFER',
  INSURANCE_MENU: 'INSURANCE_MENU',
  LIFE_INSURANCE: 'LIFE_INSURANCE',
  HEALTH_INSURANCE: 'HEALTH_INSURANCE',
  BRANCH_ATM_LOCATOR: 'BRANCH_ATM_LOCATOR',
  BRANCH_SUPPORT: 'BRANCH_SUPPORT',
  COMPLAINT: 'COMPLAINT',
  COMPLAINT_FOLLOWUP: 'COMPLAINT_FOLLOWUP',
  LEAD_CAPTURE: 'LEAD_CAPTURE',
  LEAD_NAME: 'LEAD_NAME',
  LEAD_PRODUCT: 'LEAD_PRODUCT',
  LEAD_CALLBACK: 'LEAD_CALLBACK',
  RM_HANDOFF: 'RM_HANDOFF',
  NEW_CUSTOMER_NAME: 'NEW_CUSTOMER_NAME',
  NEW_CUSTOMER_PRODUCT: 'NEW_CUSTOMER_PRODUCT',
  CAMPAIGNS: 'CAMPAIGNS',
  FAQ_ANSWER: 'FAQ_ANSWER',
};

// ============================================================
// Core message processor
// ============================================================

const processMessage = async (sessionId, userMessage, mobile) => {
  const msg = userMessage.trim();

  // Get or create session
  let session = await SessionModel.findById(sessionId);
  if (!session) {
    session = await SessionModel.create({ id: sessionId, mobile, state: STATES.WELCOME });
  }

  const lang = session.language || 'en';
  const responses = [];

  // Log inbound message
  await MessageModel.create({
    session_id: session.id,
    direction: 'inbound',
    content: msg,
    message_type: 'text',
  });

  // Detect language on first message
  if (!session.language || session.state === STATES.WELCOME || session.state === STATES.LANGUAGE_SELECTION) {
    const detectedLang = detectLanguage(msg);
    if (detectedLang !== 'en') {
      await SessionModel.update(session.id, { language: detectedLang });
    }
  }

  // Check for risk keywords
  const riskCheck = detectRiskKeywords(msg);
  if (riskCheck.hasRisk && riskCheck.severity === 'critical') {
    const riskMsg = `🚨 *URGENT ALERT DETECTED*\n\nWe've detected potentially fraudulent activity. Your account has been flagged for security review.\n\n📞 Please call our 24x7 Fraud Helpline: *1800-XXX-FRAUD*\n\nOr press 1 to speak to a security agent immediately.`;
    responses.push(riskMsg);
    await logOutbound(session.id, riskMsg);
    return responses;
  }

  // Global commands
  const upper = msg.toUpperCase();
  if (upper === 'HI' || upper === 'HELLO' || upper === 'START' || upper === 'NAMASTE') {
    return await handleState(STATES.WELCOME, session, msg, responses);
  }
  if (upper === 'MENU' || upper === 'HOME') {
    if (session.context && session.context.authenticated) {
      return await handleState(STATES.MAIN_MENU, session, msg, responses);
    }
  }
  if (upper === 'EXIT' || upper === 'BYE' || upper === 'QUIT' || msg === '0' && session.state === STATES.MAIN_MENU) {
    const exitMsg = getMessage('EXIT', session.language || 'en');
    responses.push(exitMsg);
    await SessionModel.update(session.id, { state: STATES.WELCOME });
    await logOutbound(session.id, exitMsg);
    return responses;
  }

  // Route based on current state
  return await handleState(session.state, session, msg, responses);
};

const handleState = async (state, session, msg, responses = []) => {
  const lang = session.language || 'en';

  switch (state) {
    case STATES.WELCOME: {
      await SessionModel.update(session.id, { state: STATES.LANGUAGE_SELECTION, context: {} });
      const welcome = getMessage('WELCOME', lang);
      responses.push(welcome);
      break;
    }

    case STATES.LANGUAGE_SELECTION: {
      let selectedLang = 'en';
      if (msg === '1' || msg.toLowerCase().includes('english')) selectedLang = 'en';
      else if (msg === '2' || msg.toLowerCase().includes('hindi') || msg.includes('हिंदी')) selectedLang = 'hi';
      else if (msg === '3' || msg.toLowerCase().includes('gujarati') || msg.includes('ગુ')) selectedLang = 'gu';
      else {
        responses.push('Please select a valid option:\n1. English\n2. हिंदी (Hindi)\n3. ગુજરાતી (Gujarati)');
        break;
      }

      await SessionModel.update(session.id, { language: selectedLang, state: STATES.CUSTOMER_TYPE });
      const customerTypeMsg = getMessage('CUSTOMER_TYPE', selectedLang);
      responses.push(customerTypeMsg);
      break;
    }

    case STATES.CUSTOMER_TYPE: {
      if (msg === '1' || msg.toLowerCase().includes('existing')) {
        await SessionModel.update(session.id, { state: STATES.AUTH_MOBILE });
        responses.push(getMessage('AUTH_MOBILE_PROMPT', lang));
      } else if (msg === '2' || msg.toLowerCase().includes('new')) {
        await SessionModel.update(session.id, { state: STATES.NEW_CUSTOMER_NAME, context: { ...session.context, customer_type: 'new' } });
        const newCustMsg = lang === 'hi'
          ? `👋 नए ग्राहक के रूप में आपका स्वागत है!\n\nकृपया अपना पूरा नाम दर्ज करें:`
          : lang === 'gu'
          ? `👋 નવા ગ્રાહક તરીકે સ્વાગત!\n\nકૃpaa tmaruu pooru naam dakhal karo:`
          : `👋 Welcome, new customer!\n\nPlease enter your full name:`;
        responses.push(newCustMsg);
      } else if (msg === '3' || msg.toLowerCase().includes('general') || msg.toLowerCase().includes('enquiry')) {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU, context: { ...session.context, authenticated: true, customer_type: 'guest' } });
        responses.push(getMessage('MAIN_MENU', lang));
      } else {
        responses.push(getMessage('INVALID_OPTION', lang));
        responses.push(getMessage('CUSTOMER_TYPE', lang));
      }
      break;
    }

    case STATES.AUTH_MOBILE: {
      const mobile = msg.replace(/\s/g, '').replace(/^\+91/, '');
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        responses.push(lang === 'hi' ? '❌ अमान्य मोबाइल नंबर। कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।' : '❌ Invalid mobile number. Please enter a valid 10-digit mobile number.');
        break;
      }

      const user = await UserModel.findByMobile(mobile);
      if (!user) {
        await SessionModel.update(session.id, { state: STATES.CUSTOMER_TYPE });
        responses.push(getMessage('MOBILE_NOT_FOUND', lang));
        break;
      }

      await sendOTP(mobile, 'login');
      await SessionModel.update(session.id, {
        state: STATES.AUTH_OTP,
        context: { ...session.context, auth_mobile: mobile, auth_attempts: 0 },
      });
      responses.push(getMessage('AUTH_OTP_SENT', lang, mobile));
      break;
    }

    case STATES.AUTH_OTP: {
      const mobile = session.context.auth_mobile;
      const otp = msg.replace(/\s/g, '');

      const isValid = await verifyOTP(mobile, otp, 'login');
      if (!isValid) {
        const attempts = (session.context.auth_attempts || 0) + 1;
        if (attempts >= 3) {
          await SessionModel.update(session.id, { state: STATES.WELCOME, context: {} });
          responses.push(`❌ Too many failed attempts. Session ended for security. Type *Hi* to start again.`);
          break;
        }
        await SessionModel.update(session.id, { context: { ...session.context, auth_attempts: attempts } });
        responses.push(getMessage('AUTH_FAILED', lang));
        break;
      }

      const user = await UserModel.findByMobile(mobile);
      await SessionModel.update(session.id, {
        state: STATES.MAIN_MENU,
        context: { ...session.context, authenticated: true, user_id: user.id, user_name: user.name },
      });

      responses.push(getMessage('AUTH_SUCCESS', lang, user.name));
      responses.push(getMessage('MAIN_MENU', lang));
      break;
    }

    case STATES.NEW_CUSTOMER_NAME: {
      const name = msg.trim();
      if (name.length < 2) {
        responses.push('Please enter your full name (at least 2 characters).');
        break;
      }
      await SessionModel.update(session.id, {
        state: STATES.NEW_CUSTOMER_PRODUCT,
        context: { ...session.context, new_customer_name: name },
      });
      const productMenuMsg = lang === 'hi'
        ? `${name} जी, आपका स्वागत है! 😊\n\nआप किस सेवा में रुचि रखते हैं?\n\n1️⃣ होम लोन\n2️⃣ ऑटो लोन\n3️⃣ शिक्षा ऋण\n4️⃣ व्यक्तिगत ऋण\n5️⃣ सावधि जमा\n6️⃣ बचत खाता\n7️⃣ NRI सेवाएं\n8️⃣ अन्य`
        : `Welcome, ${name}! 😊\n\nWhich service are you interested in?\n\n1️⃣ Home Loan\n2️⃣ Auto Loan\n3️⃣ Education Loan\n4️⃣ Personal Loan\n5️⃣ Fixed Deposit\n6️⃣ Savings Account\n7️⃣ NRI Services\n8️⃣ Other`;
      responses.push(productMenuMsg);
      break;
    }

    case STATES.NEW_CUSTOMER_PRODUCT: {
      const productMap = {
        '1': 'Home Loan', '2': 'Auto Loan', '3': 'Education Loan',
        '4': 'Personal Loan', '5': 'Fixed Deposit', '6': 'Savings Account',
        '7': 'NRI Services', '8': 'Other',
      };
      const product = productMap[msg] || msg;
      const name = session.context.new_customer_name;
      const mobile = session.mobile;

      // Create lead
      const { lead, rm, urgency } = await createLeadFromChat({
        mobile, name, product_interest: product, notes: `New customer inquiry via WhatsApp`,
      });

      await SessionModel.update(session.id, {
        state: STATES.LEAD_CALLBACK,
        context: { ...session.context, lead_id: lead.id, lead_product: product, rm },
      });

      const productInfo = buildProductInfo(product.toLowerCase().replace(/ /g, '_'), lang);
      if (productInfo) responses.push(productInfo);

      responses.push(getMessage('RM_CALLBACK_OPTIONS', lang));
      break;
    }

    case STATES.LEAD_CALLBACK: {
      const rm = session.context.rm || { name: 'Amit Patel', mobile: '9876500003', email: 'amit.patel@bank.com' };
      const product = session.context.lead_product || 'banking services';

      if (msg === '1' || msg === '2') {
        const when = msg === '1' ? 'today' : 'tomorrow';
        const confirmMsg = `✅ *Callback Scheduled!*\n\nOur RM will call you *${when}*.\n\n${buildRMHandoff(rm)}\n\nThank you for your interest in ${product}!`;
        responses.push(confirmMsg);
      } else {
        const infoMsg = `ℹ️ No problem! Feel free to contact us anytime.\n\nFor more information, you can:\n📞 Call: 1800-XXX-XXXX\n🌐 Visit: www.bank.com\n🏢 Visit any branch\n\nType *MENU* to explore more services.`;
        responses.push(infoMsg);
      }

      await SessionModel.update(session.id, { state: STATES.MAIN_MENU, context: { ...session.context, authenticated: true } });
      break;
    }

    case STATES.MAIN_MENU: {
      if (!session.context.authenticated) {
        await SessionModel.update(session.id, { state: STATES.WELCOME });
        return handleState(STATES.WELCOME, session, msg, responses);
      }

      switch (msg) {
        case '1':
          await SessionModel.update(session.id, { state: STATES.ACCOUNT_SERVICES });
          responses.push(getMessage('ACCOUNT_SERVICES', lang));
          break;
        case '2':
          await SessionModel.update(session.id, { state: STATES.LOANS_MENU });
          responses.push(getMessage('LOANS_MENU', lang));
          break;
        case '3':
          await SessionModel.update(session.id, { state: STATES.DEPOSITS_MENU });
          responses.push(getMessage('DEPOSITS_MENU', lang));
          break;
        case '4':
          await SessionModel.update(session.id, { state: STATES.NRI_BANKING });
          responses.push(getMessage('NRI_MENU', lang));
          break;
        case '5':
          await SessionModel.update(session.id, { state: STATES.CARDS_MENU });
          responses.push(getMessage('CARDS_MENU', lang));
          break;
        case '6':
          await SessionModel.update(session.id, { state: STATES.INSURANCE_MENU });
          responses.push(getMessage('INSURANCE_MENU', lang));
          break;
        case '7':
          await SessionModel.update(session.id, { state: STATES.CAMPAIGNS });
          const campaigns = `🎯 *Current Offers & Campaigns*\n\n🏠 *Monsoon Home Loan Offer*\nHome loans at 8.25% p.a. + ₹5,000 cashback!\n\n💰 *FD Rate Hike Alert*\nFD rates increased to 7.25% p.a. - Lock in now!\n\n🌏 *NRI Welcome Offer*\nOpen NRE account online, no minimum balance for 6 months.\n\nType the offer name to know more, or 0 to go back.`;
          responses.push(campaigns);
          break;
        case '8':
          await SessionModel.update(session.id, { state: STATES.BRANCH_SUPPORT });
          responses.push(getMessage('BRANCH_SUPPORT', lang));
          break;
        case '9': {
          const rm = await assignRM('MumbaiMain');
          await SessionModel.update(session.id, { state: STATES.RM_HANDOFF });
          responses.push(buildRMHandoff(rm));
          break;
        }
        case '0':
          responses.push(getMessage('EXIT', lang));
          await SessionModel.update(session.id, { state: STATES.WELCOME, context: {} });
          break;
        default: {
          // Try FAQ or AI fallback
          const { answer } = await answerFAQ(msg, lang);
          if (answer) {
            responses.push(`💡 *Answer:*\n\n${answer}\n\nType *MENU* to go back to the main menu.`);
          } else {
            responses.push(getMessage('INVALID_OPTION', lang));
            responses.push(getMessage('MAIN_MENU', lang));
          }
        }
      }
      break;
    }

    case STATES.ACCOUNT_SERVICES: {
      switch (msg) {
        case '1': {
          const userId = session.context.user_id;
          const user = userId ? await UserModel.findById(userId) : null;
          const balanceMsg = buildBalanceMessage(user || { account_number: 'DEMO000000001234', balance: 125430.50 });
          responses.push(balanceMsg);
          responses.push('\n0️⃣ Back to Account Services | *MENU* for Main Menu');
          break;
        }
        case '2': {
          const userId = session.context.user_id;
          const user = userId ? await UserModel.findById(userId) : null;
          const stmtMsg = buildMiniStatement(user || { account_number: 'DEMO000000001234' });
          responses.push(stmtMsg);
          break;
        }
        case '3':
          await SessionModel.update(session.id, { state: STATES.FUND_TRANSFER });
          responses.push(`💸 *Fund Transfer*\n\nSelect transfer type:\n\n1️⃣ UPI Transfer\n2️⃣ NEFT\n3️⃣ RTGS\n4️⃣ IMPS\n5️⃣ Own Account Transfer\n\n0️⃣ Back`);
          break;
        case '4':
          responses.push(`📄 *Account Statement*\n\nFor your account statement:\n\n• Last 3 months: Available on net banking/app\n• Older statements: Visit branch or call 1800-XXX-XXXX\n• Email statement: Register at netbanking.bank.com\n\n0️⃣ Back`);
          break;
        case '5':
          responses.push(`✏️ *Update Details*\n\nFor security, updates must be done at your home branch.\n\nRequired documents: Aadhaar + PAN + Old mobile/email proof.\n\n🏢 Visit: Mumbai Main Branch\n📞 Call: 022-2345-6789\n\n0️⃣ Back`);
          break;
        case '0':
          await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
          responses.push(getMessage('MAIN_MENU', lang));
          break;
        default:
          responses.push(getMessage('INVALID_OPTION', lang));
          responses.push(getMessage('ACCOUNT_SERVICES', lang));
      }
      break;
    }

    case STATES.LOANS_MENU: {
      const loanProductMap = {
        '1': { key: 'home_loan', name: 'Home Loan', state: STATES.HOME_LOAN },
        '2': { key: 'auto_loan', name: 'Auto Loan', state: STATES.AUTO_LOAN },
        '3': { key: 'education_loan', name: 'Education Loan', state: STATES.EDUCATION_LOAN },
        '4': { key: 'personal_loan', name: 'Personal Loan', state: STATES.PERSONAL_LOAN },
      };

      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
        break;
      }

      const selected = loanProductMap[msg];
      if (selected) {
        const info = buildProductInfo(selected.key, lang);
        responses.push(info || `Information about ${selected.name} will be provided by our RM.`);
        await SessionModel.update(session.id, {
          state: STATES.LEAD_NAME,
          context: { ...session.context, pending_product: selected.name, pending_product_key: selected.key },
        });
        responses.push(getMessage('LEAD_NAME_PROMPT', lang));
      } else {
        responses.push(getMessage('INVALID_OPTION', lang));
        responses.push(getMessage('LOANS_MENU', lang));
      }
      break;
    }

    case STATES.LEAD_NAME: {
      const name = msg.trim();
      if (name.length < 2) {
        responses.push('Please enter a valid name.');
        break;
      }

      await SessionModel.update(session.id, {
        state: STATES.LEAD_CALLBACK,
        context: { ...session.context, lead_name: name, rm: await assignRM('MumbaiMain') },
      });

      // Create lead
      const product = session.context.pending_product || 'Loan';
      const { lead, rm } = await createLeadFromChat({
        mobile: session.mobile || session.context.auth_mobile || 'unknown',
        name,
        product_interest: product,
        notes: `Customer expressed interest in ${product} via WhatsApp Banking`,
      });

      await SessionModel.update(session.id, { context: { ...session.context, lead_id: lead.id, lead_product: product, rm, lead_name: name } });

      responses.push(`Thank you, *${name}*! 😊\n\n${getMessage('RM_CALLBACK_OPTIONS', lang)}`);
      break;
    }

    case STATES.DEPOSITS_MENU: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
        break;
      }

      const depositInfo = {
        '1': buildProductInfo('fd', lang),
        '2': `📈 *Recurring Deposit*\n\n✅ Monthly installment: ₹500 to ₹1 Lakh\n✅ Tenure: 6 months to 10 years\n✅ Interest rate: 6.75-7.00% p.a.\n✅ Good for systematic savings\n\nWant to open an RD? Reply *YES*`,
        '3': `💰 *Savings Account Benefits*\n\n✅ 3.50% interest p.a.\n✅ Free net banking & mobile app\n✅ Zero balance variant available\n✅ Instant account opening online`,
        '4': `📊 *Mutual Funds*\n\n✅ SIP from ₹500/month\n✅ Diversified portfolio\n✅ Expert fund managers\n✅ SEBI registered\n\nFor mutual fund advisory, speak to your RM.`,
      };

      if (depositInfo[msg]) {
        responses.push(depositInfo[msg]);
        responses.push('\n0️⃣ Back | *MENU* for Main Menu');
      } else {
        responses.push(getMessage('INVALID_OPTION', lang));
        responses.push(getMessage('DEPOSITS_MENU', lang));
      }
      break;
    }

    case STATES.NRI_BANKING: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
        break;
      }

      const nriInfo = buildProductInfo('nri', lang);
      responses.push(nriInfo || getMessage('NRI_MENU', lang));

      if (msg === '5') {
        const rm = await assignRM('MumbaiMain');
        responses.push(`\n${buildRMHandoff(rm)}`);
      } else {
        await SessionModel.update(session.id, {
          state: STATES.LEAD_NAME,
          context: { ...session.context, pending_product: 'NRI Services' },
        });
        responses.push(getMessage('LEAD_NAME_PROMPT', lang));
      }
      break;
    }

    case STATES.CARDS_MENU: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
        break;
      }

      const cardResponses = {
        '1': `💳 *Card Limit Information*\n\nYour current card limits:\n\n🔵 Daily ATM Limit: ₹25,000\n🟢 POS Limit: ₹1,00,000\n🟡 Online Limit: ₹50,000\n\nTo change limits, use net banking or call 1800-XXX-XXXX.`,
        '2': `✨ *Credit Card Application*\n\nWe offer:\n• Platinum Card - 5X rewards, 2% cashback\n• Gold Card - 3X rewards, Lounge access\n• Classic Card - Basic rewards\n\nEligibility: Income > ₹3 Lakhs/year, CIBIL > 700\n\nType *APPLY* to start application.`,
        '3': `🔒 *Block/Unblock Card*\n\nTo *BLOCK* your card immediately:\n• Call: 1800-XXX-XXXX (24x7)\n• Net banking: Cards > Block Card\n• Type: *BLOCK CARD*\n\n⚠️ Blocked cards cannot be used for any transactions.`,
        '4': `📋 *Card Statement*\n\nAccess card statements via:\n• Net banking: Cards > Statements\n• Mobile app\n• Email: statement@bank.com\n\nOr we can send last 3 months to your registered email. Type *YES* to send.`,
        '5': `⭐ *Reward Points Balance*\n\nYour rewards: 2,450 points (₹245 value)\n\nRedeem for:\n• Cashback\n• Amazon/Flipkart vouchers\n• Air miles\n\nVisit rewardzone.bank.com to redeem.`,
      };

      responses.push(cardResponses[msg] || getMessage('INVALID_OPTION', lang));
      responses.push('\n0️⃣ Back to Cards Menu | *MENU* for Main Menu');
      break;
    }

    case STATES.INSURANCE_MENU: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
        break;
      }

      const insuranceMap = {
        '1': { key: 'life_insurance', name: 'Life Insurance' },
        '2': { key: 'health_insurance', name: 'Health Insurance' },
        '3': { key: null, name: 'Auto Insurance' },
        '4': { key: null, name: 'Home Insurance' },
      };

      const selected = insuranceMap[msg];
      if (selected) {
        const info = selected.key ? buildProductInfo(selected.key, lang) : `Information about ${selected.name} is available at your nearest branch or by calling 1800-XXX-XXXX.`;
        responses.push(info);
        await SessionModel.update(session.id, {
          state: STATES.LEAD_NAME,
          context: { ...session.context, pending_product: selected.name },
        });
        responses.push(`\n${getMessage('LEAD_NAME_PROMPT', lang)}`);
      } else {
        responses.push(getMessage('INVALID_OPTION', lang));
        responses.push(getMessage('INSURANCE_MENU', lang));
      }
      break;
    }

    case STATES.BRANCH_SUPPORT: {
      switch (msg) {
        case '1':
          responses.push(buildBranchLocations());
          responses.push('\n0️⃣ Back');
          break;
        case '2':
          await SessionModel.update(session.id, { state: STATES.COMPLAINT });
          responses.push(getMessage('COMPLAINT_PROMPT', lang));
          break;
        case '3': {
          const rm = await assignRM('MumbaiMain');
          responses.push(buildRMHandoff(rm));
          break;
        }
        case '4':
          responses.push(`🔍 *Track Your Complaint*\n\nEnter your ticket number (e.g., TKT-2024-0001):\n\nOr call 1800-XXX-XXXX with your ticket number.`);
          break;
        case '0':
          await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
          responses.push(getMessage('MAIN_MENU', lang));
          break;
        default:
          responses.push(getMessage('INVALID_OPTION', lang));
          responses.push(getMessage('BRANCH_SUPPORT', lang));
      }
      break;
    }

    case STATES.COMPLAINT: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.BRANCH_SUPPORT });
        responses.push(getMessage('BRANCH_SUPPORT', lang));
        break;
      }

      if (msg.length < 10) {
        responses.push('Please provide more details about your complaint (at least 10 characters).');
        break;
      }

      const ticket = await TicketModel.create({
        customer_id: session.context.user_id || 'anonymous',
        category: 'General Complaint',
        description: msg,
        priority: 'medium',
      });

      await SessionModel.update(session.id, {
        state: STATES.COMPLAINT_FOLLOWUP,
        context: { ...session.context, last_ticket: ticket.ticket_number },
      });

      responses.push(buildTicketConfirmation(ticket));
      break;
    }

    case STATES.COMPLAINT_FOLLOWUP: {
      if (msg === '1') {
        const rm = await assignRM('MumbaiMain');
        responses.push(buildRMHandoff(rm));
      } else {
        responses.push(`✅ Thank you! Your complaint (${session.context.last_ticket}) is registered.\n\nExpected resolution: 48 hours.\n\nType *MENU* to return to the main menu.`);
      }
      await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
      break;
    }

    case STATES.CAMPAIGNS: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
      } else {
        responses.push(`For details about this offer, please call 1800-XXX-XXXX or visit your nearest branch.\n\nType *MENU* for main menu.`);
      }
      break;
    }

    case STATES.FUND_TRANSFER: {
      if (msg === '0') {
        await SessionModel.update(session.id, { state: STATES.ACCOUNT_SERVICES });
        responses.push(getMessage('ACCOUNT_SERVICES', lang));
        break;
      }
      responses.push(`💸 *Fund Transfer*\n\nFor security, fund transfers via WhatsApp are currently disabled.\n\nPlease use:\n📱 Mobile App\n💻 Net Banking: netbank.bank.com\n🏢 Visit Branch\n📞 Call: 1800-XXX-XXXX\n\n0️⃣ Back`);
      break;
    }

    case STATES.RM_HANDOFF: {
      responses.push(`Is there anything else I can help you with?\n\n1️⃣ Yes, go to Main Menu\n2️⃣ No, exit`);
      if (msg === '1') {
        await SessionModel.update(session.id, { state: STATES.MAIN_MENU });
        responses.push(getMessage('MAIN_MENU', lang));
      } else {
        responses.push(getMessage('EXIT', lang));
        await SessionModel.update(session.id, { state: STATES.WELCOME });
      }
      break;
    }

    default: {
      // Fallback: try FAQ search
      const { answer } = await answerFAQ(msg, lang);
      if (answer) {
        responses.push(`💡 *Answer:*\n\n${answer}\n\nType *MENU* to access the main menu.`);
      } else {
        await SessionModel.update(session.id, { state: STATES.WELCOME });
        return handleState(STATES.WELCOME, session, msg, responses);
      }
    }
  }

  // Log outbound messages
  for (const r of responses) {
    await logOutbound(session.id, r);
  }

  return responses;
};

const logOutbound = async (sessionId, content) => {
  await MessageModel.create({
    session_id: sessionId,
    direction: 'outbound',
    content,
    message_type: 'text',
  });
};

const getOrCreateSession = async (mobile) => {
  let session = await SessionModel.findByMobile(mobile);
  if (!session) {
    session = await SessionModel.create({ mobile, state: STATES.WELCOME });
  }
  return session;
};

const resetSession = async (sessionId) => {
  await SessionModel.update(sessionId, { state: STATES.WELCOME, context: {}, language: 'en' });
  return { message: 'Session reset successfully' };
};

module.exports = { processMessage, getOrCreateSession, resetSession, STATES };
