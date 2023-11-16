import { Injectable, HttpException, HttpStatus, Query, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import {User} from './entities/user.entity'


@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(User) private userRepository: Repository<User>

    ) {}


  async create(user: CreateUserDto) {

    // chequeo primero si el user ya existe
    const userFound = await this.userRepository.findOne({
      where: {
        email: user.email
      }
    })

    if (userFound) {
      return new HttpException('User already exists', HttpStatus.CONFLICT) // código de estado HTTP 409 Conflict se utiliza cuando hay un conflicto con el estado actual del recurso
    }

    const newUser = this.userRepository.create(user)

    return this.userRepository.save(newUser) 
  }



  findAll() {
    return this.userRepository.find()
  }



  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id  // id == user.id
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email  // email  == user.email
      }
    });

    if (!user) {
      // throw new NotFoundException('User not found');
      return null
    }

    return user;
  }



  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-])/;
    return strongPasswordRegex.test(password);
  }

  async update(id: string, user: UpdateUserDto) {

    console.log("User1: ", user);

    try {
      const userFound = await this.userRepository.findOne({
        where : {
          id
        }
      });
  
      if (!userFound) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      // el email no se puede cambiar porque esta vinculado al token
      user.email ? delete user.email : '';

      user.password.trim() === '' ? delete user.password : '';
      user.newPassword && user.newPassword.trim() === '' ? delete user.newPassword : '';
      user.confirmNewPassword && user.confirmNewPassword.trim() === '' ? delete user.confirmNewPassword : '';

      let newUser = {
        password: ''
      }

      if (user.newPassword && !this.isPasswordStrong(user.newPassword)){
        return new BadRequestException(
          'New password should contain at least one lowercase letter, one uppercase letter, and one special character.'
        );
      }
      
      user.newPassword ? newUser.password = user.newPassword : delete newUser.password

      if (user.newPassword && user.confirmNewPassword && user.newPassword !== user.confirmNewPassword) {
        return new HttpException('NewPassword and ConfirmPassword are different.', HttpStatus.NOT_FOUND);
      } 

      let updatedUser: UpdateUserDto;

      if (user.password && newUser.password) {
        const isPasswordValid = (user.password === userFound.password);
  
        if (isPasswordValid) {

          // combina el segundo sobre el primero
          const updateUser = Object.assign(userFound, newUser);
          
          // Guarda el usuario actualizado en la base de datos
          updatedUser = await this.userRepository.save(updateUser);

          console.log("NupdatedUser: ", updatedUser)

          // Desestructura el objeto para obtener solo las propiedades deseadas
          const { email, password } = updatedUser;
      
          // Crea un nuevo objeto con las propiedades deseadas
          const userResponse = { email, password };
      
          return userResponse;
        } else {
          return new BadRequestException(
            'User does not exist.'
          );
        }
      }

      return new BadRequestException(
        'The data you submitted to update the users data is invalid or non-existent.'
      );

    } catch (error) {
      return new BadRequestException(
        'Something went wrong when trying to update users data.'
      );
    }
    
  }


  // delete user by id
  async remove(id: string) {

    const userFound = await this.userRepository.findOne({
      where : {
        id
      }
    }) 

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return this.userRepository.delete({ id });
  }

}
