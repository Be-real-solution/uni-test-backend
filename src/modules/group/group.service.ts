import { BadRequestException, Injectable } from '@nestjs/common'
import { IResponse } from 'interfaces/response.interfaces'
import { GroupRepository } from './group.repository'
import {
	GroupCreateRequest,
	GroupCreateResponse,
	GroupDeleteRequest,
	GroupFindAllRequest,
	GroupFindAllResponse,
	GroupFindFullRequest,
	GroupFindFullResponse,
	GroupFindOneRequest,
	GroupFindOneResponse,
	GroupUpdateRequest,
	GroupUpdateResponse,
} from './interfaces'

@Injectable()
export class GroupService {
	private readonly repository: GroupRepository
	constructor(repository: GroupRepository) {
		this.repository = repository
	}

	async findFull(payload: GroupFindFullRequest): Promise<IResponse<GroupFindFullResponse>> {
		const groups = await this.repository.findFull(payload)
		return { status_code: 200, data: groups, message: 'success' }
	}

	async findAll(payload: GroupFindAllRequest): Promise<IResponse<GroupFindAllResponse>> {
		const groups = await this.repository.findAll(payload)
		return { status_code: 200, data: groups, message: 'success' }
	}

	async findOne(payload: GroupFindOneRequest): Promise<IResponse<GroupFindOneResponse>> {
		const group = await this.repository.findOne(payload)
		if (!group) {
			throw new BadRequestException('Group not found')
		}
		return { status_code: 200, data: group, message: 'success' }
	}

	async findOneByName(payload: Partial<GroupFindOneResponse>): Promise<GroupFindOneResponse> {
		const group = await this.repository.findByName({ name: payload.name, id: payload.id })
		if (group) {
			throw new BadRequestException('Group already exists')
		}
		return group
	}

	async create(payload: GroupCreateRequest): Promise<IResponse<GroupCreateResponse>> {
		await this.findOneByName({ name: payload.name })
		const group = await this.repository.create(payload)
		return { status_code: 201, data: group, message: 'created' }
	}

	async update(
		params: GroupFindOneRequest,
		payload: GroupUpdateRequest,
	): Promise<IResponse<GroupUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.name ? await this.findOneByName({ name: payload.name, id: params.id }) : null

		const group = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: group, message: 'updated' }
	}

	async delete(payload: GroupDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}
}
