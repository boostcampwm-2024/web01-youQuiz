import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MysqlConfigService {
    constructor(private configService: ConfigService) {}

    get type(): string {
        return this.configService.get<string>('mysql.type');
    }

    get host(): string {
        return this.configService.get<string>('mysql.host');
    }

    get port(): number {
        return this.configService.get<number>('mysql.port');
    }

    get user(): string {
        return this.configService.get<string>('mysql.user');
    }

    get password(): string {
        return this.configService.get<string>('mysql.password');
    }

    get database(): string {
        return this.configService.get<string>('mysql.database');
    }

    get autoLoadEntities(): boolean {
        return this.configService.get<boolean>('mysql.autoLoadEntities');
    }

    get synchronize(): boolean {
        return this.configService.get<boolean>('mysql.synchronize');
    }
}
