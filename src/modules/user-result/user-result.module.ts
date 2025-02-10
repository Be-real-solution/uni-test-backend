import { Module } from '@nestjs/common'
import { UserResultService } from './user-result.service'
import { UserResultController } from './user-result.controller'
import { PrismaModule } from 'modules/prisma'
import { QuestionModule } from 'modules/question'
import { UserModule } from 'modules/user/user.module'
import { UserResultRepository } from './user-result.repository'
import { AnswerModule } from 'modules/answer'

@Module({
	imports: [PrismaModule, QuestionModule, UserModule, AnswerModule],
	controllers: [UserResultController],
	providers: [UserResultService, UserResultRepository],
})
export class UserResultModule {}
