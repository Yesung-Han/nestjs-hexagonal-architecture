import { Module } from '@nestjs/common';
import { GetMembersController } from './controller/get-member.controller';
import { FIND_MEMBERS_INBOUND_PORT } from './inbound-port/find-members.inbound-port';
import { FindMembersRepository } from './outbound-adapter/find-members.repository';
import { FIND_MEMBERS_OUTBOUND_PORT } from './outbound-port/find-members.outbound-port';
import { FindMembersService } from './service/find-members.service';

// member 리스트를 조회하는 API를 작성해보자
@Module({
  controllers: [GetMembersController],
  providers: [
    {
      // 토큰으로 provider 구분 => @Inject(FIND_MEMBERS_INBOUND_PORT)이런 식으로 가져올 수 있다.
      // 토큰과 인터페이스를 사용하면 직접적인 클래스를 inject할 필요가 없다.
      provide: FIND_MEMBERS_INBOUND_PORT,
      // FIND_MEMBERS_INBOUND_PORT로 제공 할 클래스는 아래 클래스 제공자 useClass로 지정 할 수 있다.
      // 클래스 제공자를 사용하면, FIND_MEMBERS_INBOUND_PORT이 사용할 객체를 바꾸기 쉬워진다.
      // provide에서는 토큰을 사용하고 실제 의존되는 객체는 useClass 부분만 바꾸어 주면
      // 실제 의존되는 객체가 바뀌었을때 useClass부분만 바꾸어주면 된다!
      // FindMembersService 는 inbound prot 인터페이스의 구현체
      useClass: FindMembersService,
    },
    {
      provide: FIND_MEMBERS_OUTBOUND_PORT,
      useClass: FindMembersRepository,
    },
  ],
})
export class MemberModule {}
