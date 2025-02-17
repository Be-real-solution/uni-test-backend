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
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CollectionService } from './collection.service'
import {
	CollectionCreateRequestDto,
	CollectionFindFullResponseDto,
	CollectionDeleteRequestDto,
	CollectionFindAllRequestDto,
	CollectionFindFullRequestDto,
	CollectionFindOneRequestDto,
	CollectionUpdateRequestDto,
	CollectionFindAllResponseDto,
	CollectionFindOneResponseDto,
	CollectionBeforeCreateResponseDto,
	CollectionBeforeCreateRequestDto,
} from './dtos'
import {
	CollectionBeforeCreateResponse,
	CollectionCreateResponse,
	CollectionDeleteResponse,
	CollectionFindAllResponse,
	CollectionFindFullResponse,
	CollectionFindOneResponse,
	CollectionFindOneWithQuestionAnswers,
	CollectionUpdateResponse,
} from './interfaces'
import { PAGE_NUMBER, PAGE_SIZE } from '../../constants'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadedTxtFile } from '../../interfaces'
import { CheckAuthGuard } from '../../guards'
import { Response } from 'express'
import { IResponse } from 'interfaces/response.interfaces'

@ApiTags('Collection')
@UseGuards(CheckAuthGuard)
@ApiBearerAuth()
@Controller('collection')
export class CollectionController {
	private readonly service: CollectionService

	constructor(service: CollectionService) {
		this.service = service
	}

	@Get('full')
	@ApiResponse({ type: CollectionFindFullResponseDto, isArray: true })
	findFull(@Query() payload: CollectionFindFullRequestDto): Promise<CollectionFindFullResponse> {
		return this.service.findFull(payload)
	}

	@Get('all')
	@ApiResponse({ type: CollectionFindAllResponseDto })
	findAll(@Query() payload: CollectionFindAllRequestDto): Promise<CollectionFindAllResponse> {
		return this.service.findAll({ ...payload, pageSize: PAGE_SIZE, pageNumber: PAGE_NUMBER })
	}

	@Get(':id/with-qa')
	@ApiResponse({ type: CollectionFindOneResponseDto })
	findOneWithQA(
		@Param() payload: CollectionFindOneRequestDto,
	): Promise<CollectionFindOneWithQuestionAnswers> {
		return this.service.findOneWithQuestions(payload)
	}

	@Get(':id/with-question')
	@ApiResponse({ type: CollectionFindOneResponseDto })
	findOneWithQuestionAnswers(
		@Param() payload: CollectionFindOneRequestDto,
	): Promise<CollectionFindOneWithQuestionAnswers> {
		return this.service.findOneWithQuestionAnswers(payload)
	}

	@Get(':id/in-txt')
	@ApiResponse({ type: null })
	async findOneInTxt(
		@Param() payload: CollectionFindOneRequestDto,
		@Res() response: Response,
	): Promise<void> {
		const collection = await this.service.findOneAndReturnTxt(payload)

		response.setHeader('Content-Disposition', `attachment; filename=${collection.filename}.txt`)
		response.setHeader('Content-Type', 'text/plain')
		response.send(collection.content)
	}

	@Get(':id')
	@ApiResponse({ type: CollectionFindOneResponseDto })
	findOne(@Param() payload: CollectionFindOneRequestDto): Promise<CollectionFindOneResponse> {
		return this.service.findOne(payload)
	}

	@Post()
	@ApiResponse({ type: null })
	create(@Body() payload: CollectionCreateRequestDto): Promise<CollectionCreateResponse> {
		return this.service.create(payload)
	}

	@Post('with-questions')
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
	createWithQuestions(
		@Body() payload: CollectionCreateRequestDto,
		@UploadedFile() file: UploadedTxtFile,
	): Promise<CollectionCreateResponse> {
		return this.service.createWithQuestions(payload, file.buffer.toString('utf-8'))
	}

	@Post('check-with-questions')
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
	@ApiResponse({ type: CollectionBeforeCreateResponseDto })
	returnWithQuestions(
		@Body() payload: CollectionBeforeCreateRequestDto,
		@UploadedFile() file: UploadedTxtFile,
	): Promise<CollectionBeforeCreateResponse> {
		return this.service.returnWithQuestions(payload, file.buffer.toString('utf-8'))
	}

	@Post('confirm-with-questions')
	@ApiResponse({ type: null })
	confirmWithQuestions(
		@Body() payload: CollectionBeforeCreateResponseDto,
	): Promise<CollectionCreateResponse> {
		return this.service.confirmCreateWithQuestions(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: null })
	update(
		@Param() params: CollectionFindOneRequestDto,
		@Body() payload: CollectionUpdateRequestDto,
	): Promise<CollectionUpdateResponse> {
		return this.service.update(params, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: null })
	delete(@Param() payload: CollectionDeleteRequestDto): Promise<CollectionDeleteResponse> {
		return this.service.delete(payload)
	}
}
