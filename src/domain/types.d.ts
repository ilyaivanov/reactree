type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  parent?: Item;
};
