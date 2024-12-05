import { BadRequestException, Injectable } from '@nestjs/common'
import { UserCollectionRepository } from './user-collection.repository'
import {
	UserCollectionCreateManyRequest,
	UserCollectionCreateRequest,
	UserCollectionCreateResponse,
	UserCollectionDeleteRequest,
	UserCollectionDeleteResponse,
	UserCollectionFindAllRequest,
	UserCollectionFindAllResponse,
	UserCollectionFindFullRequest,
	UserCollectionFindFullResponse,
	UserCollectionFindOneRequest,
	UserCollectionFindOneResponse,
	UserCollectionUpdateRequest,
	UserCollectionUpdateResponse,
} from './interfaces'
import { IResponse } from 'interfaces/response.interfaces'

@Injectable()
export class UserCollectionService {
	private readonly repository: UserCollectionRepository
	constructor(repository: UserCollectionRepository) {
		this.repository = repository
	}

	async findFull(
		payload: UserCollectionFindFullRequest,
	): Promise<UserCollectionFindFullResponse> {
		const userCollections = this.repository.findFull(payload)
		return userCollections
	}

	async findAll(payload: UserCollectionFindAllRequest): Promise<UserCollectionFindAllResponse> {
		const userCollections = this.repository.findAll(payload)
		return userCollections
	}

	async findOne(payload: UserCollectionFindOneRequest): Promise<UserCollectionFindOneResponse> {
		const userCollection = await this.repository.findOne(payload)
		if (!userCollection) {
			throw new BadRequestException('UserCollection not found')
		}
		return userCollection
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
