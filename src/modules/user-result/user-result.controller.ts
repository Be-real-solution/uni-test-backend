import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common'
import { UserResultService } from './user-result.service'
import { CreateUserResultDto, UserResultFindAllDto, UserResultFindAllResponseDto, UserResultResponseDto } from './dto/create-user-result.dto'
import { UpdateUserResultDto } from './dto/update-user-result.dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CheckAuthGuard } from 'guards'
import { Request } from 'express'
// import userAgent from 'user-agents'

import * as os from "os"


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
	findAll(@Query() query: UserResultFindAllDto) {
		return this.studentResultService.findAll(query)
	}

	@ApiResponse({ type: UserResultResponseDto })
	@Get(':id')
	findOne(@Param('id') id: string) {
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
