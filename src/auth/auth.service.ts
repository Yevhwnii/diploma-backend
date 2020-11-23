import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AuthSignInCredentialsDto,
  AuthSignUpCredentialsDto,
} from './dto/authCredentials.dto';
import { User, UserDocument } from './user.schema';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger();

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async signUp(authCred: AuthSignUpCredentialsDto): Promise<string> {
    this.logger.verbose(`User is about to be created, Data: ${authCred} `);
    const { username, password, fullname } = authCred;

    const user = new this.userModel();
    const salt = await bcrypt.genSalt(10);
    user.username = username;
    user.fullname = fullname;
    if (authCred.isAdmin) {
      user.isAdmin = true;
    }
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User with such username already exists');
      } else {
        throw new InternalServerErrorException('Could not create user');
      }
    }

    return user.username;
  }

  async signIn(
    authCred: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, fullname, isAdmin } = await this.checkUserCreds(authCred);

    if (!username || !fullname) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.verbose(
      `User is about to sign in. Data: ${JSON.stringify(authCred)}`,
    );

    const payload: JwtPayload = isAdmin
      ? { username, fullname, isAdmin }
      : { username, fullname };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(`Jwt token: ${JSON.stringify(accessToken)}`);
    return { accessToken };
  }

  async checkUserCreds(authCred: AuthSignInCredentialsDto) {
    const { username, password } = authCred;

    const user = await this.userModel.findOne({ username: username });
    if (user && (await this.comparePassword(user.password, password))) {
      if (user.isAdmin) {
        return {
          username: user.username,
          fullname: user.fullname,
          isAdmin: user.isAdmin,
        };
      } else {
        return {
          username: user.username,
          fullname: user.fullname,
          isAdmin: false,
        };
      }
    } else {
      return {
        username: null,
        fullname: null,
      };
    }
  }

  // True or false
  private async comparePassword(
    hashedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
