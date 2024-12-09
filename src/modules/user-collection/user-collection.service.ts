import { BadRequestException, Injectable } from '@nestjs/common'
import { IResponse } from 'interfaces/response.interfaces'
import {
	UserCollectionCreateManyRequest,
	UserCollectionCreateRequest,
	UserCollectionCreateResponse,
	UserCollectionDeleteRequest,
	UserCollectionFindAllRequest,
	UserCollectionFindAllResponse,
	UserCollectionFindFullRequest,
	UserCollectionFindFullResponse,
	UserCollectionFindOneRequest,
	UserCollectionFindOneResponse,
	UserCollectionUpdateRequest,
	UserCollectionUpdateResponse,
} from './interfaces'
import { UserCollectionRepository } from './user-collection.repository'

@Injectable()
export class UserCollectionService {
	private readonly repository: UserCollectionRepository
	constructor(repository: UserCollectionRepository) {
		this.repository = repository
	}

	async findFull(
		payload: UserCollectionFindFullRequest,
	): Promise<IResponse<UserCollectionFindFullResponse>> {
		const userCollections = await this.repository.findFull(payload)
		return { status_code: 200, data: userCollections, message: 'success' }
	}

	async findAll(
		payload: UserCollectionFindAllRequest,
	): Promise<IResponse<UserCollectionFindAllResponse>> {
		const userCollections = await this.repository.findAll(payload)
		return { status_code: 200, data: userCollections, message: 'success' }
	}

	async findOne(
		payload: UserCollectionFindOneRequest,
	): Promise<IResponse<UserCollectionFindOneResponse>> {
		const userCollection = await this.repository.findOne(payload)
		if (!userCollection) {
			throw new BadRequestException('UserCollection not found')
		}
		return { status_code: 200, data: userCollection, message: 'success' }
	}

	async findOneByUserCollection(
		payload: Partial<UserCollectionCreateRequest>,
	): Promise<UserCollectionFindOneResponse> {
		const userCollection = await this.repository.findByUserCollection({
			userId: payload.userId,
			collectionId: payload.collectionId,
		})
		if (userCollection) {
			throw new BadRequestException('UserCollection already exists')
		}
		return userCollection
	}

	async create(
		payload: UserCollectionCreateRequest,
	): Promise<IResponse<UserCollectionCreateResponse>> {
		await this.findOneByUserCollection({
			userId: payload.userId,
			collectionId: payload.collectionId,
		})
		const userCollection = await this.repository.create(payload)
		return { status_code: 201, data: userCollection, message: 'created' }
	}

	async createMany(payload: UserCollectionCreateManyRequest): Promise<IResponse<[]>> {
		await this.repository.createMany(payload)
		return { status_code: 201, data: [], message: 'created' }
	}

	async update(
		params: UserCollectionFindOneRequest,
		payload: UserCollectionUpdateRequest,
	): Promise<IResponse<UserCollectionUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.collectionId || payload.userId
			? await this.findOneByUserCollection({
					userId: payload.userId,
					collectionId: payload.collectionId,
			  })
			: null

		const userCollection = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: userCollection, message: 'updated' }
	}

	async delete(payload: UserCollectionDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}
}
