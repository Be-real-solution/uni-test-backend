import { Injectable } from '@nestjs/common'
import { PrismaService } from 'modules/prisma'
import {
	ICreateUserResultRepository,
	IUpdateUserResultRepository,
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

	async findOneByUserIdCollectionId(payload: IUpdateUserResultRepository) {
		return await this.prisma.userResult.findFirst({
			where: {
				userId: payload.userId,
				collectionId: payload.collectionId,
				hasFinished: false,
			},
		})
	}

	async findOne(id: string): Promise<IUserResultResponse> {
		return this.prisma.userResult.findFirst({
			where: { id },
			include: {
				user: true,
				collection: true,
				question: true,
				group: true,
			},
		})
	}

	async findAllPagination(query: IUserResultFindAll): Promise<IUserResultFindAllResponse> {
		// let where_condition = {}

		// if (query.search) {
		// 	where_condition = {user: { fullName: { contains: query.search, mode: 'insensitive' }}
		// }
		if (query.hasFinished) {
			query.hasFinished = String(query.hasFinished) === "false"? false : true
		}

		console.log(query);
		

		const userResult = await this.prisma.userResult.findMany({
			skip: (query.pageNumber - 1) * query.pageSize,
			take: +query.pageSize,
			where: {
				hasFinished: query.hasFinished,
				collectionId: query.collectionId,
				user: { fullName: { contains: query.search, mode: 'insensitive' } },
			},
			include: { user: true, group: true, collection: true, question: true },
			orderBy: [{ createdAt: 'desc' }],
		})

		const userResultCount = await this.prisma.userResult.count({
			where: {
				hasFinished: query.hasFinished,
				collectionId: query.collectionId,
				user: { fullName: { contains: query.search, mode: 'insensitive' } },
			},
		})

		return {
			pageSize: userResult.length,
			totalCount: userResultCount,
			pageCount: Math.ceil(userResultCount / query.pageSize),
			data: userResult,
		}
	}
}
