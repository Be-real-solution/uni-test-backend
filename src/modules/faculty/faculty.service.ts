import { BadRequestException, Injectable } from '@nestjs/common'
import { IResponse } from 'interfaces/response.interfaces'
import { FacultyRepository } from './faculty.repository'
import {
	FacultyCreateRequest,
	FacultyCreateResponse,
	FacultyDeleteRequest,
	FacultyFindAllRequest,
	FacultyFindAllResponse,
	FacultyFindFullForSetCollection,
	FacultyFindFullRequest,
	FacultyFindFullResponse,
	FacultyFindOneRequest,
	FacultyFindOneResponse,
	FacultyUpdateRequest,
	FacultyUpdateResponse,
} from './interfaces'

@Injectable()
export class FacultyService {
	private readonly repository: FacultyRepository
	constructor(repository: FacultyRepository) {
		this.repository = repository
	}

	async findFull(payload: FacultyFindFullRequest): Promise<IResponse<FacultyFindFullResponse>> {
		const facultys = await this.repository.findFull(payload)
		return { status_code: 200, data: facultys, message: 'success' }
	}

	async findAll(payload: FacultyFindAllRequest): Promise<IResponse<FacultyFindAllResponse>> {
		const facultys = await this.repository.findAll(payload)
		return { status_code: 200, data: facultys, message: 'success' }
	}

	async findOne(payload: FacultyFindOneRequest): Promise<IResponse<FacultyFindOneResponse>> {
		const faculty = await this.repository.findOne(payload)
		if (!faculty) {
			throw new BadRequestException('Faculty not found')
		}
		return { status_code: 200, data: faculty, message: 'success' }
	}

	async findOneByName(payload: Partial<FacultyFindOneResponse>): Promise<FacultyFindOneResponse> {
		const faculty = await this.repository.findByName({ name: payload.name, id: payload.id })
		if (faculty) {
			throw new BadRequestException('Faculty already exists')
		}
		return faculty
	}

	async create(payload: FacultyCreateRequest): Promise<IResponse<FacultyCreateResponse>> {
		await this.findOneByName({ name: payload.name })
		const faculty = await this.repository.create(payload)
		return { status_code: 201, data: faculty, message: 'created' }
	}

	async update(
		params: FacultyFindOneRequest,
		payload: FacultyUpdateRequest,
	): Promise<IResponse<FacultyUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.name ? await this.findOneByName({ name: payload.name, id: params.id }) : null

		const faculty = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: faculty, message: 'updated' }
	}

	async delete(payload: FacultyDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}

	async findAllForSetCollection(): Promise<IResponse<FacultyFindFullForSetCollection[]>> {
		const collection = await this.repository.getAllForSetCollections()
		return { status_code: 200, data: collection, message: 'success' }
	}
}
