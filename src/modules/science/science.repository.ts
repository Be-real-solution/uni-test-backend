import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma'
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
} from './interfaces'

@Injectable()
export class ScienceRepository {
	private readonly prisma: PrismaService

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async findFull(payload: ScienceFindFullRequest): Promise<ScienceFindFullResponse> {
		const sciences = await this.prisma.science.findMany({
			where: { deletedAt: null },
			select: { id: true, name: true, since_id: true, createdAt: true },
			orderBy: [{ createdAt: 'desc' }],
		})

		return sciences
	}

	async findAll(payload: ScienceFindAllRequest): Promise<ScienceFindAllResponse> {
		const sciences = await this.prisma.science.findMany({
			where: { deletedAt: null },
			skip: (payload.pageNumber - 1) * payload.pageSize,
			take: payload.pageSize,
			select: { id: true, name: true, since_id: true, createdAt: true },
			orderBy: [{ createdAt: 'desc' }],
		})

		const sciencesCount = await this.prisma.science.count({
			where: { deletedAt: null },
		})

		return {
			pageSize: sciences.length,
			totalCount: sciencesCount,
			pageCount: Math.ceil(sciencesCount / payload.pageSize),
			data: sciences,
		}
	}

	async findOne(payload: ScienceFindOneRequest): Promise<ScienceFindOneResponse> {
		const science = await this.prisma.science.findFirst({
			where: { id: payload.id, deletedAt: null },
			select: { id: true, name: true, since_id: true, createdAt: true },
		})

		return science
	}

	async findByNameOrSinceId(
		payload: Partial<ScienceFindOneResponse>,
	): Promise<ScienceFindOneResponse> {
		const science = await this.prisma.science.findFirst({
			where: {
				OR: [{ name: payload.name }, { since_id: payload.since_id }],
				id: { not: payload.id },
				deletedAt: null,
			},
		})
		return science
	}

	async create(payload: ScienceCreateRequest): Promise<ScienceCreateResponse> {
		const since = await this.prisma.science.findFirst({ where: { since_id: payload.since_id } })

		await this.prisma.science.create({ data: { ...payload } })
		return null
	}

	async update(
		payload: ScienceFindOneRequest & ScienceUpdateRequest,
	): Promise<ScienceUpdateRequest> {
		await this.prisma.science.update({
			where: { id: payload.id, deletedAt: null },
			data: { ...payload },
		})
		return null
	}

	async delete(payload: ScienceDeleteRequest): Promise<ScienceDeleteResponse> {
		await this.prisma.science.update({
			where: { id: payload.id, deletedAt: null },
			data: { deletedAt: new Date() },
		})
		return null
	}

	async findAllForArchivePage(userId: string): Promise<ScienceFindFullForArchive[]> {
		const sciences = await this.prisma.science.findMany({
			where: {
				deletedAt: null,
				collections: {
					some: {
						archives: {
							some: {
								userId: userId,
							},
						},
					},
				},
			},
			select: {
				id: true,
				name: true,
				since_id: true,
				createdAt: true,
				collections: {
					select: {
						id: true,
						amountInTest: true,
						createdAt: true,
						givenMinutes: true,
						maxAttempts: true,
						language: true,
						name: true,
						archives: {
							select: {
								course: { select: { id: true, stage: true } },
								faculty: { select: { id: true, name: true } },
								group: { select: { id: true, name: true } },
								result: true,
								id: true,
								testCount: true,
							},
						},
					},
				},
			},
			orderBy: [{ createdAt: 'desc' }],
		})

		return sciences
	}

	async findAllWithUserCollection(
		payload: ScienceFindOnwWithUserCollectionRequest,
	): Promise<ScienceFindOneWithUserCollection[]> {
		const sciences = await this.prisma.science.findMany({
			where: {
				deletedAt: null,
				collections: {
					some: {
						userCollectiona: {
							some: {
								userId: payload.userId,
								deletedAt: null,
								haveAttempt: { gt: 0 },
							},
						},
					},
				},
			},
			select: {
				id: true,
				name: true,
				since_id: true,
				collections: {
					select: {
						id: true,
						amountInTest: true,
						givenMinutes: true,
						name: true,
						maxAttempts: true,
						language: true,
						userCollectiona: {
							where: { userId: payload.userId },
							select: {
								haveAttempt: true,
								user: {
									select: { fullName: true, id: true },
								},
							},
						},
					},
				},
			},
			orderBy: [{ createdAt: 'desc' }],
		})

		const mappedS = sciences.map((s) => {
			const collections = s.collections
				.map((c) => {
					const co = {
						id: c.id,
						amountInTest: c.amountInTest,
						givenMinutes: c.givenMinutes,
						name: c.name,
						maxAttempts: c.maxAttempts,
						language: c.language,
						userCollections: c.userCollectiona,
					}

					return co
				})
				.filter((c) => c.userCollections.length)

			const sc = {
				id: s.id,
				name: s.name,
				since_id: s.since_id,
				collections: collections,
			}
			return sc
		})
		return mappedS
	}
}
