import axios from 'axios';

<<<<<<< HEAD
const API_BASE_URL = 'https://fitoffice2-ff8035a9df10.herokuapp.com/api';
=======
const API_BASE_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

// Tipos
interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

interface CampaignPayload {
  name: string;
  subject: string;
  recipients: string[];
  content: {
    html?: string;
    text?: string;
  };
  scheduledDate?: Date;
  templateId?: string;
}

// Servicio de Email
export const emailService = {
  // Envío básico de email
  async sendEmail(payload: EmailPayload) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/send`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Campañas
  async createCampaign(campaign: CampaignPayload) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/campaign/create`,
      campaign,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getCampaignStatus(campaignId: string) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/campaign/status`,
      { campaignId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  // Emails automáticos
  async sendWelcomeEmail(userId: string) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/welcome`,
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async toggleBirthdayEmails(enabled: boolean) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/birthday/toggle`,
      { enabled },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
};
