import { AppException } from "../exceptions/AppException.js";

class MazeRoomShift {
    #maze
    #room 
    
    constructor(maze, room) {
        this.#maze = maze;
        this.#room = room;
    }

    #next = (roomIndex, takeRooms) => {
        if (roomIndex === -1) {
            throw new AppException("This room is not placed inside maze array");
        }
        
        const next = this.#maze[takeRooms](roomIndex).find((_, ind, arr) => arr[ind - 1] && (arr[ind - 1].id === this.#room.id))
        return next;
    }

    #prev = (roomIndex, takeRooms) => {
        if (roomIndex === -1) {
            throw new AppException("This room is not placed inside maze array");
        }

        const array = this.#maze[takeRooms](roomIndex);
        const prev = array.find((_, ind, arr) => arr[ind + 1] && (arr[ind + 1].id === this.#room.id));
        return prev;
    }

    nextX =  () => {
        const mazeRoomIndexY = this.#maze.rooms.findIndex((mazeRooms) => mazeRooms.filter((room) => room.id === this.#room.id).length > 0);
        if (mazeRoomIndexY === -1) {
            throw new AppException("This room is not placed inside maze array");
        }
        const mazeRoomIndexX = this.#maze.rooms[mazeRoomIndexY].findIndex(room => room.id === this.#room.id);
        return this.#next(mazeRoomIndexX, 'takeRoomsColumn');
    }

    nextY =  () => {
        const mazeRoomIndexY = this.#maze.rooms.findIndex((mazeRooms) => mazeRooms.filter((room) => room.id === this.#room.id).length > 0);
        return this.#next(mazeRoomIndexY, 'takeRoomsRow');
    }

    prevX =  () => {
        const mazeRoomIndexY = this.#maze.rooms.findIndex((mazeRooms) => mazeRooms.filter((room) => room.id === this.#room.id).length > 0);
        if (mazeRoomIndexY === -1) {
            console.error(this.#maze, this.#room);
            throw new AppException("This room is not placed inside maze array");
        }
        
        const mazeRoomIndexX = this.#maze.rooms[mazeRoomIndexY].findIndex(room => room.id === this.#room.id);

        return this.#prev(mazeRoomIndexX, 'takeRoomsColumn');
    }

    prevY =  () => {
        const mazeRoomIndexY = this.#maze.rooms.findIndex((mazeRooms) => mazeRooms.filter((room) => room.id === this.#room.id).length > 0);

        return this.#prev(mazeRoomIndexY, 'takeRoomsRow');
    }
}

export { MazeRoomShift }