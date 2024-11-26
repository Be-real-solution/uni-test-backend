import { Module } from '@nestjs/common'
import { UserResultService } from './user-result.service'
import { UserResultController } from './user-result.controller'
import { PrismaModule } from 'modules/prisma'
import { QuestionModule } from 'modules/question'
import { UserModule } from 'modules/user/user.module'
import { UserResultRepository } from './user-result.repository'

@Module({
	imports: [PrismaModule, QuestionModule, UserModule],
	controllers: [UserResultController],
	providers: [UserResultService, UserResultRepository],
})
export class UserResultModule {}
