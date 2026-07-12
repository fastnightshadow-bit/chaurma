# Yandex Map Integration

## Scope

Replace the temporary map placeholder with a real, lazily loaded Yandex Maps widget without changing the approved layout or interaction model.

## Behavior

- The widget is not mounted until the route section approaches the viewport.
- The map container remains 300 px high in every loading and ready state.
- Switching the selected location replaces the widget URL, center, and marker atomically.
- Confirmed coordinates are used for the Frunze 75 destination.
- The exact address is used for Frunze 46B because its coordinates conflict between confirmed sources.
- The external route URL uses the same destination rule as the map.
- No Yandex JavaScript SDK, API key, geolocation request, or initial-page map bundle is introduced.

## Failure handling

If the widget cannot load, the address, contact details, and external route action remain available. The existing map error presentation is retained.
