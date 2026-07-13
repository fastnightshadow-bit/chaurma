export interface MenuCategory {
  readonly id: string;
  readonly name: string;
}

export interface MenuOption {
  readonly id: string;
  readonly name: string;
  readonly priceDelta: number;
  readonly available: boolean;
}

export type MenuBadge = "hit" | "spicy";

export interface MenuItem {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;
  readonly description: string;
  readonly weight: string;
  readonly price: number;
  readonly available: boolean;
  readonly badges: readonly MenuBadge[];
  readonly image: null | {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
  readonly options: readonly MenuOption[];
  readonly allowComment: boolean;
  readonly isTemporaryData: boolean;
}
