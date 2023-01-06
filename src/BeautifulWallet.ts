export default class {
    addressPattern: RegExp
    description: string
    active: true

    constructor(addressPattern: RegExp, description: string, active: true) {
        this.addressPattern = addressPattern
        this.description = description
        this.active = active
    }

    isAppropriate(address: string): boolean {
        return this.active && !!this.addressPattern.exec(address)
    }
}