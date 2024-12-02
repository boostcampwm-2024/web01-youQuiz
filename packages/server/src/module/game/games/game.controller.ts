import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('api')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('games/:pinCode')
  @UsePipes(ValidationPipe)
  async checkPinCode(@Param('pinCode') pinCode: string) {
    return await this.gameService.checkPinCode(pinCode);
  }

  @Get('games/:pinCode/sid/:sid')
  @UsePipes(ValidationPipe)
  async checkSidType(@Param('sid') sid: string, @Param('pinCode') pinCode: string) {
    return await this.gameService.checkSidType(sid);
  }

  @Get('games/:pinCode/check')
  @UsePipes(ValidationPipe)
  async checkAccumulation(@Param('pinCode') pinCode: string) {
    return await this.gameService.checkAccumulation(pinCode);
  }
}
