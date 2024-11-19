import { Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('api')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('games/:pinCode')
  @UsePipes(ValidationPipe)
  async checkPinCode(@Param('pinCode') pinCode: string) {
    return await this.gameService.checkPinCode(pinCode);
  }
}
