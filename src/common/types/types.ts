export type TestAction<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">

export type BaseResponce<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};
