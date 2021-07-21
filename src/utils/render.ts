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

// We currently assume that these two elements will be found.
// Might be worth implementing checking in the future.

const reactMount = document.getElementById('MSFS_REACT_MOUNT') as HTMLElement;

/**
 * Returns the render target which React mounts onto
 */
export const getRenderTarget = () => reactMount;

/**
 * Returns the root element which receives `update` events
 */
export const getRootElement: () => HTMLElement = () => {
    if (reactMount?.parentElement) {
        return reactMount.parentElement;
    }
    throw new Error('Could not find rootElement');
};
