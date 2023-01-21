export type GoogleSearchByKeywordOutboundPortInputDto = {
  keyword: string;
};

export type GoogleSearchByKeywordOutboundPortOutputDto = {
  items: Array<{ link: string }>;
} | null; // 에러를 상위 레이어까지 리턴하는 것보다 null을 보내고 null 일 경우 처리를 위에서 하는게 더 낫다.

// output port 토큰
export const GOOGLE_SEARCH_BY_KEYWORD_OUTBOUND_PORT =
  'GOOGLE_SEARCH_BY_KEYWORD_OUTBOUND_PORT ' as const;

export interface GoogleSearchByKeywordOutboundPort {
  execute(
    params: GoogleSearchByKeywordOutboundPortInputDto,
  ): Promise<GoogleSearchByKeywordOutboundPortOutputDto>;
}
