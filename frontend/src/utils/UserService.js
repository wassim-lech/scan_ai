// UserService.js - Utility functions for user management and role checking
import api from './api';

class UserService {
  // Get current user data
  static async getCurrentUser() {
    try {
      const res = await api.get('/auth/user');
      return res.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user has specific role
  static hasRole(user, role) {
    if (!user) return false;
    return user.role === role;
  }

  // Check if user is admin
  static isAdmin(user) {
    return this.hasRole(user, 'admin');
  }

  // Check if user is doctor
  static isDoctor(user) {
    return this.hasRole(user, 'doctor');
  }

  // Check if user is premium
  static isPremium(user) {
    return this.hasRole(user, 'premium');
  }

  // Check if user is free
  static isFree(user) {
    return this.hasRole(user, 'free');
  }
  
  // Get all users (admin only)
  static async getAllUsers() {
    try {
      const res = await api.get('/admin/users');
      return res.data;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
  
  // Create a new user (admin only)
  static async createUser(userData) {
    try {
      const res = await api.post('/admin/create-user', userData);
      return res.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  // Update user role (admin only)
  static async updateUserRole(userId, role) {
    try {
      const res = await api.put(`/admin/users/${userId}`, { role });
      return res.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
  
  // Get remaining scans for current user
  static getRemainingScans(user) {
    if (!user) return 0;
    return user.scansRemaining || 0;
  }
  
  // Format user role for display
  static formatRole(role) {
    if (!role) return 'Unknown';
    
    // Capitalize first letter and add formatting
    return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

export default UserService;
