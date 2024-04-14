/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { EmailService } from './email/email.service';

interface UserData {
  name: string
  email: string
  password: string
  phone_number: number
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // register user service
  async register(registerDto: RegisterDto, response:Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist) {
      throw new BadRequestException('User already exist with this email!');
    }

    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });

    if (isPhoneNumberExist) {
      throw new BadRequestException('User already exist with this email!');
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
        name,
        email,
        password: hashedPassword,
        phone_number,
      }

    const activationToken = await this.createActivationToken(user)

    const activationCode = activationToken.activationCode

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode
    })

    return {user, response}
  }

  async createActivationToken(user: UserData){
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      }
    )

    return { token, activationCode}
  }

  // Login service
  async getUsers(){
    return this.prisma.user.findMany({})
  }
}
