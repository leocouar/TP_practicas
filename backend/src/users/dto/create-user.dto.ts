import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEmail, Length } from "class-validator"
import { Transform } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @Transform(({ value }) => value.trim()) // QUITA ESPACIOs EN BLANCO
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Un nombre de usuario ',
        example: 'Leonardo',
    })
    username: string

    @Transform(({ value }) => value.trim()) // QUITA ESPACIOs EN BLANCO
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description: 'Un email',
        example: 'admin@admin',
    })
    email: string

    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Una contraseña',
        example: 'PassW0rd.',
    })
    @Length(8, 20)
    password: string
}
