import { Injectable, NotFoundException } from '@nestjs/common'
import { IResponse } from 'interfaces/response.interfaces'
import { ICreateSetting, ISettingResponse, IUpdateSetting } from './interfaces/setting.interface'
import { SettingRepository } from './setting.repository'

@Injectable()
export class SettingService {
	private readonly repository: SettingRepository

	constructor(repository: SettingRepository) {
		this.repository = repository
	}

	async create(payload: ICreateSetting): Promise<IResponse<ISettingResponse>> {
		const setting = await this.repository.create(payload)

		return { status_code: 201, data: setting, message: 'created' }
	}

	async findAll(): Promise<ISettingResponse[]> {
		return this.repository.findAll()
	}

	async findOne(id: string): Promise<ISettingResponse> {
		const setting = await this.repository.findOne(id)

		if (!setting) {
			throw new NotFoundException('setting not found')
		}

		return setting
	}

	async update(id: string, payload: IUpdateSetting): Promise<IResponse<ISettingResponse>> {
		await this.findOne(id)

		const setting = await this.repository.update(id, payload)

		return { status_code: 200, data: setting, message: 'updated' }
	}

	async remove(id: string): Promise<IResponse<[]>> {
		await this.findOne(id)

		await this.repository.remove(id)

		return { status_code: 200, data: [], message: 'deleted' }
	}
}
