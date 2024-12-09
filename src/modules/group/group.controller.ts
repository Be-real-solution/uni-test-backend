import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IResponse } from 'interfaces/response.interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'
import {
	GroupCreateRequestDto,
	GroupDeleteRequestDto,
	GroupFindAllRequestDto,
	GroupFindAllResponseDto,
	GroupFindFullRequestDto,
	GroupFindFullResponseDto,
	GroupFindOneRequestDto,
	GroupFindOneResponseDto,
	GroupUpdateRequestDto,
} from './dtos'
import { GroupService } from './group.service'
import {
	GroupCreateResponse,
	GroupFindAllResponse,
	GroupFindFullResponse,
	GroupFindOneResponse,
	GroupUpdateResponse,
} from './interfaces'

@ApiTags('Group')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('group')
export class GroupController {
	private readonly service: GroupService

	constructor(service: GroupService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: GroupFindFullResponseDto, isArray: true })
	findFull(@Query() payload: GroupFindFullRequestDto): Promise<IResponse<GroupFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: GroupFindAllResponseDto })
	findAll(@Query() payload: GroupFindAllRequestDto): Promise<IResponse<GroupFindAllResponse>> {
		return this.service.findAll({ ...payload, pageNumber: PAGE_NUMBER, pageSize: PAGE_SIZE })
	}

	@Get(':id')
	@ApiResponse({ type: GroupFindOneResponseDto })
	findOne(@Param() payload: GroupFindOneRequestDto): Promise<IResponse<GroupFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: GroupCreateRequestDto): Promise<IResponse<GroupCreateResponse>> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: GroupFindOneRequestDto,
		@Body() payload: GroupUpdateRequestDto,
	): Promise<IResponse<GroupUpdateResponse>> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: GroupDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
