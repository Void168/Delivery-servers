/* eslint-disable prettier/prettier */
import { BadGatewayException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterReponse } from './types/user.types';
import { RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Resolver('User')
// UserFilters
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterReponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: {res: Response}
  ): Promise<RegisterReponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadGatewayException('Please fill the all fields');
    }

    const user = await this.userService.register(registerDto, context.res);

    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
