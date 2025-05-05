export type Upgrade = {
  id: string;
  name: string;
  description: string;
  children?: Upgrade[];
  weight?: number;
  count?: number;
};
