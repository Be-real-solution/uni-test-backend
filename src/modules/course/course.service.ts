import { BadRequestException, Injectable } from '@nestjs/common'
import { IResponse } from 'interfaces/response.interfaces'
import { CourseRepository } from './course.repository'
import {
	CourseCreateRequest,
	CourseCreateResponse,
	CourseDeleteRequest,
	CourseFindAllRequest,
	CourseFindAllResponse,
	CourseFindFullRequest,
	CourseFindFullResponse,
	CourseFindOneRequest,
	CourseFindOneResponse,
	CourseUpdateRequest,
	CourseUpdateResponse,
} from './interfaces'

@Injectable()
export class CourseService {
	private readonly repository: CourseRepository
	constructor(repository: CourseRepository) {
		this.repository = repository
	}

	async findFull(payload: CourseFindFullRequest): Promise<IResponse<CourseFindFullResponse>> {
		const courses = await this.repository.findFull(payload)
		return { status_code: 200, data: courses, message: 'success' }
	}

	async findAll(payload: CourseFindAllRequest): Promise<IResponse<CourseFindAllResponse>> {
		const courses = await this.repository.findAll(payload)
		return { status_code: 200, data: courses, message: 'success' }
	}

	async findOne(payload: CourseFindOneRequest): Promise<IResponse<CourseFindOneResponse>> {
		const course = await this.repository.findOne(payload)
		if (!course) {
			throw new BadRequestException('Course not found')
		}
		return { status_code: 200, data: course, message: 'success' }
	}

	async findOneByStage(payload: Partial<CourseFindOneResponse>): Promise<CourseFindOneResponse> {
		const course = await this.repository.findByStage({ stage: payload.stage, id: payload.id })
		if (course) {
			throw new BadRequestException('Course already exists')
		}
		return course
	}

	async create(payload: CourseCreateRequest): Promise<IResponse<CourseCreateResponse>> {
		await this.findOneByStage({ stage: payload.stage })
		const course = await this.repository.create(payload)
		return { status_code: 201, data: course, message: 'created' }
	}

	async update(
		params: CourseFindOneRequest,
		payload: CourseUpdateRequest,
	): Promise<IResponse<CourseUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.stage ? await this.findOneByStage({ stage: payload.stage, id: params.id }) : null

		const course = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: course, message: 'updated' }
	}

	async delete(payload: CourseDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}
}
