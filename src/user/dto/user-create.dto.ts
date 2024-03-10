import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";



export class UserCreateDto {
    id?: number;
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    image: string;

    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number
}