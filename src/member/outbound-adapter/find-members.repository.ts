import {
  FindMembersOutboundPort,
  FindMembersOutboundPortInputDto,
  FindMembersOutboundPortOutputDto,
} from '../outbound-port/find-members.outbound-port';

import { MemoryDatabase } from '../../lib/memory-database';

// adaptor 는 port 인터페이스의 구현체를 의미한다.
// FindMembersOutboundPort 의 구현체
export class FindMembersRepository implements FindMembersOutboundPort {
  async execute(
    params: FindMembersOutboundPortInputDto,
  ): Promise<FindMembersOutboundPortOutputDto> {
    const members = await MemoryDatabase.findMembers();

    return members.map((member) => {
      return {
        name: member.name,
        email: member.email,
        phone: member.phone,
      };
    });
  }
}
