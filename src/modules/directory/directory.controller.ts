import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { DirectoryService } from './directory.service'
import { CreateDirectoryDto } from './dto/create-directory.dto'
import { UpdateDirectoryDto } from './dto/update-directory.dto'
import { CheckAuthGuard } from 'guards'
import { IResponse } from 'interfaces/response.interfaces'
import { ICreateDirectoryResponse, IFindOneDirectoryResponse } from './interfaces'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SwaggerDirectoryDto } from './dto'

@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@ApiTags('Directory')
@Controller('directory')
export class DirectoryController {
	constructor(private readonly directoryService: DirectoryService) {}

	@ApiResponse({ type: SwaggerDirectoryDto })
	@Post()
	create(@Body() payload: CreateDirectoryDto): Promise<IResponse<ICreateDirectoryResponse>> {
		return this.directoryService.create(payload)
	}

	@ApiResponse({ type: [SwaggerDirectoryDto] })
	@Get()
	findAll(): Promise<IFindOneDirectoryResponse[]> {
		return this.directoryService.findAll()
	}

	@ApiResponse({ type: SwaggerDirectoryDto })
	@Get(':id')
	findOne(@Param('id') id: string): Promise<IFindOneDirectoryResponse> {
		return this.directoryService.findOne(id)
	}

	@ApiResponse({ type: SwaggerDirectoryDto })
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() payload: UpdateDirectoryDto,
	): Promise<IResponse<IFindOneDirectoryResponse>> {
		return this.directoryService.update(id, payload)
	}

	@ApiResponse({ type: SwaggerDirectoryDto })
	@Delete(':id')
	remove(@Param('id') id: string): Promise<IResponse<[]>> {
		return this.directoryService.remove(id)
	}
}
