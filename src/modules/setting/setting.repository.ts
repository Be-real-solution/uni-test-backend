import { Injectable } from '@nestjs/common'
import { PrismaService } from 'modules/prisma'
import { ICreateSetting, ISettingResponse, IUpdateSetting } from './interfaces/setting.interface'

@Injectable()
export class SettingRepository {
	private readonly prisma: PrismaService

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async create(payload: ICreateSetting): Promise<ISettingResponse> {
		return this.prisma.setting.create({ data: payload })
	}

	async findAll(): Promise<ISettingResponse[]> {
		return this.prisma.setting.findMany({ orderBy: { createdAt: 'desc' } })
	}

	async findOne(id: string): Promise<ISettingResponse> {
		return this.prisma.setting.findFirst({ where: { id } })
	}

	async update(id: string, payload: IUpdateSetting): Promise<ISettingResponse> {
		return this.prisma.setting.update({ where: { id }, data: payload })
	}

	async remove(id: string): Promise<null> {
		await this.prisma.setting.delete({ where: { id } })
		return null
	}
}
