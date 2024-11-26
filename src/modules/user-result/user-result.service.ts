import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserResultDto } from './dto/create-user-result.dto'
import { UpdateUserResultDto } from './dto/update-user-result.dto'
import { ICreateUserResultService, IUserResultFindAll, IUserResultFindAllResponse, IUserResultResponse } from './interfaces/user-result.interfaces'
import { QuestionService } from 'modules/question'
import { UserService } from 'modules/user'
import { UserResultRepository } from './user-result.repository'
import { Request } from 'express'

@Injectable()
export class UserResultService {
	private readonly repository: UserResultRepository
	private readonly questionService: QuestionService
	private readonly userService: UserService

	constructor(
		repository: UserResultRepository,
		questionService: QuestionService,
		userService: UserService,
	) {
		this.repository = repository
		this.questionService = questionService
		this.userService = userService
	}

	async create(payload: ICreateUserResultService, request: Request) {
		const question = await this.questionService.findOne({ id: payload.questionId })
		const user = await this.userService.findOne({ id: payload.userId })

		let userResult: IUserResultResponse = await this.repository.findOneByUserIdCollectionId({
			id: '',
			userId: user.id,
			collectionId: question.collection.id,
		})

		if (!userResult) {
			userResult = await this.repository.create({
				userFullName: user.fullName,
				grade: 0,
				userId: user.id,
				groupId: user.userInfo.group.id,
				questionId: question.id,
				questionCount: payload.number,
				compyuterName: request.headers['user-agent'],
				collectionId: question.collection.id,
			})
			return { status_code: 200, data: userResult, message: 'created' }
		} else {
			userResult = await this.repository.update({
				id: userResult.id,
				questionId: question.id,
				compyuterName: request.headers['user-agent'],
				hasFinished: payload.hasFinished,
				questionCount: payload.number,
			})
		}

		return { status_code: 200, data: userResult, message: 'updated' }
	}

	async findAll(query: IUserResultFindAll): Promise<IUserResultFindAllResponse> {
		const userResult = await this.repository.findAllPagination(query)
		return userResult
	}

	async findOne(id: string): Promise<IUserResultResponse> {
		const userResult = await this.repository.findOne(id)

		if (!userResult) {
			throw new NotFoundException('User result not found')
		}

		return userResult
	}


}
