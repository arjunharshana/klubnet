const SibApiV3Sdk = require("sib-api-v3-sdk");
const crypto = require("crypto");
require("dotenv").config();

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is not defined in environment variables");
}

// New instance of the API client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKeyAuth = client.authentications["api-key"];
apiKeyAuth.apiKey = apiKey;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Send verification email

const sendVerificationEmail = async (userName, userEmail) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Your KlubNet Verification OTP";

    sendSmtpEmail.htmlContent = `
        <html>
            <body>
                <p>Hi ${userName},</p>
                <p>Your OTP for KlubNet email verification is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>Thank you for joining KlubNet!</p>
            </body>
        </html>
        `;

    sendSmtpEmail.sender = {
      name: "KlubNet Support",
      email: "arjunharjun18@gmail.com",
    };

    sendSmtpEmail.to = [{ email: userEmail, name: userName }];

    console.log("Sending verification email to:", userEmail);

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Verification email sent successfully to:", userEmail);
    return otp;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
