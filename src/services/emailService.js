require('dotenv').config();
const nodemailer = require('nodemailer');

// Cấu hình transporter để gửi email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // false với port 587, true với 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Gửi email thông báo khi Admin tạo tài khoản
 */
const sendAccountCreatedEmail = async (email, resetPasswordLink) => {
  try {
    await transporter.sendMail({
      from: `"Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thông báo tài khoản mới',
      html: `
        <h3>Chào bạn,</h3>
        <p>Admin đã cấp cho bạn một tài khoản mới.</p>
        <p>Bạn vui lòng đặt lại mật khẩu bằng cách nhấn vào link bên dưới:</p>
        <a href="${resetPasswordLink}" style="color:blue;">Đặt lại mật khẩu</a>
        <p>Cảm ơn bạn!</p>
      `,
    });
    console.log(`📩 Email đã gửi thành công tới ${email}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi email tới ${email}:`, error);
  }
};

/**
 * Gửi email thông báo khi người dùng được thêm vào project
 */
const sendProjectAssignedEmail = async (email, projectName, projectLink) => {
  try {
    await transporter.sendMail({
      from: `"Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Bạn đã được thêm vào dự án: ${projectName}`,
      html: `
        <h3>Xin chào,</h3>
        <p>Bạn đã được thêm vào dự án <strong>${projectName}</strong>.</p>
        <p>Nhấn vào link bên dưới để truy cập dự án:</p>
        <a href="${projectLink}" style="color:blue;">Truy cập dự án</a>
        <p>Cảm ơn bạn!</p>
      `,
    });
    console.log(`📩 Email thông báo dự án đã gửi tới ${email}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi email tới ${email}:`, error);
  }
};

module.exports = { sendAccountCreatedEmail, sendProjectAssignedEmail };
