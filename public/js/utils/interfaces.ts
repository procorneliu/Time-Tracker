// Typescript interface definition
export interface WorklogObject {
  title?: string;
  time: number;
  rate?: string;
  client?: { [key: string]: any };
}

export interface ClientObject {
  name: string;
  owner: { [key: string]: any };
  id: string;
}
