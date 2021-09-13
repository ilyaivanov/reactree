type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  isEditing?: boolean;
};
