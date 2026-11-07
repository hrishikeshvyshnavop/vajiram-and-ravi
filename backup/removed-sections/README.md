# Removed sections (backups)

Sections taken off /v5 on request, kept here so they can be restored. Files end in `.bak` so they are not compiled.

## RecipeProgrammes ("Programmes · कार्यक्रम", Pick your stage, flagship block)
- Removed 2026-11-07 (user request). Replaced as the programme catalogue by `RecipeCourses` (id `courses`).
- Restore: copy `RecipeProgrammes.tsx.bak` to `app/components/RecipeProgrammes.tsx`, append `RecipeProgrammes.css.bak` to `app/components/recipe-story.css`, import it in `RecipeStory.tsx` and render `<RecipeProgrammes />` (it was placed right after the team section).
- Links that used `#programmes` (header feature card, footer links, hero secondary link) now point at `#courses`.

## RecipeManifesto ("Our manifesto · हमारा घोषणापत्र")
- Removed 2026-11-07 (user request). The component file `app/components/RecipeManifesto.tsx` is still in place (only the import and `<RecipeManifesto />` were removed from `RecipeStory.tsx`), so restoring is those two lines; it sat right after the team section.

## RecipeResources, bento version ("Free resources · निःशुल्क संसाधन", tiles with a live feed, magazine stack and calendar path)
- Replaced 2026-11-07 (user: "this section needs to be rethought") by an index-style Free library (same file name, new content).
- Restore: copy `RecipeResources.tsx.bak` over `app/components/RecipeResources.tsx` and put `RecipeResources.css.bak` back into `recipe-story.css`. Remove the `.rs-lib*` rules and the light-pass `#resources` rules if you do.

## RecipeCounselling option A (two columns: promise left, rust form card right)
- Replaced 2026-11-07 by option B (centred saffron section with one wide form bar) on request ("show this section another option"). Same form logic, same `#enrol` anchor.
- Restore A: copy `RecipeCounselling.optionA.tsx.bak` over `app/components/RecipeCounselling.tsx` (its `.rs-cb*` styles are still in `recipe-story.css`).

## RecipeFaq accordion (two-column, after davidecarusio.it)
- Replaced 2026-11-07 by the OMR answer-sheet FAQ on a rust ground. Restore: copy `RecipeFaq.accordion.tsx.bak` over `app/components/RecipeFaq.tsx` (old `.rs-faq-*` styles are still in `recipe-story.css`).
