export type FindMembersOutboundPortInputDto = void;

export type FindMembersOutboundPortOutputDto = Array<{
  name: string;
  email: string;
  phone: string;
}>;

export const FIND_MEMBERS_OUTBOUND_PORT = 'FIND_MEMBERS_OUTBOUND_PORT' as const;

// Outbound 처리는 repository에서 할거다.
// 즉 OutboundPort 의 구현체는 repository가 되고, 이것은 repository에서 사용할 인터페이스인 것이다.
export interface FindMembersOutboundPort {
  execute(
    params: FindMembersOutboundPortInputDto,
  ): Promise<FindMembersOutboundPortOutputDto>;
}
