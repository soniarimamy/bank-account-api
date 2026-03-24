import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private users: User[];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.initializeUsers();
  }

  private async initializeUsers() {
    // Hasher les mots de passe pour la démo
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    this.users = [
      {
        id: 1,
        username: 'admin',
        password: adminPassword,
        role: 'admin',
      },
      {
        id: 2,
        username: 'user',
        password: userPassword,
        role: 'user',
      },
    ];
    
    this.logger.log('Utilisateurs initialisés pour l\'authentification');
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;
    
    this.logger.log(`Tentative de connexion pour l'utilisateur: ${username}`);
    
    const user = await this.validateUser(username, password);
    
    if (!user) {
      this.logger.warn(`Échec de connexion pour l'utilisateur: ${username}`);
      throw new UnauthorizedException('Nom d\'utilisateur ou mot de passe incorrect');
    }
    
    const payload = { 
      sub: user.id, 
      username: user.username, 
      role: user.role 
    };
    
    this.logger.log(`Connexion réussie pour l'utilisateur: ${username}`);
    
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      username: user.username,
      role: user.role,
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result as User;
    }
    
    return null;
  }

  async validateUserById(userId: number): Promise<any> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createUser(username: string, password: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: this.users.length + 1,
      username,
      password: hashedPassword,
      role,
    };
    this.users.push(newUser);
    return newUser;
  }
}