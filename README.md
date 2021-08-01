# `react-msfs`

## Hooks

To be written. Most hooks are already documented in their JSDoc.

### `useImageLoader`
The issue with `HTMLImageElement`s is that loading the actual image is an asynchronous task and would make drawing `Icon`s on a canvas layer very difficult. The `useImageLoader` allows you to preload these elements and pass them as parameters to the `Icon` component. Once the image is successfully loaded, the state is updated and the image can be drawn on the canvas.
```tsx
const airplaneIcon = useImageLoader('/Pages/VCockpit/Instruments/a22x/assets/MAP/ND_AIRPLANE.svg');
const airportIcon = useImageLoader('/Pages/VCockpit/Instruments/a22x/assets/MAP/ND_AIRPORT.svg');
```

## Components

### `CanvasMap`
The following is the most basic usage of the `CanvasMap` component. This will create a Bing map layer that is tied to the aircraft's position and heading. The map will be larger than it's parent container so that the entire container is filled in even when the map rotates.
```tsx
const [latitude] = useSimVar('A:PLANE LATITUDE', 'Degrees');
const [longitude] = useSimVar('A:PLANE LONGITUDE', 'Degrees');
const [headingTrue] = useSimVar('A:PLANE HEADING DEGREES TRUE', 'Degrees');

return (
    <CanvasMap
        bingConfigFolder="/Pages/VCockpit/Instruments/.../assets/MAP/"
        mapId="MAP"
        centerLla={{ lat: latitude, long: longitude }}
        range={10}
        rotation={-headingTrue}
    />
)
```
| Name             | Type         | Default | Description                                                             |
|------------------|--------------|---------|-------------------------------------------------------------------------|
| bingConfigFolder | `string`     |         | Path to `mapConfig.json` file                                           |
| mapId            | `string`     |         | Unique identifier                                                       |
| centerLla        | `LatLongAlt` |         | Latitude and longitude of map's center                                  |
| showMap          | `boolean`    | `true`  | Show Bing map layer                                                     |
| range            | `number`     | `80`    | Distance in nautical miles from map's center to top of parent container |
| rotation         | `number`     | `0`     | Map rotation in degrees                                                 |

### `Icon`
The `Icon` component allows you to place images and text onto the map. An icon can either have text, icon, or both! The icon is locked to a coordinate position so as the map moves around, so does the icon. The component(s) must be included as a child of your `CanvasMap` component.
```tsx
const [headingTrue] = useSimVar('A:PLANE HEADING DEGREES TRUE', 'Degrees');
const airportIcon = useImageLoader('/Pages/VCockpit/Instruments/.../assets/MAP/ND_AIRPORT.svg');
const airports = // some array of nearby airports

return (
    <CanvasMap ...>
        airports.map(airport => (
            <Icon
                position={{ lat: airport.latitude, long: airport.longitude }}
                icon={airportIcon}
                iconWidth={21}
                iconHeight={21}
                rotation={headingTrue}
                text={airport.ident}
                textFill="#00AFF0"
                fontFamily="LetterGothic-Bold"
                fontSize={25}
            />
        ))
    </CanvasMap>
)
```
| Name         | Type               | Default    | Description                                      |
|--------------|--------------------|------------|--------------------------------------------------|
| position     | `LatLongAlt`       |            | Latitude and longitude of icon                   |
| rotation     | `number`           | `0`        | Icon rotation in degrees                         |
| icon         | `HTMLImageElement` | *Optional* | Preloaded (`useImageLoader`) image for icon      |
| iconWidth    | `number`           | *Optional* | Icon with in px                                  |
| iconHeight   | `number`           | *Optional* | Icon height in px                                |
| text         | `string`           | *Optional* | Text to display next to icon                     |
| textFill     | `string`           | *Optional* | Text fill color                                  |
| textPosition | `string`           | *Optional* | Text position (`top`, `bottom`, `left`, `right`) |
| fontFamily   | `string`           | *Optional* | Text font family                                 |
| fontSize     | `number`           | *Optional* | Text font size                                   |

### `Geometry`
The `Geometry` component allows you to draw lines and arcs on the map using the `GeoPath` and `GeoArc` classes, respectively. The paths are locked to coordinate positions so as the map moves around, so do the paths. The component(s) must be included as a child of your `CanvasMap` component.
```tsx
const waypoints = flightPlanManager.getWaypoints();

const routePaths: GeoPath[] = [];
for (let i = 0; i < waypoints.length - 1; i++) {
    routePaths.push(
        GeoPath.pathFromLatLongAlt(
            waypoints[i].infos.coordinates,
            waypoints[i + 1].infos.coordinates,
        )
    );
}

return (
    <CanvasMap ...>
        <Geometry
            geoPaths={routePaths}
            strokeWidth={3}
            strokeColor="magenta"
            outlineWidth={6}
            outlineColor="black"
        />
    </CanvasMap>
)
```
| Name         | Type        | Default | Description                        |
|--------------|-------------|---------|------------------------------------|
| geoPaths     | `GeoPath[]` |         | Array of `GeoPath` objects to draw |
| strokeWidth  | `number`    | `1`     |                                    |
| strokeColor  | `string`    | `white` |                                    |
| outlineWidth | `number`    | `1`     | Drawn below the stroke             |
| outlineColor | `string`    | `white` | Drawn below the stroke             |

## Classes

### `GeoPath`
The `GeoPath` object stores two [geodesy](https://github.com/chrisveness/geodesy) `LatLon` objects to represent a geographical line.
```ts
class GeoPath {
    start: LatLon; // line start point
    end: LatLon; // line end point
}
```
There are two ways to create these objects:
```ts
const path1 = GeoPath.pathFromLatLongAlt(
    start: LatLongAlt,
    end: LatLongAlt,
);
const path2 = GeoPath.pathFromCoordinates(
    startLat: number,
    startLong: number,
    endLat: number,
    endLong: number,
);
```

### `GeoArc`
The `GeoArc` object stores three [geodesy](https://github.com/chrisveness/geodesy) `LatLon` objects and a radius to represent a geographical arc.
```ts
class GeoArc extends GeoPath {
    // start and end inherited from GeoPath

    control: LatLon; // arc control point
    radius: number; // arc radius
}
```
There are two ways to create these objects:
```ts
const arc1 = GeoArc.arcFromLatLongAlt(
    start: LatLongAlt,
    control: LatLongAlt,
    end: LatLongAlt,
    radius: number,
);
const arc2 = GeoArc.arcFromCoordinates(
    startLat: number,
    startLong: number,
    controlLat: number,
    controlLong: number,
    endLat: number,
    endLong: number,
    radius: number,
);
```
