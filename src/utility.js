import constants from './constants';

export function randomColor() {
    const options = [constants.blue, constants.green, constants.yellow, constants.red];

    return options[Math.floor(Math.random()*options.length)];
}
