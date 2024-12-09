import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { CheckAuthGuard } from 'guards'
import {
	CreateUserResultDto,
	UserResultFindAllDto,
	UserResultFindAllResponseDto,
	UserResultResponseDto,
} from './dto/create-user-result.dto'
import { UserResultService } from './user-result.service'
// import userAgent from 'user-agents'

import { IResponse } from 'interfaces/response.interfaces'
import {
	IUserResultFindAllResponse,
	IUserResultResponse,
} from './interfaces/user-result.interfaces'

@ApiTags('UserResult')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('user-result')
export class UserResultController {
	constructor(private readonly studentResultService: UserResultService) {}

	@ApiResponse({ type: UserResultResponseDto })
	@Post()
	create(@Body() payload: CreateUserResultDto, @Req() request: Request) {
		return this.studentResultService.create(payload, request)
	}

	@ApiResponse({ type: UserResultFindAllResponseDto, isArray: true })
	@Get()
	findAll(@Query() query: UserResultFindAllDto): Promise<IResponse<IUserResultFindAllResponse>> {
		return this.studentResultService.findAll(query)
	}

	@ApiResponse({ type: UserResultResponseDto })
	@Get(':id')
	findOne(@Param('id') id: string): Promise<IResponse<IUserResultResponse>> {
		return this.studentResultService.findOne(id)
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateUserResultDto: UpdateUserResultDto) {
	// 	return this.studentResultService.update(+id, updateUserResultDto)
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.studentResultService.remove(+id)
	// }
}
