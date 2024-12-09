import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IResponse } from 'interfaces/response.interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'
import {
	UserInfoCreateRequestDto,
	UserInfoDeleteRequestDto,
	UserInfoFindAllRequestDto,
	UserInfoFindAllResponseDto,
	UserInfoFindFullRequestDto,
	UserInfoFindFullResponseDto,
	UserInfoFindOneRequestDto,
	UserInfoFindOneResponseDto,
	UserInfoUpdateRequestDto,
} from './dtos'
import {
	UserInfoCreateResponse,
	UserInfoFindAllResponse,
	UserInfoFindFullResponse,
	UserInfoFindOneResponse,
	UserInfoUpdateResponse,
} from './interfaces'
import { UserInfoService } from './user-info.service'

@ApiTags('UserInfo')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('user-info')
export class UserInfoController {
	private readonly service: UserInfoService

	constructor(service: UserInfoService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: UserInfoFindFullResponseDto, isArray: true })
	findFull(
		@Query() payload: UserInfoFindFullRequestDto,
	): Promise<IResponse<UserInfoFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: UserInfoFindAllResponseDto })
	findAll(
		@Query() payload: UserInfoFindAllRequestDto,
	): Promise<IResponse<UserInfoFindAllResponse>> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiResponse({ type: UserInfoFindOneResponseDto })
	findOne(
		@Param() payload: UserInfoFindOneRequestDto,
	): Promise<IResponse<UserInfoFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: UserInfoCreateRequestDto): Promise<IResponse<UserInfoCreateResponse>> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: UserInfoFindOneRequestDto,
		@Body() payload: UserInfoUpdateRequestDto,
	): Promise<IResponse<UserInfoUpdateResponse>> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: UserInfoDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
