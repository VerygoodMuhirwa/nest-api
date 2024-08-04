import { Injectable } from '@nestjs/common';
const { PrismaClient } = require('@prisma/client');
@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super(
        {
            datasources:{
                db:{
                    url: 'postgresql://verygood:1234@localhost:5434/nest-api-tutorial?schema=public'
                }
            }
        }
        )
    }
}



