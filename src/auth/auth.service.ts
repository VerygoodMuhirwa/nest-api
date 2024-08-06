import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignInDto } from "./dto";
import * as argon from "argon2" ;
import {PrismaClientKnownRequestError} from "prisma/prisma-client/runtime/library"
@Injectable({})
export class AuthService {
    constructor( private prisma : PrismaService ){}
    async signup( dto: AuthDto){
       try {
         //check if the user with the same email already exists 
         const existingUser = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })

        if(existingUser) throw new ConflictException("The user with that email already exists")
        // harsh the password using argon
        const hash = await argon.hash(dto.password); 
        const user =  await this.prisma.user.create({
            data: {
                email : dto.email,
                hash,
                firstName: dto.firstName,
                lastName: dto.lastName
            },  
            // select:{
            //     id: true,
            //     email: true,
            //     firstName:true,
            //     lastName:true,
            //     createdAt: true,
            // }
        })

        delete user.hash;
        return  user;
       } catch (error) {
        console.log(error);
        
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === "P2002"){
                throw new ForbiddenException("Credentials taken")
            }
        }
        throw error;
    }
    }



    async signin( dto: SignInDto){
        //check the user by email
        const userExists = await await this.prisma.user.findUnique({
          where:{
            email: dto.email
          }
        });
        
        //if user does not exist throw exception
        if(!userExists) throw new NotFoundException("Invalid email or password")
        //compare passwords
        const passwordMatches =  await argon.verify(userExists.hash,  dto.password);        
        //if passwords mismatch throw exception
        if(!passwordMatches) throw new ForbiddenException("Invalid email or password")
        //return back the user
    return userExists;
    }
}