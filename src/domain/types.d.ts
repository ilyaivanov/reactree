type Item = {
  title: string;
  children: Item[];
  isOpen: boolean;
  parent?: Item;
};
