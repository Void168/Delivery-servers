/* eslint-disable prettier/prettier */
import { ObjectType, Field} from '@nestjs/graphql'
import { User } from '../entities/user.entity'

@ObjectType()
export class ErrorType {
    @Field()
    message: string;

    @Field({nullable: true})
    code?:string;
}

@ObjectType()
export class RegisterReponse {
    @Field(() => User, {nullable: true})
    user?: User | any

    @Field(() => ErrorType, {nullable: true})
    error?: ErrorType
}

export class LoginReponse {
    @Field(() => User)
    user: User

    @Field(() => ErrorType, {nullable: true})
    error?: ErrorType
}