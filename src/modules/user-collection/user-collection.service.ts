import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common'
import { UserCollectionRepository } from './user-collection.repository'
import {
	UserCollectionCreateByHemisIdRequest,
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
import { ArchiveRepository } from 'modules/archive'
import { UserInfoService } from 'modules/user-info'

@Injectable()
export class UserCollectionService {
	private readonly repository: UserCollectionRepository
	private readonly archiveRepository: ArchiveRepository
	private readonly userInfoService: UserInfoService
	constructor(
		repository: UserCollectionRepository,
		@Inject(forwardRef(() => ArchiveRepository)) archiveRepository: ArchiveRepository,
		userInfoService: UserInfoService,
	) {
		this.repository = repository
		this.archiveRepository = archiveRepository
		this.userInfoService = userInfoService
	}

	async findFull(
		payload: UserCollectionFindFullRequest,
	): Promise<UserCollectionFindFullResponse> {
		const userCollections = await this.repository.findFull(payload)
		const list: any = []

		for (const col of userCollections) {
		
			if (col.isMakeup) {
				const archiveCount = await this.archiveRepository.findToday(
					payload.userId,
					col.collection.id,
				)
				if (archiveCount != col.haveAttempt) {
					list.push(col)
				}
			} else {
				list.push(col)
			}
		}

		return list
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

	async create(payload: UserCollectionCreateRequest): Promise<UserCollectionCreateResponse> {
		await this.findOneByUserCollection({
			userId: payload.userId,
			collectionId: payload.collectionId,
		})
		return this.repository.create(payload)
	}

	async createByHemisId(payload: UserCollectionCreateByHemisIdRequest) {
		const user = await this.userInfoService.findOneByHemisId({hemisId: payload.hemisId})
		const userCollection = await this.repository.findByUserCollection({
			userId: user.user.id,
			collectionId: payload.collectionId,
		})

		if (userCollection) {
			return userCollection
		}

		const data = await this.repository.create({
			haveAttempt: payload.haveAttempt,
			userId: user.user.id,
			collectionId: payload.collectionId,
			isMakeup: payload.isMakeup,
		})

		return data
	}

	async createMany(
		payload: UserCollectionCreateManyRequest,
	): Promise<UserCollectionCreateResponse> {
		return this.repository.createMany(payload)
	}

	async createManyMakeup(
		payload: UserCollectionCreateManyRequest,
	): Promise<UserCollectionCreateResponse> {
		return this.repository.createManyMakeup(payload)
	}

	async update(
		params: UserCollectionFindOneRequest,
		payload: UserCollectionUpdateRequest,
	): Promise<UserCollectionUpdateResponse> {
		await this.findOne({ id: params.id })
		payload.collectionId || payload.userId
			? await this.findOneByUserCollection({
					userId: payload.userId,
					collectionId: payload.collectionId,
			  })
			: null

		await this.repository.update({ ...params, ...payload })
		return null
	}

	async delete(payload: UserCollectionDeleteRequest): Promise<UserCollectionDeleteResponse> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return null
	}
}
