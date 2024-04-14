/* eslint-disable prettier/prettier */
import { BadGatewayException, Query } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterReponse } from './types/user.types';
import { RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Resolver('User')
// UserFilters
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterReponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<RegisterReponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadGatewayException('Please fill the all fields');
    }

    const user = await this.usersService.register(registerDto);

    return { user };
  }

  @Query(() => [User])
  async getUsers(){
    return this.usersService.getUsers()
  }
}
