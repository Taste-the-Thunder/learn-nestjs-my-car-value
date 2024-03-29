import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/createuser.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {

  constructor(private usersService: UsersService,private authService: AuthService){}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto){
    return this.authService.signUp(body.email, body.password)
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto){
    return this.authService.signIn(body.email, body.password)
  }

  @Get('/:id')
  async findUser(@Param('id') id: string){
    console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id)); 
    if(!user){
      throw new NotFoundException('user not found');
    }
    
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string){
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string){
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
    return this.usersService.update(parseInt(id), body);
  }
}
