import { BadRequestException, Injectable } from '@nestjs/common'
import { ScienceRepository } from './science.repository'
import {
	ScienceCreateRequest,
	ScienceCreateResponse,
	ScienceDeleteRequest,
	ScienceDeleteResponse,
	ScienceFindAllRequest,
	ScienceFindAllResponse,
	ScienceFindFullForArchive,
	ScienceFindFullRequest,
	ScienceFindFullResponse,
	ScienceFindOneRequest,
	ScienceFindOneResponse,
	ScienceFindOneWithUserCollection,
	ScienceFindOnwWithUserCollectionRequest,
	ScienceUpdateRequest,
	ScienceUpdateResponse,
} from './interfaces'
import { IResponse } from 'interfaces/response.interfaces'

@Injectable()
export class ScienceService {
	private readonly repository: ScienceRepository
	constructor(repository: ScienceRepository) {
		this.repository = repository
	}

	async findFull(payload: ScienceFindFullRequest): Promise<ScienceFindFullResponse> {
		const sciences = this.repository.findFull(payload)
		return sciences
	}

	async findAll(payload: ScienceFindAllRequest): Promise<ScienceFindAllResponse> {
		const sciences = this.repository.findAll(payload)
		return sciences
	}

	async findAllForArchive(id: string): Promise<ScienceFindFullForArchive[]> {
		const sciences = this.repository.findAllForArchivePage(id)
		return sciences
	}

	async findOne(payload: ScienceFindOneRequest): Promise<ScienceFindOneResponse> {
		const science = await this.repository.findOne(payload)
		if (!science) {
			throw new BadRequestException('Science not found')
		}
		return science
	}

	async findOneBySinceId(
		payload: Partial<ScienceFindOneResponse>,
	): Promise<ScienceFindOneResponse> {
		const science = await this.repository.findByNameOrSinceId({
			since_id: payload.since_id,
			id: payload.id,
		})
		if (science) {
			throw new BadRequestException('Science already exists')
		}
		return science
	}

	async create(payload: ScienceCreateRequest): Promise<IResponse<ScienceCreateResponse>> {
		await this.findOneBySinceId({ since_id: payload.since_id })
		const since = await this.repository.create(payload)
		return { status_code: 201, data: since, message: 'created' }
	}

	async update(
		params: ScienceFindOneRequest,
		payload: ScienceUpdateRequest,
	): Promise<IResponse<ScienceUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.name ? await this.findOneBySinceId({ id: params.id }) : null

		const since = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: since, message: 'updated' }
	}

	async delete(payload: ScienceDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}

	async findAllWithUserCollection(
		payload: ScienceFindOnwWithUserCollectionRequest,
	): Promise<ScienceFindOneWithUserCollection[]> {
		return this.repository.findAllWithUserCollection(payload)
	}
}
