enum Category {
  Fiction,
  Science,
  SelfDevelopment,
  Poetry,
  Religious,
  History,
  chess,
}

export interface IBook {
  title: string;
  author: string;
  category: keyof typeof Category;
  description: string;
  quantity: number;
  price: number;
  inStock: boolean;
  isDeleted: boolean;
}
