import { Resend } from "resend";

class ResendClient {
  private client: Resend | null = null;

  private getClient() {
    if (!this.client) {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("Missing RESEND_API_KEY environment variable");
      }
      this.client = new Resend(process.env.RESEND_API_KEY);
    }
    return this.client;
  }

  async sendEmail(params: Parameters<Resend["emails"]["send"]>[0]) {
    return this.getClient().emails.send(params);
  }
}

export const resend = new ResendClient();
