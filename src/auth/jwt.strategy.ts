import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtPayload } from './jwt-payload.interface';
import { User, UserDocument } from './user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;

    const user = await this.userModel
      .findOne({ username: username })
      .select('-password');

    console.log(user);

    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Unauthorized!');
    }

    return user;
  }
}
