import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDirectoryDto } from './dto/create-directory.dto'
import { UpdateDirectoryDto } from './dto/update-directory.dto'
import { DirectoryRepository } from './directory.repository'
import { ICreateDirectory, ICreateDirectoryResponse, IFindOneDirectoryResponse, IUpdateDirectory } from './interfaces'
import { IResponse } from 'interfaces/response.interfaces'

@Injectable()
export class DirectoryService {
	private readonly repository: DirectoryRepository
	constructor(repository: DirectoryRepository) {
		this.repository = repository
	}

	async create(payload: ICreateDirectory): Promise<IResponse<ICreateDirectoryResponse>> {
		let directory: ICreateDirectoryResponse | null
		if (payload.parentId) {
			directory = await this.repository.findOneByParentIdOrNameForCheck({ id: payload.parentId, name: payload.name })
		} else {
			directory = await this.repository.findOneByParentIdOrNameForCheck({ name: payload.name })
		}

		if (directory) {
			throw new ConflictException('Bunday directory mavjud')
		}

		const new_direct = await this.repository.create(payload)

		return { status_code: 201, data: new_direct, message: 'success' }
	}

	async findAll(): Promise<IFindOneDirectoryResponse[]> {
		return this.repository.findAll()
	}

	async findOne(id: string): Promise<IFindOneDirectoryResponse> {
		const directory: IFindOneDirectoryResponse = await this.repository.findOne(id)

		if (!directory) {
			throw new NotFoundException('Bunday directory mavjud emas')
		}
		return  directory
	}

	async update(id: string, payload: IUpdateDirectory): Promise<IResponse<IFindOneDirectoryResponse>> {
		const old_directory = (await this.findOne(id))

		let new_directory: IFindOneDirectoryResponse | null

		if ((payload.parentId && payload.name) && (old_directory.parentId != payload.parentId || old_directory.name != payload.name)) {
			let payload_condition: { id: string | null; name: string } = { id: '', name: '' }
			if (payload.parentId && payload.name) {
				payload_condition.id = payload.parentId
				payload_condition.name = payload.name
			} else if (payload.parentId) {
				payload_condition.id = payload.parentId
				payload_condition.name = old_directory.name
			} else if (payload.name) {
				payload_condition.id = old_directory.parentId
				payload_condition.name = payload.name
			}

			new_directory = await this.repository.findOneByParentIdOrNameForCheck(payload_condition)
			if (new_directory) {
				throw new ConflictException('Bunday directory mavjud')
			}

			new_directory = await this.repository.update(id, payload)
		} else {
			new_directory = old_directory
		}

		return { status_code: 200, data: new_directory, message: 'success' }
	}

	async remove(id: string): Promise<IResponse<[]>> {
		const directory = await this.findOne(id)

		if (directory.children.length) {
			throw new BadRequestException("directoryda ma'lumotlar mavjud")
		}

		await this.repository.remove(id)
		return {status_code: 200, data: [], message: "success"}
	}
}