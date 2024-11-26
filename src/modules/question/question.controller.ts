import {
	BadRequestException,
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
import { QuestionService } from './question.service'
import {
	QuestionCreateRequestDto,
	QuestionFindFullResponseDto,
	QuestionDeleteRequestDto,
	QuestionFindAllRequestDto,
	QuestionFindFullRequestDto,
	QuestionFindOneRequestDto,
	QuestionUpdateRequestDto,
	QuestionFindAllResponseDto,
	QuestionFindOneResponseDto,
	QuestionsCreateWithAnswersDto,
	AnswerUpdateForQuestionDto,
} from './dtos'
import {
	QuestionCreateResponse,
	QuestionDeleteResponse,
	QuestionFindAllResponse,
	QuestionFindFullResponse,
	QuestionFindOneResponse,
	QuestionUpdateResponse,
	QuestionsCreateWithAnswersResponse,
} from './interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadedTxtFile } from '../../interfaces'
import { CheckAuthGuard } from '../../guards'
import { multerImageUpload } from 'libs/fileService'
import { IResponse } from 'interfaces/response.interfaces'

@ApiTags('Question')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
	private readonly service: QuestionService

	constructor(service: QuestionService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: QuestionFindFullResponseDto, isArray: true })
	findFull(@Query() payload: QuestionFindFullRequestDto): Promise<QuestionFindFullResponse> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: QuestionFindAllResponseDto })
	findAll(@Query() payload: QuestionFindAllRequestDto): Promise<QuestionFindAllResponse> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id')
	@ApiResponse({ type: QuestionFindOneResponseDto })
	findOne(@Param() payload: QuestionFindOneRequestDto): Promise<QuestionFindOneResponse> {
		return this.service.findOne(payload)
	}

	@Post('file')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter(req, file, cb) {
				if (file.mimetype !== 'text/plain') {
					return cb(new BadRequestException('Invalid file type'), false)
				}
				cb(null, true)
			},
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiResponse({ type: null })
	createQuestionsWithFile(
		@Body() payload: QuestionsCreateWithAnswersDto,
		@UploadedFile() file: UploadedTxtFile,
	): Promise<QuestionsCreateWithAnswersResponse> {
		return this.service.createManyWithAnswers(payload, file.buffer.toString('utf-8'))
	}

	@Post()
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
					example: 'kimyo',
				},
				collectionId: {
					type: 'string',
					example: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
				},
			},
		},
	})
	create(
		@Body() payload: QuestionCreateRequestDto,
		@UploadedFile() file: Express.Multer.File,
	): Promise<QuestionCreateResponse> {
		return this.service.create(payload, file)
	}

	@Patch(':id')
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
					format: 'binary', // Fayl yuklash uchun kerak
				},
				text: {
					type: 'string',
					example: 'kimyo',
				},
				collectionId: {
					type: 'string',
					example: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
				},
				answers: {
					type: 'array', // Massiv ekanligini ko‘rsatish
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								format: 'uuid',
								example: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
							},
							text: {
								type: 'string',
								example: 'Answer text',
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
					example: [
						{
							id: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
							text: 'Answer text 1',
							questionId: '11919fb5-a5b4-4775-aedd-efc1254bca5c',
							isCorrect: true,
						},
						{
							id: '31919fb5-a5b4-4775-aedd-efc1254bca5d',
							text: 'Answer text 2',
							questionId: '21919fb5-a5b4-4775-aedd-efc1254bca5e',
							isCorrect: false,
						},
					],
				},
			},
		},
	})
	update(
		@Param() params: QuestionFindOneRequestDto,
		@Body() payload: QuestionUpdateRequestDto,
		@UploadedFile() file: Express.Multer.File,
	): Promise<IResponse<{}>> {
		return this.service.update(params, payload, file)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: QuestionDeleteRequestDto): Promise<QuestionDeleteResponse> {
		return this.service.delete(payload)
	}
}
