import { AuthFormData, AuthResponse } from '../types/auth';

// Simulated user database with admin credentials
const users = new Map<string, { 
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  failedAttempts: number;
  lastAttempt: number;
}>();

// Add default admin user
users.set('admin@eventhub.com', {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@eventhub.com',
  phone: '1234567890',
  password: 'Admin@123',
  isAdmin: true,
  failedAttempts: 0,
  lastAttempt: Date.now()
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export class AuthValidation {
  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private static isUserLocked(email: string): boolean {
    const user = users.get(email);
    if (!user) return false;

    const timeSinceLastAttempt = Date.now() - user.lastAttempt;
    return user.failedAttempts >= MAX_FAILED_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION;
  }

  private static resetFailedAttempts(email: string): void {
    const user = users.get(email);
    if (user) {
      user.failedAttempts = 0;
      user.lastAttempt = Date.now();
      users.set(email, user);
    }
  }

  private static incrementFailedAttempts(email: string): void {
    const user = users.get(email);
    if (user) {
      user.failedAttempts += 1;
      user.lastAttempt = Date.now();
      users.set(email, user);
    }
  }

  static async register(data: AuthFormData): Promise<AuthResponse> {
    if (users.has(data.email)) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }

    const userId = Math.random().toString(36).substring(2);
    users.set(data.email, {
      id: userId,
      name: data.name || '',
      email: data.email,
      phone: data.phone || '',
      password: data.password,
      isAdmin: false,
      failedAttempts: 0,
      lastAttempt: Date.now()
    });

    return {
      success: true,
      message: 'Registration successful',
      token: this.generateToken(),
      user: {
        id: userId,
        name: data.name || '',
        email: data.email,
        phone: data.phone,
        isAdmin: false
      }
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    if (this.isUserLocked(email)) {
      return {
        success: false,
        message: 'Account temporarily locked. Please try again later.'
      };
    }

    const user = users.get(email);

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    if (user.password !== password) {
      this.incrementFailedAttempts(email);
      const remainingAttempts = MAX_FAILED_ATTEMPTS - user.failedAttempts;

      if (remainingAttempts <= 0) {
        return {
          success: false,
          message: 'Account locked. Please try again later.'
        };
      }

      return {
        success: false,
        message: `Invalid password. ${remainingAttempts} attempts remaining.`
      };
    }

    this.resetFailedAttempts(email);
    return {
      success: true,
      message: 'Login successful',
      token: this.generateToken(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    };
  }

  static getAllUsers(): void {
    console.log('All registered users:', Array.from(users.entries()));
  }
}