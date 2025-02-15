import { Module } from '@nestjs/common'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { QuestionRepository } from './question.repository'
import { PrismaModule } from '../prisma'
import { AnswerModule } from 'modules/answer/answer.module'

@Module({
	imports: [PrismaModule, AnswerModule],
	controllers: [QuestionController],
	providers: [QuestionService, QuestionRepository],
	exports: [QuestionService, QuestionRepository],
})
export class QuestionModule {}
