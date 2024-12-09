import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IResponse } from 'interfaces/response.interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'
import { CourseService } from './course.service'
import {
	CourseCreateRequestDto,
	CourseDeleteRequestDto,
	CourseFindAllRequestDto,
	CourseFindAllResponseDto,
	CourseFindFullRequestDto,
	CourseFindFullResponseDto,
	CourseFindOneRequestDto,
	CourseFindOneResponseDto,
	CourseUpdateRequestDto,
} from './dtos'
import {
	CourseCreateResponse,
	CourseFindAllResponse,
	CourseFindFullResponse,
	CourseFindOneResponse,
	CourseUpdateResponse,
} from './interfaces'

@ApiTags('Course')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('course')
export class CourseController {
	private readonly service: CourseService

	constructor(service: CourseService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: CourseFindFullResponseDto, isArray: true })
	findFull(
		@Query() payload: CourseFindFullRequestDto,
	): Promise<IResponse<CourseFindFullResponse>> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: CourseFindAllResponseDto })
	findAll(@Query() payload: CourseFindAllRequestDto): Promise<IResponse<CourseFindAllResponse>> {
		return this.service.findAll({ ...payload, pageNumber: PAGE_NUMBER, pageSize: PAGE_SIZE })
	}

	@Get(':id')
	@ApiResponse({ type: CourseFindOneResponseDto })
	findOne(@Param() payload: CourseFindOneRequestDto): Promise<IResponse<CourseFindOneResponse>> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: CourseCreateRequestDto): Promise<IResponse<CourseCreateResponse>> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: CourseFindOneRequestDto,
		@Body() payload: CourseUpdateRequestDto,
	): Promise<IResponse<CourseUpdateResponse>> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: CourseDeleteRequestDto): Promise<IResponse<[]>> {
		return this.service.delete(payload)
	}
}
