import { Resend } from 'resend';

// Provide a dummy key if not present in env to avoid breaking build. 
// User needs to add RESEND_API_KEY to .env to make it work.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const sendOrderConfirmationEmail = async (toEmail, order) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Dhinda Hijab <noreply@dhindahijab.com>',
      to: [toEmail],
      subject: `Order Confirmation - #${order.id.slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #db2777;">Terima kasih atas pesanan Anda!</h2>
          <p>Halo,</p>
          <p>Pesanan Anda <strong>#${order.id.slice(-8).toUpperCase()}</strong> telah kami terima dan sedang menunggu pembayaran.</p>
          
          <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #9d174d;">Ringkasan Pesanan</h3>
            <p><strong>Total Pembayaran:</strong> Rp ${order.totalAmount.toLocaleString('id-ID')}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <p>Silakan selesaikan pembayaran Anda agar pesanan dapat segera kami proses.</p>
          
          <br/>
          <p>Salam hangat,<br/><strong>Tim Dhinda Hijab</strong></p>
        </div>
      `
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send order email:", err);
    return { success: false, error: err };
  }
};
