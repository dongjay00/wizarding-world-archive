import type {
  PotterBook,
  PotterCharacter,
  PotterMovie,
  PotterPotion,
  PotterSpell,
} from "@/types/potter";
import type { FavoriteItemInput } from "@/lib/stores/favoritesStore";

export function favoriteFromCharacter(
  character: PotterCharacter
): FavoriteItemInput {
  const { attributes } = character;
  return {
    id: character.id,
    type: "character",
    title: attributes.name,
    subtitle: [attributes.house, attributes.species].filter(Boolean).join(" • "),
    image: attributes.image,
    href: `/characters/${character.id}`,
  };
}

export function favoriteFromSpell(spell: PotterSpell): FavoriteItemInput {
  const { attributes } = spell;
  return {
    id: spell.id,
    type: "spell",
    title: attributes.name,
    subtitle: [attributes.category, attributes.incantation]
      .filter(Boolean)
      .join(" • "),
    image: attributes.image,
    href: `/spells/${spell.id}`,
  };
}

export function favoriteFromPotion(potion: PotterPotion): FavoriteItemInput {
  const { attributes } = potion;
  return {
    id: potion.id,
    type: "potion",
    title: attributes.name,
    subtitle: [attributes.difficulty, attributes.effect].filter(Boolean).join(" • "),
    image: attributes.image,
    href: `/potions/${potion.id}`,
  };
}

export function favoriteFromMovie(movie: PotterMovie): FavoriteItemInput {
  const { attributes } = movie;
  return {
    id: movie.id,
    type: "movie",
    title: attributes.title,
    subtitle: [attributes.release_date, attributes.rating].filter(Boolean).join(" • "),
    image: attributes.poster,
    href: `/movies/${movie.id}`,
  };
}

export function favoriteFromBook(book: PotterBook): FavoriteItemInput {
  const { attributes } = book;
  return {
    id: book.id,
    type: "book",
    title: attributes.title,
    subtitle: [attributes.author, attributes.release_date].filter(Boolean).join(" • "),
    image: attributes.cover,
    href: `/books/${book.id}`,
  };
}
