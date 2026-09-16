/**
 * Aerisence Authentication State Manager
 */

import { api } from './api.js';

class AuthService {
  constructor() {
    this.user = null;
    this.listeners = [];
    this.init();
  }

  init() {
    const savedUser = localStorage.getItem('aerisence_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (e) {
        this.user = null;
      }
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.user));
  }

  isAuthenticated() {
    return !!this.user && !!localStorage.getItem('aerisence_jwt');
  }

  getUser() {
    return this.user;
  }

  isAdmin() {
    return this.user && this.user.role === 'ROLE_ADMIN';
  }

  isOperator() {
    return this.user && (this.user.role === 'ROLE_ADMIN' || this.user.role === 'ROLE_OPERATOR');
  }

  async login(username, password) {
    const res = await api.login(username, password);
    this.user = {
      id: res.id,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role
    };
    localStorage.setItem('aerisence_user', JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  async register(data) {
    const res = await api.register(data);
    this.user = {
      id: res.id,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role
    };
    localStorage.setItem('aerisence_user', JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  logout() {
    this.user = null;
    api.setToken(null);
    localStorage.removeItem('aerisence_user');
    this.notify();
  }
}

export const auth = new AuthService();
