import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CheckAuthGuard } from 'guards'
import {
	CreateUserResultDto,
	UserResultFindAllDto,
	UserResultFindAllResponseDto,
	UserResultResponseDto,
} from './dto/create-user-result.dto'
import { UserResultService } from './user-result.service'

import { UserIdInAccessToken } from 'decorators'
import { IUserResultResponse } from './interfaces/user-result.interfaces'

@ApiTags('UserResult')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('user-result')
export class UserResultController {
	constructor(private readonly userResultService: UserResultService) {}

	@ApiResponse({ type: UserResultResponseDto })
	@Post()
	create(
		@Body() payload: CreateUserResultDto,
		@UserIdInAccessToken() userId: string,
	): Promise<IUserResultResponse> {
		return this.userResultService.create(payload, userId)
	}

	@ApiResponse({ type: null })
	@Post('/remove-panding-result')
	removePandingResult(): Promise<null> {
		return this.userResultService.removePandingTests()
	}

	@ApiResponse({ type: UserResultFindAllResponseDto, isArray: true })
	@Get()
	findAll(@Query() query: UserResultFindAllDto) {
		return this.userResultService.findAll(query)
	}

	@ApiResponse({ type: UserResultResponseDto })
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userResultService.findOne(id)
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateUserResultDto: UpdateUserResultDto) {
	// 	return this.userResultService.update(+id, updateUserResultDto)
	// }

	@ApiResponse({ type: UserResultResponseDto })
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userResultService.remove(id)
	}
}
