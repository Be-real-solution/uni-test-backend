import { BadRequestException, Injectable } from '@nestjs/common'
import { IResponse } from 'interfaces/response.interfaces'
import { AnswerRepository } from './answer.repository'
import {
	AnswerCreateRequest,
	AnswerCreateResponse,
	AnswerDeleteRequest,
	AnswerFindAllRequest,
	AnswerFindAllResponse,
	AnswerFindFullRequest,
	AnswerFindFullResponse,
	AnswerFindOneRequest,
	AnswerFindOneResponse,
	AnswerUpdateRequest,
	AnswerUpdateResponse,
} from './interfaces'

@Injectable()
export class AnswerService {
	private readonly repository: AnswerRepository
	constructor(repository: AnswerRepository) {
		this.repository = repository
	}

	async findFull(payload: AnswerFindFullRequest): Promise<IResponse<AnswerFindFullResponse>> {
		const answers = await this.repository.findFull(payload)
		return { status_code: 200, data: answers, message: 'success' }
	}

	async findAll(payload: AnswerFindAllRequest): Promise<IResponse<AnswerFindAllResponse>> {
		const answers = await this.repository.findAll(payload)
		return { status_code: 200, data: answers, message: 'success' }
	}

	async findOne(payload: AnswerFindOneRequest): Promise<IResponse<AnswerFindOneResponse>> {
		const answer = await this.repository.findOne(payload)
		if (!answer) {
			throw new BadRequestException('Answer not found')
		}
		return { status_code: 200, data: answer, message: 'success' }
	}

	async findOneByTextWithQuestionId(
		payload: Partial<AnswerCreateRequest>,
	): Promise<AnswerFindOneResponse> {
		const answer = await this.repository.findByTextWithQuestionId({
			text: payload.text,
			questionId: payload.questionId,
		})
		if (answer) {
			throw new BadRequestException('Answer already exists')
		}
		return answer
	}

	async create(payload: AnswerCreateRequest): Promise<IResponse<AnswerCreateResponse>> {
		await this.findOneByTextWithQuestionId({
			text: payload.text,
			questionId: payload.questionId,
		})
		const answer = await this.repository.create(payload)
		return { status_code: 201, data: answer, message: 'created' }
	}

	async update(
		params: AnswerFindOneRequest,
		payload: AnswerUpdateRequest,
	): Promise<IResponse<AnswerUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.text
			? await this.findOneByTextWithQuestionId({
					text: payload.text,
					questionId: payload.questionId,
			  })
			: null

		const answer = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: answer, message: 'updated' }
	}

	async delete(payload: AnswerDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}
}
