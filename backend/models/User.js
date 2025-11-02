const supabase = require('../config/supabase');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.isVerified = data.is_verified || false;
    this.createdAt = data.created_at;
    this.lastLogin = data.last_login;
  }

  // Create a new user
  static async create(userData) {
    try {
      console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: userData.password,
          is_verified: userData.isVerified || false,
          last_login: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      console.log('User created successfully:', { ...data, password: '[HIDDEN]' });
      return new User(data);
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data ? new User(data) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? new User(data) : null;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Convert to plain object (without password)
  toJSON() {
    const { password, ...userObject } = this;
    return userObject;
  }
}

module.exports = User;
