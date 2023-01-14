import { Controller, Get, Inject } from '@nestjs/common';

// controller는 유저요청이 제일 처음 들어와 라우팅되는 부분!
// 파일 하나에 기능하나로 유지하는 것이 좋기 때문에
// controller도 get-member.controller.ts 이렇게 둠.

import {
  FIND_MEMBERS_INBOUND_PORT,
  FindMembersInboundPort,
} from '../inbound-port/find-members.inbound-port';

@Controller()
export class GetMembersController {
  constructor(
    @Inject(FIND_MEMBERS_INBOUND_PORT) //modules에서 지정한 토큰
    private readonly findMembersInboundPort: FindMembersInboundPort, //토큰이 사용하는 실제 class 대신 그 class의 interface를 가지고 추상화 된 로직 작성할 수 있다.
  ) {}

  @Get('/members')
  async handle() {
    // 컨트롤러는 의존성이 주입된 객체를 직접 가지고 컨트롤 하는것이 아니라,
    // 의존된 인터페이스를 가지고 조작한다.
    return this.findMembersInboundPort.execute();
  }
}
