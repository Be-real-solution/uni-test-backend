import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { SettingService } from './setting.service'
import { CreateSettingDto } from './dto/create-setting.dto'
import { UpdateSettingDto } from './dto/update-setting.dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SwaggerSettingResponseDto } from './dto/intex'
import { IResponse } from 'interfaces/response.interfaces'
import { ISettingResponse } from './interfaces/setting.interface'
import { CheckAuthGuard } from 'guards'

@ApiTags('Setting')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('setting')
export class SettingController {
	constructor(private readonly settingService: SettingService) {}

	@Post()
	@ApiResponse({ type: SwaggerSettingResponseDto })
	create(@Body() payload: CreateSettingDto): Promise<IResponse<ISettingResponse>> {
		return this.settingService.create(payload)
	}

	@Get()
	@ApiResponse({ type: [SwaggerSettingResponseDto] })
	findAll(): Promise<ISettingResponse[]> {
		return this.settingService.findAll()
	}

	@Get(':id')
	@ApiResponse({ type: SwaggerSettingResponseDto })
	findOne(@Param('id') id: string): Promise<ISettingResponse> {
		return this.settingService.findOne(id)
	}

	@Patch(':id')
	@ApiResponse({ type: SwaggerSettingResponseDto })
	update(
		@Param('id') id: string,
		@Body() payload: UpdateSettingDto,
	): Promise<IResponse<ISettingResponse>> {
		return this.settingService.update(id, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	remove(@Param('id') id: string): Promise<IResponse<[]>> {
		return this.settingService.remove(id)
	}
}
