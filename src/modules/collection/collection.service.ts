import { BadRequestException, Injectable } from '@nestjs/common'
import { CollectionRepository } from './collection.repository'
import {
	CollectionBeforeCreateRequest,
	CollectionBeforeCreateResponse,
	CollectionCreateRequest,
	CollectionCreateResponse,
	CollectionDeleteRequest,
	CollectionDeleteResponse,
	CollectionFindAllRequest,
	CollectionFindAllResponse,
	CollectionFindFullRequest,
	CollectionFindFullResponse,
	CollectionFindOneRequest,
	CollectionFindOneResponse,
	CollectionFindOneWithQuestionAnswers,
	CollectionUpdateRequest,
	CollectionUpdateResponse,
} from './interfaces'
import { QuestionService } from '../question'
import { IResponse } from 'interfaces/response.interfaces'

@Injectable()
export class CollectionService {
	private readonly repository: CollectionRepository
	private readonly questionService: QuestionService
	constructor(repository: CollectionRepository, questionService: QuestionService) {
		this.repository = repository
		this.questionService = questionService
	}

	async findFull(payload: CollectionFindFullRequest): Promise<CollectionFindFullResponse> {
		const collections = this.repository.findFull(payload)
		return collections
	}

	async findAll(payload: CollectionFindAllRequest): Promise<CollectionFindAllResponse> {
		const collections = this.repository.findAll(payload)
		return collections
	}

	async findOne(payload: CollectionFindOneRequest): Promise<CollectionFindOneResponse> {
		const collection = await this.repository.findOne(payload)
		if (!collection) {
			throw new BadRequestException('Collection not found')
		}
		return collection
	}

	async findOneWithQuestionAnswers(
		payload: CollectionFindOneRequest,
	): Promise<CollectionFindOneWithQuestionAnswers> {
		const collection = await this.repository.findOneWithQuestionAnswers(payload)
		if (!collection) {
			throw new BadRequestException('Collection not found')
		}
		return collection
	}

	async findOneWithQuestions(
		payload: CollectionFindOneRequest,
	): Promise<CollectionFindOneWithQuestionAnswers> {
		const collection = await this.repository.findOneWithQuestionAnswers(payload)
		if (!collection) {
			throw new BadRequestException('Collection not found')
		}
		if (!collection.questions.length) {
			throw new BadRequestException('Collections questions is empty!')
		}

		const mappedQuestions = collection.questions.map((q) => {
			return {
				id: q.id,
				text: q.text,
				answers: q.answers,
				imageUrl: q.imageUrl,
				createdAt: q.createdAt,
				multipleChoice: q.answers.filter((a) => a.isCorrect === true).length > 1,
			}
		})

		const { amountInTest } = collection

		let repeatedQuestions = [...mappedQuestions]
		while (repeatedQuestions.length < amountInTest) {
			repeatedQuestions = repeatedQuestions.concat(mappedQuestions)
		}

		const shuffledQuestions = repeatedQuestions
			.sort(() => 0.5 - Math.random())
			.slice(0, amountInTest)

		const shuffledQuestionsWithAnswers = shuffledQuestions.map((question) => ({
			...question,
			answers: question.answers.sort(() => 0.5 - Math.random()),
		}))

		return {
			...collection,
			questions: shuffledQuestionsWithAnswers,
		}
	}

	async findOneAndReturnTxt(
		payload: CollectionFindOneRequest,
	): Promise<{ filename: string; content: string }> {
		const collection = await this.repository.findOneWithQuestionAnswers(payload)

		let content = ''
		collection.questions.forEach((q) => {
			content = content + `# ${q.text}\n`
			q.answers.forEach((a) => {
				content = content + `${a.isCorrect ? '+' : '-'} ${a.text}\n`
			})
			content = content + '\n'
		})

		return { filename: collection.name, content: content }
	}

	async findOneByName(
		payload: Partial<CollectionFindOneResponse>,
	): Promise<CollectionFindOneResponse> {
		const collection = await this.repository.findByName({ name: payload.name, id: payload.id })
		if (collection) {
			throw new BadRequestException('Collection already exists')
		}
		return collection
	}

	async create(payload: CollectionCreateRequest): Promise<CollectionCreateResponse> {
		await this.findOneByName({ name: payload.name })
		const collection = await this.repository.create(payload)

		return collection
	}

	async createWithQuestions(
		payload: CollectionCreateRequest,
		text: string,
	): Promise<CollectionCreateResponse> {
		await this.findOneByName({ name: payload.name })
		const collection = await this.repository.create(payload)
		await this.questionService
			.createManyWithAnswers({ collectionId: collection.id }, text)
			.catch(async (e) => {
				await this.repository.HardDelete({ id: collection.id })
				console.log(e)
				throw new BadRequestException(e)
			})
		return collection
	}

	async confirmCreateWithQuestions(
		payload: CollectionBeforeCreateResponse,
	): Promise<CollectionCreateResponse> {
		await this.findOneByName({ name: payload.name })
		const collection = await this.repository.create({
			adminId: payload.adminId,
			amountInTest: payload.amountInTest,
			givenMinutes: payload.givenMinutes,
			language: payload.language,
			maxAttempts: payload.maxAttempts,
			name: payload.name,
			scienceId: payload.science.id,
			directoryId: payload.directoryId,
		})
		await this.questionService
			.confirmCreateManyWithAnswers(
				{ collectionId: collection.id },
				{ questions: payload.questions },
			)
			.catch(async (e) => {
				await this.repository.HardDelete({ id: collection.id })
				console.log(e)

				throw new BadRequestException(e)
			})
		return collection
	}

	async returnWithQuestions(
		payload: CollectionBeforeCreateRequest,
		text: string,
	): Promise<CollectionBeforeCreateResponse> {
		payload.name ? await this.findOneByName({ name: payload.name }) : null
		const ques = await this.questionService.returnManyWithAnswers(text)
		let s: any
		if (payload.scienceId) {
			s = await this.repository.scienceFindOne({ id: payload.scienceId })
		}
		return {
			amountInTest: payload.amountInTest,
			givenMinutes: payload.givenMinutes,
			language: payload.language,
			maxAttempts: payload.maxAttempts,
			name: payload.name,
			science: s,
			questions: ques.questions,
			adminId: payload.adminId,
			directoryId: payload.directoryId,
		}
	}

	async update(
		params: CollectionFindOneRequest,
		payload: CollectionUpdateRequest,
	): Promise<CollectionUpdateResponse> {
		await this.findOne({ id: params.id })
		payload.name ? await this.findOneByName({ name: payload.name, id: params.id }) : null

		const collection = await this.repository.update({ ...params, ...payload })

		return collection
	}

	async delete(payload: CollectionDeleteRequest): Promise<CollectionDeleteResponse> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return null
	}
}
