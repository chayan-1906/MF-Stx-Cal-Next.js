import nodemailer from "nodemailer";
import {APP_NAME, EMAIL_PASS, EMAIL_USER, NODE_ENV} from "@/lib/config";
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
            subject: `Your ${APP_NAME} Login Code`,
            html: `
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                            body {
                                font-family: Nunito, Arial, sans-serif;
                                background-color: #EDEBFE;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #EDEBFE;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                padding: 20px;
                                background-color: #6366F1;
                                color: white;
                                border-radius: 8px 8px 0 0;
                            }
                            .content {
                                padding: 20px;
                                text-align: center;
                            }
                            .code-box {
                                display: inline-block;
                                font-size: 24px;
                                letter-spacing: 4px;
                                background-color: #C7D2FE;
                                padding: 12px 20px;
                                border-radius: 6px;
                                margin-top: 10px;
                                user-select: all;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #EDEBFE;
                                padding: 10px;
                            }
                            /* Explicitly ensure cursor is pointer */
                            a[href] {
                                cursor: pointer !important;
                            }
                            /* Fallback note */
                            .fallback-note {
                                font-size: 12px;
                                color: #666;
                                margin-top: 10px;
                            }
                        </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h2>${APP_NAME} Verification Code</h2>
                                </div>
                                <div class="content">
                                    <p>Hello,</p>
                                    <p>Use the code below to log in or register your ${APP_NAME} account:</p>
                                    <div class="code-box" id="verifyCode">${code}</div>
                                    <p class="fallback-note">If the copy button doesn't work, simply select the code and copy it manually.</p>
                                    <p>If you didn't request this, you can safely ignore this email.</p>
                                </div>
                                <div class="footer">
                                    <p>© 2025 ${APP_NAME}. All rights reserved.</p>
                                </div>
                            </div>

                          <!-- Script placed at the end for potential performance improvement -->
                          <script>
                            function copyCode() {
                            try {
                                const code = document.getElementById('verifyCode').innerText;

                                // Try to use modern clipboard API
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(code).then(() => {
                                    showCopyStatus();
                                }).catch(() => {
                                    fallbackCopy(code);
                                });
                                } else {
                                    fallbackCopy(code);
                                }
                            } catch (err) {
                                console.error('Failed to copy: ', err);
                            }
                        }

                        function fallbackCopy(text) {
                            const el = document.createElement('textarea');
                            el.value = text;
                            el.setAttribute('readonly', '');
                            el.style.position = 'absolute';
                            el.style.left = '-9999px';
                            document.body.appendChild(el);

                            // Select and copy
                            const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
                            el.select();
                            document.execCommand('copy');
                            document.body.removeChild(el);

                            // Restore selection
                            if (selected) {
                                document.getSelection().removeAllRanges();
                                document.getSelection().addRange(selected);
                            }

                            showCopyStatus();
                        }

                        function showCopyStatus() {
                            const status = document.getElementById('copyStatus');
                            status.style.display = 'block';
                            setTimeout(() => {
                                status.style.display = 'none';
                            }, 2000);
                        }
                        </script>
                    </body>
                </html>
            `,
        };

        // Send the email
        if (NODE_ENV !== 'development') {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}: ${info.messageId}`);
        }

        await storeOtp(otp);

        return {code: 'emailSent', success: true, message: 'Verification email sent successfully!'};
    } catch (error) {
        console.error('Error sending verification email:', error);
        // throw new Error('Failed to send verification email');
        return {code: 'emailSendFailed', success: false, message: 'Failed to send verification email!', error};
    }
}

export {sendVerificationEmail}
