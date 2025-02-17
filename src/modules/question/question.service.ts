import { BadRequestException, Injectable } from '@nestjs/common'
import { QuestionRepository } from './question.repository'
import {
	QuestionCreateRequest,
	QuestionCreateResponse,
	QuestionDeleteRequest,
	QuestionDeleteResponse,
	QuestionFindAllRequest,
	QuestionFindAllResponse,
	QuestionFindFullRequest,
	QuestionFindFullResponse,
	QuestionFindOneRequest,
	QuestionFindOneResponse,
	QuestionUpdateRequest,
	QuestionUpdateResponse,
	QuestionsCreateWithAnswersRequest,
	QuestionsCreateWithAnswersResponse,
} from './interfaces'
import { CollectionBeforeCreateResponse } from '../collection'
import { deleteFile } from 'libs/fileService'
import { AnswerService } from 'modules/answer/answer.service'
import { IResponse } from 'interfaces/response.interfaces'

@Injectable()
export class QuestionService {
	private readonly repository: QuestionRepository
	private readonly answerSerive: AnswerService

	constructor(repository: QuestionRepository, answerService: AnswerService) {
		this.repository = repository
		this.answerSerive = answerService
	}

	async findFull(payload: QuestionFindFullRequest): Promise<QuestionFindFullResponse> {
		const questions = this.repository.findFull(payload)
		return questions
	}

	async findAll(payload: QuestionFindAllRequest): Promise<QuestionFindAllResponse> {
		const questions = this.repository.findAll(payload)
		return questions
	}

	async findOne(payload: QuestionFindOneRequest): Promise<QuestionFindOneResponse> {
		const question = await this.repository.findOne(payload)
		if (!question) {
			throw new BadRequestException('Question not found')
		}
		return question
	}

	async findOneByTextWithCollectionId(
		payload: Partial<QuestionCreateRequest>,
	): Promise<QuestionFindOneResponse> {
		const question = await this.repository.findByTextWithCollectionId({
			text: payload.text,
			collectionId: payload.collectionId,
		})
		if (question) {
			throw new BadRequestException('Question already exists')
		}
		return question
	}
	async findManyByTextsWithCollectionId(payload: {
		texts: string[]
		collectionId: string
	}): Promise<QuestionFindFullResponse> {
		const questions = await this.repository.findByTextsWithCollectionId({
			texts: payload.texts,
			collectionId: payload.collectionId,
		})
		if (questions.length) {
			throw new BadRequestException(
				`This ${questions.map((q) => q.text).join(' ')} questions already exists in ${
					questions[0].collection.name
				}`,
			)
		}
		return questions
	}

	async create(payload: QuestionCreateRequest, file: any): Promise<QuestionCreateResponse> {
		try {
			await this.findOneByTextWithCollectionId({
				text: payload.text,
				collectionId: payload.collectionId,
			})
			return this.repository.create(payload, file?.filename)
		} catch (err) {
			if (file) {
				deleteFile(file.filename)
				throw err
			}
		}
	}

	async createManyWithAnswers(
		payload: Pick<QuestionsCreateWithAnswersRequest, 'collectionId'>,
		text: string,
	): Promise<QuestionsCreateWithAnswersResponse> {
		const qwa: QuestionsCreateWithAnswersRequest = {
			collectionId: payload.collectionId,
			questions: [],
		}
		const questions = text
			.split('#')
			.map((q) => q.trim())
			.filter((q) => q.toString())

		for (const q of questions) {
			const questionWithAnswers = q
				.split('\n')
				.map((w) => w.trim())
				.filter((w) => w.toString())

			const isExistTrueAnswer = questionWithAnswers
				.slice(1)
				.map((t) => t[0])
				.includes('+')

			if (!isExistTrueAnswer) {
				throw new BadRequestException(
					`Savolga to'g'ri javob berilmagan: ${questionWithAnswers[0]}`,
				)
			}

			qwa.questions.push({
				text: questionWithAnswers[0],
				answers: questionWithAnswers
					.map((q, i): any => {
						const isCorrect = q[0] === '+' ? true : false
						if (i !== 0) {
							return { isCorrect: isCorrect, text: q.slice(1).trim() }
						}
					})
					.slice(1),
			})
		}

		await this.findManyByTextsWithCollectionId({
			collectionId: payload.collectionId,
			texts: qwa.questions.map((q) => q.text),
		})

		await this.repository.createWithAnswers({ ...qwa })

		return null
	}

	async confirmCreateManyWithAnswers(
		collection: { collectionId: string },
		payload: Pick<CollectionBeforeCreateResponse, 'questions'>,
	): Promise<QuestionsCreateWithAnswersResponse> {
		await this.findManyByTextsWithCollectionId({
			collectionId: collection.collectionId,
			texts: payload.questions.map((q) => q.text),
		})

		payload.questions.forEach((q) => {
			if (!q.answers.filter((a) => a.isCorrect).length) {
				throw new BadRequestException("To'g'ri javob berilmagan savol: " + q.text)
			}
		})

		await this.repository.createWithAnswers({
			collectionId: collection.collectionId,
			questions: payload.questions,
		})

		return null
	}

	async returnManyWithAnswers(
		text: string,
	): Promise<Pick<CollectionBeforeCreateResponse, 'questions'>> {
		const qwa: Pick<QuestionsCreateWithAnswersRequest, 'questions'> = { questions: [] }
		const questions = text
			.split('#')
			.map((q) => q.trim())
			.filter((q) => q.toString())

		for (const q of questions) {
			const questionWithAnswers = q
				.split('\n')
				.map((w) => w.trim())
				.filter((w) => w.toString())

			qwa.questions.push({
				text: questionWithAnswers[0],
				answers: questionWithAnswers
					.map((q, i): any => {
						const isCorrect = q[0] === '+' ? true : false
						if (i !== 0) {
							return { isCorrect: isCorrect, text: q.slice(1).trim() }
						}
					})
					.slice(1),
			})
		}

		return qwa
	}

	async createManyWithAnswers2(
		payload: Pick<QuestionsCreateWithAnswersRequest, 'collectionId'>,
		text: string,
	): Promise<QuestionsCreateWithAnswersResponse> {
		const qwa: QuestionsCreateWithAnswersRequest = {
			collectionId: payload.collectionId,
			questions: [],
		}
		const questions = text
			.split('S:')
			.map((q) => q.trim())
			.filter((q) => q.toString())

		questions.forEach((q) => {
			const questionWithAnswers = q
				.split('J:')
				.map((w) => w.trim())
				.filter((w) => w.toString())

			if (questionWithAnswers.length - 1 !== this.countOccurrences(q, 'J:')) {
				throw new BadRequestException('Error with this question ' + q)
			} else {
				qwa.questions.push({
					text: questionWithAnswers[0],
					answers: questionWithAnswers
						.map((q, i): any => {
							const isCorrect = q[q.length - 1] === '+' ? true : false
							if (i !== 0) {
								return {
									isCorrect: isCorrect,
									text: isCorrect ? q.slice(0, q.length - 1) : q,
								}
							}
						})
						.slice(1),
				})
			}
		})

		await this.findManyByTextsWithCollectionId({
			collectionId: payload.collectionId,
			texts: qwa.questions.map((q) => q.text),
		})

		await this.repository.createWithAnswers({ ...qwa })

		return null
	}

	countOccurrences(mainStr: string, subStr: string): number {
		let count = 0
		let pos = mainStr.indexOf(subStr)

		while (pos !== -1) {
			count++
			pos = mainStr.indexOf(subStr, pos + 1)
		}

		return count
	}

	async update(
		params: QuestionFindOneRequest,
		payload: QuestionUpdateRequest,
		file: any,
	): Promise<IResponse<{}>> {
		try {
			const question = await this.findOne({ id: params.id })

			const imageUrl = question.imageUrl
			payload.text
				? await this.findOneByTextWithCollectionId({
						text: payload.text,
						collectionId: payload.collectionId,
				  })
				: null

			if (file) {
				payload.imageUrl = file.filename
			}
			await this.repository.update({ ...params, ...payload })

			if (payload.answers) {
				const answers = await this.answerSerive.findFull({ questionId: params.id })

				const new_answers = payload.answers.filter(
					(item) => !answers.some((value) => value.id == item.id),
				)

				const remove_answers = answers.filter(
					(item) => !payload.answers.some((value) => value.id == item.id),
				)

				const updated_answers = payload.answers.filter((item) =>
					answers.some((value) => value.id == item.id),
				)
				// console.log("1", new_answers, "2", remove_answers, "3", updated_answers);

				if (new_answers.length) {
					new_answers.forEach(async (item) => {
						try {
							await this.answerSerive.create({
								text: item.text,
								isCorrect: item.isCorrect,
								questionId: item.questionId,
							})
						} catch (error) {}
					})
				}

				if (remove_answers.length) {
					remove_answers.forEach(async (item) => {
						try {
							await this.answerSerive.delete({ id: item.id })
						} catch (error) {}
					})
				}

				if (updated_answers.length) {
					updated_answers.forEach(async (item) => {
						try {
							await this.answerSerive.update(
								{ id: item.id },
								{
									text: item.text,
									questionId: item.questionId,
									isCorrect: item.isCorrect,
								},
							)
						} catch (error) {}
					})
				}
			}

			if (file && imageUrl) {
				await deleteFile(imageUrl)
			}
			return { status_code: 200, data: {}, message: 'updated' }
		} catch (err) {
			if (file) {
				await deleteFile(file.filename)
			}
			throw err
		}
	}

	async delete(payload: QuestionDeleteRequest): Promise<QuestionDeleteResponse> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return null
	}
}
