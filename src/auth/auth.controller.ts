import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthSignInCredentialsDto,
  AuthSignUpCredentialsDto,
} from './dto/authCredentials.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCred: AuthSignUpCredentialsDto,
  ): Promise<{ message: string }> {
    const username = await this.authService.signUp(authCred);
    return {
      message: `User ${username} was successfully created`,
    };
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCred: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCred);
  }
}
