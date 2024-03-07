/**
 * Utils class to calculate the euclidean distance between two points
 */
class EuclideanDistanceCalculator {
    /**
     * @param {number} xStartingPoint
     */
    #xStartingPoint;  
    
    /** 
     * @param {number} yStartingPoint
     */
    #yStartingPoint;

    /**
     * @param {number} xArrivalPoint
     */ 
    #xArrivalPoint;

    /**
     * @param {number} yArrivalPoint
     */
    #yArrivalPoint;

    /**
     * @param {number} distance
     */ 
    #distance;

    /**
     * @param {number} xStartingPoint - The x coordinate of the starting point
     * @param {number} yStratingPoint - The y coordinate of the starting point
     * @param {number} xArrivalPoint - The x coordinate of the arrival point
     * @param {number} yArrivalPoint - The y coordinate of the arrival point
     */ 
    constructor(xStartingPoint, yStartingPoint, xArrivalPoint, yArrivalPoint) {
        this.#xStartingPoint = xStartingPoint;
        this.#yStartingPoint = yStartingPoint;
        this.#xArrivalPoint  = xArrivalPoint;
        this.#yArrivalPoint  = yArrivalPoint;
        this.calculateDistance();
    }

    /**
     * Calculate the euclidean distance between two points
     * @returns {number} The distance between the starting point and the arrival point
     */
    calculateDistance() {
        this.#distance = Math.sqrt(Math.pow(this.#xArrivalPoint - this.#xStartingPoint, 2) + Math.pow(this.#yArrivalPoint - this.#yStartingPoint, 2));
        return this.#distance;
    }

    /**
     * Calculate the travel time in miliseconds
     * @param {number} movementSpeed - The movement speed of the units
     * @returns {number} The travel time in miliseconds
     */
    getTravelTimeInMilliseconds (movementSpeed) {
        const travelTimeInHours         = this.#distance / movementSpeed;
        const travelTimeInMilliseconds  = travelTimeInHours * 60 * 60 * 1000;
        return travelTimeInMilliseconds;
    }

    /**
     * Return the arrival date
     * @param {Date} departureDate - The departure date
     * @param {number} movementSpeed - The movement speed of the units
     * @returns {Date} The arrival date
     */
    getArrivalDate (departureDate, movementSpeed) {
        const travelTimeInMilliseconds  = this.getTravelTimeInMilliseconds(movementSpeed);
        const date                      = new Date(departureDate);
        const arrivalDate               = new Date(date.getTime() + travelTimeInMilliseconds);
        return arrivalDate;
    }
}

module.exports = EuclideanDistanceCalculator;