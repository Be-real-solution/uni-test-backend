import { Injectable } from '@nestjs/common'
import { PrismaService } from 'modules/prisma'
import {
	ICreateDirectory,
	ICreateDirectoryResponse,
	IFilterDirectory,
	IFindByName,
	IFindOneByParentIdOrName,
	IFindOneDirectoryResponse,
	IUpdateDirectory,
} from './interfaces'

@Injectable()
export class DirectoryRepository {
	private readonly prisma: PrismaService

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}
	async create(payload: ICreateDirectory): Promise<ICreateDirectoryResponse> {
		return this.prisma.directory.create({
			data: { name: payload.name, parentId: payload.parentId },
		})
	}

	async findOneByParentIdOrNameForCheck(
		payload: IFindOneByParentIdOrName,
	): Promise<IFindOneDirectoryResponse> {
		if (payload.id) {
			return this.prisma.directory.findFirst({
				where: { parent: { id: payload.id }, name: payload.name },
			})
		}
		return this.prisma.directory.findFirst({ where: { parentId: null, name: payload.name } })
	}

	async findOne(id: string): Promise<IFindOneDirectoryResponse> {
		return this.prisma.directory.findFirst({
			where: { id },
			include: {
				children: {
					orderBy: { createdAt: 'desc' },
					include: {
						children: true,
						collections: {
							where: { deletedAt: null },
							include: { science: true, admin: true },
						},
					},
				},
				parent: true,
				collections: {
					where: { deletedAt: null },
					include: { science: true, admin: true },
					orderBy: { createdAt: 'desc' },
				},
			},
		})
	}

	async findAll(query: IFilterDirectory): Promise<IFindOneDirectoryResponse[]> {
		return this.prisma.directory.findMany({
			where: query.search
				? { name: { contains: query.search, mode: 'insensitive' } }
				: { parentId: null },
			orderBy: { createdAt: 'desc' },
			include: {
				collections: {
					where: { deletedAt: null },
					include: { science: true, admin: true },
				},
				children: true,
			},
		})
	}

	async update(id: string, payload: IUpdateDirectory): Promise<IFindOneDirectoryResponse> {
		return this.prisma.directory.update({ where: { id }, data: payload })
	}

	async remove(id: string): Promise<IFindOneDirectoryResponse> {
		return this.prisma.directory.delete({ where: { id } })
	}

	async findByName(query: IFindByName): Promise<IFindOneDirectoryResponse> {
		if (query.specialityDirectoryId && query.levelDirectoryId) {
			return this.prisma.directory.findFirst({
				where: {
					AND: {
						name: query.subjectDirectoryId,
						children: {
							some: {
								AND: {
									name: query.specialityDirectoryId,
									children: { some: { name: query.levelDirectoryId } },
								},
							},
						},
					},
				},

				include: {
					children: {
						where: { name: query.specialityDirectoryId },
						include: { children: { where: { name: query.levelDirectoryId } } },
					},
				},
			})
		}

		if (query.specialityDirectoryId) {
			return this.prisma.directory.findFirst({
				where: {
					AND: {
						name: query.subjectDirectoryId,
						children: { some: { name: query.specialityDirectoryId } },
					},
				},
				include: { children: { where: { name: query.specialityDirectoryId } } },
			})
		}

		if (query.levelDirectoryId) {
			return null
		}

		return this.prisma.directory.findFirst({
			where: { name: query.subjectDirectoryId },
		})
	}
}
