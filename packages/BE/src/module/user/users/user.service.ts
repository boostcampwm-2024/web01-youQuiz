import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class UserService {
    // DB repository
    constructor() {}

    userLogin(): string {
        // 아이디, 비밀번호 유효성 검증
        return 'login';

        // 세션 아이디 추가
    }
}