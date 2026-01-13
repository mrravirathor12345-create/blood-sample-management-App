const nodemailer = require('nodemailer');

/**
 * Notification Service for sending alerts and updates to users
 */
class NotificationService {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  /**
   * Send email notification
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @returns {Promise} Email sending promise
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Blood Sample System" <no-reply@bloodsample.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send report ready notification
   * @param {Object} patient - Patient information
   * @param {Object} report - Report information
   * @returns {Promise} Notification sending promise
   */
  async sendReportReadyNotification(patient, report) {
    const subject = 'Your Blood Test Report is Ready';
    const text = `
      Hello ${patient.firstName} ${patient.lastName},
      
      Your blood test report (${report.reportId}) is now ready for review.
      Generated on: ${report.generatedAt.toLocaleDateString()}
      
      Please log in to the Blood Sample Management System to view your report.
      
      Thank you for choosing our services.
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53935;">Blood Test Report Ready</h2>
        <p>Hello <strong>${patient.firstName} ${patient.lastName}</strong>,</p>
        
        <p>Your blood test report <strong>${report.reportId}</strong> is now ready for review.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Report Details:</strong></p>
          <ul>
            <li>Report ID: ${report.reportId}</li>
            <li>Generated on: ${report.generatedAt.toLocaleDateString()}</li>
            <li>Sample ID: ${report.sample.sampleId}</li>
          </ul>
        </div>
        
        <p><a href="${process.env.FRONTEND_URL}/reports/${report._id}" 
              style="background-color: #e53935; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
              View Report
            </a></p>
        
        <p>Thank you for choosing our services.</p>
        <p>Best regards,<br/>Blood Sample Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: patient.email,
      subject,
      text,
      html
    });
  }

  /**
   * Send abnormal result alert
   * @param {Object} patient - Patient information
   * @param {Object} report - Report information
   * @param {Array} abnormalTests - List of abnormal tests
   * @returns {Promise} Notification sending promise
   */
  async sendAbnormalResultAlert(patient, report, abnormalTests) {
    const subject = 'Important: Abnormal Blood Test Results';
    const text = `
      Hello ${patient.firstName} ${patient.lastName},
      
      We have detected abnormal results in your recent blood test (${report.reportId}).
      
      Abnormal tests:
      ${abnormalTests.map(test => `- ${test.test.testName}: ${test.resultValue} ${test.unit || ''}`).join('\n')}
      
      Please contact your healthcare provider as soon as possible to discuss these results.
      
      You can view the full report in the Blood Sample Management System.
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">Important: Abnormal Blood Test Results</h2>
        <p>Hello <strong>${patient.firstName} ${patient.lastName}</strong>,</p>
        
        <p>We have detected abnormal results in your recent blood test <strong>${report.reportId}</strong>.</p>
        
        <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
          <p><strong>Abnormal Tests:</strong></p>
          <ul>
            ${abnormalTests.map(test => `<li>${test.test.testName}: ${test.resultValue} ${test.unit || ''}</li>`).join('')}
          </ul>
        </div>
        
        <p style="background-color: #fff9e6; padding: 15px; border-radius: 5px;">
          <strong>⚠️ Important:</strong> Please contact your healthcare provider as soon as possible to discuss these results.
        </p>
        
        <p><a href="${process.env.FRONTEND_URL}/reports/${report._id}" 
              style="background-color: #e53935; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
              View Full Report
            </a></p>
        
        <p>Best regards,<br/>Blood Sample Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: patient.email,
      subject,
      text,
      html
    });
  }

  /**
   * Send sample collection reminder
   * @param {Object} patient - Patient information
   * @param {Object} sample - Sample information
   * @returns {Promise} Notification sending promise
   */
  async sendCollectionReminder(patient, sample) {
    const subject = 'Blood Sample Collection Reminder';
    const text = `
      Hello ${patient.firstName} ${patient.lastName},
      
      This is a reminder for your upcoming blood sample collection.
      
      Appointment Details:
      - Date: ${sample.collectionDate.toLocaleDateString()}
      - Time: ${sample.collectionDate.toLocaleTimeString()}
      - Location: ${sample.collectionPoint}
      
      Please arrive 15 minutes early and bring your ID.
      
      If you need to reschedule, please contact us at least 24 hours in advance.
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #45b7d1;">Blood Sample Collection Reminder</h2>
        <p>Hello <strong>${patient.firstName} ${patient.lastName}</strong>,</p>
        
        <p>This is a reminder for your upcoming blood sample collection.</p>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Appointment Details:</strong></p>
          <ul>
            <li><strong>Date:</strong> ${sample.collectionDate.toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${sample.collectionDate.toLocaleTimeString()}</li>
            <li><strong>Location:</strong> ${sample.collectionPoint}</li>
          </ul>
        </div>
        
        <p><strong>Please arrive 15 minutes early and bring your ID.</strong></p>
        
        <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
        
        <p>Thank you,<br/>Blood Sample Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: patient.email,
      subject,
      text,
      html
    });
  }

  /**
   * Send doctor review notification
   * @param {Object} doctor - Doctor information
   * @param {Object} report - Report information
   * @param {Object} patient - Patient information
   * @returns {Promise} Notification sending promise
   */
  async sendDoctorReviewNotification(doctor, report, patient) {
    const subject = 'New Report Requires Your Review';
    const text = `
      Hello Dr. ${doctor.firstName} ${doctor.lastName},
      
      A new blood test report requires your review.
      
      Report Details:
      - Report ID: ${report.reportId}
      - Patient: ${patient.firstName} ${patient.lastName}
      - Generated on: ${report.generatedAt.toLocaleDateString()}
      
      Please log in to the Blood Sample Management System to review and approve this report.
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #96ceb4;">New Report Requires Your Review</h2>
        <p>Hello Dr. <strong>${doctor.firstName} ${doctor.lastName}</strong>,</p>
        
        <p>A new blood test report requires your review.</p>
        
        <div style="background-color: #f5fff0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Report Details:</strong></p>
          <ul>
            <li><strong>Report ID:</strong> ${report.reportId}</li>
            <li><strong>Patient:</strong> ${patient.firstName} ${patient.lastName}</li>
            <li><strong>Generated on:</strong> ${report.generatedAt.toLocaleDateString()}</li>
          </ul>
        </div>
        
        <p><a href="${process.env.FRONTEND_URL}/doctors/review/${report._id}" 
              style="background-color: #45b7d1; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Report
            </a></p>
        
        <p>Thank you,<br/>Blood Sample Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: doctor.email,
      subject,
      text,
      html
    });
  }
}

module.exports = new NotificationService();