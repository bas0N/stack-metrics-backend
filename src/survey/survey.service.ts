import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResponseDto } from 'src/config/response.dto';
import { SurveyRepository } from 'src/db/repositories/survey.repository';
import { SurveyStatus } from 'src/db/schemas/survey.schema';
import { AddSurveyDto } from './dto/AddSurvey.dto';
import { ChangeStateDto } from './dto/ChangeState.dto';

@Injectable()
export class SurveyService {
  constructor(private surveyRepository: SurveyRepository) {}
  async createSurvey(email: string, addSurveyDto: AddSurveyDto): Promise<any> {
    console.log('createSurveyService:');
    console.log(addSurveyDto);
    const survey = await this.surveyRepository.createSurvey(
      email,
      addSurveyDto,
    );
    return survey;
  }
  async getSurveys() {
    const surveys = await this.surveyRepository.getSurveys();
    if (!surveys) {
      throw new BadRequestException('Incorrect survey id.');
    }
    return surveys;
  }
  async searchSurveys(email, searchSurveysDto) {
    return { searchsurvey: 'search' };
  }
  async getSurveysPaginated(pageNum: number) {
    /*const surveys = await this.surveyRepository.getSurveysPaginated(pageNum);
    if (!surveys || surveys.length == 0) {
      throw new BadRequestException('Incorrect page num.');
    }
    return surveys;*/

    try {
      const pageSize = 3;
      const { surveyCount } = await this.surveyRepository.getSurveysCount();
      //console.log('surveysnumber:', surveyCount);
      //validate if the number of pages is valid
      console.log('pagenum is: ', pageNum);
      if (Math.ceil(surveyCount / pageSize) < pageNum) {
        throw new BadRequestException();
      }
      const surveys = await this.surveyRepository.getSurveys();
      if (Math.floor(surveyCount / pageSize) + 1 == pageNum) {
        console.log(
          'indexes1: ',
          (pageNum - 1) * pageSize,
          (pageNum - 1) * pageSize + (surveyCount % pageSize),
        );
        return {
          surveys: surveys.slice(
            (pageNum - 1) * pageSize,
            (pageNum - 1) * pageSize + (surveyCount % pageSize),
          ),
          pagesAvailable: Math.ceil(surveyCount / pageSize),
          totalItems: surveyCount,
        };
      } else {
        console.log(
          'indexes2: ',
          (pageNum - 1) * pageSize,
          (pageNum - 1) * pageSize + 3,
        );
        return {
          surveys: surveys.slice(
            (pageNum - 1) * pageSize,
            (pageNum - 1) * pageSize + 3,
          ),
          pagesAvailable: Math.ceil(surveyCount / pageSize),
          totalItems: surveyCount,
        };
      }
    } catch (err) {
      throw new BadRequestException('Bad page num.');
    }

    //return await this.surveyRepository.getSurveysCount();
  }
  async getSurveyDetails(id: string) {
    const survey = await this.surveyRepository.getSurveyDetails(id);
    if (!survey) {
      throw new BadRequestException('Incorrect survey id.');
    }
    return survey;
  }
  async editSurvey() {}
  async deleteSurvey(id: string) {
    const survey = await this.surveyRepository.deleteSurvey(id);
    if (!survey) {
      throw new BadRequestException('Error occured while removing survey.');
    }
    const response: ResponseDto = {
      message: 'Survey has been deleted succesfully',
    };
    return response;
  }
  async changeSurveystate(changeStateDto: ChangeStateDto) {
    if (SurveyStatus[changeStateDto.newStatus] === undefined) {
      throw new BadRequestException('Incorrect state value.');
    }
    const survey = await this.surveyRepository.changeSurveystate(
      changeStateDto,
    );
    console.log(survey);
    if (!survey) {
      throw new BadRequestException('Error occured while updating survey.');
    }
    const response: ResponseDto = {
      message: 'Survey has been updated succesfully',
    };
    return response;
  }
  async sendSurvey() {
    return { output: 'sendSurvey' };
  }
}
