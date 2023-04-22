import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { UsersService } from 'src/users/users.service';
@Controller('posts')
export class PostsController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() body: { title: string; content: string },
    @Request() req,
  ): Promise<any> {
    console.log('post.controller', req.user)
    const post = await this.userService.createPost(
      req.user.id,
      body.title,
      body.content,
    );
    return post;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPosts(): Promise<any[]> {
    const posts = await this.userService.getAllPosts();
    return posts;
  }
}
