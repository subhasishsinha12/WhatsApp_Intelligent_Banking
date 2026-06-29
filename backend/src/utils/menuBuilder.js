// Build WhatsApp-style menu messages

const buildMenu = (title, items, footer = '') => {
  let menu = `*${title}*\n\n`;
  items.forEach((item, idx) => {
    menu += `${item.number || idx + 1}️⃣ ${item.label}\n`;
  });
  if (footer) menu += `\n${footer}`;
  return menu;
};

const buildBalanceMessage = (user) => {
  const masked = `XXXXXXXXXXXX${user.account_number ? user.account_number.slice(-4) : '0000'}`;
  const balance = user.balance || 0;
  const available = balance;
  const current = balance + 2000;
  const now = new Date();
  return `💰 *Your Account Balance*\n\n🏦 Account: ${masked}\n✅ Available Balance: ₹${available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n📊 Current Balance: ₹${current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n\n🕐 Last updated: ${now.toLocaleString('en-IN')}`;
};

const buildMiniStatement = (user) => {
  const masked = `XXXX${user.account_number ? user.account_number.slice(-4) : '0000'}`;
  const transactions = [
    { date: '28-Jun', desc: 'UPI/Salary Credit', amount: '+₹45,000', balance: '1,25,430' },
    { date: '26-Jun', desc: 'NEFT/Rent Payment', amount: '-₹15,000', balance: '80,430' },
    { date: '25-Jun', desc: 'ATM Withdrawal', amount: '-₹5,000', balance: '95,430' },
    { date: '24-Jun', desc: 'Online Shopping', amount: '-₹2,350', balance: '1,00,430' },
    { date: '22-Jun', desc: 'Electricity Bill', amount: '-₹1,200', balance: '1,02,780' },
  ];

  let statement = `📋 *Mini Statement - ${masked}*\n\n`;
  transactions.forEach(t => {
    statement += `${t.date} | ${t.desc}\n${t.amount} | Bal: ${t.balance}\n─────────────────\n`;
  });
  statement += `\nFor full statement, visit net banking or branch.`;
  return statement;
};

const buildProductInfo = (productName, lang = 'en') => {
  const products = {
    'home_loan': {
      en: `🏠 *Home Loan Details*\n\n✅ Loan Amount: Up to ₹5 Crore\n✅ Interest Rate: From 8.50% p.a.\n✅ Tenure: Up to 30 years\n✅ Processing Fee: 0.5% (waived for limited period)\n✅ Approval Time: 72 hours\n\n📌 *Eligibility:*\n• Salaried: Min ₹25,000/month\n• Self-employed: Min ₹3 Lakh/year\n• CIBIL Score: 700+`,
      hi: `🏠 *होम लोन विवरण*\n\n✅ ऋण राशि: ₹5 करोड़ तक\n✅ ब्याज दर: 8.50% प्रति वर्ष से\n✅ अवधि: 30 वर्ष तक\n✅ प्रोसेसिंग शुल्क: 0.5%\n✅ अनुमोदन: 72 घंटे\n\n📌 *पात्रता:*\n• वेतनभोगी: न्यूनतम ₹25,000/माह\n• स्व-रोजगार: न्यूनतम ₹3 लाख/वर्ष\n• CIBIL स्कोर: 700+`,
    },
    'auto_loan': {
      en: `🚗 *Auto Loan Details*\n\n✅ Loan Amount: Up to ₹1 Crore\n✅ Interest Rate: From 9.25% p.a.\n✅ Tenure: Up to 7 years\n✅ Down Payment: 10-20%\n✅ Approval Time: 24 hours\n\n📌 *Features:*\n• New & used car financing\n• Zero prepayment charges\n• Easy EMI options`,
      hi: `🚗 *ऑटो लोन विवरण*\n\n✅ ऋण राशि: ₹1 करोड़ तक\n✅ ब्याज दर: 9.25% प्रति वर्ष से\n✅ अवधि: 7 वर्ष तक\n✅ डाउन पेमेंट: 10-20%\n✅ अनुमोदन: 24 घंटे`,
    },
    'education_loan': {
      en: `🎓 *Education Loan Details*\n\n✅ Loan Amount: Up to ₹50 Lakhs\n✅ Interest Rate: From 8.15% p.a.\n✅ Tenure: Up to 15 years\n✅ Processing Fee: Nil for premier institutions\n✅ Tax Benefit: Under Section 80E\n\n📌 *Special Benefits:*\n• Moratorium during study period\n• 100% financing for IIT/IIM/AIIMS\n• No collateral up to ₹7.5 Lakhs`,
      hi: `🎓 *शिक्षा ऋण विवरण*\n\n✅ ऋण राशि: ₹50 लाख तक\n✅ ब्याज दर: 8.15% प्रति वर्ष से\n✅ अवधि: 15 वर्ष तक\n✅ कर लाभ: धारा 80E के अंतर्गत`,
    },
    'personal_loan': {
      en: `💼 *Personal Loan Details*\n\n✅ Loan Amount: Up to ₹25 Lakhs\n✅ Interest Rate: From 10.50% p.a.\n✅ Tenure: Up to 5 years\n✅ Processing Fee: 1-2%\n✅ Approval Time: Same day\n\n📌 *Eligibility:*\n• Minimum age: 21 years\n• Employment: 2+ years\n• Min salary: ₹20,000/month`,
      hi: `💼 *व्यक्तिगत ऋण विवरण*\n\n✅ ऋण राशि: ₹25 लाख तक\n✅ ब्याज दर: 10.50% प्रति वर्ष से\n✅ अवधि: 5 वर्ष तक\n✅ त्वरित अनुमोदन`,
    },
    'fd': {
      en: `🏛️ *Fixed Deposit Details*\n\n✅ Minimum Amount: ₹10,000\n✅ Interest Rate: 7.25% p.a.\n✅ Tenure: 7 days to 10 years\n✅ Senior Citizen Benefit: +0.50%\n\n📌 *Features:*\n• Monthly/Quarterly/Yearly payouts\n• Loan against FD up to 90%\n• Auto-renewal option`,
      hi: `🏛️ *सावधि जमा विवरण*\n\n✅ न्यूनतम राशि: ₹10,000\n✅ ब्याज दर: 7.25% प्रति वर्ष\n✅ अवधि: 7 दिन से 10 वर्ष\n✅ वरिष्ठ नागरिक: +0.50%`,
    },
    'nri': {
      en: `🌏 *NRI Banking Services*\n\n✅ NRE Account: Tax-free interest\n✅ NRO Account: Manage India income\n✅ FCNR Deposits: Foreign currency FDs\n✅ NRI Home Loans: Up to ₹5 Crore\n\n📌 *Benefits:*\n• Free remittance services\n• Dedicated NRI Relationship Manager\n• Online account opening\n• Free international ATM access`,
      hi: `🌏 *NRI बैंकिंग सेवाएं*\n\n✅ NRE खाता: ब्याज कर मुक्त\n✅ NRO खाता: भारत आय प्रबंधन\n✅ FCNR जमा: विदेशी मुद्रा FD`,
    },
    'life_insurance': {
      en: `🛡️ *Life Insurance Plans*\n\n✅ Term Insurance: From ₹399/month\n✅ Coverage: Up to ₹5 Crore\n✅ Tax Benefit: Under Section 80C\n✅ Claim Settlement: 98.5%\n\n📌 *Plan Types:*\n• Pure Term Plan\n• Money Back Plan\n• Endowment Plan\n• ULIP`,
      hi: `🛡️ *जीवन बीमा योजनाएं*\n\n✅ टर्म बीमा: ₹399/माह से\n✅ कवरेज: ₹5 करोड़ तक\n✅ कर लाभ: धारा 80C`,
    },
    'health_insurance': {
      en: `🏥 *Health Insurance Plans*\n\n✅ Coverage: ₹2 Lakh to ₹1 Crore\n✅ Premium: From ₹999/year\n✅ No medical checkup up to 45 years\n✅ Cashless at 8,000+ hospitals\n\n📌 *Features:*\n• Individual & Family Floater\n• Pre/Post hospitalization\n• Day care procedures covered\n• Annual health checkup included`,
      hi: `🏥 *स्वास्थ्य बीमा योजनाएं*\n\n✅ कवरेज: ₹2 लाख से ₹1 करोड़\n✅ प्रीमियम: ₹999/वर्ष से\n✅ 8,000+ अस्पतालों में कैशलेस`,
    },
  };

  const product = products[productName];
  if (!product) return null;
  return product[lang] || product['en'];
};

const buildBranchLocations = () => {
  return `📍 *Nearby Branches & ATMs*\n\n🏢 *Branches:*\n\n1. *Mumbai Main Branch*\n   📍 123 Fort Road, Churchgate, Mumbai - 400001\n   📞 022-2345-6789\n   ⏰ Mon-Fri: 10AM-4PM, Sat: 10AM-2PM\n\n2. *Bandra Branch*\n   📍 45 Linking Road, Bandra West, Mumbai - 400050\n   📞 022-2345-6790\n   ⏰ Mon-Sat: 9:30AM-4:30PM\n\n3. *Andheri Branch*\n   📍 78 Andheri East, Mumbai - 400069\n   📞 022-2345-6791\n   ⏰ Mon-Sat: 9:30AM-4:30PM\n\n🏧 *Nearest ATMs:* Within 0.5 km - 3 ATMs available\n\n📲 Use our app for real-time ATM locations.`;
};

const buildTicketConfirmation = (ticket) => {
  return `✅ *Complaint Registered Successfully!*\n\n🎫 Ticket No: *${ticket.ticket_number}*\n📋 Category: ${ticket.category}\n🕐 Registered: ${new Date(ticket.created_at).toLocaleString('en-IN')}\n⏱️ Expected Resolution: *48 hours*\n\nYou will receive updates on this WhatsApp number.\n\nWould you like to speak to a staff member?\n1️⃣ Yes, connect me\n2️⃣ No, thank you`;
};

const buildRMHandoff = (rm) => {
  return `🤝 *Connecting you to your Relationship Manager...*\n\n👤 *${rm.name}*\n📞 ${rm.mobile}\n📧 ${rm.email || 'Not available'}\n⏰ Available: Mon-Sat, 9AM-6PM\n\n✅ Your RM will contact you within *2 hours*.\n\nRef ID: RM-${Date.now().toString().slice(-6)}\n\nIs there anything else I can help you with?`;
};

module.exports = {
  buildMenu,
  buildBalanceMessage,
  buildMiniStatement,
  buildProductInfo,
  buildBranchLocations,
  buildTicketConfirmation,
  buildRMHandoff,
};
