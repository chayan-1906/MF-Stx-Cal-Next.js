import nodemailer from "nodemailer";
import {APP_NAME, EMAIL_PASS, EMAIL_USER} from "@/lib/config";
import {ApiResponse} from "@/types/ApiResponse";
import {storeOtp} from "@/lib/db/otp-storage";
import {Otp} from "@/models/Otp";

async function sendVerificationEmail(otp: Otp): Promise<ApiResponse> {
    try {
        const {email, code, codeExpiry} = otp;

        // Create a Nodemailer transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        // Define email options
        const mailOptions = {
            from: `${APP_NAME} <${EMAIL_USER}>`,
            to: email,
            subject: `Verify Your ${APP_NAME} Account`,
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  font-family: Nunito, Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  padding: 20px;
                  background-color: #DB2777;
                  color: white;
                  border-radius: 8px 8px 0 0;
                }
                .content {
                  padding: 20px;
                  text-align: center;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #DB2777;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                }
                .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  padding: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Account Verification</h2>
                </div>
                <div class="content">
                  <p>Hello,</p>
                  <p>Thank you for joining ${APP_NAME}! Please verify your email address by clicking the button below:</p>
                  <a href="${code}" class="button">${code}</a>
                  <p>If you didn’t create this account, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© 2025 ${APP_NAME}. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}: ${info.messageId}`);

        await storeOtp(otp);

        return {code: 'emailSent', success: true, message: 'Verification email sent successfully!'};
    } catch (error) {
        console.error('Error sending verification email:', error);
        // throw new Error('Failed to send verification email');
        return {code: 'emailSendFailed', success: false, message: 'Failed to send verification email!', error};
    }
}

export {sendVerificationEmail}
