import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module'; 
import { DatabaseModule } from './database/database.module';


@Module({
   imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, AuthModule, UsersModule, PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})




export class AppModule {}
