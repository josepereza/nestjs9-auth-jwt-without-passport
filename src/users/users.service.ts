import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: { posts: true },
    });
    return users;
  }

  async createPost(
    userId: number,
    title: string,
    content: string,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const post = this.postRepository.create({ title, content, user });
    await this.postRepository.save(post);
    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({ relations: ['user'] });
    return posts;
  }
}
