import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FacultyService } from './faculty.service'
import {
	FacultyCreateRequestDto,
	FacultyFindFullResponseDto,
	FacultyDeleteRequestDto,
	FacultyFindAllRequestDto,
	FacultyFindFullRequestDto,
	FacultyFindOneRequestDto,
	FacultyUpdateRequestDto,
	FacultyFindAllResponseDto,
	FacultyFindOneResponseDto,
	FacultyFindFullForSetCollectionDto,
} from './dtos'
import {
	FacultyCreateResponse,
	FacultyDeleteResponse,
	FacultyFindAllResponse,
	FacultyFindFullForSetCollection,
	FacultyFindFullResponse,
	FacultyFindOneResponse,
	FacultyUpdateResponse,
} from './interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'

@ApiTags('Faculty')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('faculty')
export class FacultyController {
	private readonly service: FacultyService

	constructor(service: FacultyService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: FacultyFindFullResponseDto, isArray: true })
	findFull(@Query() payload: FacultyFindFullRequestDto): Promise<FacultyFindFullResponse> {
		return this.service.findFull(payload)
	}

	@Get('with-details')
	@ApiResponse({ type: FacultyFindFullForSetCollectionDto, isArray: true })
	findFullWithDetails(): Promise<FacultyFindFullForSetCollection[]> {
		return this.service.findAllForSetCollection()
	}

	@Get('all')
	@ApiResponse({ type: FacultyFindAllResponseDto })
	findAll(@Query() payload: FacultyFindAllRequestDto): Promise<FacultyFindAllResponse> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiResponse({ type: FacultyFindOneResponseDto })
	findOne(@Param() payload: FacultyFindOneRequestDto): Promise<FacultyFindOneResponse> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: FacultyCreateRequestDto): Promise<FacultyCreateResponse> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: FacultyFindOneRequestDto,
		@Body() payload: FacultyUpdateRequestDto,
	): Promise<FacultyUpdateResponse> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: FacultyDeleteRequestDto): Promise<FacultyDeleteResponse> {
		return this.service.delete(payload)
	}
}
