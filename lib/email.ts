import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
  from: process.env.EMAIL_FROM || 'noreply@universitasdumai.ac.id',
};

let transporter: nodemailer.Transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  }
  return transporter;
}

export async function sendSurveyEmail(
  toEmail: string,
  alumniName: string,
  surveyTitle: string,
  surveyUrl: string
) {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: emailConfig.from,
      to: toEmail,
      subject: `Undangan Survey: ${surveyTitle} - Universitas Dumai`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Undangan Survey Tracer Study</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #1e40af;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background: #1e40af;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Universitas Dumai</h1>
              <h2>Tracer Study Program</h2>
            </div>
            <div class="content">
              <p>Halo ${alumniName},</p>
              <p>
                Kami dari Universitas Dumai mengundang Anda untuk berpartisipasi dalam survey tracer study.
                Survey ini sangat penting untuk membantu kami meningkatkan kualitas pendidikan dan
                layanan kepada mahasiswa alumni.
              </p>
              <p><strong>Judul Survey:</strong> ${surveyTitle}</p>
              <p>
                Survey ini akan memakan waktu sekitar 10-15 menit. Jawaban Anda akan sangat berharga bagi kami
                untuk pengembangan institusi.
              </p>
              <p style="text-align: center;">
                <a href="${surveyUrl}" class="button">Isi Survey Sekarang</a>
              </p>
              <p>
                Link survey hanya berlaku untuk satu kali penggunaan dan akan kadaluarsa dalam 7 hari.
                Jika Anda tidak bisa mengakses link di atas, silakan copy dan paste link berikut ke browser:
              </p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">
                ${surveyUrl}
              </p>
              <p>
                Terima kasih atas partisipasi Anda.
              </p>
              <p>
                Hormat kami,<br>
                Universitas Dumai<br>
                Alumni Relations Office
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Universitas Dumai. All rights reserved.</p>
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function testEmailConnection() {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { success: true, message: 'Email connection verified' };
  } catch (error) {
    console.error('Email connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email connection test failed'
    };
  }
}