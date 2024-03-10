import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserListDto } from './dto/user-list-dto';
import { UserCreateDto } from './dto/user-create.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /// get  nearest users
  async getUsers(user: UserListDto): Promise<UserListDto[]> {
    return this.prisma.user.findMany({
      select: {
        email: true,
        name: true,
        password: false,
        image: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async register(data: UserCreateDto): Promise<UserListDto> {
    const userData = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (userData) {
      throw new BadRequestException(`Email already exists: ${data.email}`);
    }
    try {
      const user = await this.prisma.user.create({
        data: data,
      });
      delete user.password;
      return user;
    } catch (e) {
      throw new BadRequestException(`please enter all fields`);
    }
  }

  async login(data: UserCreateDto): Promise<UserListDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // If no user is found, throw an error
    if (!user) {
      throw new BadRequestException(`No user found for email: ${data.email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = user.password === data.password;

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async updateUser(data: UserCreateDto, userId: number): Promise<UserListDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: data,
    });
    delete user.password;
    return user;
  }

  public async getUserFromAuthenticationToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.userId) {
        return this.findOne(payload.userId);
      }
    } catch (e) {}
  }
}
