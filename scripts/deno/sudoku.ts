// deno-fmt-ignore-file

/* eslint-disable @typescript-eslint/no-empty-function */

type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const _ = 0 / 0 as never;

export function sudoku<
  C11 extends Cell, C12 extends Cell, C13 extends Cell, C14 extends Cell, C15 extends Cell, C16 extends Cell, C17 extends Cell, C18 extends Cell, C19 extends Cell,
  C21 extends Cell, C22 extends Cell, C23 extends Cell, C24 extends Cell, C25 extends Cell, C26 extends Cell, C27 extends Cell, C28 extends Cell, C29 extends Cell,
  C31 extends Cell, C32 extends Cell, C33 extends Cell, C34 extends Cell, C35 extends Cell, C36 extends Cell, C37 extends Cell, C38 extends Cell, C39 extends Cell,
  C41 extends Cell, C42 extends Cell, C43 extends Cell, C44 extends Cell, C45 extends Cell, C46 extends Cell, C47 extends Cell, C48 extends Cell, C49 extends Cell,
  C51 extends Cell, C52 extends Cell, C53 extends Cell, C54 extends Cell, C55 extends Cell, C56 extends Cell, C57 extends Cell, C58 extends Cell, C59 extends Cell,
  C61 extends Cell, C62 extends Cell, C63 extends Cell, C64 extends Cell, C65 extends Cell, C66 extends Cell, C67 extends Cell, C68 extends Cell, C69 extends Cell,
  C71 extends Cell, C72 extends Cell, C73 extends Cell, C74 extends Cell, C75 extends Cell, C76 extends Cell, C77 extends Cell, C78 extends Cell, C79 extends Cell,
  C81 extends Cell, C82 extends Cell, C83 extends Cell, C84 extends Cell, C85 extends Cell, C86 extends Cell, C87 extends Cell, C88 extends Cell, C89 extends Cell,
  C91 extends Cell, C92 extends Cell, C93 extends Cell, C94 extends Cell, C95 extends Cell, C96 extends Cell, C97 extends Cell, C98 extends Cell, C99 extends Cell,
>(C11: Exclude<C11, C13 | C61 | C15 | C21 | C18 | C16 | C91 | C19 | C22 | C33 | C71 | C32 | C14 | C17 | C51 | C23 | C81 | C41 | C31 | C12>,
  C21: Exclude<C21, C13 | C61 | C11 | C91 | C22 | C33 | C71 | C26 | C32 | C29 | C27 | C25 | C51 | C24 | C23 | C81 | C41 | C31 | C12 | C28>,
  C31: Exclude<C31, C13 | C61 | C37 | C21 | C11 | C39 | C91 | C22 | C33 | C38 | C71 | C35 | C32 | C36 | C34 | C51 | C23 | C81 | C41 | C12>,
  C41: Exclude<C41, C61 | C43 | C52 | C42 | C21 | C45 | C44 | C49 | C11 | C48 | C91 | C46 | C71 | C53 | C63 | C62 | C51 | C47 | C81 | C31>,
  C51: Exclude<C51, C61 | C52 | C43 | C42 | C21 | C59 | C58 | C57 | C11 | C91 | C55 | C71 | C53 | C63 | C62 | C81 | C54 | C56 | C41 | C31>,
  C61: Exclude<C61, C52 | C43 | C42 | C21 | C66 | C11 | C91 | C64 | C67 | C71 | C53 | C69 | C63 | C62 | C51 | C65 | C68 | C81 | C41 | C31>,
  C71: Exclude<C71, C61 | C77 | C73 | C21 | C79 | C75 | C93 | C76 | C11 | C91 | C82 | C78 | C72 | C51 | C92 | C81 | C74 | C83 | C41 | C31>,
  C81: Exclude<C81, C61 | C73 | C21 | C93 | C11 | C84 | C91 | C82 | C85 | C89 | C87 | C71 | C88 | C72 | C51 | C92 | C86 | C83 | C41 | C31>,
  C91: Exclude<C91, C61 | C73 | C97 | C21 | C93 | C11 | C98 | C99 | C82 | C94 | C96 | C71 | C72 | C51 | C92 | C95 | C81 | C83 | C41 | C31>,
  C12: Exclude<C12, C13 | C52 | C42 | C15 | C21 | C18 | C16 | C11 | C19 | C22 | C82 | C33 | C32 | C14 | C72 | C62 | C17 | C23 | C92 | C31>,
  C22: Exclude<C22, C13 | C52 | C42 | C21 | C11 | C82 | C33 | C26 | C32 | C29 | C27 | C25 | C72 | C62 | C24 | C23 | C92 | C31 | C12 | C28>,
  C32: Exclude<C32, C13 | C52 | C42 | C37 | C21 | C11 | C39 | C22 | C82 | C33 | C38 | C35 | C36 | C34 | C72 | C62 | C23 | C92 | C31 | C12>,
  C42: Exclude<C42, C52 | C43 | C61 | C45 | C44 | C49 | C48 | C22 | C82 | C46 | C53 | C32 | C72 | C63 | C62 | C51 | C92 | C47 | C41 | C12>,
  C52: Exclude<C52, C61 | C43 | C42 | C59 | C58 | C57 | C55 | C22 | C82 | C53 | C32 | C72 | C63 | C62 | C51 | C92 | C54 | C56 | C41 | C12>,
  C62: Exclude<C62, C52 | C61 | C43 | C42 | C66 | C22 | C82 | C64 | C67 | C53 | C32 | C69 | C72 | C63 | C51 | C92 | C65 | C68 | C41 | C12>,
  C72: Exclude<C72, C52 | C42 | C77 | C73 | C79 | C75 | C93 | C76 | C91 | C22 | C82 | C71 | C32 | C78 | C62 | C92 | C81 | C74 | C83 | C12>,
  C82: Exclude<C82, C52 | C42 | C73 | C93 | C84 | C91 | C22 | C85 | C89 | C87 | C71 | C88 | C32 | C72 | C62 | C92 | C86 | C81 | C83 | C12>,
  C92: Exclude<C92, C52 | C42 | C73 | C97 | C93 | C98 | C99 | C91 | C22 | C82 | C94 | C96 | C71 | C32 | C72 | C62 | C95 | C81 | C83 | C12>,
  C13: Exclude<C13, C43 | C15 | C73 | C21 | C18 | C93 | C16 | C11 | C19 | C22 | C33 | C53 | C32 | C14 | C63 | C17 | C23 | C83 | C31 | C12>,
  C23: Exclude<C23, C13 | C43 | C73 | C21 | C93 | C11 | C22 | C33 | C53 | C26 | C32 | C29 | C27 | C25 | C63 | C24 | C83 | C31 | C12 | C28>,
  C33: Exclude<C33, C13 | C43 | C73 | C37 | C21 | C93 | C11 | C39 | C22 | C38 | C53 | C35 | C32 | C36 | C34 | C63 | C23 | C83 | C31 | C12>,
  C43: Exclude<C43, C13 | C61 | C52 | C42 | C73 | C45 | C44 | C49 | C93 | C48 | C46 | C33 | C53 | C63 | C62 | C51 | C23 | C47 | C83 | C41>,
  C53: Exclude<C53, C13 | C43 | C52 | C61 | C42 | C73 | C59 | C58 | C93 | C57 | C55 | C33 | C63 | C62 | C51 | C23 | C54 | C83 | C56 | C41>,
  C63: Exclude<C63, C13 | C43 | C61 | C52 | C42 | C73 | C66 | C93 | C64 | C33 | C67 | C53 | C69 | C62 | C51 | C23 | C65 | C68 | C83 | C41>,
  C73: Exclude<C73, C13 | C43 | C77 | C79 | C93 | C75 | C76 | C91 | C82 | C33 | C53 | C71 | C78 | C63 | C72 | C23 | C92 | C81 | C83 | C74>,
  C83: Exclude<C83, C13 | C43 | C73 | C93 | C84 | C91 | C82 | C85 | C33 | C89 | C87 | C53 | C71 | C88 | C63 | C72 | C23 | C92 | C86 | C81>,
  C93: Exclude<C93, C13 | C43 | C73 | C97 | C98 | C99 | C91 | C82 | C94 | C33 | C96 | C53 | C71 | C63 | C72 | C23 | C92 | C95 | C81 | C83>,
  C14: Exclude<C14, C13 | C15 | C18 | C44 | C16 | C11 | C84 | C19 | C64 | C94 | C26 | C35 | C36 | C34 | C25 | C17 | C24 | C54 | C74 | C12>,
  C24: Exclude<C24, C15 | C21 | C44 | C16 | C84 | C22 | C64 | C94 | C26 | C35 | C14 | C29 | C27 | C36 | C34 | C25 | C23 | C54 | C74 | C28>,
  C34: Exclude<C34, C15 | C37 | C44 | C16 | C39 | C84 | C64 | C94 | C33 | C38 | C35 | C26 | C32 | C14 | C36 | C25 | C24 | C54 | C74 | C31>,
  C44: Exclude<C44, C43 | C42 | C45 | C66 | C49 | C84 | C48 | C55 | C64 | C46 | C94 | C14 | C34 | C24 | C47 | C65 | C54 | C74 | C56 | C41>,
  C54: Exclude<C54, C52 | C45 | C66 | C59 | C44 | C58 | C57 | C84 | C55 | C64 | C46 | C94 | C53 | C14 | C34 | C24 | C51 | C65 | C74 | C56>,
  C64: Exclude<C64, C61 | C45 | C66 | C44 | C84 | C55 | C46 | C94 | C67 | C14 | C69 | C34 | C63 | C62 | C24 | C65 | C68 | C54 | C74 | C56>,
  C74: Exclude<C74, C77 | C73 | C79 | C44 | C75 | C76 | C84 | C64 | C94 | C85 | C96 | C71 | C14 | C78 | C34 | C72 | C24 | C86 | C95 | C54>,
  C84: Exclude<C84, C44 | C75 | C76 | C64 | C82 | C94 | C85 | C89 | C87 | C96 | C88 | C14 | C34 | C24 | C86 | C95 | C54 | C81 | C74 | C83>,
  C94: Exclude<C94, C97 | C44 | C93 | C75 | C76 | C98 | C99 | C84 | C91 | C64 | C85 | C96 | C14 | C34 | C24 | C92 | C95 | C86 | C54 | C74>,
  C15: Exclude<C15, C13 | C45 | C18 | C75 | C16 | C11 | C55 | C19 | C85 | C35 | C26 | C14 | C36 | C25 | C34 | C17 | C24 | C65 | C95 | C12>,
  C25: Exclude<C25, C15 | C21 | C45 | C75 | C16 | C55 | C22 | C85 | C35 | C26 | C14 | C29 | C27 | C36 | C34 | C24 | C23 | C65 | C95 | C28>,
  C35: Exclude<C35, C15 | C37 | C45 | C75 | C16 | C39 | C55 | C85 | C33 | C38 | C26 | C32 | C14 | C36 | C25 | C34 | C24 | C65 | C95 | C31>,
  C45: Exclude<C45, C43 | C15 | C42 | C66 | C44 | C49 | C75 | C48 | C55 | C46 | C64 | C85 | C35 | C25 | C65 | C47 | C95 | C54 | C56 | C41>,
  C55: Exclude<C55, C52 | C15 | C45 | C66 | C59 | C44 | C58 | C75 | C57 | C46 | C64 | C85 | C35 | C53 | C25 | C51 | C65 | C95 | C54 | C56>,
  C65: Exclude<C65, C61 | C15 | C45 | C66 | C44 | C75 | C55 | C64 | C46 | C85 | C67 | C35 | C69 | C25 | C63 | C62 | C95 | C68 | C54 | C56>,
  C75: Exclude<C75, C15 | C77 | C73 | C45 | C79 | C76 | C84 | C55 | C85 | C94 | C96 | C35 | C71 | C78 | C25 | C72 | C65 | C95 | C86 | C74>,
  C85: Exclude<C85, C15 | C45 | C75 | C76 | C84 | C55 | C82 | C94 | C89 | C87 | C96 | C35 | C88 | C25 | C65 | C95 | C86 | C81 | C83 | C74>,
  C95: Exclude<C95, C15 | C97 | C45 | C75 | C93 | C76 | C98 | C99 | C84 | C55 | C91 | C85 | C94 | C96 | C35 | C25 | C65 | C92 | C86 | C74>,
  C16: Exclude<C16, C13 | C15 | C18 | C66 | C76 | C11 | C19 | C46 | C96 | C26 | C35 | C14 | C36 | C25 | C34 | C17 | C24 | C86 | C56 | C12>,
  C26: Exclude<C26, C15 | C21 | C66 | C76 | C16 | C22 | C46 | C96 | C35 | C14 | C29 | C36 | C27 | C25 | C34 | C24 | C23 | C86 | C56 | C28>,
  C36: Exclude<C36, C15 | C37 | C66 | C76 | C16 | C39 | C46 | C33 | C38 | C96 | C26 | C35 | C32 | C14 | C34 | C25 | C24 | C86 | C56 | C31>,
  C46: Exclude<C46, C43 | C42 | C45 | C66 | C44 | C49 | C76 | C16 | C48 | C55 | C64 | C96 | C26 | C36 | C47 | C65 | C86 | C54 | C56 | C41>,
  C56: Exclude<C56, C52 | C45 | C66 | C59 | C44 | C58 | C57 | C76 | C16 | C55 | C46 | C64 | C96 | C26 | C53 | C36 | C51 | C65 | C86 | C54>,
  C66: Exclude<C66, C61 | C45 | C44 | C76 | C16 | C55 | C46 | C64 | C67 | C96 | C26 | C36 | C69 | C63 | C62 | C65 | C86 | C68 | C54 | C56>,
  C76: Exclude<C76, C77 | C73 | C79 | C66 | C75 | C16 | C84 | C46 | C85 | C94 | C96 | C26 | C71 | C36 | C78 | C72 | C86 | C95 | C56 | C74>,
  C86: Exclude<C86, C66 | C75 | C76 | C16 | C84 | C46 | C82 | C85 | C94 | C89 | C96 | C87 | C26 | C88 | C36 | C95 | C81 | C56 | C83 | C74>,
  C96: Exclude<C96, C97 | C66 | C93 | C75 | C76 | C16 | C98 | C99 | C84 | C91 | C46 | C94 | C85 | C26 | C36 | C92 | C86 | C95 | C56 | C74>,
  C17: Exclude<C17, C13 | C15 | C77 | C37 | C97 | C18 | C57 | C16 | C11 | C39 | C19 | C38 | C67 | C87 | C14 | C29 | C27 | C47 | C12 | C28>,
  C27: Exclude<C27, C77 | C37 | C97 | C21 | C18 | C57 | C39 | C19 | C22 | C38 | C67 | C87 | C26 | C29 | C25 | C17 | C24 | C23 | C47 | C28>,
  C37: Exclude<C37, C77 | C97 | C18 | C57 | C39 | C19 | C33 | C38 | C67 | C87 | C35 | C32 | C29 | C27 | C36 | C34 | C17 | C47 | C31 | C28>,
  C47: Exclude<C47, C43 | C42 | C77 | C37 | C97 | C45 | C59 | C44 | C49 | C58 | C57 | C48 | C46 | C67 | C87 | C27 | C69 | C17 | C68 | C41>,
  C57: Exclude<C57, C52 | C77 | C37 | C97 | C59 | C58 | C49 | C48 | C55 | C67 | C87 | C53 | C27 | C69 | C17 | C51 | C47 | C68 | C54 | C56>,
  C67: Exclude<C67, C61 | C77 | C37 | C97 | C66 | C59 | C49 | C58 | C57 | C48 | C64 | C87 | C27 | C69 | C63 | C17 | C62 | C47 | C65 | C68>,
  C77: Exclude<C77, C37 | C73 | C97 | C79 | C57 | C75 | C76 | C98 | C99 | C89 | C67 | C87 | C71 | C88 | C27 | C78 | C72 | C17 | C47 | C74>,
  C87: Exclude<C87, C77 | C37 | C97 | C79 | C57 | C98 | C99 | C84 | C82 | C85 | C89 | C67 | C88 | C27 | C78 | C17 | C47 | C86 | C81 | C83>,
  C97: Exclude<C97, C77 | C37 | C79 | C57 | C93 | C98 | C99 | C91 | C94 | C89 | C67 | C87 | C96 | C88 | C27 | C78 | C17 | C47 | C92 | C95>,
  C18: Exclude<C18, C13 | C15 | C37 | C58 | C16 | C11 | C98 | C39 | C48 | C19 | C38 | C88 | C14 | C29 | C27 | C78 | C17 | C68 | C12 | C28>,
  C28: Exclude<C28, C37 | C21 | C18 | C58 | C98 | C39 | C48 | C19 | C22 | C38 | C26 | C88 | C29 | C27 | C78 | C25 | C17 | C24 | C23 | C68>,
  C38: Exclude<C38, C37 | C18 | C58 | C98 | C39 | C48 | C19 | C33 | C35 | C88 | C32 | C29 | C36 | C27 | C78 | C34 | C17 | C68 | C31 | C28>,
  C48: Exclude<C48, C43 | C42 | C18 | C45 | C59 | C44 | C58 | C49 | C57 | C98 | C46 | C38 | C67 | C88 | C78 | C69 | C47 | C68 | C41 | C28>,
  C58: Exclude<C58, C52 | C18 | C59 | C49 | C57 | C98 | C48 | C55 | C38 | C67 | C53 | C88 | C78 | C69 | C51 | C47 | C68 | C54 | C56 | C28>,
  C68: Exclude<C68, C61 | C18 | C66 | C59 | C58 | C49 | C57 | C98 | C48 | C64 | C38 | C67 | C88 | C78 | C69 | C63 | C62 | C65 | C47 | C28>,
  C78: Exclude<C78, C77 | C73 | C97 | C18 | C79 | C58 | C75 | C76 | C98 | C99 | C48 | C38 | C89 | C87 | C71 | C88 | C72 | C68 | C74 | C28>,
  C88: Exclude<C88, C77 | C97 | C18 | C79 | C58 | C98 | C99 | C48 | C84 | C82 | C85 | C38 | C89 | C87 | C78 | C68 | C86 | C81 | C83 | C28>,
  C98: Exclude<C98, C77 | C97 | C18 | C79 | C58 | C93 | C99 | C48 | C91 | C94 | C38 | C89 | C96 | C87 | C88 | C78 | C92 | C68 | C95 | C28>,
  C19: Exclude<C19, C13 | C15 | C37 | C18 | C79 | C59 | C49 | C16 | C11 | C99 | C39 | C38 | C89 | C14 | C29 | C27 | C69 | C17 | C12 | C28>,
  C29: Exclude<C29, C37 | C21 | C18 | C79 | C59 | C49 | C99 | C39 | C19 | C22 | C38 | C89 | C26 | C27 | C69 | C25 | C17 | C24 | C23 | C28>,
  C39: Exclude<C39, C37 | C18 | C79 | C59 | C49 | C99 | C19 | C33 | C38 | C89 | C35 | C32 | C29 | C36 | C27 | C69 | C34 | C17 | C31 | C28>,
  C49: Exclude<C49, C43 | C42 | C45 | C79 | C59 | C44 | C58 | C57 | C99 | C39 | C48 | C19 | C46 | C89 | C67 | C29 | C69 | C47 | C68 | C41>,
  C59: Exclude<C59, C52 | C79 | C49 | C58 | C57 | C99 | C39 | C48 | C19 | C55 | C89 | C67 | C53 | C29 | C69 | C51 | C47 | C68 | C54 | C56>,
  C69: Exclude<C69, C61 | C79 | C66 | C59 | C49 | C58 | C57 | C99 | C39 | C48 | C19 | C64 | C89 | C67 | C29 | C63 | C62 | C65 | C47 | C68>,
  C79: Exclude<C79, C77 | C73 | C97 | C59 | C49 | C75 | C76 | C98 | C99 | C39 | C19 | C89 | C87 | C71 | C88 | C29 | C69 | C78 | C72 | C74>,
  C89: Exclude<C89, C77 | C97 | C79 | C59 | C49 | C98 | C99 | C39 | C84 | C19 | C82 | C85 | C87 | C88 | C29 | C69 | C78 | C86 | C81 | C83>,
  C99: Exclude<C99, C77 | C97 | C79 | C59 | C49 | C93 | C98 | C39 | C19 | C91 | C94 | C89 | C96 | C87 | C88 | C29 | C69 | C78 | C92 | C95>) {}



sudoku(
  _, 3, _,  _, _, _,  _, _, _,
  _, _, _,  1, 9, 5,  _, _, _,
  _, _, 8,  _, _, _,  _, 6, _,

  8, _, _,  _, 6, _,  _, _, _,
  4, _, _,  8, _, _,  _, _, 1,
  _, _, _,  _, 2, _,  _, _, _,

  _, 6, _,  _, _, _,  2, 8, _,
  _, _, _,  4, 1, 9,  _, _, 5,
  _, _, _,  _, _, _,  _, 7, _
);
