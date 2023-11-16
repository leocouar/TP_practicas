import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize:true,
      logging:true, // para que sincronice las clases con las tablas. Siempre la clase se va a ver reflejada en la db
      entities: ["dist/**/**.entity{.ts,.js}"]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
