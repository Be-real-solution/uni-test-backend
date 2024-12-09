import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IResponse } from 'interfaces/response.interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { UserIdInAccessToken } from '../../decorators'
import { CheckAuthGuard } from '../../guards'
import {
	UserCollectionCreateManyRequestDto,
	UserCollectionCreateRequestDto,
	UserCollectionDeleteRequestDto,
	UserCollectionFindAllRequestDto,
	UserCollectionFindAllResponseDto,
	UserCollectionFindFullRequestDto,
	UserCollectionFindFullResponseDto,
	UserCollectionFindOneRequestDto,
	UserCollectionFindOneResponseDto,
	UserCollectionUpdateRequestDto,
} from './dtos'
import {
	UserCollectionCreateResponse,
	UserCollectionFindAllResponse,
	UserCollectionFindFullResponse,
	UserCollectionFindOneResponse,
	UserCollectionUpdateResponse,
} from './interfaces'
import { UserCollectionService } from './user-collection.service'

@ApiTags('UserCollection')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('user-collection')
export class UserCollectionController {
	private readonly service: UserCollectionService

	constructor(service: UserCollectionService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: UserCollectionFindFullResponseDto, isArray: true })
	findFull(
		@Query() payload: UserCollectionFindFullRequestDto,
	): Promise<IResponse<UserCollectionFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('full')
	@ApiResponse({ type: UserCollectionFindFullResponseDto, isArray: true })
	findFullForUser(
		@UserIdInAccessToken() id: string,
		@Query() payload: UserCollectionFindFullRequestDto,
	): Promise<IResponse<UserCollectionFindFullResponse>> {
		return this.service.findFull({ ...payload, userId: id })
	}

	@Get('all')
	@ApiResponse({ type: UserCollectionFindAllResponseDto })
	findAll(
		@Query() payload: UserCollectionFindAllRequestDto,
	): Promise<IResponse<UserCollectionFindAllResponse>> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiResponse({ type: UserCollectionFindOneResponseDto })
	findOne(
		@Param() payload: UserCollectionFindOneRequestDto,
	): Promise<IResponse<UserCollectionFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(
		@Body() payload: UserCollectionCreateRequestDto,
	): Promise<IResponse<UserCollectionCreateResponse>> {
		return this.service.create(payload)
	}

	@Post('many')
	@ApiResponse({ type: null })
	createMany(@Body() payload: UserCollectionCreateManyRequestDto): Promise<IResponse<[]>> {
		return this.service.createMany(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: UserCollectionFindOneRequestDto,
		@Body() payload: UserCollectionUpdateRequestDto,
	): Promise<IResponse<UserCollectionUpdateResponse>> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: UserCollectionDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
