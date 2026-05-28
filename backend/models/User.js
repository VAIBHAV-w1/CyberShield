const supabase = require('../config/supabase');

const localUsers = [];

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
      console.warn('Supabase create failed, falling back to local storage:', error.message);
      const data = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        is_verified: userData.isVerified || false,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      localUsers.push(data);
      console.log('User created locally:', { ...data, password: '[HIDDEN]' });
      return new User(data);
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
      console.warn('Supabase findByEmail failed, checking local storage:', error.message);
      const localUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      return localUser ? new User(localUser) : null;
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
      console.warn('Supabase findById failed, checking local storage:', error.message);
      const localUser = localUsers.find(u => u.id === id);
      return localUser ? new User(localUser) : null;
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
      console.warn('Supabase update failed, updating locally:', error.message);
      const localUserIndex = localUsers.findIndex(u => u.id === this.id);
      if (localUserIndex !== -1) {
        const mappedUpdate = {};
        if (updateData.name !== undefined) mappedUpdate.name = updateData.name;
        if (updateData.email !== undefined) mappedUpdate.email = updateData.email;
        if (updateData.password !== undefined) mappedUpdate.password = updateData.password;
        if (updateData.isVerified !== undefined) mappedUpdate.is_verified = updateData.isVerified;
        if (updateData.is_verified !== undefined) mappedUpdate.is_verified = updateData.is_verified;
        if (updateData.lastLogin !== undefined) mappedUpdate.last_login = updateData.lastLogin;
        if (updateData.last_login !== undefined) mappedUpdate.last_login = updateData.last_login;

        localUsers[localUserIndex] = {
          ...localUsers[localUserIndex],
          ...mappedUpdate
        };
        Object.assign(this, {
          ...updateData,
          isVerified: mappedUpdate.is_verified || this.isVerified,
          lastLogin: mappedUpdate.last_login || this.lastLogin
        });
      }
      return this;
    }
  }

  // Convert to plain object (without password)
  toJSON() {
    const { password, ...userObject } = this;
    return userObject;
  }
}

module.exports = User;
