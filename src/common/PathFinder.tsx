import { Position } from "../interfaces";

export class PathFinder {

    /** validator = func to check is suggested by this method position is valid */
    getNextPosition(currentPosition: Position, finalDestination: Position, validator: CallableFunction = this.defaultValidator): Position {
        if (currentPosition.toString() === finalDestination.toString()) {
            return currentPosition;
        }

        let nextPosition = currentPosition;

        if (finalDestination.x > currentPosition.x) {
            nextPosition.x++;
            if (validator(nextPosition) === true) {
                return nextPosition;
            }
        }

        if (finalDestination.y > currentPosition.y) {
            nextPosition.y++;
            if (validator(nextPosition) === true) {
                return nextPosition;
            }
        }

        throw new Error("No valid steps available");
    }

    private defaultValidator(position: Position): boolean {
        return true; // Default validator accepts any position as valid
    }
}