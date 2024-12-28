import { Injectable, NotFoundException } from '@nestjs/common'
import { AnswerService } from 'modules/answer'
import { QuestionService } from 'modules/question'
import { UserService } from 'modules/user'
import { ICreateUserResultService, IUserResultFindAll, IUserResultFindAllResponse, IUserResultResponse } from './interfaces/user-result.interfaces'
import { UserResultRepository } from './user-result.repository'

@Injectable()
export class UserResultService {
    private readonly repository: UserResultRepository
    private readonly questionService: QuestionService
    private readonly answerService: AnswerService
    private readonly userService: UserService

    constructor(
        repository: UserResultRepository,
        questionService: QuestionService,
        userService: UserService,
        answerService: AnswerService,
    ) {
        this.repository = repository
        this.questionService = questionService
        this.userService = userService
        this.answerService = answerService
    }

    async create(payload: ICreateUserResultService, userId: string): Promise<IUserResultResponse> {

        const user = await this.userService.findOne({ id: userId })

        const question = await this.questionService.findOne({ id: payload.questionId })

        const correct_answer_count = question.answers.filter((a) => a.isCorrect).length
        let find_answer_count = 0
        payload.answer.forEach(async (a) => {
            if (question.answers.some(value => value.id == a.answerId)) {
                const answer = await this.answerService.findOne({ id: a.answerId })
                find_answer_count = answer.isCorrect ? find_answer_count + 1 : find_answer_count
            } else {
                throw new NotFoundException('Answer not found')
            }
        })

        let userResult: IUserResultResponse = await this.repository.findOneByUserId({
            id: '',
            userId: user.id,
        })

        if (userResult) {
            await this.repository.createUserResultAnswerData({
                userResultId: userResult.id,
                correctAnswerCount: correct_answer_count,
                findAnswerCount: find_answer_count,
                questionNumber: payload.questionNumber,
                getTime: payload.getTime
            })

            if (question.collection.amountInTest == payload.questionNumber || userResult.endTime <= new Date()) {
                await this.repository.update({
                    id: userResult.id,
                    hasFinished: true,
                    endTime: payload.endTime,
                    findQuestionCount: find_answer_count > 0 ? userResult.findQuestionCount + 1 : userResult.findQuestionCount,
                })
            } else {
                await this.repository.update({
                    id: userResult.id,
                    findQuestionCount: find_answer_count > 0 ? userResult.findQuestionCount + 1 : userResult.findQuestionCount,
                })
            }
        } else {

            userResult = await this.repository.create({
                userFullName: user.fullName,
                hemisId: user.userInfo.hemisId,
                grade: 0,
                userId: user.id,
                allQuestionCount: question.collection.amountInTest,
                findQuestionCount: find_answer_count > 0 ? 1 : 0,
                compyuterName: payload.computerName,
                collectionId: question.collection.id,
                groupName: user.userInfo.group.name,
                course: user.userInfo.group.course.stage,
                facultyName: user.userInfo.group.faculty.name,
                startTime: payload.startTime
            })

            await this.repository.createUserResultAnswerData({
                userResultId: userResult.id,
                correctAnswerCount: correct_answer_count,
                findAnswerCount: find_answer_count,
                questionNumber: payload.questionNumber,
                getTime: payload.getTime
            })

        }

        return userResult
    }

    async findAll(query: IUserResultFindAll): Promise<IUserResultFindAllResponse> {
        const userResult = await this.repository.findAllPagination(query)
        return userResult
    }

    async findOne(id: string): Promise<IUserResultResponse> {
        const userResult = await this.repository.findOne(id)

        if (!userResult) {
            throw new NotFoundException('User result not found')
        }

        return userResult
    }

    async remove(id: string): Promise<IUserResultResponse> {
        const userResult = await this.repository.findOne(id)

        if (!userResult) {
            throw new NotFoundException('User result not found')
        }

        return await this.repository.removeUserResult(id)
    }


}
