import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
  } from 'typeorm';
  import { IsEmail } from 'class-validator';
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    username: string;
  
  
    @Column({ unique: true, nullable: false })
    @IsEmail()
    email: string;
  
  
    @Column({ nullable: false })
    password: string;
    
  
    // Response e.g.: "createdDate": "2023-06-23T12:26:33.197Z"
    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;
  }
  