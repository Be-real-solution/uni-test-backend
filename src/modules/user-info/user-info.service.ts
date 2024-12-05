import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserInfoRepository } from './user-info.repository'
import {
	UserInfoCreateRequest,
	UserInfoCreateResponse,
	UserInfoDeleteRequest,
	UserInfoDeleteResponse,
	UserInfoFindAllRequest,
	UserInfoFindAllResponse,
	UserInfoFindFullRequest,
	UserInfoFindFullResponse,
	UserInfoFindOneRequest,
	UserInfoFindOneResponse,
	UserInfoUpdateRequest,
	UserInfoUpdateResponse,
} from './interfaces'
import { IResponse } from 'interfaces/response.interfaces'

@Injectable()
export class UserInfoService {
	private readonly repository: UserInfoRepository
	constructor(repository: UserInfoRepository) {
		this.repository = repository
	}

	async findFull(payload: UserInfoFindFullRequest): Promise<UserInfoFindFullResponse> {
		const userInfos = this.repository.findFull(payload)
		return userInfos
	}

	async findAll(payload: UserInfoFindAllRequest): Promise<UserInfoFindAllResponse> {
		const userInfos = this.repository.findAll(payload)
		return userInfos
	}

	async findOne(payload: UserInfoFindOneRequest): Promise<UserInfoFindOneResponse> {
		const userInfo = await this.repository.findOne(payload)
		if (!userInfo) {
			throw new BadRequestException('UserInfo not found')
		}
		return userInfo
	}

	async findOneByUser(payload: Partial<UserInfoCreateRequest>): Promise<UserInfoFindOneResponse> {
		const userInfo = await this.repository.findByUser({ userId: payload.userId })
		if (userInfo) {
			throw new BadRequestException('UserInfo already exists')
		}
		return userInfo
	}

	async findOneByUserId(
		payload: Partial<UserInfoCreateRequest>,
	): Promise<UserInfoFindOneResponse> {
		const userInfo = await this.repository.findByUser({ userId: payload.userId })
		if (!userInfo) {
			throw new BadRequestException('UserInfo not found')
		}
		return userInfo
	}

	async findOneByHemisId(
		payload: Partial<UserInfoCreateRequest>,
	): Promise<UserInfoFindOneResponse> {
		const userInfo = await this.repository.findOneByHemisId({ hemisId: payload.hemisId })
		if (!userInfo) {
			throw new UnauthorizedException('User not found')
		}
		return userInfo
	}

	async findByHemisId(payload: Partial<UserInfoCreateRequest>): Promise<UserInfoFindOneResponse> {
		const userInfo = await this.repository.findOneByHemisId2({
			hemisId: payload.hemisId,
			userId: payload.userId,
		})
		if (userInfo) {
			throw new BadRequestException('UserInfo with this hemisId already exists')
		}
		return userInfo
	}

	async create(payload: UserInfoCreateRequest): Promise<IResponse<UserInfoCreateResponse>> {
		await this.findByHemisId({ hemisId: payload.hemisId })
		await this.findOneByUser({ userId: payload.userId })
		const user = await this.repository.create(payload)

		return { status_code: 201, data: user, message: 'created' }
	}

	async update(
		params: UserInfoFindOneRequest,
		payload: UserInfoUpdateRequest,
	): Promise<IResponse<UserInfoUpdateResponse>> {
		await this.findOne({ id: params.id })
		await this.findByHemisId({ hemisId: payload.hemisId, userId: payload.userId })
		// payload.userId ? await this.findOneByUser({ userId: payload.userId }) : null

		const user = await this.repository.update({ ...params, ...payload })
		return { status_code: 200, data: user, message: 'updated' }
	}

	async delete(payload: UserInfoDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}
}
