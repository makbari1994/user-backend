import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserListDto } from './dto/user-list-dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { UserCreateDto } from './dto/user-create.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('getUsers')
  @UseGuards(JwtAuthGuard)
  getUsers(@Request() req: any): Promise<UserListDto[]> {
    return this.userService.getUsers(req.user);
  }

  @Get('getUserInfo')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Request() req: any): Promise<UserListDto[]> {
    delete req.user.password;
    return req.user;
  }

  @Post('login')
  login(@Body() data: UserCreateDto): Promise<UserListDto> {
    return this.userService.login(data);
  }

  @Post('register')
  regiter(@Body() data: UserCreateDto): Promise<UserListDto> {
    return this.userService.register(data);
  }

  @Post('updateUser')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Request() req: any,
    @Body() data: UserCreateDto,
  ): Promise<UserListDto> {
    console.log(data, req.user.id);
    return this.userService.updateUser(data, req.user.id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          cb(
            null,
            `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`,
          );
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    // return files;
    return file.filename;
  }
}
