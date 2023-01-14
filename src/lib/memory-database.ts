export type Member = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export const MemoryDatabase = (() => {
  // closure 로 member 숨김
  const members = [
    {
      id: 1,
      name: 'J',
      email: 'j@gmail.com',
      phone: '010-3333-4444',
    },
    {
      id: 2,
      name: 'H',
      email: 'h@gmail.com',
      phone: '010-2222-4444',
    },
    {
      id: 3,
      name: 'T',
      email: 't@gmail.com',
      phone: '010-1111-4444',
    },
  ] as Member[];

  return {
    findMembers: () => Promise.resolve(members),
  };
})();
