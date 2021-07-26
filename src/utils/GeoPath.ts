/*
 *   Copyright (c) 2021 Synaptic Simulations and its contributors
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// eslint-disable-next-line max-classes-per-file
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';

declare class LatLongAlt {
    lat: number;

    long: number;
}

export class GeoPath {
    start: LatLon;

    end: LatLon

    constructor(start: LatLon, end: LatLon) {
        this.start = start;
        this.end = end;
    }

    static pathFromLatLongAlt(start: LatLongAlt, end: LatLongAlt): GeoPath {
        return new GeoPath(
            new LatLon(start.lat, start.long),
            new LatLon(end.lat, end.long),
        );
    }

    static pathFromCoordinates(startLat: number, startLong: number, endLat: number, endLong: number): GeoPath {
        return new GeoPath(
            new LatLon(startLat, startLong),
            new LatLon(endLat, endLong),
        );
    }
}

export class GeoArc extends GeoPath {
    control: LatLon;

    radius: number;

    constructor(start: LatLon, control: LatLon, end: LatLon, radius: number) {
        super(start, end);
        this.control = control;
        this.radius = radius;
    }

    static arcFromLatLongAlt(start: LatLongAlt, control: LatLongAlt, end: LatLongAlt, radius: number): GeoPath {
        return new GeoArc(
            new LatLon(start.lat, start.long),
            new LatLon(control.lat, control.long),
            new LatLon(end.lat, end.long),
            radius,
        );
    }

    static arcFromCoordinates(startLat: number, startLong: number, controlLat: number, controlLong: number, endLat: number, endLong: number, radius: number): GeoPath {
        return new GeoArc(
            new LatLon(startLat, startLong),
            new LatLon(controlLat, controlLong),
            new LatLon(endLat, endLong),
            radius,
        );
    }
}
