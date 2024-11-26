import { Module } from '@nestjs/common'
import { AnswerController } from './answer.controller'
import { AnswerService } from './answer.service'
import { AnswerRepository } from './answer.repository'
import { PrismaModule } from '../prisma'

@Module({
	imports: [PrismaModule],
	controllers: [AnswerController],
	providers: [AnswerService, AnswerRepository],
	exports: [AnswerService],
})
export class AnswerModule {}
