import { PartialType } from '@nestjs/swagger'
import { CreateUserResultDto } from './create-user-result.dto'

export class UpdateUserResultDto extends PartialType(CreateUserResultDto) {}
