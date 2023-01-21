export type FindAppIdInboundPortInputDto = {
  keyword: string;
};

export type FindAppIdInboundPortOutputDto = Array<string>;

// inbound port용 토큰
export const FIND_APP_ID_INBOUND_PORT = 'FIND_APP_ID_INBOUND_PORT' as const;

export interface FindAppIdInboundPort {
  execute(
    params: FindAppIdInboundPortInputDto,
  ): Promise<FindAppIdInboundPortOutputDto>;
}
