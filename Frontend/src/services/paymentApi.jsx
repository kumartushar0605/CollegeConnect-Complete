// Mock API service for payment tracking

class PaymentAPI {
  constructor() {
    this.baseUrl = 'https://jsonplaceholder.typicode.com';
  }

  async validatePhoneNumber(phoneNumber) {
    // Mock validation - in real app, this would validate against a database
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      const users = await response.json();
      // Simulate validation
      return phoneNumber.length === 10 && (
        phoneNumber.startsWith('6') || 
        phoneNumber.startsWith('7') || 
        phoneNumber.startsWith('8') || 
        phoneNumber.startsWith('9')
      );
    } catch (error) {
      console.error('Validation failed:', error);
      return true; // Default to true for demo
    }
  }

  async initiatePayment(phoneNumber, amount) {
    // Mock API call to initiate payment
    try {
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
          timestamp: new Date().toISOString(),
        }),
      });
      
      const result = await response.json();
      return `TXN${result.id}${Date.now()}`;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw new Error('Payment initiation failed');
    }
  }

  async getTransactionStatus(transactionId) {
    // Mock status check
    try {
      await fetch(`${this.baseUrl}/posts/1`);
      // Simulate random status for demo
      const statuses = ['pending', 'completed', 'failed'];
      return statuses[Math.floor(Math.random() * statuses.length)];
    } catch (error) {
      console.error('Status check failed:', error);
      return 'pending';
    }
  }

  async getTransactionHistory() {
    // Mock transaction history
    try {
      const response = await fetch(`${this.baseUrl}/posts?_limit=5`);
      const posts = await response.json();
      
      return posts.map((post, index) => ({
        id: `TXN${post.id}${Date.now() - index * 86400000}`,
        phoneNumber: `${Math.floor(Math.random() * 900000000) + 600000000}`,
        amount: `${Math.floor(Math.random() * 10000) + 100}`,
        status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() - index * 86400000).toISOString(),
      }));
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      return [];
    }
  }
}

export const paymentApi = new PaymentAPI();