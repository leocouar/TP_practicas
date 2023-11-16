import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('api/users')
@Controller('api/users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}


  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  
  @Get(':email')
  findByEmail(@Param('email', ParseUUIDPipe) email: string) {
    return this.usersService.findByEmail(email);
  }
  

  @Patch(':id')
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto) {
      return this.usersService.update(id, user)
  }


  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  } 
} 
