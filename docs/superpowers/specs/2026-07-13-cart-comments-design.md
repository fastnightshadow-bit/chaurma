# Cart Comments Design

## Goal

Allow a customer to attach one preparation request to each cart line and one separate comment to the whole order.

## Item comment

- Each cart line exposes `Добавить пожелание`; an existing comment changes the action to `Изменить пожелание`.
- The action expands an inline editor without a modal or page navigation.
- The editor contains a textarea with placeholder `Например: без лука`, a 120-character limit, save and cancel actions, and a delete action when a saved comment exists.
- Saving trims surrounding whitespace. An empty saved value removes the comment.
- The saved comment appears directly below its own dish and does not affect other cart lines.

## Order comment

- A permanently visible textarea below the cart list is labelled `Комментарий ко всему заказу`.
- Placeholder: `Например: буду через 15 минут`.
- Maximum length: 200 characters.
- The value belongs to the cart snapshot, persists with the cart, and is cleared with an empty cart.

## Persistence

- New snapshots use storage schema version 2 and include `orderComment`.
- Version 1 snapshots are migrated to version 2 in memory with an empty order comment.
- Individual comments and the order comment are validated and length-limited before entering restored state.
- A storage failure keeps both comment types usable in memory for the current tab.

## Order presentation

- An item comment appears immediately below the matching dish.
- The order-wide comment appears in a separate labelled block before the total.
- Neither comment can be edited inside presentation mode.

## Motion and accessibility

- The inline editor uses the existing short fade and downward reveal style.
- Reduced-motion settings collapse the transition to the existing global minimum.
- Textareas have visible labels, counters, and keyboard-accessible controls with at least 44 px targets.
