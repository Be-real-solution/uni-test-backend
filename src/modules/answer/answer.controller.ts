import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AnswerService } from './answer.service'
import {
	AnswerCreateRequestDto,
	AnswerFindFullResponseDto,
	AnswerDeleteRequestDto,
	AnswerFindAllRequestDto,
	AnswerFindFullRequestDto,
	AnswerFindOneRequestDto,
	AnswerUpdateRequestDto,
	AnswerFindAllResponseDto,
	AnswerFindOneResponseDto,
	AnswerCreateOrUpdateRequestDto,
} from './dtos'
import {
	AnswerCreateResponse,
	AnswerDeleteResponse,
	AnswerFindAllResponse,
	AnswerFindFullResponse,
	AnswerFindOneResponse,
	AnswerUpdateResponse,
} from './interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { CheckAuthGuard } from '../../guards'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerImageUpload } from 'libs/fileService'

@ApiTags('Answer')
@ApiBearerAuth()
@UseGuards(CheckAuthGuard)
@Controller('answer')
export class AnswerController {
	private readonly service: AnswerService

	constructor(service: AnswerService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: AnswerFindFullResponseDto, isArray: true })
	findFull(@Query() payload: AnswerFindFullRequestDto): Promise<AnswerFindFullResponse> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: AnswerFindAllResponseDto })
	findAll(@Query() payload: AnswerFindAllRequestDto): Promise<AnswerFindAllResponse> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiResponse({ type: AnswerFindOneResponseDto })
	findOne(@Param() payload: AnswerFindOneRequestDto): Promise<AnswerFindOneResponse> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: AnswerCreateRequestDto): Promise<AnswerCreateResponse> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: AnswerFindOneRequestDto,
		@Body() payload: AnswerUpdateRequestDto,
	): Promise<AnswerUpdateResponse> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: AnswerDeleteRequestDto): Promise<AnswerDeleteResponse> {
		return this.service.delete(payload)
	}

	@Post('create-or-update')
	@ApiResponse({ type: null })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file', multerImageUpload))
	@ApiBody({
		description: 'Fayl yuklash',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				text: {
					type: 'string',
					example: 'text',
				},
				id: {
					type: 'string',
					format: 'uuid',
					example: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
				},
				questionId: {
					type: 'string',
					format: 'uuid',
					example: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
				},
				isCorrect: {
					type: 'boolean',
					example: true,
				},
			},
		},
	})
	createOrUpdate(
		@Body() payload: AnswerCreateOrUpdateRequestDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		file?.filename && (file.filename = `upload/answer/${file.filename}`)
		return this.service.createOrUpdate(payload, file)
	}

	@Delete('delete-file/:id')
	@ApiResponse({ type: null })
	deleteFile(@Param() params: AnswerFindOneRequestDto) {
		return this.service.deleteAnswerFile(params)
	}
}
