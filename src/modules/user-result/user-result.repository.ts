import { Injectable } from '@nestjs/common'
import { PrismaService } from 'modules/prisma'
import {
	ICreateUserResultRepository,
	IUpdateUserResultRepository,
	IUserResultAnswerDataCreate,
	IUserResultAnswerDataResponse,
	IUserResultFindAll,
	IUserResultFindAllResponse,
	IUserResultResponse,
} from './interfaces/user-result.interfaces'

@Injectable()
export class UserResultRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async create(payload: ICreateUserResultRepository): Promise<IUserResultResponse> {
		return this.prisma.userResult.create({ data: payload })
	}

	async update(payload: IUpdateUserResultRepository) {
		return this.prisma.userResult.update({ where: { id: payload.id }, data: payload })
	}

	async findOneByUserId(payload: IUpdateUserResultRepository): Promise<IUserResultResponse> {
		return await this.prisma.userResult.findFirst({
			where: {
				userId: payload.userId,
				hasFinished: false,
			},
			include: { userResultAnswerData: true },
		})
	}

	async findOne(id: string): Promise<IUserResultResponse> {
		return this.prisma.userResult.findFirst({
			where: { id },
			include: {
				userResultAnswerData: true,
			},
		})
	}

	async findAllPagination(query: IUserResultFindAll): Promise<IUserResultFindAllResponse> {
		if (query.hasFinished) {
			query.hasFinished = String(query.hasFinished) === 'false' ? false : true
		}

		const userResult = await this.prisma.userResult.findMany({
			skip: (query.pageNumber - 1) * query.pageSize,
			take: +query.pageSize,
			where: {
				userId: query.userId,
				collectionId: query.collectionId,
				userFullName: query.fullName,
				groupName: query.group,
				facultyName: query.faculty,
				course: query.course,
				grade: query.grade,
				compyuterName: query.computerName,
				hemisId: query.hemisId,
				hasFinished: query.hasFinished,
			},
			orderBy: [{ createdAt: 'desc' }],
		})

		const userResultCount = await this.prisma.userResult.count({
			where: {
				userId: query.userId,
				collectionId: query.collectionId,
				userFullName: query.fullName,
				groupName: query.group,
				facultyName: query.faculty,
				course: query.course,
				grade: query.grade,
				compyuterName: query.computerName,
				hemisId: query.hemisId,
				hasFinished: query.hasFinished,
			},
		})

		return {
			pageSize: userResult.length,
			totalCount: userResultCount,
			pageCount: Math.ceil(userResultCount / query.pageSize),
			data: userResult,
		}
	}

	async removeUserResult(id: string): Promise<IUserResultResponse> {
		return this.prisma.userResult.delete({ where: { id } })
	}

	async createUserResultAnswerData(
		payload: IUserResultAnswerDataCreate,
	): Promise<IUserResultAnswerDataResponse> {
		return this.prisma.userResultAnswerData.create({ data: payload })
	}

	async removePendingUserResults(): Promise<null> {
		
		await this.prisma.userResult.deleteMany({
			where: { hasFinished: false, untilTime: { lt: new Date() } },
		})

		return null
	}
}
