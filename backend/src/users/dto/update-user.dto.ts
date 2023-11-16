import { IsOptional, IsString, IsUUID, IsEmail, Length, IsNotEmpty } from "class-validator"
import { Transform } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {

    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Un nombre de usuario ',
        example: 'Leonardo',
    })
    username?: string

    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Un email',
        example: 'leonardo.couar@gmail.com',
    })
    email?: string

    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Una contraseña',
        example: 'PassW0rd.',
    })
    password?: string

    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString()
    @Length(8, 20)
    @IsNotEmpty()
    @ApiProperty({
        description: 'Una contraseña',
        example: 'PassW0rd.',
    })
    newPassword?: string

    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString()
    @Length(8, 20)
    @ApiProperty({
        description: 'Una contraseña',
        example: 'PassW0rd.',
    })
    @IsNotEmpty()
    confirmNewPassword?: string
}
