import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'lsjhf8w7r98usjdhfjhsfkjhdsufw7r8OOPPhsjf',
    });
  }

  async validate(payload: any) {
    return { userId: payload._id, email: payload.email, role: payload.role };
  }
}
