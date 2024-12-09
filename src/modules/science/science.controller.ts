import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IResponse } from 'interfaces/response.interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { UserIdInAccessToken } from '../../decorators'
import { CheckAuthGuard } from '../../guards'
import {
	ScienceCreateRequestDto,
	ScienceDeleteRequestDto,
	ScienceFindAllRequestDto,
	ScienceFindAllResponseDto,
	ScienceFindFullForArchiveDto,
	ScienceFindFullRequestDto,
	ScienceFindFullResponseDto,
	ScienceFindOneRequestDto,
	ScienceFindOneResponseDto,
	ScienceFindOneWithUserCollectionDto,
	ScienceFindOnwWithUserCollectionRequestDto,
	ScienceUpdateRequestDto,
} from './dtos'
import {
	ScienceCreateResponse,
	ScienceFindAllResponse,
	ScienceFindFullForArchive,
	ScienceFindFullResponse,
	ScienceFindOneResponse,
	ScienceFindOneWithUserCollection,
	ScienceUpdateResponse,
} from './interfaces'
import { ScienceService } from './science.service'

@ApiTags('Science')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('science')
export class ScienceController {
	private readonly service: ScienceService

	constructor(service: ScienceService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: ScienceFindFullResponseDto, isArray: true })
	findFull(
		@Query() payload: ScienceFindFullRequestDto,
	): Promise<IResponse<ScienceFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: ScienceFindAllResponseDto })
	findAll(
		@Query() payload: ScienceFindAllRequestDto,
	): Promise<IResponse<ScienceFindAllResponse>> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get('with-collection')
	@ApiResponse({ type: ScienceFindOneWithUserCollectionDto, isArray: true })
	findAllWithUserCollection(
		@UserIdInAccessToken() id: string,
		@Query() payload: ScienceFindOnwWithUserCollectionRequestDto,
	): Promise<IResponse<ScienceFindOneWithUserCollection[]>> {
		return this.service.findAllWithUserCollection({ ...payload, userId: payload.userId ?? id })
	}

	@Get('for-archive')
	@ApiResponse({ type: ScienceFindFullForArchiveDto, isArray: true })
	findAllForArchive(
		@UserIdInAccessToken() id: string,
	): Promise<IResponse<ScienceFindFullForArchive[]>> {
		return this.service.findAllForArchive(id)
	}

	@Get(':id')
	@ApiResponse({ type: ScienceFindOneResponseDto })
	findOne(
		@Param() payload: ScienceFindOneRequestDto,
	): Promise<IResponse<ScienceFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: ScienceCreateRequestDto): Promise<IResponse<ScienceCreateResponse>> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: ScienceFindOneRequestDto,
		@Body() payload: ScienceUpdateRequestDto,
	): Promise<IResponse<ScienceUpdateResponse>> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: ScienceDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
