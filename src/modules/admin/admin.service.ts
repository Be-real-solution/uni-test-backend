import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { IResponse } from 'interfaces/response.interfaces'
import { JWTService } from '../jwt'
import { AdminRepository } from './admin.repository'
import {
	AdminCreateRequest,
	AdminDeleteRequest,
	AdminFindAllRequest,
	AdminFindAllResponse,
	AdminFindFullRequest,
	AdminFindFullResponse,
	AdminFindOneRequest,
	AdminFindOneResponse,
	AdminSignInRequest,
	AdminSignInResponse,
	AdminUpdateRequest,
	AdminUpdateResponse,
} from './interfaces'

@Injectable()
export class AdminService {
	private readonly repository: AdminRepository
	private readonly jwtService: JWTService
	constructor(repository: AdminRepository, jwtService: JWTService) {
		this.repository = repository
		this.jwtService = jwtService
	}

	async findFull(payload: AdminFindFullRequest): Promise<IResponse<AdminFindFullResponse>> {
		const admins = await this.repository.findFull(payload)
		return { status_code: 200, data: admins, message: 'success' }
	}

	async findAll(payload: AdminFindAllRequest): Promise<IResponse<AdminFindAllResponse>> {
		const admins = await this.repository.findAll(payload)
		return { status_code: 200, data: admins, message: 'success' }
	}

	async findOne(payload: AdminFindOneRequest): Promise<IResponse<AdminFindOneResponse>> {
		const admin = await this.repository.findOne(payload)
		if (!admin) {
			throw new BadRequestException('Admin not found')
		}
		return { status_code: 200, data: admin, message: 'success' }
	}

	async findOneByEmail(
		payload: Partial<AdminFindOneResponse>,
	): Promise<IResponse<AdminFindOneResponse>> {
		const admin = await this.repository.findByEmail({
			emailAddress: payload.emailAddress,
			id: payload.id,
		})
		if (admin) {
			throw new BadRequestException('Admin already exists')
		}
		return { status_code: 200, data: admin, message: 'success' }
	}

	async findByEmail(payload: Partial<AdminFindOneResponse>): Promise<AdminFindOneResponse> {
		const admin = await this.repository.findByEmail({
			emailAddress: payload.emailAddress,
			id: payload.id,
		})
		return admin
	}

	async singIn(payload: AdminSignInRequest): Promise<IResponse<AdminSignInResponse>> {
		const admin = await this.findByEmail({ emailAddress: payload.hemisId })
		if (!admin) {
			throw new UnauthorizedException('User not found')
		}
		const isCorrect = await bcrypt.compare(payload.password, admin.password)
		if (!isCorrect) {
			throw new UnauthorizedException('User not found')
		}
		const tokens = await this.jwtService.getTokens({ id: admin.id })
		return { status_code: 200, data: { admin: admin, tokens: tokens }, message: 'success' }
	}

	async create(payload: AdminCreateRequest): Promise<IResponse<AdminFindOneResponse>> {
		const password = await bcrypt.hash(payload.password, 7)
		payload.emailAddress
			? await this.findOneByEmail({ emailAddress: payload.emailAddress })
			: null
		const admin = await this.repository.create({ ...payload, password })

		return { status_code: 201, data: admin, message: 'created' }
	}

	async update(
		params: AdminFindOneRequest,
		payload: AdminUpdateRequest,
	): Promise<IResponse<AdminUpdateResponse>> {
		await this.findOne({ id: params.id })
		payload.emailAddress
			? await this.findOneByEmail({ emailAddress: payload.emailAddress, id: params.id })
			: null
		const password = payload.password ? await bcrypt.hash(payload.password, 7) : undefined
		const admin = await this.repository.update({ ...params, ...payload, password })
		return { status_code: 200, data: admin, message: 'updated' }
	}

	async delete(payload: AdminDeleteRequest): Promise<IResponse<[]>> {
		await this.findOne(payload)
		await this.repository.delete(payload)
		return { status_code: 200, data: [], message: 'deleted' }
	}
}
