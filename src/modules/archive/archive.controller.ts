import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { IResponse } from 'interfaces/response.interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { Roles } from '../../decorators'
import { CheckAuthGuard } from '../../guards'
import { ArchiveService } from './archive.service'
import {
	ArchiveCreateRequestDto,
	ArchiveDeleteRequestDto,
	ArchiveExcelResponseDto,
	ArchiveFindAllRequestDto,
	ArchiveFindAllResponseDto,
	ArchiveFindFullRequestDto,
	ArchiveFindFullResponseDto,
	ArchiveFindOneRequestDto,
	ArchiveFindOneResponseDto,
	ArchiveUpdateRequestDto,
} from './dtos'
import {
	ArchiveCreateResponse,
	ArchiveFindAllResponse,
	ArchiveFindFullResponse,
	ArchiveFindOneResponse,
	ArchiveUpdateResponse,
} from './interfaces'

@ApiTags('Archive')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('archive')
export class ArchiveController {
	private readonly service: ArchiveService

	constructor(service: ArchiveService) {
		this.service = service
	}

	@Get('full')
	@Roles('admin', 'student')
	@ApiResponse({ type: ArchiveFindFullResponseDto, isArray: true })
	findFull(
		@Query() payload: ArchiveFindFullRequestDto,
	): Promise<IResponse<ArchiveFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('excel-old')
	@Roles('admin', 'student')
	@ApiResponse({ type: null })
	findFullInExcel1(
		@Query() payload: ArchiveFindFullRequestDto,
		@Res() res: Response,
	): Promise<IResponse<[]>> {
		return this.service.downloadInExcel1(payload, res)
	}

	@Get('excel')
	@Roles('admin', 'student')
	@ApiResponse({ type: ArchiveExcelResponseDto })
	findFullInExcel(
		@Query() payload: ArchiveFindFullRequestDto,
	): Promise<IResponse<{ url: string }>> {
		return this.service.downloadInExcel(payload)
	}

	@Get('all')
	@ApiResponse({ type: ArchiveFindAllResponseDto })
	findAll(
		@Query() payload: ArchiveFindAllRequestDto,
	): Promise<IResponse<ArchiveFindAllResponse>> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiResponse({ type: ArchiveFindOneResponseDto })
	findOne(
		@Param() payload: ArchiveFindOneRequestDto,
	): Promise<IResponse<ArchiveFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: ArchiveCreateRequestDto): Promise<IResponse<ArchiveCreateResponse>> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: ArchiveFindOneRequestDto,
		@Body() payload: ArchiveUpdateRequestDto,
	): Promise<IResponse<ArchiveUpdateResponse>> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: ArchiveDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
