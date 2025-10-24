import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabase';
import { User, SignupCredentials } from '@/types/auth';

export async function createUser(credentials: SignupCredentials): Promise<User | null> {
  try {
    console.log('🆕 Creating new user:', credentials.email);
    
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', credentials.email)
      .single();
    
    if (existingUser) {
      console.log('❌ User already exists:', credentials.email);
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(credentials.password, 12);
    console.log('🔐 Password hashed successfully');

    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: credentials.email,
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          phone: credentials.phone,
          password: hashedPassword,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('💥 Error creating user:', error);
      throw error;
    }

    console.log('✅ User created successfully:', newUser.email);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      firstName: userWithoutPassword.first_name,
      lastName: userWithoutPassword.last_name,
      phone: userWithoutPassword.phone,
      createdAt: new Date(userWithoutPassword.created_at)
    };
  } catch (error) {
    console.error('💥 User creation error:', error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    console.log('🔍 Authentication attempt:', { email });
    
    // Get user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      console.log('❌ No user found with email:', email);
      return null;
    }

    console.log('👤 User found:', user.email);

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Password comparison failed');
      return null;
    }

    // Return user without password
    console.log('🎉 Authentication successful');
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      createdAt: new Date(user.created_at)
    };
  } catch (error) {
    console.error('💥 Authentication error:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, phone, created_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      createdAt: new Date(user.created_at)
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

// Debug function to check users
export async function debugUsers() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name');
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log('🗃️ All users in Supabase:');
    users?.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, ID: ${user.id}, Name: ${user.first_name} ${user.last_name}`);
    });
    console.log(`📊 Total users: ${users?.length || 0}`);
  } catch (error) {
    console.error('Debug users error:', error);
  }
}
